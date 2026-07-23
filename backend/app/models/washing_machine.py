from __future__ import annotations

from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class WashingMachine(Base):
    __tablename__ = "washing_machines"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    wash_room_id: Mapped[int] = mapped_column(ForeignKey("wash_rooms.id"))
    label: Mapped[str]
    status: Mapped[str] = mapped_column(default="Unbekannt", server_default="Unbekannt")
    last_signal_at: Mapped[datetime | None] = mapped_column(default=None)

    wash_room: Mapped["WashRoom"] = relationship(back_populates="washing_machines")
