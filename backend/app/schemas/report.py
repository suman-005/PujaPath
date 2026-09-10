from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ReportBase(BaseModel):
    puja_id: int
    type: str
    message: str


class ReportCreate(ReportBase):
    user_id: Optional[int] = None


class ReportUpdate(BaseModel):
    type: Optional[str] = None
    message: Optional[str] = None
    status: Optional[str] = None


class ReportResponse(ReportBase):
    id: int
    user_id: Optional[int] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)