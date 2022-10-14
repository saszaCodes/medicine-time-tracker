import { DrawerScreenProps } from "@react-navigation/drawer";
import { useCallback } from "react";
import { Button, View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { reminderOptions } from "../../components/NewTimeTrackerForm/components/Reminders";
import { useTimeTrackerContext } from "../../contexts/TimeTrackerContext";
import { MainNavigatorParams } from "../../types/types";

// TODO: fix type
export const WelcomeScreen = ({
  navigation,
}: DrawerScreenProps<MainNavigatorParams>) => {
  const { trackers } = useTimeTrackerContext();

  const generateTrackers = useCallback(() => {
    return trackers.map((tracker, i) => {
      return (
        <View key={i}>
          <Text>{tracker.name}</Text>
          <Text>{tracker.finishDate}</Text>
          <Text>{tracker.description}</Text>
          {tracker.reminders
            ? tracker.reminders?.map((key, i) => (
                <Text key={i}>{reminderOptions[key].label}</Text>
              ))
            : null}
        </View>
      );
    });
  }, [trackers]);

  return (
    <ScrollView>
      {generateTrackers()}
      <Button
        onPress={() => navigation.navigate("AddTracker")}
        title="Add new tracker"
      />
    </ScrollView>
  );
};
