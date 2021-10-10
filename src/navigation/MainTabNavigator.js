import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";

import TabBarIcon from "../components/TabBarIcon";
import FeedScreen from "../screens/FeedScreen";
import CollectionsScreen from "../screens/CollectionsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import AboutScreen from "../screens/AboutScreen";
import theme from "../util/theme";

const renderTabBar = props => (
  <TabBar
    {...props}
    style={styles.tabBar}
    indicatorStyle={styles.indicator}
    renderIcon={props => <TabBarIcon {...props} />}
  />
);

const renderScene = ({ route }) => {
  switch (route.key) {
    case "feed":
      return <FeedScreen />;
    case "favorites":
      return <FavoritesScreen />;
    case "collections":
      return <CollectionsScreen />;
    case "about":
      return <AboutScreen />;
    default:
      return null;
  }
};

const MainTabNavigator = props => {
  const [state, setState] = useState({
    index: 0,
    routes: [
      { key: "feed", icon: "ios-home" },
      { key: "collections", icon: "ios-search" },
      { key: "favorites", icon: "ios-heart" },
      { key: "about", icon: "ellipsis-horizontal-outline" }
    ]
  });

  return (
    <TabView
      tabBarPosition="bottom"
      navigationState={state}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={index => setState({ ...state, index })}
      initialLayout={{ width: Dimensions.get("window").width }}
      sceneContainerStyle={styles.scene}
    />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.primary
  },
  indicator: {
    top: 0,
    backgroundColor: theme.colors.secondary,
    height: 3
  },
  scene: {
    backgroundColor: theme.colors.primary
  }
});

export default MainTabNavigator;
