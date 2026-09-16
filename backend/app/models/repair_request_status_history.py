from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.time import now_utc
from app.db.database import Base

if TYPE_CHECKING:
    from app.models.repair_request import RepairRequest
    from app.models.user import User


class RepairRequestStatusHistory(Base):
    __tablename__ = "repair_request_status_histories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    repair_request_id: Mapped[int] = mapped_column(ForeignKey("repair_requests.id"))
    status: Mapped[str]
    changed_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    changed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True),
                                                        default=now_utc)

    repair_request: Mapped[RepairRequest] = relationship(
        back_populates="status_history"
    )
    changed_by: Mapped[User] = relationship(back_populates="changed_status_histories")
