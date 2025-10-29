from fastapi import APIRouter, Depends, File, Form, UploadFile
from pydantic import BaseModel
from sqlmodel import Session

from database import get_session
from dependencies import verify_client_key
from services.mcp_orchestrator import orchestrator


router = APIRouter(
    prefix="/prescription",
    tags=["prescription"],
    dependencies=[Depends(verify_client_key)],
)


class PrescriptionResponse(BaseModel):
    user_id: str
    medicine: str
    dosage: str
    frequency: str
    duration: str
    notes: str


@router.post("/upload", response_model=PrescriptionResponse)
async def upload_prescription(
    user_id: str = Form(...),
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
) -> PrescriptionResponse:
    image_bytes = await file.read()
    payload = orchestrator.process_prescription(session, image_bytes, user_id)
    return PrescriptionResponse(**payload)
