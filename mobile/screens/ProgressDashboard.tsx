import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Divider, List } from "react-native-paper";

import ProgressChart from "../components/ProgressChart";
import { fetchProgress } from "../services/api";
import { useAppStore } from "../services/store";
import { eraseAllKeys } from "../utils/storage";

type Props = NativeStackScreenProps<any, "ProgressDashboard">;

export default function ProgressDashboard({}: Props) {
  const user = useAppStore((state) => state.user);
  const adherence = useAppStore((state) => state.adherence);
  const setAdherence = useAppStore((state) => state.setAdherence);
  const [stats, setStats] = useState<{ adherence: number; refill_prediction: string }>({
    adherence: 0,
    refill_prediction: "",
  });

  useEffect(() => {
    const load = async () => {
      if (!user) {
        return;
      }
      try {
        const response = await fetchProgress(user.id);
        setStats({ adherence: response.data.adherence, refill_prediction: response.data.refill_prediction });
        setAdherence(response.data.events);
        if (response.source === "fallback") {
          Alert.alert(
            "Demo stats",
            "Using offline adherence data. Start the backend to sync real progress."
          );
        }
      } catch (error) {
        console.warn("Progress load failed", error);
        Alert.alert("Unable to load progress", "Please try again shortly.");
      }
    };
    load();
  }, [user, setAdherence]);

  const clearData = async () => {
    await eraseAllKeys();
    alert("All locally stored data has been securely erased.");
  };

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={adherence}
      keyExtractor={(item, index) => `${item.recorded_at}-${index}`}
      ListHeaderComponent={
        <View style={styles.header}>
          <ProgressChart
            adherence={stats.adherence}
            refillPrediction={stats.refill_prediction}
          />
          <Card>
            <Card.Title title="Dose history" />
          </Card>
        </View>
      }
      renderItem={({ item }) => (
        <List.Item
          title={item.status.toUpperCase()}
          description={new Date(item.recorded_at).toLocaleString()}
          left={(props) => <List.Icon {...props} icon="pill" />}
        />
      )}
      ItemSeparatorComponent={Divider}
      ListFooterComponent={
        <Button mode="outlined" onPress={clearData} style={styles.erase}>
          Erase data securely
        </Button>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
  },
  header: {
    gap: 16,
    marginBottom: 16,
  },
  erase: {
    marginTop: 16,
  },
});
