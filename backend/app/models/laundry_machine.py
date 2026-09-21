from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.status import LaundryStatus, LaundryType
from app.db.database import Base

if TYPE_CHECKING:
    from app.models.laundry_booking import LaundryBooking
    from app.models.laundry_room import LaundryRoom


class LaundryMachine(Base):
    __tablename__ = "laundry_machines"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    label: Mapped[str]
    laundry_room_id: Mapped[int] = mapped_column(ForeignKey("laundry_rooms.id"))
    type: Mapped[LaundryType] = mapped_column(
        Enum(LaundryType),
        default=LaundryType.WASHINGMASCHINE,
        server_default="Washingmachine",
    )
    status: Mapped[LaundryStatus] = mapped_column(
        Enum(LaundryStatus), default=LaundryStatus.UNKNOWN, server_default="UNKNOWN"
    )

    laundry_room: Mapped[LaundryRoom] = relationship(back_populates="laundry_machines")
    bookings: Mapped[list[LaundryBooking]] = relationship(
        back_populates="laundry_machine"
    )
