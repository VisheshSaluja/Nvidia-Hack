import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

const mockPrescription = {
  user_id: "demo-user",
  medicine: "Atorvastatin",
  dosage: "10mg",
  frequency: "twice daily",
  duration: "30 days",
  notes: "Take with evening meal.",
};

const mockSchedule = [
  {
    time: new Date().setHours(8, 0, 0, 0),
    medicine: "Atorvastatin",
    dose: "10mg",
    instructions: "Morning dose with breakfast.",
    reminderCopy:
      "Good morning! Time for your Atorvastatin 10mg. A glass of water helps.",
  },
  {
    time: new Date().setHours(20, 0, 0, 0),
    medicine: "Atorvastatin",
    dose: "10mg",
    instructions: "Evening dose after dinner.",
    reminderCopy:
      "Hope your day was kind. Take your evening Atorvastatin with a smile.",
  },
].map((item) => ({ ...item, time: new Date(item.time).toISOString() }));

export async function uploadPrescription(userId: string, uri: string) {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("file", {
      uri,
      name: "prescription.jpg",
      type: "image/jpeg",
    } as any);
    const response = await client.post("/prescription/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.warn("Falling back to mock prescription", error);
    return mockPrescription;
  }
}

export async function generateSchedule(userId: string, prescription: object) {
  try {
    const response = await client.post("/schedule/generate", {
      user_id: userId,
      prescription,
    });
    return response.data;
  } catch (error) {
    console.warn("Falling back to mock schedule", error);
    return { schedule: mockSchedule, reminders: mockSchedule.map((x) => x.reminderCopy) };
  }
}

export async function verifyBottle(userId: string, uri: string) {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("file", { uri, name: "bottle.jpg", type: "image/jpeg" } as any);
    const response = await client.post("/bottle/verify", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.warn("Falling back to mock bottle check", error);
    return { match: true, remaining: 18, expected_medicine: "Atorvastatin" };
  }
}

export async function fetchProgress(userId: string) {
  try {
    const response = await client.get(`/progress/stats/${userId}`);
    return response.data;
  } catch (error) {
    console.warn("Falling back to mock adherence", error);
    return {
      adherence: 92.5,
      refill_prediction: new Date(Date.now() + 12 * 86400000)
        .toISOString()
        .split("T")[0],
      events: [
        { status: "taken", recorded_at: new Date().toISOString() },
        {
          status: "pending",
          recorded_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
    };
  }
}

