import { Text } from "react-native";
import renderer from "react-test-renderer";
import App, { Contexts } from "../../App";
// SCREENS
// Welcome screen and related components
import { WelcomeScreen } from "../../screens/Welcome/Welcome";
import { TrackerCard } from "../../screens/Welcome/components/TrackerCard";
// Settings screen
import { SettingsScreen } from "../../screens/Settings/Settings";
// AddTracker screen
import { AddTrackerScreen } from "../../screens/AddTracker/AddTracker";

describe("Snapshot matches: ", () => {
  it("WelcomeScreen", () => {
    const component = renderer
      .create(
        <Contexts>
          <WelcomeScreen />
        </Contexts>
      )
      .toJSON();
    expect(component).toMatchSnapshot();
  });
});
