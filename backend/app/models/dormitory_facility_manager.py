from __future__ import annotations

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class DormitoryFacilityManager(Base):
    __tablename__ = "dormitory_facility_managers"
    __table_args__ = (UniqueConstraint("dormitory_id", "user_id"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    dormitory_id: Mapped[int] = mapped_column(ForeignKey("dormitories.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    dormitory: Mapped["Dormitory"] = relationship(back_populates="facility_managers")
    user: Mapped["User"] = relationship(back_populates="facility_manager_of")
