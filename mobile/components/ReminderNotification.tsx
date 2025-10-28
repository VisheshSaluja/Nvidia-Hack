import * as Notifications from "expo-notifications";
import { useCallback, useMemo } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

type ScheduleItem = {
  time: string;
  medicine: string;
  dose: string;
  instructions?: string;
  reminderCopy?: string;
};

type Props = {
  schedule: ScheduleItem[];
};

export default function ReminderNotification({ schedule }: Props) {
  const nextDose = useMemo(() => {
    const sorted = [...schedule].sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    );
    return sorted[0];
  }, [schedule]);

  const scheduleLocalReminders = useCallback(async () => {
    for (const item of schedule) {
      const trigger = new Date(item.time);
      if (trigger.getTime() < Date.now()) {
        trigger.setDate(trigger.getDate() + 1);
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Medication reminder",
          body: item.reminderCopy
            ? item.reminderCopy
            : `It's time for ${item.dose} of ${item.medicine}.`,
        },
        trigger,
      });
    }
    Alert.alert("Reminders scheduled", "We'll nudge you at the right moments.");
  }, [schedule]);

  if (!nextDose) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">Next reminder</Text>
      <Text>
        {new Date(nextDose.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
        {" • "}
        {nextDose.medicine}
      </Text>
      <Text>{nextDose.reminderCopy}</Text>
      <Button mode="contained-tonal" onPress={scheduleLocalReminders}>
        Schedule local notifications
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
    backgroundColor: "rgba(98, 0, 238, 0.08)",
  },
});
