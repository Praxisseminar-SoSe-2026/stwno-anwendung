import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse, SetPasswordRequest
from app.schemas.user import UserResponse
from app.services.auth_service import (
    CredentialsAlreadySetError,
    InvalidCredentialsError,
    UserNotFoundError,
    authenticate,
    set_password,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/set-password", response_model=UserResponse)
def set_password_endpoint(payload: SetPasswordRequest, db: Session = Depends(get_db)):
    try:
        user = set_password(db, payload.email, payload.password)
    except UserNotFoundError as exc:
        raise HTTPException(status_code=404, detail="No account found "
                                                    "for this email") from exc
    except CredentialsAlreadySetError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc

    return user


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = authenticate(db, payload.email, payload.password)
    except InvalidCredentialsError as exc:
        logger.warning("Failed login attempt for email %s", payload.email)
        raise HTTPException(status_code=401, detail=str(exc)) from exc

    return user