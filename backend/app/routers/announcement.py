import logging
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_permission
from app.db.database import get_db
from app.models.user import User
from app.schemas.announcement import (
    AnnouncementCreate,
    AnnouncementResponse,
    AnnouncementUpdate,
)
from app.services.announcement_service import (
    AnnouncementNotFoundError,
    create_announcement,
    delete_announcement,
    get_announcement,
    list_announcements,
    update_announcement,
)
from app.services.email_service import send_emails
from app.services.notification_service import announcement_emails

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/announcements", tags=["announcements"])


@router.post("", response_model=AnnouncementResponse, status_code=201)
def create(
    payload: AnnouncementCreate,
    background_tasks: BackgroundTasks,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_permission("post_announcement"))],
):
    announcement = create_announcement(db, current_user.id, payload)
    background_tasks.add_task(send_emails, announcement_emails(db, announcement))
    return announcement


@router.get("", response_model=list[AnnouncementResponse])
def list_all(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    return list_announcements(db)


@router.get("/{announcement_id}", response_model=AnnouncementResponse)
def get_one(
    announcement_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    try:
        return get_announcement(db, announcement_id)
    except AnnouncementNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/{announcement_id}", response_model=AnnouncementResponse)
def update(
    announcement_id: int,
    payload: AnnouncementUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_permission("edit_announcement"))],
):
    try:
        return update_announcement(db, announcement_id, payload)
    except AnnouncementNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.delete("/{announcement_id}", status_code=204)
def delete(
    announcement_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_permission("edit_announcement"))],
):
    try:
        delete_announcement(db, announcement_id)
    except AnnouncementNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
