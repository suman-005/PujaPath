from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import api_router
from app.api.v1.endpoints.health import router as health_router
from app.core.config import settings
from app.schemas.health import RootResponse

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Production Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response


@app.get("/", response_model=RootResponse, status_code=status.HTTP_200_OK, tags=["Root"])
def root() -> RootResponse:
    return RootResponse(
        name=settings.PROJECT_NAME,
        status="running",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
    )


# Root health probe alias for cloud platform checks (/health)
app.include_router(health_router, tags=["Probes"])

# Versioned API routes (/api/v1/...)
app.include_router(api_router, prefix=settings.API_V1_STR)