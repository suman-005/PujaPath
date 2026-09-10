from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ImageBase(BaseModel):
    puja_id: int
    image_url: str
    caption: Optional[str] = None
    image_type: str = "pandal"
    is_real_photo: bool = True


class ImageCreate(ImageBase):
    pass


class ImageUpdate(BaseModel):
    image_url: Optional[str] = None
    caption: Optional[str] = None
    image_type: Optional[str] = None
    is_real_photo: Optional[bool] = None


class ImageResponse(ImageBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)