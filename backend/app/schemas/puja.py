from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class PujaBase(BaseModel):
    name: str
    description: Optional[str] = None
    theme: Optional[str] = None
    address: str
    area: str
    latitude: float
    longitude: float
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    parking: bool = False
    toilet: bool = False
    food: bool = False
    medical_assistance: bool = False
    accessibility: bool = False
    contact: Optional[str] = None
    crowd_status: str = "Low"
    verified: bool = False


class PujaCreate(PujaBase):
    pass


class PujaUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    theme: Optional[str] = None
    address: Optional[str] = None
    area: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    opening_time: Optional[str] = None
    closing_time: Optional[str] = None
    parking: Optional[bool] = None
    toilet: Optional[bool] = None
    food: Optional[bool] = None
    medical_assistance: Optional[bool] = None
    accessibility: Optional[bool] = None
    contact: Optional[str] = None
    crowd_status: Optional[str] = None
    verified: Optional[bool] = None


class PujaResponse(PujaBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)