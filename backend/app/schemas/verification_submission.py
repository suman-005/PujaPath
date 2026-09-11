from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator

VALID_SUBMISSION_TYPES = {"THEME", "PUJA_INFO", "CROWD_INFO", "PHOTOGRAPH"}
VALID_STATUSES = {"PENDING", "VERIFIED", "REJECTED", "NEEDS_MORE_EVIDENCE"}
VALID_CROWD_GUIDANCE = {"LOW", "MODERATE", "HEAVY", "UNKNOWN"}

class SubmissionCreate(BaseModel):
    puja_id: int
    submission_type: str = Field(..., description="THEME, PUJA_INFO, CROWD_INFO, or PHOTOGRAPH")
    source: str = Field(..., min_length=3, max_length=255, description="Official source attribution")
    source_url: Optional[str] = Field(None, max_length=500)
    
    # Theme fields
    theme: Optional[str] = Field(None, max_length=200)
    theme_year: Optional[int] = Field(None, ge=2020, le=2030)
    
    # General description / updates
    description: Optional[str] = None
    
    # Photograph fields
    image_url: Optional[str] = Field(None, max_length=500)
    caption: Optional[str] = Field(None, max_length=255)
    license_or_permission: Optional[str] = Field(None, max_length=255)
    
    # Crowd fields
    crowd_guidance: Optional[str] = Field(None, max_length=50)

    @field_validator("submission_type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        v_upper = v.upper().strip()
        if v_upper not in VALID_SUBMISSION_TYPES:
            raise ValueError(f"submission_type must be one of {VALID_SUBMISSION_TYPES}")
        return v_upper

    @field_validator("crowd_guidance")
    @classmethod
    def validate_crowd(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v_upper = v.upper().strip()
        if v_upper not in VALID_CROWD_GUIDANCE:
            raise ValueError(f"crowd_guidance must be one of {VALID_CROWD_GUIDANCE}")
        return v_upper

class SubmissionReviewAction(BaseModel):
    verification_notes: str = Field(..., min_length=3, description="Mandatory notes detailing review rationale")

class SubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    puja_id: int
    submission_type: str
    status: str
    theme: Optional[str] = None
    theme_year: Optional[int] = None
    description: Optional[str] = None
    source: str
    source_url: Optional[str] = None
    image_url: Optional[str] = None
    caption: Optional[str] = None
    license_or_permission: Optional[str] = None
    crowd_guidance: Optional[str] = None
    submitted_by_id: Optional[int] = None
    verification_notes: Optional[str] = None
    reviewed_by_id: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
