import { Button, Text, View } from "react-native";
import { useTimeTrackerContext } from "../../contexts/TimeTrackerContext";

export const WelcomeScreen = () => {
  const { addTracker } = useTimeTrackerContext();

  return (
    <View>
      <Button
        onPress={async () => {
          addTracker({
            name: "TEST",
            payload: { finishTime: 1000, description: "TEST!" },
          });
        }}
        title="Schedule Tracker 1"
      />
      <Button onPress={() => alert("LALALA")} title="Schedule Tracker 2" />
    </View>
  );
};
