import * as Notifications from "expo-notifications";
import { ThemeProvider } from "styled-components/native";
import { TimeTrackerProvider } from "../../contexts/TimeTrackerContext";
import { SettingsProvider } from "../../contexts/SettingsContext";
import { theme } from "../../styles/theme";
import { create } from "react-test-renderer";
// SCREENS
// Welcome screen and related components
import { WelcomeScreen } from "../../screens/Welcome/Welcome";
import { TrackerCard } from "../../screens/Welcome/components/TrackerCard";
// Settings screen
import { SettingsScreen } from "../../screens/Settings/Settings";
// AddTracker screen
import { AddTrackerScreen } from "../../screens/AddTracker/AddTracker";
import { Tracker, Trackers } from "../../types/types";
import { NavigationContainer } from "@react-navigation/native";

const createTracker = (
  name: Tracker["name"],
  finishDate: Tracker["finishDate"],
  description?: Tracker["description"],
  reminders?: Tracker["reminders"]
) => ({ name, finishDate, description, reminders });

const mockTrackers: Trackers = [
  createTracker("TEST9", 4444099799999, "Test 9", ["15min"]),
  createTracker("TEST0", 4444099700000, "Test 0", ["3h"]),
  createTracker("TEST1", 4444099711111, "Test 1", ["15min", "1d"]),
  createTracker("TEST2", 4444099722222, "Test 2", ["1h", "3d"]),
  createTracker("TEST3", 4444099733333, undefined, ["3d"]),
  createTracker("TEST4", 4444099744444, "Test 4", undefined),
];

const mockTracker = mockTrackers[0];

jest.mock("../../hooks/useDatabase", () => ({
  useDatabase: () => ({
    addEntry: (tracker: Tracker, callback?: () => void) => {
      callback?.();
    },
    removeEntry: (name: string, callback?: () => void) => {
      callback?.();
    },
    getEntry: (name: string, callback?: (results: Tracker) => void) => {
      callback?.(mockTracker);
    },
    getAllEntries: (callback?: (results: Trackers) => void) => {
      callback?.(mockTrackers);
    },
    checkIfEntryExists: (
      name: string,
      callback?: (entryExists: boolean) => void
    ) => {
      callback?.(true);
    },
  }),
}));

jest.mock("../../hooks/useNotifications", () => ({
  useNotifications: () => ({
    setupNotificationHandlers: () => {},
    scheduleNotification: (
      name: string,
      input: Omit<Notifications.NotificationRequestInput, "identifier">
    ) => name,
    removeNotification: (name: string) => {},
    getAllNotifications: () => [],
  }),
}));

describe("Snapshot matches: ", () => {
  const createInContexts = (el: JSX.Element) =>
    create(
      <SettingsProvider>
        <TimeTrackerProvider>
          <ThemeProvider theme={theme}>
            <NavigationContainer>{el}</NavigationContainer>
          </ThemeProvider>
        </TimeTrackerProvider>
      </SettingsProvider>
    );

  it("WelcomeScreen", () => {
    // TODO: don't use ts-ignore
    // @ts-ignore
    const component = createInContexts(<WelcomeScreen />).toJSON();
    expect(component).toMatchSnapshot();
  });

  it("AddTrackerScreen", () => {
    const component = createInContexts(<AddTrackerScreen />).toJSON();
    expect(component).toMatchSnapshot();
  });

  it("SettingsScreen", () => {
    const component = createInContexts(<SettingsScreen />).toJSON();
    expect(component).toMatchSnapshot();
  });

  it("TrackerCard", () => {
    const component = createInContexts(
      <TrackerCard tracker={mockTracker} />
    ).toJSON();
    expect(component).toMatchSnapshot();
  });
});
