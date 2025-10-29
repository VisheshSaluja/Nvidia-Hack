import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import { useAppStore } from "../services/store";
import { saveObject } from "../utils/storage";

type Props = NativeStackScreenProps<any, "Onboarding">;

export default function Onboarding({ navigation }: Props) {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [wakeTime, setWakeTime] = useState("07:30");
  const [sleepTime, setSleepTime] = useState("22:30");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setAge(user.age ?? "");
      setWakeTime(user.wakeTime ?? "07:30");
      setSleepTime(user.sleepTime ?? "22:30");
    }
  }, [user]);

  const inputs = useMemo(
    () => [
      { label: "Name", value: name, onChange: setName },
      { label: "Age", value: age, onChange: setAge, keyboardType: "numeric" as const },
      { label: "Wake time", value: wakeTime, onChange: setWakeTime },
      { label: "Sleep time", value: sleepTime, onChange: setSleepTime },
    ],
    [name, age, wakeTime, sleepTime]
  );

  const handleContinue = async () => {
    try {
      const profile = { id: user?.id ?? `user-${Date.now()}`, name, age, wakeTime, sleepTime };
      setUser(profile);
      await saveObject("user", profile);
      navigation.navigate("PrescriptionUpload");
    } catch (error) {
      console.warn("Failed to persist user profile", error);
      Alert.alert(
        "Could not save profile",
        "We could not encrypt your profile locally. Please retry."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text variant="headlineMedium" style={styles.title}>
        Auto Medicine Reminder
      </Text>
      <Text style={styles.subtitle}>Let us tailor reminders around your daily routine.</Text>
      <View style={styles.form}>
        {inputs.map((field) => (
          <TextInput
            key={field.label}
            label={field.label}
            value={field.value}
            onChangeText={field.onChange}
            keyboardType={field.keyboardType ?? "default"}
            mode="outlined"
            style={styles.input}
          />
        ))}
        <Button mode="contained" onPress={handleContinue} disabled={!name || !age}>
          Continue
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: "center" },
  title: { textAlign: "center", marginBottom: 8 },
  subtitle: { textAlign: "center", marginBottom: 24 },
  form: { gap: 12 },
  input: { backgroundColor: "transparent" },
});

