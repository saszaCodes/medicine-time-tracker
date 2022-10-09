import { DrawerScreenProps } from "@react-navigation/drawer";
import { useCallback } from "react";
import { Button, View, Text } from "react-native";
import { useTimeTrackerContext } from "../../contexts/TimeTrackerContext";
import { MainNavigatorParams } from "../../types/types";

// TODO: fix type
export const WelcomeScreen = ({
  navigation,
}: DrawerScreenProps<MainNavigatorParams>) => {
  const { trackers } = useTimeTrackerContext();

  const generateTrackers = useCallback(() => {
    return trackers.map((tracker, i) => (
      <View key={i}>
        <Text>{tracker.name}</Text>
        <Text>{tracker.finishDate}</Text>
        <Text>{tracker.description}</Text>
        <Text>{tracker.reminders}</Text>
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
