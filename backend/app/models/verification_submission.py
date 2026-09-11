from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.puja import Puja
    from app.models.user import User


class PujaVerificationSubmission(Base):
    __tablename__ = "puja_verification_submissions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    puja_id: Mapped[int] = mapped_column(ForeignKey("pujas.id", ondelete="CASCADE"), index=True, nullable=False)
    
    # Types: THEME, PUJA_INFO, CROWD_INFO, PHOTOGRAPH
    submission_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    
    # Statuses: PENDING, VERIFIED, REJECTED, NEEDS_MORE_EVIDENCE
    status: Mapped[str] = mapped_column(String(50), default="PENDING", index=True, nullable=False)
    
    # Factual Theme details
    theme: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    theme_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    # Factual updates or descriptions
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Source provenance (mandatory by policy)
    source: Mapped[str] = mapped_column(String(255), nullable=False)
    source_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    # Photograph / licensing details
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    caption: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    license_or_permission: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Crowd guidance info
    crowd_guidance: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    # User / Submitter tracking
    submitted_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Admin review tracking
    verification_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    reviewed_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    puja: Mapped["Puja"] = relationship("Puja")
    submitted_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[submitted_by_id])
    reviewed_by: Mapped[Optional["User"]] = relationship("User", foreign_keys=[reviewed_by_id])


Index("ix_submissions_puja_status", PujaVerificationSubmission.puja_id, PujaVerificationSubmission.status)
Index("ix_submissions_type_status", PujaVerificationSubmission.submission_type, PujaVerificationSubmission.status)
