from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.dormitory import Dormitory
    from app.models.laundry_machine import LaundryMachine


class LaundryRoom(Base):
    __tablename__ = "laundry_rooms"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    dormitory_id: Mapped[int] = mapped_column(ForeignKey("dormitories.id"))
    name: Mapped[str]

    dormitory: Mapped[Dormitory] = relationship(back_populates="laundry_rooms")
    laundry_machines: Mapped[list[LaundryMachine]] = relationship(
        back_populates="laundry_room"
    )
