import { Button, View } from "react-native";
import { useTimeTrackerContext } from "../../contexts/TimeTrackerContext";

export const WelcomeScreen = () => {
  const { addTracker } = useTimeTrackerContext();

  return (
    <View>
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
