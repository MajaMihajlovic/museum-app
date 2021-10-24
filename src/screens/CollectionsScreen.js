import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Appbar, Surface, Title, TouchableRipple } from "react-native-paper";
import { useNavigation } from "react-navigation-hooks";
import Spinner from "../components/Spinner";
import useCollectionsReducer from "../store/hooks/collections";

const CollectionsScreen = () => {
  const { push } = useNavigation();
  const { state, actions } = useCollectionsReducer("null");

  useEffect(() => {
    actions.onLoad();
  }, []);

  return (
    <View style={styles.root}>
      <Appbar.Header>
        <Appbar.Content title="Kolekcije" />
      </Appbar.Header>
      <View style={styles.content}>
        <ScrollView style={styles.grow}>
          {state.loadingCollections ? (
            <Spinner />
          ) : state.error ? (
            <Text style={styles.body}>{state.error}</Text>
          ) : (
            state.collections?.map((col) => (
              <Surface elevation={4} style={styles.surface} key={col.name}>
                <TouchableRipple
                  onPress={() => {
                    push("CollectionDetails", {
                      id: col.id,
                      name: col.name,
                      description: col.description,
                    });
                  }}
                  style={styles.card}
                >
                  <Title>{col.name}</Title>
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
  },
});

export default CollectionsScreen;
