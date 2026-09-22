import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.permission import get_user_role
from app.core.security import create_access_token
from app.db.database import get_db
from app.models import User
from app.schemas.auth import LoginRequest, LoginResponse, SetPasswordRequest
from app.schemas.user import UserResponse
from app.services.auth_service import (
    ContractEndedError,
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
        raise HTTPException(
            status_code=404, detail="No account found " "for this email"
        ) from exc
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
    except ContractEndedError as exc:
        logger.warning("Login attempt with ended contract for email %s", payload.email)
        raise HTTPException(status_code=403, detail=str(exc)) from exc

    token = create_access_token(user.id)
    roles = get_user_role(db, user.id)
    return LoginResponse(
        access_token=token,
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        dormitory_id=user.dormitory_id,
        flat_number=user.flat_number,
        roles=roles,
    )


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    roles = get_user_role(db, current_user.id)
    response = UserResponse.model_validate(current_user)
    response.roles = roles
    return response
