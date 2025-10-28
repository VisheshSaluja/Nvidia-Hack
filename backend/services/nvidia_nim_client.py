from datetime import datetime, timedelta
from typing import Dict, List


def simulate_prescription_ocr(_: bytes, user_id: str) -> Dict[str, str]:
    """Return a deterministic prescription payload for the demo."""
    return {
        "user_id": user_id,
        "medicine": "Atorvastatin",
        "dosage": "10mg",
        "frequency": "twice daily",
        "duration": "30 days",
        "notes": "Take with evening meal. Monitor for muscle pain.",
    }


def simulate_schedule_planner(prescription: Dict[str, str]) -> List[Dict[str, str]]:
    """Build an AM/PM schedule anchored to the current day."""
    base = datetime.utcnow().replace(second=0, microsecond=0)
    slots = [base.replace(hour=8), base.replace(hour=20)]
    schedule = []
    for idx, slot in enumerate(slots):
        schedule.append(
            {
                "time": slot.isoformat(),
                "medicine": prescription["medicine"],
                "dose": prescription["dosage"],
                "instructions": "Take with water and food" if idx == 0 else "Evening dose.",
            }
        )
    return schedule


def simulate_bottle_verification(_: bytes, reference: Dict[str, str]) -> Dict[str, object]:
    """Pretend the bottle image matches the prescription with generous remaining pills."""
    return {
        "match": True,
        "remaining": 20,
        "expected_medicine": reference.get("medicine", "Unknown"),
    }


def simulate_reminder_language(schedule_item: Dict[str, str]) -> str:
    """Create a gentle reminder sentence."""
    return (
        f"It's time to take {schedule_item['dose']} of {schedule_item['medicine']}. "
        "Grab some water, take a moment, and mark it in the app when done."
    )


def simulate_adherence_tracker(events: List[Dict[str, str]]) -> Dict[str, object]:
    """Summarize adherence based on recorded events."""
    total = len(events) or 1
    taken = sum(1 for event in events if event.get("status") == "taken")
    adherence = round((taken / total) * 100, 1)
    refill_eta = (datetime.utcnow() + timedelta(days=12)).date().isoformat()
    return {"adherence": adherence, "refill_prediction": refill_eta}

