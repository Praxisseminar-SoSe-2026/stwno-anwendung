from datetime import date

from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.models.user import User


class InvalidCredentialsError(Exception):
    pass


class ContractEndedError(Exception):
    pass


def authenticate(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user is None or user.password_hash is None:
        raise InvalidCredentialsError("Invalid email or password")

    if not verify_password(password, user.password_hash):
        raise InvalidCredentialsError("Invalid email or password")

    if user.contract_end is not None and user.contract_end < date.today():
        raise ContractEndedError("Your contract has ended")

    return user
