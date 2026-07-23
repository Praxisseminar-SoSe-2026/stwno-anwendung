from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.dormitory import Dormitory
    from app.models.washing_machine import WashingMachine


class WashRoom(Base):
    __tablename__ = "wash_rooms"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    dormitory_id: Mapped[int] = mapped_column(ForeignKey("dormitories.id"))
    name: Mapped[str]

    dormitory: Mapped[Dormitory] = relationship(back_populates="wash_rooms")
    washing_machines: Mapped[list[WashingMachine]] = relationship(
        back_populates="wash_room"
    )
