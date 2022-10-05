import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { FC } from "react";
import { WelcomeScreen } from "../screens/Welcome/Welcome";

const Drawer = createDrawerNavigator();

// TODO: define and use typing
type MainNavigatorType = unknown;

export const MainNavigator: FC = () => (
  <NavigationContainer>
    <Drawer.Navigator initialRouteName="Welcome">
      <Drawer.Screen name="Welcome" component={WelcomeScreen} />
    </Drawer.Navigator>
  </NavigationContainer>
);
