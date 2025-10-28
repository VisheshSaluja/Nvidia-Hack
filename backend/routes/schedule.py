from typing import Dict, List

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlmodel import Session

from database import get_session
from services.mcp_orchestrator import orchestrator


router = APIRouter(prefix="/schedule", tags=["schedule"])


class ScheduleRequest(BaseModel):
    user_id: str = Field(..., example="user-123")
    prescription: Dict[str, str]


@router.post("/generate")
def generate_schedule(
    payload: ScheduleRequest, session: Session = Depends(get_session)
) -> Dict[str, List[Dict[str, str]]]:
    schedule = orchestrator.generate_schedule(
        session, payload.user_id, payload.prescription
    )
    reminders = [orchestrator.reminder_copy(item) for item in schedule]
    return {"schedule": schedule, "reminders": reminders}
