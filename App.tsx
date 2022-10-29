import { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components/native";
import { SettingsProvider } from "./contexts/SettingsContext";
import { TimeTrackerProvider } from "./contexts/TimeTrackerContext";
import { MainNavigator } from "./navigators/MainNavigator";
import { theme } from "./styles/theme";

export const Contexts = ({ children }: PropsWithChildren) => (
  <SettingsProvider>
    <TimeTrackerProvider>
      <ThemeProvider theme={theme}>
        <MainNavigator />
      </ThemeProvider>
    </TimeTrackerProvider>
  </SettingsProvider>
);

export default function App() {
  return (
    <Contexts>
      <MainNavigator />
    </Contexts>
  );
}
