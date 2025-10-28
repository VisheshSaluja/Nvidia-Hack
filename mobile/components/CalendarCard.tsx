import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

type Props = {
  onSync: () => void;
  eventCount: number;
};

export default function CalendarCard({ onSync, eventCount }: Props) {
  return (
    <Card style={styles.card}>
      <Card.Title title="Calendar sync" />
      <Card.Content>
        <Text>
          {eventCount
            ? `${eventCount} events synced to your calendar account.`
            : "Grant calendar access to sync reminders automatically."}
        </Text>
      </Card.Content>
      <Card.Actions>
        <View style={styles.actions}>
          <Button mode="contained" onPress={onSync}>
            Sync now
          </Button>
        </View>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

