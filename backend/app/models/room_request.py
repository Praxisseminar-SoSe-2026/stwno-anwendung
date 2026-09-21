from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy import true as sql_true
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.request import Request

if TYPE_CHECKING:
    from app.models.community_room import CommunityRoom
    from app.models.user import User


class RoomRequest(Request):

    __tablename__ = "room_requests"

    id: Mapped[int] = mapped_column(ForeignKey("requests.id"), primary_key=True)
    community_room_id: Mapped[int] = mapped_column(ForeignKey("community_rooms.id"))
    start_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    regular_key_exchange_possible: Mapped[bool] = mapped_column(
        default=True, server_default=sql_true()
    )
    alternative_key_exchange_date: Mapped[datetime | None]
    decided_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"), default=None
    )
    decided_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), default=None
    )

    community_room: Mapped[CommunityRoom] = relationship(back_populates="room_requests")
    decided_by: Mapped[User | None] = relationship(
        back_populates="decided_room_requests", foreign_keys=[decided_by_id]
    )

    __mapper_args__ = {"polymorphic_identity": "room"}
