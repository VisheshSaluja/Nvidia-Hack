import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Provider as PaperProvider, Text } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import BottleVerification from "./screens/BottleVerification";
import Onboarding from "./screens/Onboarding";
import PrescriptionUpload from "./screens/PrescriptionUpload";
import ProgressDashboard from "./screens/ProgressDashboard";
import ScheduleView from "./screens/ScheduleView";
import { useNotificationSetup } from "./hooks/useNotificationSetup";
import { ScreenName, useHydratedUser } from "./hooks/useHydratedUser";

type StackParams = Record<ScreenName, undefined>;

const Stack = createNativeStackNavigator<StackParams>();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useNotificationSetup();
  const { ready, initialRoute } = useHydratedUser("Onboarding");

  const screens = useMemo(
    () => [
      { name: "Onboarding", component: Onboarding, options: { headerShown: false } },
      { name: "PrescriptionUpload", component: PrescriptionUpload, options: { title: "Prescription" } },
      { name: "ScheduleView", component: ScheduleView, options: { title: "Schedule" } },
      { name: "BottleVerification", component: BottleVerification, options: { title: "Bottle Check" } },
      { name: "ProgressDashboard", component: ProgressDashboard, options: { title: "Progress" } },
    ] as const,
    []
  );

  if (!ready) {
    return (
      <PaperProvider>
        <SafeAreaProvider>
          <View style={styles.loader}>
            <ActivityIndicator animating size="large" />
            <Text>Preparing Auto Medicine Reminder…</Text>
          </View>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute}>
            {screens.map((screen) => (
              <Stack.Screen key={screen.name} {...screen} />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
});

