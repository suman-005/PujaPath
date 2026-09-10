from typing import Optional
from pydantic import BaseModel, ConfigDict


class ThemeBase(BaseModel):
    name: str
    description: Optional[str] = None


class ThemeCreate(ThemeBase):
    pass


class ThemeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class ThemeResponse(ThemeBase):
    id: int

    model_config = ConfigDict(from_attributes=True)