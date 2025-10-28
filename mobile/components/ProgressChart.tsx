import { StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import Svg, { Circle } from "react-native-svg";

type Props = {
  adherence: number;
  refillPrediction: string;
};

export default function ProgressChart({ adherence, refillPrediction }: Props) {
  const progress = Math.min(Math.max(adherence / 100, 0), 1);
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <Card style={styles.card}>
      <Card.Title title="Adherence overview" />
      <Card.Content>
        <View style={styles.chartRow}>
          <View style={styles.chartContainer}>
            <Svg width={size} height={size}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(98,0,238,0.2)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#6200ee"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>
            <View style={styles.centerLabel}>
              <Text variant="titleLarge">{adherence}%</Text>
            </View>
          </View>
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
  chartContainer: {
    height: 120,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabel: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    gap: 8,
  },
});
