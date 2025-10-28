from typing import Dict, List


class CalendarService:
    """Stores a lightweight log of events the demo would sync to calendars."""

    def __init__(self) -> None:
        self._events: List[Dict[str, str]] = []

    def simulate_sync_events(
        self, user_id: str, schedule: List[Dict[str, str]]
    ) -> List[Dict[str, str]]:
        events = [
            {
                "user_id": user_id,
                "title": f"{item['medicine']} dose",
                "time": item["time"],
                "notes": item.get("instructions", ""),
            }
            for item in schedule
        ]
        self._events = events
        return events

    def last_synced_events(self) -> List[Dict[str, str]]:
        return self._events


calendar_service = CalendarService()

