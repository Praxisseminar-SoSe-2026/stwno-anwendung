import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permission
from app.db.database import get_db
from app.models.user import User
from app.schemas.infrastructure import CommunityRoomResponse
from app.services.infrastructure_service import list_community_rooms
from app.services.request_service import ResidentDormitoryError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/infrastructure", tags=["infrastructure"])


@router.get("/community_rooms", response_model=list[CommunityRoomResponse])
def list_all(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        return list_community_rooms(db, current_user)
    except ResidentDormitoryError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
