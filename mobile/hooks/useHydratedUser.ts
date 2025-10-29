import { useEffect, useState } from "react";

import { useAppStore } from "../services/store";
import { getObject } from "../utils/storage";

export type ScreenName =
  | "Onboarding"
  | "PrescriptionUpload"
  | "ScheduleView"
  | "BottleVerification"
  | "ProgressDashboard";

export function useHydratedUser(defaultRoute: ScreenName) {
  const setUser = useAppStore((state) => state.setUser);
  const [initialRoute, setInitialRoute] = useState<ScreenName>(defaultRoute);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await getObject<Record<string, string>>("user");
        if (stored?.id) {
          setUser(stored as any);
          setInitialRoute("PrescriptionUpload");
        }
      } catch (error) {
        console.warn("Failed to restore profile", error);
      } finally {
        setReady(true);
      }
    };
    hydrate();
  }, [setUser]);

  return { ready, initialRoute };
}

