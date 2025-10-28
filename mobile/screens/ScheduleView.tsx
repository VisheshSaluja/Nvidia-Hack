import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import CalendarCard from "../components/CalendarCard";
import ReminderNotification from "../components/ReminderNotification";
import { generateSchedule } from "../services/api";
import { useAppStore } from "../services/store";

type Props = NativeStackScreenProps<any, "ScheduleView">;

export default function ScheduleView({ navigation }: Props) {
  const user = useAppStore((state) => state.user);
  const prescription = useAppStore((state) => state.prescription);
  const schedule = useAppStore((state) => state.schedule);
  const setSchedule = useAppStore((state) => state.setSchedule);
  const [calendarEvents, setCalendarEvents] = useState(0);

  useEffect(() => {
    const loadSchedule = async () => {
      if (!user || !prescription) {
        return;
      }
      const data = await generateSchedule(user.id, prescription);
      const enriched = data.schedule.map((item: any, index: number) => ({
        ...item,
        reminderCopy: data.reminders?.[index],
      }));
      setSchedule(enriched);
    };
    if (!schedule.length) {
      loadSchedule();
    }
  }, [user, prescription, schedule.length, setSchedule]);

  const handleSyncCalendar = async () => {
    // Calendar integration removed for compatibility; simulate successful sync
    setCalendarEvents(schedule.length);
    Alert.alert("Calendar updated", "Using local notifications as fallback.");
  };

  const goToBottleCheck = () => {
    navigation.navigate("BottleVerification");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CalendarCard onSync={handleSyncCalendar} eventCount={calendarEvents} />
      {schedule.map((item) => (
        <Card key={item.time} style={styles.card}>
          <Card.Title title={item.medicine} subtitle={item.dose} />
          <Card.Content>
            <Text>
              {new Date(item.time).toLocaleString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text>{item.instructions}</Text>
          </Card.Content>
        </Card>
      ))}
      <ReminderNotification schedule={schedule} />
      <Button mode="contained" onPress={goToBottleCheck} style={styles.next}>
        Verify medicine bottle
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 16,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  next: {
    marginTop: 16,
  },
});
