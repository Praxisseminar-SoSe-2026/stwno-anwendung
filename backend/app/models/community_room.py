from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.dormitory import Dormitory
    from app.models.room_request import RoomRequest


class CommunityRoom(Base):
    __tablename__ = "community_rooms"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    dormitory_id: Mapped[int] = mapped_column(ForeignKey("dormitories.id"))
    name: Mapped[str]
    description: Mapped[str | None] = mapped_column(default=None)

    dormitory: Mapped[Dormitory] = relationship(back_populates="community_rooms")
    room_requests: Mapped[list[RoomRequest]] = relationship(
        back_populates="community_room"
    )
