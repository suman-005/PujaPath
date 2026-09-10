from datetime import datetime, timezone
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.image import Image
    from app.models.report import Report
    from app.models.crowd_report import CrowdReport


class Puja(Base):
    __tablename__ = "pujas"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    theme: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    address: Mapped[str] = mapped_column(String(300), nullable=False)
    area: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    opening_time: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    closing_time: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    parking: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    toilet: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    food: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    medical_assistance: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    accessibility: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    contact: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    crowd_status: Mapped[str] = mapped_column(String(50), default="Low", nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
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

    images: Mapped[List["Image"]] = relationship(
        "Image",
        back_populates="puja",
        cascade="all, delete-orphan",
    )
    reports: Mapped[List["Report"]] = relationship(
        "Report",
        back_populates="puja",
        cascade="all, delete-orphan",
    )
    crowd_reports: Mapped[List["CrowdReport"]] = relationship(
        "CrowdReport",
        back_populates="puja",
        cascade="all, delete-orphan",
    )