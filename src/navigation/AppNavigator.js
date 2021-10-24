import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import MainTabNavigator from "./MainTabNavigator";
import DetailsScreen from "../screens/DetailsScreen";
import CollectionDetailsScreen from "../screens/CollectionDetailsScreen";
import FeedScreen from "../screens/FeedScreen";

const MainStack = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
    Details: DetailsScreen,
    CollectionDetails: CollectionDetailsScreen,
    Feed: FeedScreen,
  },
  {
    initialRouteName: "Main",
    defaultNavigationOptions: {
      gestureEnabled: true,
      headerShown: false,
    },
  }
);

export default createAppContainer(MainStack);
