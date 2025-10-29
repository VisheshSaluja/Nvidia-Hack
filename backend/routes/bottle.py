from fastapi import APIRouter, Depends, File, Form, UploadFile
from pydantic import BaseModel
from sqlmodel import Session

from database import get_session
from dependencies import verify_client_key
from services.mcp_orchestrator import orchestrator


router = APIRouter(
    prefix="/bottle",
    tags=["bottle"],
    dependencies=[Depends(verify_client_key)],
)


class BottleVerificationResponse(BaseModel):
    match: bool
    remaining: int
    expected_medicine: str


@router.post("/verify", response_model=BottleVerificationResponse)
async def verify_bottle(
    user_id: str = Form(...),
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
) -> BottleVerificationResponse:
    image_bytes = await file.read()
    payload = orchestrator.verify_bottle(session, user_id, image_bytes)
    return BottleVerificationResponse(**payload)
