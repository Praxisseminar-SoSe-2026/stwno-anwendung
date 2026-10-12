import csv
import io
import json
from dataclasses import dataclass
from pathlib import Path

REQUIRED_FIELDS = ("person_number", "first_name", "last_name", "email")

# Accepted column names (lowercase) per field.
# Add further aliases here if the real export uses other headers.
FIELD_ALIASES: dict[str, tuple[str, ...]] = {
    "person_number": (
        "person_number",
        "personennummer",
        "personen-nummer",
        "nr.",
        "nr",
    ),
    "first_name": ("first_name", "vorname"),
    "last_name": ("last_name", "name", "nachname"),
    "email": ("email", "e-mail", "e-mail-adresse", "mail"),
    "dormitory": ("dormitory", "wohnheim"),
    "flat_number": ("flat_number", "wohnungsnummer", "wohnung", "zimmer"),
    "vo_number": ("vo_number", "vo-nummer", "vo nummer", "vo"),
}

_ALIAS_TO_FIELD = {
    alias: field for field, aliases in FIELD_ALIASES.items() for alias in aliases
}


class ImportFileError(Exception):
    """The uploaded file cannot be read (format, encoding or structure)."""


@dataclass(frozen=True)
class ParsedRow:
    row_number: int
    values: dict[str, str]


def _canonical_field(key: object) -> str | None:
    if key is None:
        return None
    return _ALIAS_TO_FIELD.get(str(key).strip().lower())


def _canonical_values(raw: dict) -> dict[str, str]:
    """Keep only known fields; all other columns are dropped here."""
    values: dict[str, str] = {}
    for key, value in raw.items():
        field = _canonical_field(key)
        if field is not None and value is not None:
            values[field] = str(value).strip()
    return values


def _decode(content: bytes) -> str:
    for encoding in ("utf-8-sig", "cp1252"):
        try:
            return content.decode(encoding)
        except UnicodeDecodeError:
            continue
    raise ImportFileError("File encoding is not supported")


def _read_csv(text: str) -> list[ParsedRow]:
    first_line = next((line for line in text.splitlines() if line.strip()), "")
    delimiter = max(";,\t", key=first_line.count)
    reader = csv.DictReader(io.StringIO(text), delimiter=delimiter)

    known_fields = {_canonical_field(name) for name in reader.fieldnames or []}
    missing = [field for field in REQUIRED_FIELDS if field not in known_fields]
    if missing:
        raise ImportFileError("Missing columns: " + ", ".join(missing))

    if "vo_number" not in known_fields and "dormitory" not in known_fields:
        raise ImportFileError("Missing columns: vo_number (or dormitory)")
    rows: list[ParsedRow] = []
    for raw in reader:
        if not any(v.strip() for v in raw.values() if isinstance(v, str)):
            continue
        rows.append(
            ParsedRow(row_number=reader.line_num, values=_canonical_values(raw))
        )
    return rows


def _read_json(text: str) -> list[ParsedRow]:
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        raise ImportFileError("File is not valid JSON") from exc

    if not isinstance(data, list) or not all(isinstance(i, dict) for i in data):
        raise ImportFileError("JSON must be a list of objects")

    return [
        ParsedRow(row_number=index, values=_canonical_values(item))
        for index, item in enumerate(data, start=1)
    ]


def parse_import_file(filename: str | None, content: bytes) -> list[ParsedRow]:
    text = _decode(content)
    extension = Path(filename or "").suffix.lower()

    if extension == ".csv":
        rows = _read_csv(text)
    elif extension == ".json":
        rows = _read_json(text)
    else:
        raise ImportFileError("Only .csv and .json files are supported")

    if not rows:
        raise ImportFileError("File contains no data rows")
    return rows
