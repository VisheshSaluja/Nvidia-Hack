# Auto Medicine Reminder Mobile App

Expo + React Native Paper client for the NVIDIA Auto Medicine Reminder MVP. It walks through onboarding, prescription OCR, schedule generation, bottle verification, and adherence insights backed by the FastAPI backend.

## Setup
```bash
cd mobile
npm install
```

Create a `.env` or `.env.local` file to point at the backend if not using the default:
```
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Run
```bash
npx expo start
```

Use the onscreen workflow:
1. Complete onboarding with your routine preferences.
2. Upload a prescription photo to trigger Nemotron OCR (simulated for offline use).
3. Review the generated schedule, sync to calendar, and schedule local notifications.
4. Scan the pill bottle to confirm the medication.
5. Track adherence and manage encrypted data via the dashboard.

All local data is persisted with `expo-secure-store`, and offline fallbacks ensure the flow works without network access.
