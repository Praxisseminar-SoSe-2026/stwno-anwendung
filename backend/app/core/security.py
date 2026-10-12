from datetime import timedelta

import bcrypt
import jwt

from app.core.config import settings
from app.core.time import now_utc

REGISTRATION_TOKEN_PURPOSE = "registration"


# Build with Step 6 in:
# https://www.geeksforgeeks.org/python/login-registration-system-with-jwt-in-fastapi/
def hash_password(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_access_token(user_id: int) -> str:
    expire = now_utc() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(
        payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
    )


class InvalidTokenError(Exception):
    pass


def decode_access_token(token: str) -> int:
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
    except jwt.ExpiredSignatureError as exc:
        raise InvalidTokenError("Session expired") from exc
    except jwt.InvalidTokenError as exc:
        raise InvalidTokenError("Invalid token") from exc
    # exclude registration tokens
    if "purpose" in payload or "sub" not in payload:
        raise InvalidTokenError("Invalid token")
    return int(payload["sub"])


def create_registration_token(master_data_id: int) -> str:
    expire = now_utc() + timedelta(hours=settings.registration_token_expire_hours)
    payload = {
        "purpose": REGISTRATION_TOKEN_PURPOSE,
        "mid": master_data_id,
        "exp": expire,
    }
    return jwt.encode(
        payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
    )


def decode_registration_token(token: str) -> int:
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
    except jwt.ExpiredSignatureError as exc:
        raise InvalidTokenError("Registration link expired") from exc
    except jwt.InvalidTokenError as exc:
        raise InvalidTokenError("Invalid registration link") from exc

    if payload.get("purpose") != REGISTRATION_TOKEN_PURPOSE:
        raise InvalidTokenError("Invalid registration link")
    return int(payload["mid"])
