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
  const [calendarEvents, setCalendarEvents] = useState(0),
    [loading, setLoading] = useState(false),
    [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchedule = async () => {
      if (!user || !prescription) {
        return;
      }
      try {
        setLoading(true);
        const result = await generateSchedule(user.id, prescription);
        const enriched = result.data.schedule.map((item: any, index: number) => ({
          ...item,
          reminderCopy: result.data.reminders?.[index],
        }));
        setSchedule(enriched);
        setError(null);
        if (result.source === "fallback") {
          Alert.alert(
            "Demo schedule",
            "Using offline schedule data. Start the backend for live optimization."
          );
        }
      } catch (apiError) {
        console.warn("Schedule generation failed", apiError);
        setError("Could not generate schedule. Please retry.");
      } finally {
        setLoading(false);
      }
    };
    if (!schedule.length) {
      loadSchedule();
    }
  }, [user, prescription, schedule.length, setSchedule]);

  const handleSyncCalendar = () => {
    setCalendarEvents(schedule.length);
    Alert.alert("Calendar updated", "Using local notifications as fallback.");
  };

  const goToBottleCheck = () => navigation.navigate("BottleVerification");

  if (!user || !prescription)
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Please complete onboarding and upload a prescription to see your schedule.</Text>
      </ScrollView>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CalendarCard onSync={handleSyncCalendar} eventCount={calendarEvents} />
      {error && <Text style={styles.error}>{error}</Text>}
      {loading && <Text>Generating optimized schedule…</Text>}
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
  container: { flexGrow: 1, padding: 24, gap: 16 },
  card: { backgroundColor: "rgba(255,255,255,0.08)" },
  error: { color: "#b00020" },
  next: { marginTop: 16 },
});
