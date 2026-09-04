from __future__ import annotations

from typing import TYPE_CHECKING, Literal

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.laundry_booking import LaundryBooking
    from app.models.laundry_room import LaundryRoom


class LaundryMachine(Base):
    __tablename__ = "laundry_machines"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    label: Mapped[str]
    laundry_room_id: Mapped[int] = mapped_column(ForeignKey("laundry_rooms.id"))
    type: Mapped[Literal["Washingmachine", "Dryer"]] = mapped_column(
        default="Washingmachine",
        server_default="Washingmachine"
    )
    # Todo: discuss language and naming conventions
    status: Mapped[str] = mapped_column(default="Unbekannt", server_default="Unbekannt")

    laundry_room: Mapped[LaundryRoom] = relationship(back_populates="laundry_machines")
    bookings: Mapped[list[LaundryBooking]] = relationship(
        back_populates="laundry_machine"
    )
