import { SettingsProvider } from "./contexts/SettingsContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TimeTrackerProvider } from "./contexts/TimeTrackerContext";
import { MainNavigator } from "./navigators/MainNavigator";

export default function App() {
  return (
    <SettingsProvider>
      <TimeTrackerProvider>
        <ThemeProvider>
          <MainNavigator />
        </ThemeProvider>
      </TimeTrackerProvider>
    </SettingsProvider>
  );
}
