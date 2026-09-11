from fastapi import APIRouter
from app.api.v1.endpoints import (
    assistant,
    admin,
    auth,
    contact,
    crowd_reports,
    emergency,
    health,
    images,
    pujas,
    reports,
    submissions,
    themes,
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])
api_router.include_router(pujas.router, prefix="/pujas", tags=["Pujas"])
api_router.include_router(themes.router, prefix="/themes", tags=["Themes"])
api_router.include_router(images.router, tags=["Images"])
api_router.include_router(emergency.router, prefix="/emergency", tags=["Emergency"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(crowd_reports.router, tags=["Crowd Reports"])
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["Assistant"])
