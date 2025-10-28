from typing import Dict


def run_ocr_fallback(_: bytes, user_id: str) -> Dict[str, str]:
    """Return a simple placeholder when advanced OCR fails."""
    return {
        "user_id": user_id,
        "medicine": "Unknown medication",
        "dosage": "as prescribed",
        "frequency": "once daily",
        "duration": "7 days",
        "notes": "OCR fallback engaged. Please review details manually.",
    }

