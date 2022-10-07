import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { FC } from "react";
import { AddTrackerScreen } from "../screens/AddTracker/AddTracker";
import { SettingsScreen } from "../screens/Settings/Settings";
import { WelcomeScreen } from "../screens/Welcome/Welcome";
import { MainNavigatorParams } from "../types/types";

const Drawer = createDrawerNavigator<MainNavigatorParams>();

export const MainNavigator: FC = () => (
  <NavigationContainer>
    <Drawer.Navigator initialRouteName="Welcome">
      <Drawer.Screen name="Welcome" component={WelcomeScreen} />
      <Drawer.Screen name="AddTracker" component={AddTrackerScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  </NavigationContainer>
);
