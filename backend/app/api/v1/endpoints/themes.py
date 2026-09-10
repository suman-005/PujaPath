from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.theme import Theme
from app.schemas.theme import ThemeCreate, ThemeResponse, ThemeUpdate

router = APIRouter()


@router.get("", response_model=List[ThemeResponse])
def get_themes(db: Session = Depends(get_db)):
    return db.scalars(select(Theme).order_by(Theme.name.asc())).all()


@router.get("/{id}", response_model=ThemeResponse)
def get_theme(id: int, db: Session = Depends(get_db)):
    theme = db.get(Theme, id)
    if not theme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Theme not found")
    return theme


@router.post("", response_model=ThemeResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_admin)])
def create_theme(payload: ThemeCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(Theme).where(Theme.name == payload.name))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Theme already exists")

    theme = Theme(**payload.model_dump())
    db.add(theme)
    db.commit()
    db.refresh(theme)
    return theme


@router.put("/{id}", response_model=ThemeResponse, dependencies=[Depends(get_current_admin)])
def update_theme(id: int, payload: ThemeUpdate, db: Session = Depends(get_db)):
    theme = db.get(Theme, id)
    if not theme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Theme not found")

    update_data = payload.model_dump(exclude_unset=True)
    if "name" in update_data and update_data["name"] != theme.name:
        existing = db.scalar(select(Theme).where(Theme.name == update_data["name"]))
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Theme name already in use")

    for field, value in update_data.items():
        setattr(theme, field, value)

    db.commit()
    db.refresh(theme)
    return theme


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_theme(id: int, db: Session = Depends(get_db)):
    theme = db.get(Theme, id)
    if not theme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Theme not found")

    db.delete(theme)
    db.commit()
    return None