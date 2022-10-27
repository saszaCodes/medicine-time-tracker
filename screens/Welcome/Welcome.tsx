import { DrawerScreenProps } from "@react-navigation/drawer";
import { useCallback } from "react";
import { Button, View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTimeTrackerContext } from "../../contexts/TimeTrackerContext";
import { MainNavigatorParams, Tracker } from "../../types/types";
import moment from "moment";
import { TrackerCard } from "./components/TrackerCard";

// TODO: fix type
export const WelcomeScreen = ({
  navigation,
}: DrawerScreenProps<MainNavigatorParams>) => {
  const { trackers } = useTimeTrackerContext();

  const generateTrackers = useCallback(
    (params?: { startDate: number; endDate: number; limit?: number }) => {
      let filteredTrackers: Tracker[] = [...trackers];
      if (params) {
        const { startDate: listStartDate, endDate: listEndDate } = params;
        if (listStartDate >= listEndDate) return null;
        filteredTrackers = trackers.filter(
          (tracker) =>
            listStartDate <= tracker.finishDate &&
            tracker.finishDate <= listEndDate
        );
      }
      console.log(filteredTrackers);
      return filteredTrackers.map((tracker, i) => {
        if (params?.limit && i >= params.limit) return null;
        return <TrackerCard key={i} tracker={tracker} />;
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
      <Button
        onPress={() => navigation.navigate("AddTracker")}
        title="Add new tracker"
      />
    </ScrollView>
  );
};
