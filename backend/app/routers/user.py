from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import require_permission
from app.db.database import get_db
from app.models import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.auth_service import UserNotFoundError
from app.services.user_service import list_users, update_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("", response_model=list[UserResponse])
def list_all(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_permission("manage_users"))],
):
    return list_users(db)

@router.put("/{user_id}", response_model=UserResponse)
def update(
    user_id: int,
    payload: UserUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_permission("manage_users"))],
):
    try:
        return update_user(db, user_id, payload)
    except UserNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc