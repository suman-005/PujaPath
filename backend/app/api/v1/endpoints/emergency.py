from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.emergency import EmergencyContact
from app.schemas.emergency import EmergencyContactCreate, EmergencyContactResponse, EmergencyContactUpdate

router = APIRouter()


@router.get("", response_model=List[EmergencyContactResponse])
def get_emergency_contacts(
    category: Optional[str] = Query(None, description="Filter contacts by category"),
    db: Session = Depends(get_db),
):
    query = select(EmergencyContact)
    if category:
        query = query.where(EmergencyContact.category.ilike(f"%{category.strip()}%"))
    return db.scalars(query.order_by(EmergencyContact.category.asc(), EmergencyContact.name.asc())).all()


@router.get("/{id}", response_model=EmergencyContactResponse)
def get_emergency_contact(id: int, db: Session = Depends(get_db)):
    contact = db.get(EmergencyContact, id)
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emergency contact not found")
    return contact


@router.post("", response_model=EmergencyContactResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_admin)])
def create_emergency_contact(payload: EmergencyContactCreate, db: Session = Depends(get_db)):
    contact = EmergencyContact(**payload.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.put("/{id}", response_model=EmergencyContactResponse, dependencies=[Depends(get_current_admin)])
def update_emergency_contact(id: int, payload: EmergencyContactUpdate, db: Session = Depends(get_db)):
    contact = db.get(EmergencyContact, id)
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emergency contact not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(contact, field, value)

    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_admin)])
def delete_emergency_contact(id: int, db: Session = Depends(get_db)):
    contact = db.get(EmergencyContact, id)
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Emergency contact not found")

    db.delete(contact)
    db.commit()
    return None