import React, { useEffect, memo, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";
import { Appbar, Divider, Paragraph, Title } from "react-native-paper";
import CollapsibleView from "@eliav2/react-native-collapsible-view";

import useCollectionsReducer from "../store/hooks/collections";
import ListFooter from "../components/ListFooter";
import ListItem, { LIST_ITEM_HEIGHT } from "../components/ListItem";

const getItemLayout = (data, index) => {
  return {
    length: LIST_ITEM_HEIGHT,
    offset: LIST_ITEM_HEIGHT * index,
    index,
  };
};

const CollectionDetailsScreen = () => {
  const { push, goBack } = useNavigation();
  const name = useNavigationParam("name");
  const id = useNavigationParam("id");
  const description = useNavigationParam("description");

  const { state, actions } = useCollectionsReducer(id);

  useEffect(() => {
    actions.loadList();
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <ListItem key={item.id} {...item} target={state.name} />
    ),
    [state.name]
  );

  const renderListFooter = useCallback(
    () => <ListFooter error={state.error} loading={state.loading} />,
    [state.error, state.loading]
  );

  return (
    <View style={styles.root}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => goBack()} />
        <Appbar.Content title={name} />
      </Appbar.Header>

      <View style={styles.body}>
        <Title style={styles.align}>Naziv kolekcije</Title>
        <Paragraph style={styles.align}>{name}</Paragraph>
        <Divider />
        <CollapsibleView
          title={<Title>Opis</Title>}
          initExpanded={true}
          style={{ borderWidth: 0, textAlign: "center" }}
        >
          <Paragraph>{description ? description : "-"}</Paragraph>
        </CollapsibleView>

        <Title style={styles.align}>Skup unosa</Title>
      </View>
      <FlatList
        data={state.records}
        renderItem={renderItem}
        //keyExtractor={(item, index) => index}
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={20}
        initialNumToRender={20}
        ListFooterComponent={renderListFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  body: {
    padding: 16,
  },
  align: {
    textAlign: "center",
  },
  titleStyle: {
    position: "absolute",
    right: 0,
    width: 300,
  },
});

export default CollectionDetailsScreen;
