import logging
from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.schemas.health import HealthResponse, ReadyResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check probe",
)
def get_health() -> HealthResponse:
    return HealthResponse(
        status="healthy",
        environment=settings.ENVIRONMENT,
        version=settings.VERSION,
    )


@router.get(
    "/ready",
    response_model=ReadyResponse,
    responses={
        200: {"model": ReadyResponse, "description": "Database connected"},
        503: {"model": ReadyResponse, "description": "Database unavailable"},
    },
    summary="Readiness probe",
)
def get_ready(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1"))
        if result.scalar() == 1:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": "ready",
                    "database": "connected",
                },
            )
        raise ValueError("Unexpected query result")
    except Exception as exc:
        logger.warning("Database readiness probe failed: %s", exc.__class__.__name__)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unavailable",
                "database": "disconnected",
            },
        )