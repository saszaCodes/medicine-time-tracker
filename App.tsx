import { ThemeProvider } from "./contexts/ThemeContext";
import { TimeTrackerProvider } from "./contexts/TimeTrackerContext";
import { MainNavigator } from "./navigators/MainNavigator";

export default function App() {
  return (
    <TimeTrackerProvider>
      <ThemeProvider>
        <MainNavigator />
      </ThemeProvider>
    </TimeTrackerProvider>
  );
}
