import { Button, Text, View } from "react-native";
import { useTimeTrackerContext } from "../../contexts/TimeTrackerContext";
import { useDatabase } from "../../hooks/useDatabase";

export const WelcomeScreen = () => {
  const { addTracker } = useTimeTrackerContext();
  const { getAllEntries, checkIfEntryExists } = useDatabase();

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
      <Button
        onPress={() =>
          checkIfEntryExists("TEST", (entryExists) =>
            entryExists ? console.log(true) : console.log(false)
          )
        }
        title="Read DB"
      />
    </View>
  );
};
