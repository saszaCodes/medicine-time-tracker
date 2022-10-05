import { useCallback } from "react";
import { Button, View, Text } from "react-native";
import { useTimeTrackerContext } from "../../contexts/TimeTrackerContext";
import { parseFinishTime } from "../../utils/parseFinishTimeToFinishDate";

export const WelcomeScreen = () => {
  const { addTracker, trackers } = useTimeTrackerContext();

  const generateTrackers = useCallback(() => {
    return trackers.map((tracker) => (
      <View key={tracker.name}>
        <Text>{tracker.name}</Text>
        <Text>{parseFinishTime(tracker.payload.finishTime, "date")}</Text>
        <Text>{tracker.payload.description}</Text>
        <Text>{tracker.payload.reminders}</Text>
      </View>
    ));
  }, []);

  return (
    <View>
      {generateTrackers()}
      <Button
        onPress={async () => {
          addTracker({
            name: "TEST2",
            payload: {
              finishTime: { type: "timePeriod", value: 1000 },
              description: "TEST!",
            },
          });
        }}
        title="Schedule Tracker 1"
      />
    </View>
  );
};
