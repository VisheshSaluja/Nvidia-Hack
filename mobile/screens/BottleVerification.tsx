import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

import CameraUploader from "../components/CameraUploader";
import { verifyBottle } from "../services/api";
import { useAppStore } from "../services/store";

type Props = NativeStackScreenProps<any, "BottleVerification">;

export default function BottleVerification({ navigation }: Props) {
  const user = useAppStore((state) => state.user);
  const [result, setResult] = useState<{
    match: boolean;
    remaining: number;
    expected_medicine: string;
  } | null>(null);

  const handleBottle = async (uri: string) => {
    if (!user) {
      Alert.alert("Profile missing", "Please complete onboarding first.");
      return;
    }
    try {
      const response = await verifyBottle(user.id, uri);
      setResult(response.data);
      if (response.source === "fallback") {
        Alert.alert(
          "Demo verification",
          "Using offline bottle check data. Start the backend for live verification."
        );
      }
    } catch (error) {
      console.warn("Bottle verification failed", error);
      Alert.alert("Verification failed", "Please try scanning the bottle again.");
    }
  };

  const goToProgress = () => {
    navigation.navigate("ProgressDashboard");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CameraUploader
        label="Scan your pill bottle"
        onPick={handleBottle}
      />
      {result && (
        <Card>
          <Card.Title title="Verification result" />
          <Card.Content>
            <View style={styles.row}>
              <Text>Matches prescription</Text>
              <Text>{result.match ? "Yes" : "No"}</Text>
            </View>
            <View style={styles.row}>
              <Text>Expected medicine</Text>
              <Text>{result.expected_medicine}</Text>
            </View>
            <View style={styles.row}>
              <Text>Estimated pills remaining</Text>
              <Text>{result.remaining}</Text>
            </View>
          </Card.Content>
        </Card>
      )}
      <Button
        mode="contained"
        style={styles.next}
        onPress={goToProgress}
        disabled={!result}
      >
        View progress
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  next: {
    marginTop: 16,
  },
});
