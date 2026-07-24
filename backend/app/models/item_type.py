from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.dormitory import Dormitory
    from app.models.item_reservation import ItemReservation


class ItemType(Base):
    __tablename__ = "item_types"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    dormitory_id: Mapped[int] = mapped_column(ForeignKey("dormitories.id"))
    name: Mapped[str]
    total_count: Mapped[int] = mapped_column(default=0, server_default="0")

    dormitory: Mapped[Dormitory] = relationship(back_populates="item_types")
    reservations: Mapped[list[ItemReservation]] = relationship(
        back_populates="item_type"
    )
