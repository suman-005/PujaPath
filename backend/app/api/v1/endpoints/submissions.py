from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_current_admin
from app.db.session import get_db
from app.models.user import User
from app.models.puja import Puja
from app.models.image import Image
from app.models.verification_submission import PujaVerificationSubmission
from app.schemas.verification_submission import (
    SubmissionCreate,
    SubmissionResponse,
    SubmissionReviewAction,
)

router = APIRouter()

@router.post("", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
def create_submission(
    payload: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    puja = db.get(Puja, payload.puja_id)
    if not puja:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Puja with id {payload.puja_id} does not exist",
        )

    if payload.submission_type == "THEME" and not payload.theme:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Theme name is required for THEME submissions",
        )
    if payload.submission_type == "PHOTOGRAPH" and not payload.image_url:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="image_url is required for PHOTOGRAPH submissions",
        )
    if payload.submission_type == "CROWD_INFO" and not payload.crowd_guidance:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="crowd_guidance is required for CROWD_INFO submissions",
        )

    submission = PujaVerificationSubmission(
        puja_id=payload.puja_id,
        submission_type=payload.submission_type,
        status="PENDING",
        theme=payload.theme,
        theme_year=payload.theme_year,
        description=payload.description,
        source=payload.source,
        source_url=payload.source_url,
        image_url=payload.image_url,
        caption=payload.caption,
        license_or_permission=payload.license_or_permission,
        crowd_guidance=payload.crowd_guidance,
        submitted_by_id=current_user.id,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("", response_model=List[SubmissionResponse])
def list_submissions(
    puja_id: Optional[int] = Query(None),
    submission_type: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    query = select(PujaVerificationSubmission)
    if puja_id is not None:
        query = query.where(PujaVerificationSubmission.puja_id == puja_id)
    if submission_type is not None:
        query = query.where(PujaVerificationSubmission.submission_type == submission_type.upper())
    if status_filter is not None:
        query = query.where(PujaVerificationSubmission.status == status_filter.upper())

    query = query.order_by(desc(PujaVerificationSubmission.created_at)).offset(skip).limit(limit)
    results = db.execute(query).scalars().all()
    return results


@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    submission = db.get(PujaVerificationSubmission, submission_id)
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Submission {submission_id} not found",
        )
    return submission


@router.post("/{submission_id}/approve", response_model=SubmissionResponse)
def approve_submission(
    submission_id: int,
    action: SubmissionReviewAction,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    submission = db.get(PujaVerificationSubmission, submission_id)
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Submission {submission_id} not found",
        )

    puja = db.get(Puja, submission.puja_id)
    if not puja:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated Puja not found",
        )

    now = datetime.now(timezone.utc)
    submission.status = "VERIFIED"
    submission.verification_notes = action.verification_notes
    submission.reviewed_by_id = admin.id
    submission.reviewed_at = now

    if submission.submission_type == "THEME":
        if submission.theme:
            puja.theme = submission.theme
    elif submission.submission_type == "PUJA_INFO":
        if submission.description:
            puja.description = submission.description
    elif submission.submission_type == "CROWD_INFO":
        if submission.crowd_guidance:
            puja.crowd_status = submission.crowd_guidance
    elif submission.submission_type == "PHOTOGRAPH":
        if submission.image_url:
            canonical_image = Image(
                puja_id=puja.id,
                image_url=submission.image_url,
                caption=submission.caption or f"Verified photo: {puja.name}",
                image_type="pandal",
                is_real_photo=True,
            )
            db.add(canonical_image)

    db.commit()
    db.refresh(submission)
    return submission


@router.post("/{submission_id}/reject", response_model=SubmissionResponse)
def reject_submission(
    submission_id: int,
    action: SubmissionReviewAction,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    submission = db.get(PujaVerificationSubmission, submission_id)
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Submission {submission_id} not found",
        )

    submission.status = "REJECTED"
    submission.verification_notes = action.verification_notes
    submission.reviewed_by_id = admin.id
    submission.reviewed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(submission)
    return submission
