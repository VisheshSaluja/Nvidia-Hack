from typing import Dict, List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session

from database import get_session
from dependencies import verify_client_key
from services.mcp_orchestrator import orchestrator


router = APIRouter(
    prefix="/progress",
    tags=["progress"],
    dependencies=[Depends(verify_client_key)],
)


class ProgressEntry(BaseModel):
    status: str
    recorded_at: str


class ProgressResponse(BaseModel):
    adherence: float
    refill_prediction: str
    events: List[ProgressEntry]


@router.get("/stats/{user_id}", response_model=ProgressResponse)
def get_progress(
    user_id: str, session: Session = Depends(get_session)
) -> Dict[str, object]:
    summary = orchestrator.adherence_summary(session, user_id)
    return summary
