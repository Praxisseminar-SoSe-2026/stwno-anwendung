from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import (
    InvalidTokenError,
    decode_registration_token,
    hash_password,
)
from app.models import ResidentMasterData, Role, UserRole
from app.models.user import User


class DuplicateRegistrationError(Exception):
    pass


class VerificationFailedError(Exception):
    pass


class InvalidRegistrationTokenError(Exception):
    pass


def _ensure_not_registered(db: Session, master_data: ResidentMasterData) -> None:
    existing = (
        db.query(User)
        .filter(
            (User.person_number == master_data.person_number)
            | (func.lower(User.email) == master_data.email.lower())
        )
        .first()
    )
    if existing is not None:
        raise DuplicateRegistrationError("This person is already registered")


def start_registration(
    db: Session, person_number: str, email: str
) -> ResidentMasterData:
    master_data = (
        db.query(ResidentMasterData)
        .filter(
            ResidentMasterData.person_number == person_number,
            func.lower(ResidentMasterData.email) == email.lower(),
        )
        .first()
    )
    if master_data is None:
        raise VerificationFailedError("Person number and email do not match")

    _ensure_not_registered(db, master_data)
    return master_data


def complete_registration(db: Session, token: str, password: str) -> User:
    try:
        master_data_id = decode_registration_token(token)
    except InvalidTokenError as exc:
        raise InvalidRegistrationTokenError(str(exc)) from exc

    master_data = db.get(ResidentMasterData, master_data_id)
    if master_data is None:
        raise InvalidRegistrationTokenError("Invalid registration link")

    _ensure_not_registered(db, master_data)

    resident_role = db.query(Role).filter(Role.name == "bewohner").one()

    user = User(
        person_number=master_data.person_number,
        first_name=master_data.first_name,
        last_name=master_data.last_name,
        email=master_data.email,
        flat_number=master_data.flat_number,
        dormitory_id=master_data.dormitory_id,
        password_hash=hash_password(password),
    )
    db.add(user)
    db.flush()
    db.add(UserRole(user_id=user.id, role_id=resident_role.id))

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise DuplicateRegistrationError("This person is already registered") from exc

    db.refresh(user)
    return user
