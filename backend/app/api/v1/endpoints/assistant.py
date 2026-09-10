from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.services.assistant_service import PujaAssistantService

router = APIRouter()


@router.post("", response_model=AssistantResponse, status_code=status.HTTP_200_OK)
def ask_assistant(payload: AssistantRequest, db: Session = Depends(get_db)):
    if not payload.message or not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Message cannot be empty."
        )

    try:
        response = PujaAssistantService.process_query(db, payload.message)
        return response
    except Exception as err:
        # Fail-closed safe error handling without leaking database credentials or stack traces
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="I couldn't retrieve verified PujaPath information right now. Please try again later."
        )