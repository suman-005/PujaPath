from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.db.session import get_db
from app.models.puja import Puja
from app.models.report import Report
from app.schemas.common import PageResponse
from app.schemas.report import ReportCreate, ReportResponse, ReportUpdate

router = APIRouter()


@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(payload: ReportCreate, db: Session = Depends(get_db)):
    puja = db.get(Puja, payload.puja_id)
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated Puja does not exist")

    report = Report(**payload.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("", response_model=PageResponse[ReportResponse], dependencies=[Depends(get_current_admin)])
def get_reports(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter reports by status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = select(Report)
    if status_filter:
        query = query.where(Report.status == status_filter)

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    items = db.scalars(query.order_by(Report.id.desc()).offset((page - 1) * page_size).limit(page_size)).all()

    return PageResponse[ReportResponse](
        items=items,
        page=page,
        page_size=page_size,
        total=total,
    )


@router.get("/{id}", response_model=ReportResponse, dependencies=[Depends(get_current_admin)])
def get_report(id: int, db: Session = Depends(get_db)):
    report = db.get(Report, id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return report


@router.put("/{id}", response_model=ReportResponse, dependencies=[Depends(get_current_admin)])
def update_report(id: int, payload: ReportUpdate, db: Session = Depends(get_db)):
    report = db.get(Report, id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(report, field, value)

    db.commit()
    db.refresh(report)
    return report