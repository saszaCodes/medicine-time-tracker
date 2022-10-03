import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TimeTrackerProvider } from "./contexts/TimeTrackerContext";

export default function App() {
  return (
    <TimeTrackerProvider>
      <ThemeProvider>
        <View style={styles.container}>
          <Text>Open up App.tsx to start working on your app!</Text>
          <StatusBar style="auto" />
        </View>
      </ThemeProvider>
    </TimeTrackerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
