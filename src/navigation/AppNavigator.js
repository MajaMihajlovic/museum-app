import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import MainTabNavigator from "./MainTabNavigator";
import DetailsScreen from "../screens/DetailsScreen";
import ListScreen from "../screens/ListScreen";
import FeedScreen from "../screens/FeedScreen";

const MainStack = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator
    },
    Details: DetailsScreen,
    List: ListScreen,
    Feed: FeedScreen
  },
  {
    initialRouteName: "Main",
    defaultNavigationOptions: {
      gestureEnabled: true,
      headerShown: false
    }
  }
);

export default createAppContainer(MainStack);
