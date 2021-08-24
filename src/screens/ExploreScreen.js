import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Appbar, Surface, Title, TouchableRipple } from "react-native-paper";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";
import Spinner from "../components/Spinner";
import useExploreReducer from "../store/hooks/explore";

const ExploreScreen = () => {
  const { push } = useNavigation();
  const target = useNavigationParam("target");
  const { state, actions } = useExploreReducer("null");

  useEffect(() => {
    actions.onLoad();
  }, []);

  return (
    <View style={styles.root}>
      <Appbar.Header>
        <Appbar.Content title="Explore" />
      </Appbar.Header>
      <View style={styles.content}>
        <ScrollView style={styles.grow}>
          {state.loadingCollections ? (
            <Spinner />
          ) : state.error ? (
            <Text style={styles.body}>{state.error}</Text>
          ) : (
            state.collections?.map((target) => (
              <Surface elevation={4} style={styles.surface} key={target.id}>
                <TouchableRipple
                  onPress={() => push("List", { target })}
                  style={styles.card}
                >
                  <Title>{target.name}</Title>
                </TouchableRipple>
              </Surface>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  grow: {
    flex: 1,
  },
  card: {
    padding: 16,
    paddingLeft: 32,
  },
  surface: {
    margin: 8,
    borderRadius: 16,
    // backgroundColor: "#fafafa"
  },
});

export default ExploreScreen;
