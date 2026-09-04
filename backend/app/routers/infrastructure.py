import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.infrastructure import CommunityRoomResponse
from app.schemas.laundry import LaundryMachineResponse
from app.services.infrastructure_service import (
    LaundryRoomNotFoundError,
    list_community_rooms,
    list_laundry_machines,
)
from app.services.request_service import ResidentDormitoryError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/infrastructure", tags=["infrastructure"])


@router.get("/community_rooms", response_model=list[CommunityRoomResponse])
def list_all_rooms(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        return list_community_rooms(db, current_user)
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/laundry_machines", response_model=list[LaundryMachineResponse])
def list_all_laundry_machines(
        laundry_room_id: int,
        db: Annotated[Session, Depends(get_db)],
        current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        return list_laundry_machines(db, current_user, laundry_room_id)
    except LaundryRoomNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
