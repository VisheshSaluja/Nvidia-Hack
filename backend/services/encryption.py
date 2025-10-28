import json
import os
from typing import Any, Dict

from cryptography.fernet import Fernet


class EncryptionService:
    """Handles symmetric encryption for on-device storage."""

    def __init__(self) -> None:
        key = os.getenv("AUTO_MEDICINE_FERNET_KEY")
        if key:
            self._fernet = Fernet(key.encode("utf-8"))
        else:
            generated = Fernet.generate_key()
            os.environ.setdefault(
                "AUTO_MEDICINE_FERNET_KEY", generated.decode("utf-8")
            )
            self._fernet = Fernet(generated)

    def encrypt_dict(self, payload: Dict[str, Any]) -> str:
        serialized = json.dumps(payload, separators=(",", ":"), sort_keys=True)
        return self._fernet.encrypt(serialized.encode("utf-8")).decode("utf-8")

    def decrypt_dict(self, token: str) -> Dict[str, Any]:
        data = self._fernet.decrypt(token.encode("utf-8")).decode("utf-8")
        return json.loads(data)

    def encrypt_text(self, text: str) -> str:
        return self._fernet.encrypt(text.encode("utf-8")).decode("utf-8")

    def decrypt_text(self, token: str) -> str:
        return self._fernet.decrypt(token.encode("utf-8")).decode("utf-8")


encryption_service = EncryptionService()

