from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.puja import Puja
from app.schemas.common import PageResponse
from app.schemas.puja import PujaCreate, PujaResponse, PujaUpdate

router = APIRouter()


@router.get("", response_model=PageResponse[PujaResponse])
def get_pujas(
    search: Optional[str] = Query(None, description="Search name, description, area, address, or theme"),
    area: Optional[str] = Query(None, description="Filter by area"),
    theme: Optional[str] = Query(None, description="Filter by theme"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    query = select(Puja)

    if search:
        term = f"%{search.strip()}%"
        query = query.where(
            or_(
                Puja.name.ilike(term),
                Puja.description.ilike(term),
                Puja.area.ilike(term),
                Puja.address.ilike(term),
                Puja.theme.ilike(term),
            )
        )

    if area:
        query = query.where(Puja.area.ilike(f"%{area.strip()}%"))

    if theme:
        query = query.where(Puja.theme.ilike(f"%{theme.strip()}%"))

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    offset = (page - 1) * page_size
    items = db.scalars(query.order_by(Puja.id.desc()).offset(offset).limit(page_size)).all()

    return PageResponse[PujaResponse](
        items=items,
        page=page,
        page_size=page_size,
        total=total,
    )


@router.get("/{id}", response_model=PujaResponse)
def get_puja(id: int, db: Session = Depends(get_db)):
    puja = db.get(Puja, id)
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puja not found")
    return puja


@router.post("", response_model=PujaResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_admin)])
def create_puja(payload: PujaCreate, db: Session = Depends(get_db)):
    puja = Puja(**payload.model_dump())
    db.add(puja)
    db.commit()
    db.refresh(puja)
    return puja


@router.put("/{id}", response_model=PujaResponse, dependencies=[Depends(get_current_admin)])
def update_puja(id: int, payload: PujaUpdate, db: Session = Depends(get_db)):
    puja = db.get(Puja, id)
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puja not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(puja, field, value)

    db.commit()
    db.refresh(puja)
    return puja


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_puja(id: int, db: Session = Depends(get_db)):
    puja = db.get(Puja, id)
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puja not found")

    db.delete(puja)
    db.commit()
    return None