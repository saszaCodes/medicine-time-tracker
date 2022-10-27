import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { FC } from "react";
import { View } from "react-native";
import { AddTrackerScreen } from "../screens/AddTracker/AddTracker";
import { SettingsScreen } from "../screens/Settings/Settings";
import { WelcomeScreen } from "../screens/Welcome/Welcome";
import { MainNavigatorParams } from "../types/types";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import styled from "styled-components/native";

const Tab = createBottomTabNavigator<MainNavigatorParams>();

type MenuIconProps = { icon: JSX.Element; focused?: boolean };

const IconContainer = styled.View<{ focused?: boolean }>`
  align-self: center;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  padding: ${({ theme }) => theme.spacing.s};
  ${({ focused, theme }) =>
    focused &&
    `
    border-radius: 1000px;
    background-color: ${theme.colors.primary};
  `}
`;

const Title = styled.Text`
  font: ${({ theme }) => theme.fonts.regular};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.mplus};
`;

const MenuIcon = (p: MenuIconProps) => (
  <IconContainer focused={p.focused}>{p.icon}</IconContainer>
);

export const MainNavigator: FC = () => {
  const theme = useTheme();
  const iconSize = 24;
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            justifyContent: "center",
            height: 60,
          },
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarLabel: () => {
            if (route.name === "Welcome") return <Title>Trackers</Title>;
            if (route.name === "AddTracker") return <Title>Add tracker</Title>;
            if (route.name === "Settings") return <Title>Settings</Title>;
          },
          tabBarIcon: ({ focused }) => {
            if (route.name === "Welcome")
              return (
                <IconContainer {...{ focused }}>
                  <Ionicons name="list" size={iconSize} />
                </IconContainer>
              );
            if (route.name === "AddTracker")
              return (
                <IconContainer {...{ focused }}>
                  <Ionicons name="add" size={iconSize} />
                </IconContainer>
              );
            if (route.name === "Settings")
              return (
                <IconContainer {...{ focused }}>
                  <Ionicons name="cog" size={iconSize} />
                </IconContainer>
              );
          },
        })}
        initialRouteName="Welcome"
      >
        <Tab.Screen name="Welcome" component={WelcomeScreen} />
        <Tab.Screen name="AddTracker" component={AddTrackerScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
