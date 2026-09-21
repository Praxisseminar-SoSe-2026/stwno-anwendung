from datetime import date

from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User


class UserNotFoundError(Exception):
    pass


class CredentialsAlreadySetError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


class ContractEndedError(Exception):
    pass


def set_password(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise UserNotFoundError(f"No user found for email {email}")

    if user.password_hash is not None:
        raise CredentialsAlreadySetError(
            "Login credentials are already " "set for this account"
        )

    user.password_hash = hash_password(password)
    db.commit()
    db.refresh(user)
    return user


def authenticate(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user is None or user.password_hash is None:
        raise InvalidCredentialsError("Invalid email or password")

    if not verify_password(password, user.password_hash):
        raise InvalidCredentialsError("Invalid email or password")

    if user.contract_end is not None and user.contract_end < date.today():
        raise ContractEndedError("Your contract has ended")

    return user
