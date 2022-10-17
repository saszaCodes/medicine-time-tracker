import { DrawerScreenProps } from "@react-navigation/drawer";
import { useCallback } from "react";
import { Button, View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { reminderOptions } from "../../components/NewTimeTrackerForm/components/Reminders";
import { useTimeTrackerContext } from "../../contexts/TimeTrackerContext";
import { MainNavigatorParams } from "../../types/types";
import moment from "moment";

// TODO: fix type
export const WelcomeScreen = ({
  navigation,
}: DrawerScreenProps<MainNavigatorParams>) => {
  const { trackers } = useTimeTrackerContext();

  const generateTrackers = useCallback(
    (params?: { startDate: number; endDate: number }) => {
      return trackers.map((tracker, i) => {
        const { name, finishDate, description, reminders } = tracker;
        if (params) {
          const { startDate: listStartDate, endDate: listEndDate } = params;
          if (listStartDate >= listEndDate) return null;
          if (listStartDate > finishDate || finishDate > listEndDate)
            return null;
        }
        return (
          <View key={i}>
            <Text>{name}</Text>
            <Text>{finishDate}</Text>
            <Text>{description}</Text>
            {reminders
              ? reminders?.map((key, i) => (
                  <Text key={i}>{reminderOptions[key].label}</Text>
                ))
              : null}
          </View>
        );
      });
    },
    [trackers]
  );

  return (
    <ScrollView>
      <Text>Today</Text>
      {generateTrackers({
        startDate: moment().valueOf(),
        endDate: moment().endOf("day").valueOf(),
      })}
      <Text>Tommorow</Text>
      {generateTrackers({
        startDate: moment().add(1, "days").startOf("day").valueOf(),
        endDate: moment().add(1, "days").endOf("day").valueOf(),
      })}
      <Text>Missed</Text>
      {generateTrackers({
        startDate: 0,
        endDate: moment().valueOf(),
      })}
      <Text>Future</Text>
      {generateTrackers({
        startDate: moment().add(1, "days").endOf("day").valueOf(),
        endDate: Infinity,
      })}
      <Button
        onPress={() => navigation.navigate("AddTracker")}
        title="Add new tracker"
      />
    </ScrollView>
  );
};
