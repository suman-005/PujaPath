from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.image import Image
from app.models.puja import Puja
from app.schemas.image import ImageCreate, ImageResponse

router = APIRouter()


@router.get("/pujas/{puja_id}/images", response_model=List[ImageResponse])
def get_puja_images(puja_id: int, db: Session = Depends(get_db)):
    puja = db.get(Puja, puja_id)
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puja not found")

    return db.scalars(select(Image).where(Image.puja_id == puja_id).order_by(Image.id.asc())).all()


@router.post("/pujas/{puja_id}/images", response_model=ImageResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_admin)])
def create_puja_image(puja_id: int, payload: ImageCreate, db: Session = Depends(get_db)):
    puja = db.get(Puja, puja_id)
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puja not found")

    image = Image(
        puja_id=puja_id,
        image_url=payload.image_url,
        caption=payload.caption,
        image_type=payload.image_type,
        is_real_photo=payload.is_real_photo,
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@router.delete("/images/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_image(id: int, db: Session = Depends(get_db)):
    image = db.get(Image, id)
    if not image:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    db.delete(image)
    db.commit()
    return None