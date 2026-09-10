from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


def normalize_database_url(url: str) -> str:
    """
    Normalize PostgreSQL URLs for SQLAlchemy.

    Supports:
    postgresql://
    postgresql+psycopg://
    postgresql+asyncpg://

    Stage 2 uses synchronous SQLAlchemy sessions.
    """
    if url.startswith("postgresql+asyncpg://"):
        return url.replace(
            "postgresql+asyncpg://",
            "postgresql+psycopg://",
            1,
        )

    if url.startswith("postgres://"):
        return url.replace(
            "postgres://",
            "postgresql+psycopg://",
            1,
        )

    if url.startswith("postgresql://"):
        return url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1,
        )

    return url


DATABASE_URL = normalize_database_url(settings.DATABASE_URL)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI database session dependency.
    """
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
