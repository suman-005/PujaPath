from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class CrowdReportBase(BaseModel):
    puja_id: int
    crowd_level: str


class CrowdReportCreate(CrowdReportBase):
    user_id: Optional[int] = None


class CrowdReportResponse(CrowdReportBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)