import { create } from "zustand";

export type UserProfile = {
  id: string;
  name: string;
  age: string;
  wakeTime?: string;
  sleepTime?: string;
};

export type Prescription = Record<string, string>;

export type ScheduleItem = {
  time: string;
  medicine: string;
  dose: string;
  instructions?: string;
  reminderCopy?: string;
};

export type AdherenceEntry = {
  status: string;
  recorded_at: string;
};

type AppState = {
  user?: UserProfile;
  prescription?: Prescription;
  schedule: ScheduleItem[];
  adherence: AdherenceEntry[];
  setUser: (user: UserProfile) => void;
  setPrescription: (payload: Prescription) => void;
  setSchedule: (items: ScheduleItem[]) => void;
  setAdherence: (events: AdherenceEntry[]) => void;
};

export const useAppStore = create<AppState>((set) => ({
  schedule: [],
  adherence: [],
  setUser: (user) => set({ user }),
  setPrescription: (payload) => set({ prescription: payload }),
  setSchedule: (items) => set({ schedule: items }),
  setAdherence: (events) => set({ adherence: events }),
}));
