import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permission
from app.db.database import get_db
from app.models.user import User
from app.schemas.dormitory import DormitoryCreate, DormitoryResponse, DormitoryUpdate
from app.services.dormitory_service import (
    DormitoryNotFoundError,
    create_dormitory,
    delete_dormitory,
    list_all_dormitories,
    update_dormitory,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dormitories", tags=["dormitories"])


@router.get("", response_model=list[DormitoryResponse])
def list_all(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return list_all_dormitories(db)


@router.post("", response_model=DormitoryResponse)
def create(
        payload: DormitoryCreate,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User,
        Depends(require_permission("manage_dormitories"))],
):
    return create_dormitory(db, payload)


@router.put("/{dorm_id}", response_model=DormitoryResponse)
def update(
        dorm_id: int,
        payload: DormitoryUpdate,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User,
        Depends(require_permission("manage_dormitories"))],
):
    try:
        return update_dormitory(db, dorm_id, payload)
    except DormitoryNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete("/{dorm_id}")
def delete(
        dorm_id: int,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User,
        Depends(require_permission("manage_dormitories"))],
):
    try:
        delete_dormitory(db, dorm_id)
    except DormitoryNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
