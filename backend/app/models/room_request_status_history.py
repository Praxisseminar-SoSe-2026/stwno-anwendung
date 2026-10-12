from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.time import now_utc
from app.db.database import Base

if TYPE_CHECKING:
    from app.models.room_request import RoomRequest
    from app.models.user import User


class RoomRequestStatusHistory(Base):
    __tablename__ = "room_request_status_histories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    room_request_id: Mapped[int] = mapped_column(ForeignKey("room_requests.id"))
    status: Mapped[str]
    changed_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    changed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=now_utc
    )

    room_request: Mapped[RoomRequest] = relationship(back_populates="status_history")
    changed_by: Mapped[User] = relationship(
        back_populates="changed_room_status_histories"
    )
