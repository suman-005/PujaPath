from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.puja import Puja


class CrowdReport(Base):
    __tablename__ = "crowd_reports"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    puja_id: Mapped[int] = mapped_column(ForeignKey("pujas.id", ondelete="CASCADE"), index=True, nullable=False)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True)
    crowd_level: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    puja: Mapped["Puja"] = relationship("Puja", back_populates="crowd_reports")
    user: Mapped[Optional["User"]] = relationship("User", back_populates="crowd_reports")