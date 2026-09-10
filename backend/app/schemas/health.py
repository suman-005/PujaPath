from pydantic import BaseModel


class RootResponse(BaseModel):
    name: str
    status: str
    version: str
    environment: str


class HealthResponse(BaseModel):
    status: str
    environment: str
    version: str


class ReadyResponse(BaseModel):
    status: str
    database: str