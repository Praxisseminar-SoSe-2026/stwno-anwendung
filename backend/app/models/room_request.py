from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.request import Request

if TYPE_CHECKING:
    from app.models.community_room import CommunityRoom
    from app.models.user import User


class RoomRequest(Request):

    __tablename__ = "room_requests"

    id: Mapped[int] = mapped_column(ForeignKey("requests.id"), primary_key=True)
    community_room_id: Mapped[int] = mapped_column(ForeignKey("community_rooms.id"))
    start_datetime: Mapped[datetime]
    end_datetime: Mapped[datetime]
    decided_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"), default=None
    )
    decided_at: Mapped[datetime | None] = mapped_column(default=None)

    community_room: Mapped[CommunityRoom] = relationship(back_populates="room_requests")
    decided_by: Mapped[User | None] = relationship(
        back_populates="decided_room_requests", foreign_keys=[decided_by_id]
    )

    __mapper_args__ = {"polymorphic_identity": "room"}
