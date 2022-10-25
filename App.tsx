import { ThemeProvider } from "styled-components/native";
import { SettingsProvider } from "./contexts/SettingsContext";
import { TimeTrackerProvider } from "./contexts/TimeTrackerContext";
import { MainNavigator } from "./navigators/MainNavigator";
import { theme } from "./styles/theme";

export default function App() {
  return (
    <SettingsProvider>
      <TimeTrackerProvider>
        <ThemeProvider theme={theme}>
          <MainNavigator />
        </ThemeProvider>
      </TimeTrackerProvider>
    </SettingsProvider>
  );
}
