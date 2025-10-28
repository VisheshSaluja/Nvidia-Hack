# Auto Medicine Reminder Backend

FastAPI backend that orchestrates NVIDIA Nemotron agents via an MCP-style interface, stores encrypted prescription data, and schedules medication reminders for the Expo demo client.

## Features
- `/prescription/upload`: accepts prescription photos, parses them through simulated Nemotron OCR, and stores encrypted payloads.
- `/schedule/generate`: builds medication schedules, syncs mock calendar events, and returns empathetic reminder copy.
- `/bottle/verify`: compares bottle photos against the latest prescription using a simulated vision agent.
- `/progress/stats/{user_id}`: aggregates adherence activity and predicts refill dates.

## Setup
```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file if you want deterministic encryption keys:
```
AUTO_MEDICINE_FERNET_KEY=<base64_fernet_key>
```

## Run
```bash
uvicorn main:app --reload
```

The scheduler runs a demo job each minute to create adherence activity so charts populate immediately.

## Testing the API
- Upload a prescription: `curl -F "user_id=user-123" -F "file=@tests/sample.jpg" http://localhost:8000/prescription/upload`
- Generate a schedule: `curl -X POST http://localhost:8000/schedule/generate -H "Content-Type: application/json" -d '{"user_id":"user-123","prescription":{"medicine":"Atorvastatin","dosage":"10mg"}}'`

All payloads are encrypted at rest inside the SQLite database located at `auto_medicine.db`.
