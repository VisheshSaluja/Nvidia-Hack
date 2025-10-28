from typing import Dict, List, Optional

from sqlmodel import Session, select

from database import (
    AdherenceRecord,
    PrescriptionRecord,
    ScheduleRecord,
    engine,
)
from services.calendar_service import calendar_service
from services.encryption import encryption_service
from services.nvidia_nim_client import (
    simulate_adherence_tracker,
    simulate_bottle_verification,
    simulate_prescription_ocr,
    simulate_reminder_language,
    simulate_schedule_planner,
)
from services.ocr_fallback import run_ocr_fallback


class ReminderOrchestrator:
    """Coordinates mock MCP agent calls and local storage."""

    def __init__(self) -> None:
        self._demo_toggle = False

    def process_prescription(
        self, session: Session, image_bytes: bytes, user_id: str
    ) -> Dict[str, str]:
        try:
            payload = simulate_prescription_ocr(image_bytes, user_id)
        except Exception:
            payload = run_ocr_fallback(image_bytes, user_id)
        encrypted = encryption_service.encrypt_dict(payload)
        record = PrescriptionRecord(user_id=user_id, encrypted_payload=encrypted)
        session.add(record)
        session.commit()
        return payload

    def _latest_prescription(
        self, session: Session, user_id: str
    ) -> Optional[Dict[str, str]]:
        statement = (
            select(PrescriptionRecord)
            .where(PrescriptionRecord.user_id == user_id)
            .order_by(PrescriptionRecord.created_at.desc())
        )
        record = session.exec(statement).first()
        if not record:
            return None
        return encryption_service.decrypt_dict(record.encrypted_payload)

    def generate_schedule(
        self, session: Session, user_id: str, prescription: Dict[str, str]
    ) -> List[Dict[str, str]]:
        schedule = simulate_schedule_planner(prescription)
        calendar_service.simulate_sync_events(user_id, schedule)
        encrypted = encryption_service.encrypt_dict({"items": schedule})
        record = ScheduleRecord(user_id=user_id, encrypted_payload=encrypted)
        session.add(record)
        session.commit()
        return schedule

    def verify_bottle(
        self, session: Session, user_id: str, image_bytes: bytes
    ) -> Dict[str, object]:
        prescription = self._latest_prescription(session, user_id) or {}
        return simulate_bottle_verification(image_bytes, prescription)

    def adherence_summary(self, session: Session, user_id: str) -> Dict[str, object]:
        statement = select(AdherenceRecord).where(AdherenceRecord.user_id == user_id)
        events = [
            {"status": record.status, "recorded_at": record.recorded_at.isoformat()}
            for record in session.exec(statement).all()
        ]
        summary = simulate_adherence_tracker(events)
        summary["events"] = events
        return summary

    def simulate_dispatch_reminders(self) -> None:
        with Session(engine) as session:
            schedule_record = (
                session.exec(select(ScheduleRecord).order_by(ScheduleRecord.id.desc()))
                .first()
            )
            if not schedule_record:
                return
            status = "taken" if self._demo_toggle else "pending"
            self._demo_toggle = not self._demo_toggle
            reminder = AdherenceRecord(
                user_id=schedule_record.user_id,
                status=status,
            )
            session.add(reminder)
            session.commit()

    def reminder_copy(self, schedule_item: Dict[str, str]) -> str:
        return simulate_reminder_language(schedule_item)


orchestrator = ReminderOrchestrator()
