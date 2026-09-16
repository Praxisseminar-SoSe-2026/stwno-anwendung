from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.time import now_utc
from app.db.database import Base

if TYPE_CHECKING:
    from app.models.item_type import ItemType
    from app.models.user import User


class ItemReservation(Base):
    __tablename__ = "item_reservations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    item_type_id: Mapped[int] = mapped_column(ForeignKey("item_types.id"))
    resident_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    status: Mapped[str] = mapped_column(
        default="Reserviert", server_default="Reserviert"
    )
    # Sketch: kein NOT NULL, nur DEFAULT (now()) -> nullable
    reserved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True),
                                                         default=now_utc)
    picked_up_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True),
                                                          default=None)
    returned_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True),
                                                         default=None)

    item_type: Mapped[ItemType] = relationship(back_populates="reservations")
    resident: Mapped[User] = relationship(back_populates="item_reservations")
