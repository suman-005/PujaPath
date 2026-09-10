from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class EmergencyContactBase(BaseModel):
    category: str
    name: str
    phone: str
    location: Optional[str] = None
    verified: bool = True
    last_verified_at: Optional[datetime] = None


class EmergencyContactCreate(EmergencyContactBase):
    pass


class EmergencyContactUpdate(BaseModel):
    category: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    verified: Optional[bool] = None
    last_verified_at: Optional[datetime] = None


class EmergencyContactResponse(EmergencyContactBase):
    id: int

    model_config = ConfigDict(from_attributes=True)