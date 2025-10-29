import axios from "axios";

import { AdherenceEntry, Prescription, ScheduleItem } from "./store";
import { fallbackBottle, fallbackPrescription, fallbackProgress, fallbackSchedule } from "./mockData";

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000",
  timeout: 8000,
  headers: {
    "x-client-key": process.env.EXPO_PUBLIC_CLIENT_API_KEY ?? "",
  },
});

export type ApiResult<T> = { data: T; source: "api" | "fallback" };

export type ScheduleResponse = { schedule: ScheduleItem[]; reminders?: string[] };
export type BottleResponse = { match: boolean; remaining: number; expected_medicine: string };
export type ProgressResponse = {
  adherence: number;
  refill_prediction: string;
  events: AdherenceEntry[];
};

export async function uploadPrescription(userId: string, uri: string): Promise<ApiResult<Prescription>> {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("file", { uri, name: "prescription.jpg", type: "image/jpeg" } as any);
    const response = await client.post("/prescription/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { data: response.data, source: "api" };
  } catch (error) {
    console.warn("Falling back to mock prescription", error);
    return { data: fallbackPrescription, source: "fallback" };
  }
}

export async function generateSchedule(userId: string, prescription: object): Promise<ApiResult<ScheduleResponse>> {
  try {
    const response = await client.post("/schedule/generate", { user_id: userId, prescription });
    return { data: response.data, source: "api" };
  } catch (error) {
    console.warn("Falling back to mock schedule", error);
    return { data: fallbackSchedule, source: "fallback" };
  }
}

export async function verifyBottle(userId: string, uri: string): Promise<ApiResult<BottleResponse>> {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("file", { uri, name: "bottle.jpg", type: "image/jpeg" } as any);
    const response = await client.post("/bottle/verify", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { data: response.data, source: "api" };
  } catch (error) {
    console.warn("Falling back to mock bottle check", error);
    return { data: fallbackBottle, source: "fallback" };
  }
}

export async function fetchProgress(userId: string): Promise<ApiResult<ProgressResponse>> {
  try {
    const response = await client.get(`/progress/stats/${userId}`);
    return { data: response.data, source: "api" };
  } catch (error) {
    console.warn("Falling back to mock adherence", error);
    return { data: fallbackProgress, source: "fallback" };
  }
}
