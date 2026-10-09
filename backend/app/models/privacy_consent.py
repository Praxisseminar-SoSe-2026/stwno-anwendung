from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.core.time import now_utc
from app.db.database import Base


class PrivacyConsent(Base):
    __tablename__ = "privacy_consents"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    policy_version: Mapped[str]
    consented_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now_utc
    )
