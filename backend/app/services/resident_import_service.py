import logging
from dataclasses import dataclass, field

from pydantic import EmailStr, TypeAdapter, ValidationError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Dormitory, ResidentMasterData
from app.services.resident_import_parser import (
    REQUIRED_FIELDS,
    ParsedRow,
    parse_import_file,
)

logger = logging.getLogger("app.resident_import")

# Wohnanlage number (first part of the VO number) -> dormitory name in the DB.
# Add further complexes here
DORMITORY_BY_ANLAGE_NUMBER = {
    "720": "Fort-Skelly-Straße",
}

_EMAIL_ADAPTER = TypeAdapter(EmailStr)


class RowValidationError(Exception):
    pass


class ImportConflictError(Exception):
    pass


@dataclass
class RowIssue:
    row_number: int
    message: str


@dataclass
class ImportReport:
    created: int = 0
    updated: int = 0
    unchanged: int = 0
    errors: list[RowIssue] = field(default_factory=list)
    warnings: list[RowIssue] = field(default_factory=list)


def _split_vo_number(vo_number: str) -> tuple[str, str, str]:
    parts = [part.strip() for part in vo_number.split("-", 2)]
    if len(parts) != 3 or not all(parts):
        raise RowValidationError(f"Invalid VO number: {vo_number}")
    return parts[0], parts[1], parts[2]


def _prepare_row(values: dict[str, str], dormitory_ids: dict[str, int]) -> dict:
    missing = [name for name in REQUIRED_FIELDS if not values.get(name)]
    if missing:
        raise RowValidationError("Missing value: " + ", ".join(missing))

    try:
        email = _EMAIL_ADAPTER.validate_python(values["email"]).lower()
    except ValidationError as exc:
        raise RowValidationError(f"Invalid email address: {values['email']}") from exc

    dormitory_name = values.get("dormitory") or None
    flat_number = values.get("flat_number") or None
    vo_number = values.get("vo_number")

    if vo_number:
        anlage_number, _house_number, room = _split_vo_number(vo_number)
        if dormitory_name is None:
            dormitory_name = DORMITORY_BY_ANLAGE_NUMBER.get(anlage_number)
            if dormitory_name is None:
                raise RowValidationError(
                    f"Unknown Wohnanlage number in VO number: {anlage_number}"
                )
        flat_number = flat_number or room

    if dormitory_name is None:
        raise RowValidationError("Missing dormitory (vo_number or dormitory)")

    dormitory_id = dormitory_ids.get(dormitory_name.lower())
    if dormitory_id is None:
        raise RowValidationError(f"Dormitory does not exist: {dormitory_name}")

    return {
        "person_number": values["person_number"],
        "first_name": values["first_name"],
        "last_name": values["last_name"],
        "email": email,
        "dormitory_id": dormitory_id,
        "flat_number": flat_number,
    }


def import_resident_master_data(db: Session, rows: list[ParsedRow]) -> ImportReport:
    report = ImportReport()
    dormitory_ids = {d.name.lower(): d.id for d in db.query(Dormitory).all()}

    # 1. validate every row
    # one person may appear in several rows because of different contracts
    prepared: dict[str, tuple[int, dict]] = {}
    for row in rows:
        try:
            data = _prepare_row(row.values, dormitory_ids)
        except RowValidationError as exc:
            report.errors.append(RowIssue(row.row_number, str(exc)))
            continue

        previous = prepared.get(data["person_number"])
        if previous is not None and previous[1] != data:
            report.warnings.append(
                RowIssue(
                    row.row_number,
                    f"Person {data['person_number']} appears with different data "
                    f"in row {previous[0]}; the data of this row is used",
                )
            )
        prepared[data["person_number"]] = (row.row_number, data)

    # 2. one email must not belong to two different persons
    existing = {m.person_number: m for m in db.query(ResidentMasterData).all()}
    owner_by_email = {m.email.lower(): m.person_number for m in existing.values()}
    seen_in_file: dict[str, str] = {}
    for person_number, (row_number, data) in prepared.items():
        owner = seen_in_file.get(data["email"]) or owner_by_email.get(data["email"])
        if owner is not None and owner != person_number:
            report.errors.append(
                RowIssue(
                    row_number,
                    f"Email address already belongs to person {owner}",
                )
            )
        seen_in_file[data["email"]] = person_number

    if report.errors:
        return report

    # 3. create or update
    for person_number, (_, data) in prepared.items():
        record = existing.get(person_number)
        if record is None:
            db.add(ResidentMasterData(**data))
            report.created += 1
        elif any(getattr(record, key) != value for key, value in data.items()):
            for key, value in data.items():
                setattr(record, key, value)
            report.updated += 1
        else:
            report.unchanged += 1

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ImportConflictError(
            "Resident data was changed during the import, please try again"
        ) from exc

    logger.info(
        "Resident master data import: %s created, %s updated, %s unchanged",
        report.created,
        report.updated,
        report.unchanged,
    )
    return report


def import_resident_file(db: Session, filename: str | None, content: bytes):
    rows = parse_import_file(filename, content)
    return import_resident_master_data(db, rows)
