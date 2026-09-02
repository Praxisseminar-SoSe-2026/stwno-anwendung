from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.dormitory import Dormitory
from app.models.user import User
from app.schemas.dormitory import DormitoryResponse

router = APIRouter(prefix="/dormitories", tags=["dormitories"])


@router.get("", response_model=list[DormitoryResponse])
def list_all(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return db.query(Dormitory).order_by(Dormitory.name).all()