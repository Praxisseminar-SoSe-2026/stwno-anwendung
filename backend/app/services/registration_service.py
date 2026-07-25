
from sqlalchemy.orm import Session

from app.models.user import User
from app.services.stwno_mock import (
    STWNONotFoundError,
    verify_person_number,
)


class InvalidPersonNumberError(Exception):
    pass


class DuplicateRegistrationError(Exception):
    pass


class VerificationFailedError(Exception):
    pass


class VerificationUnavailableError(Exception):
    pass


def register_user(db: Session, person_number: str) -> User:
    existing = db.query(User).filter(User.person_number == person_number).first()
    if existing is not None:
        raise DuplicateRegistrationError(
            f"Person number {person_number} is already registered"
        )

    try:
        master_data = verify_person_number(person_number)
    except STWNONotFoundError as exc:
        raise VerificationFailedError(str(exc)) from exc

    user = User(
        person_number=person_number,
        first_name=master_data["first_name"],
        last_name=master_data["last_name"],
        email=master_data["email"],
        flat_number=master_data.get("flat_number"),
        dormitory_id=master_data.get("dormitory_id"),
        password_hash=None,  # set later during login-credentials setup (Issue #30)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user