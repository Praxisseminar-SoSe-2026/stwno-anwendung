from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class ResidentMasterData(Base):
    __tablename__ = "resident_master_data"

    id: Mapped[int] = mapped_column(primary_key=True)
    person_number: Mapped[str] = mapped_column(unique=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    first_name: Mapped[str]
    last_name: Mapped[str]
    dormitory_id: Mapped[int | None] = mapped_column(
        ForeignKey("dormitories.id"), default=None
    )
    flat_number: Mapped[str | None] = mapped_column(default=None)
