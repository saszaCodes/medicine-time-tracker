import { useCallback } from "react";
import { Button, View, Text } from "react-native";
import { useTimeTrackerContext } from "../../contexts/TimeTrackerContext";
import { parseFinishTime } from "../../utils/parseFinishTime";

// TODO: fix type
export const WelcomeScreen = ({ navigation }: any) => {
  const { trackers } = useTimeTrackerContext();

  const generateTrackers = useCallback(() => {
    return trackers.map((tracker, i) => (
      <View key={i}>
        <Text>{tracker.name}</Text>
        <Text>{parseFinishTime(tracker.payload.finishTime, "date")}</Text>
        <Text>{tracker.payload.description}</Text>
        <Text>{tracker.payload.reminders}</Text>
      </View>
    ));
  }, [trackers]);

  return (
    <View>
      {generateTrackers()}
      <Button
        onPress={() => navigation.navigate("AddTracker")}
        title="Add new tracker"
      />
    </View>
  );
};
