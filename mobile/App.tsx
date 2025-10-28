import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import BottleVerification from "./screens/BottleVerification";
import Onboarding from "./screens/Onboarding";
import PrescriptionUpload from "./screens/PrescriptionUpload";
import ProgressDashboard from "./screens/ProgressDashboard";
import ScheduleView from "./screens/ScheduleView";

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    const requestPermission = async () => {
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
    };
    requestPermission();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Onboarding">
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PrescriptionUpload"
              component={PrescriptionUpload}
              options={{ title: "Prescription" }}
            />
            <Stack.Screen
              name="ScheduleView"
              component={ScheduleView}
              options={{ title: "Schedule" }}
            />
            <Stack.Screen
              name="BottleVerification"
              component={BottleVerification}
              options={{ title: "Bottle Check" }}
            />
            <Stack.Screen
              name="ProgressDashboard"
              component={ProgressDashboard}
              options={{ title: "Progress" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
