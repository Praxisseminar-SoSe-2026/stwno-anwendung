from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permission
from app.db.database import get_db
from app.models.dormitory import Dormitory
from app.models.user import User
from app.schemas.dormitory import DormitoryResponse, DormitoryCreate
from app.services.dormitory_service import create_dormitory

router = APIRouter(prefix="/dormitories", tags=["dormitories"])


@router.get("", response_model=list[DormitoryResponse])
def list_all(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    # TODO: Move this to dormitory_service
    return db.query(Dormitory).order_by(Dormitory.name).all()


@router.post("", response_model=DormitoryResponse)
def create(
        payload: DormitoryCreate,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(require_permission("manage_dormitories"))],
):
    return create_dormitory(db, payload)
