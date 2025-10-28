import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

import { useAppStore } from "../services/store";
import { saveObject } from "../utils/storage";

type Props = NativeStackScreenProps<any, "Onboarding">;

export default function Onboarding({ navigation }: Props) {
  const setUser = useAppStore((state) => state.setUser);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [wakeTime, setWakeTime] = useState("07:30");
  const [sleepTime, setSleepTime] = useState("22:30");

  const handleContinue = async () => {
    try {
      const user = {
        id: `user-${Date.now()}`,
        name,
        age,
        wakeTime,
        sleepTime,
      };
      setUser(user);
      await saveObject("user", user);
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Auto Medicine Reminder
      </Text>
      <Text style={styles.subtitle}>
        Let us tailor reminders around your daily routine.
      </Text>
      <View style={styles.form}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Wake time"
          value={wakeTime}
          onChangeText={setWakeTime}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Sleep time"
          value={sleepTime}
          onChangeText={setSleepTime}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!name || !age}
        >
          Continue
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: "transparent",
  },
});
