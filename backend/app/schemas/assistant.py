from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class AssistantRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=500, description="User prompt or question")


class AssistantSource(BaseModel):
    id: Optional[int] = None
    name: str
    type: str = Field("puja", description="Type of source: puja, emergency, or theme")
    area: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AssistantResponse(BaseModel):
    answer: str
    sources: List[AssistantSource] = Field(default_factory=list)
    disclaimer: str = "Responses are generated from verified PujaPath database records."