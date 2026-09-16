from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.core.time import now_utc

if TYPE_CHECKING:
    from app.models.laundry_machine import LaundryMachine
    from app.models.user import User


class LaundryBooking(Base):
    __tablename__ = "laundry_bookings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    resident_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    laundry_machine_id: Mapped[int] = mapped_column(ForeignKey("laundry_machines.id"))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    ends_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    laundry_machine: Mapped[LaundryMachine] = relationship(back_populates="bookings")
    resident: Mapped[User] = relationship(back_populates="laundry_bookings")
