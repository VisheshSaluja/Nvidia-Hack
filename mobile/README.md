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
2. Upload a prescription photo to trigger the FastAPI `/prescription/upload` pipeline (falling back to demo data if the backend is offline).
3. Review the generated schedule returned by `/schedule/generate`, sync or rely on local notifications, and continue to bottle verification.
4. Scan the pill bottle to confirm the medication via `/bottle/verify`.
5. Track adherence and manage encrypted data via the dashboard fed by `/progress/stats/{user_id}`.

The client surfaces a toast whenever it must use local mock data so you know when the backend is disconnected. All local data is persisted with `expo-secure-store` and can be purged from the dashboard.
