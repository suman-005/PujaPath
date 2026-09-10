from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.crowd_report import CrowdReport
from app.models.puja import Puja
from app.schemas.crowd_report import CrowdReportCreate, CrowdReportResponse

router = APIRouter()


@router.post("/crowd-reports", response_model=CrowdReportResponse, status_code=status.HTTP_201_CREATED)
def create_crowd_report(payload: CrowdReportCreate, db: Session = Depends(get_db)):
    puja = db.get(Puja, payload.puja_id)
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated Puja does not exist")

    crowd_report = CrowdReport(**payload.model_dump())
    db.add(crowd_report)
    db.commit()
    db.refresh(crowd_report)
    return crowd_report


@router.get("/crowd-reports", response_model=List[CrowdReportResponse])
def get_all_crowd_reports(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    stmt = select(CrowdReport).order_by(CrowdReport.created_at.desc()).limit(limit)
    return db.scalars(stmt).all()


@router.get("/pujas/{puja_id}/crowd-reports", response_model=List[CrowdReportResponse])
def get_puja_crowd_reports(
    puja_id: int,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    puja = db.get(Puja, puja_id)
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puja not found")

    stmt = (
        select(CrowdReport)
        .where(CrowdReport.puja_id == puja_id)
        .order_by(CrowdReport.created_at.desc())
        .limit(limit)
    )
    return db.scalars(stmt).all()