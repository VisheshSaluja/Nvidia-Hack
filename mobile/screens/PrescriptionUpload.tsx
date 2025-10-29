import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";

import CameraUploader from "../components/CameraUploader";
import { uploadPrescription } from "../services/api";
import { useAppStore } from "../services/store";

type Props = NativeStackScreenProps<any, "PrescriptionUpload">;

export default function PrescriptionUpload({ navigation }: Props) {
  const user = useAppStore((state) => state.user);
  const setPrescription = useAppStore((state) => state.setPrescription);
  const [extracted, setExtracted] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (uri: string) => {
    if (!user) {
      Alert.alert("Profile missing", "Please complete onboarding first.");
      return;
    }
    try {
      setLoading(true);
      const result = await uploadPrescription(user.id, uri);
      setExtracted(result.data);
      setPrescription(result.data);
      if (result.source === "fallback") {
        Alert.alert(
          "Demo data used",
          "Using offline prescription data. Start the backend to enable live parsing."
        );
      }
    } catch (error) {
      console.warn("Prescription upload failed", error);
      Alert.alert(
        "Upload failed",
        "We could not read the prescription. Please retry with a clearer photo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigation.navigate("ScheduleView");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CameraUploader
        label="Upload or capture your prescription"
        onPick={handleUpload}
      />
      {loading && <ActivityIndicator style={styles.loader} />}
      {extracted && (
        <Card>
          <Card.Title title="Detected prescription" />
          <Card.Content>
            {Object.entries(extracted).map(([key, value]) => (
              <View key={key} style={styles.row}>
                <Text style={styles.key}>{key}</Text>
                <Text>{value}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
      <Button
        mode="contained"
        style={styles.next}
        onPress={handleContinue}
        disabled={!extracted}
      >
        Generate Schedule
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 16 },
  loader: { marginVertical: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  key: { fontWeight: "600", textTransform: "capitalize" },
  next: { marginTop: 24 },
});
