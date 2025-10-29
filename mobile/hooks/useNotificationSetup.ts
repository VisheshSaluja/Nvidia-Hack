import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export function useNotificationSetup(): void {
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const settings = await Notifications.getPermissionsAsync();
        if (!settings.granted) {
          await Notifications.requestPermissionsAsync();
        }
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "Medication Reminders",
            importance: Notifications.AndroidImportance.MAX,
          });
        }
      } catch (error) {
        console.warn("Notification setup failed", error);
      }
    };
    bootstrap();
  }, []);
}

