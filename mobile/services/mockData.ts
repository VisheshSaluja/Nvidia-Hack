import { AdherenceEntry, Prescription, ScheduleItem } from "./store";

export const fallbackPrescription: Prescription = {
  user_id: "demo-user",
  medicine: "Atorvastatin",
  dosage: "10mg",
  frequency: "twice daily",
  duration: "30 days",
  notes: "Take with evening meal.",
};

export const fallbackSchedule = {
  schedule: [
    {
      time: new Date().setHours(8, 0, 0, 0),
      medicine: "Atorvastatin",
      dose: "10mg",
      instructions: "Morning dose with breakfast.",
      reminderCopy: "Good morning! Time for your Atorvastatin 10mg. A glass of water helps.",
    },
    {
      time: new Date().setHours(20, 0, 0, 0),
      medicine: "Atorvastatin",
      dose: "10mg",
      instructions: "Evening dose after dinner.",
      reminderCopy: "Hope your day was kind. Take your evening Atorvastatin with a smile.",
    },
  ].map<ScheduleItem>((item) => ({ ...item, time: new Date(item.time).toISOString() })),
  reminders: [] as string[],
};

export const fallbackBottle = {
  match: true,
  remaining: 18,
  expected_medicine: "Atorvastatin",
};

export const fallbackProgress = {
  adherence: 92.5,
  refill_prediction: new Date(Date.now() + 12 * 86400000).toISOString().split("T")[0],
  events: [
    { status: "taken", recorded_at: new Date().toISOString() },
    { status: "pending", recorded_at: new Date(Date.now() - 3600000).toISOString() },
  ] as AdherenceEntry[],
};
