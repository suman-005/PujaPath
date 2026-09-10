from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.contact_message import ContactMessage
from app.models.emergency import EmergencyContact
from app.models.image import Image
from app.models.puja import Puja
from app.models.report import Report
from app.models.user import User
from app.schemas.auth import RoleUpdateRequest
from app.schemas.common import PageResponse
from app.schemas.user import UserResponse

router = APIRouter(dependencies=[Depends(get_current_admin)])


@router.get("/dashboard")
def get_admin_dashboard(db: Session = Depends(get_db)):
    total_pujas = db.scalar(select(func.count()).select_from(Puja)) or 0
    total_users = db.scalar(select(func.count()).select_from(User)) or 0
    total_reports = db.scalar(select(func.count()).select_from(Report)) or 0
    total_emergency_contacts = db.scalar(select(func.count()).select_from(EmergencyContact)) or 0
    total_images = db.scalar(select(func.count()).select_from(Image)) or 0
    total_contact_messages = db.scalar(select(func.count()).select_from(ContactMessage)) or 0

    return {
        "total_pujas": total_pujas,
        "total_users": total_users,
        "total_reports": total_reports,
        "total_emergency_contacts": total_emergency_contacts,
        "total_images": total_images,
        "total_contact_messages": total_contact_messages,
    }


@router.get("/users", response_model=PageResponse[UserResponse])
def get_all_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = select(User)
    if role:
        query = query.where(User.role == role)

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = db.scalars(query.order_by(User.id.asc()).offset((page - 1) * page_size).limit(page_size)).all()

    return PageResponse[UserResponse](
        items=items,
        page=page,
        page_size=page_size,
        total=total,
    )


@router.get("/users/{id}", response_model=UserResponse)
def get_user_by_id(id: int, db: Session = Depends(get_db)):
    user = db.get(User, id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.put("/users/{id}/role", response_model=UserResponse)
def update_user_role(id: int, payload: RoleUpdateRequest, db: Session = Depends(get_db)):
    if payload.role not in ("user", "admin"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role must be 'user' or 'admin'")

    user = db.get(User, id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.role = payload.role
    db.commit()
    db.refresh(user)
    return user