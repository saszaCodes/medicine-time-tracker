import { createDrawerNavigator } from "@react-navigation/drawer";
import { FC } from "react";
import { WelcomeScreen } from "../screens/Welcome/Welcome";

const Drawer = createDrawerNavigator();

// TODO: define and use typing
type MainNavigatorType = unknown;

export const MainNavigator: FC = () => (
  <Drawer.Navigator initialRouteName="Welcome">
    <Drawer.Screen name="Welcome" component={WelcomeScreen} />
  </Drawer.Navigator>
);
