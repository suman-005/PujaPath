from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

CrowdLevelEnum = Literal["Low", "Moderate", "Heavy"]


class CrowdReportCreate(BaseModel):
    puja_id: int
    crowd_level: CrowdLevelEnum = Field(..., description="Reported crowd level: Low, Moderate, or Heavy")


class CrowdReportResponse(BaseModel):
    id: int
    puja_id: int
    crowd_level: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CrowdStatusSummary(BaseModel):
    puja_id: int
    status: Optional[str] = Field(None, description="Calculated approximate crowd status or None if no reports")
    report_count: int = Field(0, description="Total reports in the time window")
    window_minutes: int = Field(60, description="Time window in minutes")
    has_recent_reports: bool = Field(False, description="True if report_count > 0")
    disclaimer: str = "Crowd information is approximate and based on recent visitor reports."
    updated_at: datetime