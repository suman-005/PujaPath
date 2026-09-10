from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_user
from app.db.session import get_db
from app.models.crowd_report import CrowdReport
from app.models.puja import Puja
from app.models.user import User
from app.schemas.crowd_report import (
    CrowdReportCreate,
    CrowdReportResponse,
    CrowdStatusSummary,
)

router = APIRouter()

WINDOW_MINUTES = 60
USER_RATE_LIMIT_MINUTES = 5  # Prevent duplicate rapid submissions by same user for same puja


@router.post("/crowd-reports", response_model=CrowdReportResponse, status_code=status.HTTP_201_CREATED)
def create_crowd_report(
    payload: CrowdReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    puja = db.get(Puja, payload.puja_id)
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puja not found")

    now = datetime.now(timezone.utc)
    recent_threshold = now - timedelta(minutes=USER_RATE_LIMIT_MINUTES)

    # Check for rapid duplicate submission by same authenticated user on this puja
    existing_recent = db.scalar(
        select(CrowdReport).where(
            CrowdReport.puja_id == payload.puja_id,
            CrowdReport.user_id == current_user.id,
            CrowdReport.created_at >= recent_threshold,
        )
    )
    if existing_recent:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"You have already reported the crowd status for this Puja within the last {USER_RATE_LIMIT_MINUTES} minutes.",
        )

    # user_id is strictly derived from verified JWT token, never trusted from payload
    crowd_report = CrowdReport(
        puja_id=payload.puja_id,
        user_id=current_user.id,
        crowd_level=payload.crowd_level,
        created_at=now,
    )
    db.add(crowd_report)
    db.commit()
    db.refresh(crowd_report)
    return crowd_report


@router.get("/pujas/{puja_id}/crowd-summary", response_model=CrowdStatusSummary)
def get_puja_crowd_summary(puja_id: int, db: Session = Depends(get_db)):
    puja = db.get(Puja, puja_id)
    if not puja:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Puja not found")

    now = datetime.now(timezone.utc)
    window_start = now - timedelta(minutes=WINDOW_MINUTES)

    # Query reports within window
    stmt = select(CrowdReport).where(
        CrowdReport.puja_id == puja_id,
        CrowdReport.created_at >= window_start,
    )
    reports = db.scalars(stmt).all()
    count = len(reports)

    if count == 0:
        return CrowdStatusSummary(
            puja_id=puja_id,
            status=None,
            report_count=0,
            window_minutes=WINDOW_MINUTES,
            has_recent_reports=False,
            updated_at=now,
        )

    # Calculate majority
    counts = Counter(r.crowd_level for r in reports)
    # Tie-breaker hierarchy: Heavy > Moderate > Low (safety-first)
    priority = {"Heavy": 3, "Moderate": 2, "Low": 1}

    max_freq = max(counts.values())
    top_levels = [lvl for lvl, freq in counts.items() if freq == max_freq]
    selected_status = sorted(top_levels, key=lambda lvl: priority.get(lvl, 0), reverse=True)[0]

    return CrowdStatusSummary(
        puja_id=puja_id,
        status=selected_status,
        report_count=count,
        window_minutes=WINDOW_MINUTES,
        has_recent_reports=True,
        updated_at=now,
    )


@router.get("/crowd-reports", response_model=List[CrowdReportResponse], dependencies=[Depends(get_current_admin)])
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