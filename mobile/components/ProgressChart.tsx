import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { ProgressCircle } from "react-native-svg-charts";

type Props = {
  adherence: number;
  refillPrediction: string;
};

export default function ProgressChart({ adherence, refillPrediction }: Props) {
  const progress = Math.min(Math.max(adherence / 100, 0), 1);

  return (
    <Card style={styles.card}>
      <Card.Title title="Adherence overview" />
      <Card.Content>
        <View style={styles.chartRow}>
          <ProgressCircle
            style={styles.chart}
            progress={progress}
            progressColor="#6200ee"
            backgroundColor="rgba(98,0,238,0.2)"
          />
          <View style={styles.details}>
            <Text variant="headlineMedium">{adherence}% adherent</Text>
            <Text>Estimated refill date: {refillPrediction}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  chart: {
    height: 120,
    width: 120,
  },
  details: {
    flex: 1,
    gap: 8,
  },
});

