from typing import List, Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


INSECURE_DEFAULT_KEYS = {
    "dev-secret-key-change-in-production-min-32-chars-long",
    "secret",
    "changeme",
    "development",
    "insecure",
}


class Settings(BaseSettings):
    PROJECT_NAME: str = "PujaPath API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    ENVIRONMENT: str = "development"

    SECRET_KEY: str = (
        "dev-secret-key-change-in-production-min-32-chars-long"
    )

    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/pujapath"
    )

    # IMPORTANT: Vite frontend runs on port 5173
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    ADDITIONAL_CORS_ORIGINS: Union[List[str], str] = []

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str, info) -> str:
        env = info.data.get("ENVIRONMENT", "development")

        if env.lower() == "production":
            if len(v) < 32:
                raise ValueError(
                    "In production, SECRET_KEY must be at least 32 characters long."
                )

            if v in INSECURE_DEFAULT_KEYS or "dev" in v.lower():
                raise ValueError(
                    "In production, SECRET_KEY must not use insecure "
                    "or development default values."
                )

        return v

    @property
    def cors_origins(self) -> List[str]:
        origins: List[str] = []

        if self.FRONTEND_ORIGIN:
            origins.append(self.FRONTEND_ORIGIN)

        if isinstance(self.ADDITIONAL_CORS_ORIGINS, str):
            extra = [
                origin.strip()
                for origin in self.ADDITIONAL_CORS_ORIGINS.split(",")
                if origin.strip()
            ]
            origins.extend(extra)

        elif isinstance(self.ADDITIONAL_CORS_ORIGINS, list):
            origins.extend(self.ADDITIONAL_CORS_ORIGINS)

        deduped = list(dict.fromkeys(origins))

        if self.ENVIRONMENT.lower() == "production" and "*" in deduped:
            deduped.remove("*")

        return deduped


settings = Settings()
