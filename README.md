# Auto Medicine Reminder MVP

Cross-platform medication management experience built for the NVIDIA hackathon. The system uses FastAPI, MCP-style agent orchestration, and an Expo mobile client to deliver AI-assisted prescription parsing, schedule generation, and adherence tracking.

## Architecture
- **Mobile (Expo + React Native Paper + Zustand)** gathers user routines, captures prescriptions/bottle photos, schedules local notifications, and visualises adherence.
- **Backend (FastAPI + SQLModel + APScheduler)** routes prescription uploads, powers mock NVIDIA Nemotron agent calls, encrypts data with Fernet, and persists records in SQLite.
- **MCP Agent Layer (simulated)** encapsulates Nemotron models for OCR, schedule planning, bottle verification, empathetic reminders, and adherence analytics.
- **Calendar & Notifications** leverage Expo Calendar/Notifications for local reminders with offline-safe fallbacks.

```
React Native App ↔ FastAPI Backend ↔ MCP Orchestrator ↔ Nemotron Agents
                                   ↘ SQLite (Fernet) + APScheduler
```

## Getting Started
### Backend
```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Mobile
```bash
cd mobile
npm install
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000 npx expo start
```

## Demo Flow
1. Complete onboarding (profile + routine).
2. Upload a prescription photo to trigger simulated Nemotron OCR.
3. Review and confirm the AI-generated schedule, sync to calendar, and opt into local notifications.
4. Verify the pill bottle to validate medication details.
5. Track adherence in the dashboard, with secure local storage and one-tap data erasure.

The entire stack runs locally with deterministic mock responses so the MVP is demo-ready within minutes.
