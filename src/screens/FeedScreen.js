import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useNavigationParam, useNavigation } from "react-navigation-hooks";

import useFeedReducer from "../store/hooks/feed";
import SearchBar from "../components/SearchBar";
import FlatListBase from "../components/FlatListBase";
import ListFooter from "../components/ListFooter";
import EmptyList from "../components/EmptyList";

const FeedScreen = () => {
  const title = useNavigationParam("title") || "Katalog";
  const subtitle = useNavigationParam("subtitle");
  const filter = useNavigationParam("filter");
  const { goBack } = useNavigation();

  const { state, actions } = useFeedReducer(filter);

  useEffect(() => {
    actions.loadFeed();
  }, []);

  const [showSearch, setShowSearch] = useState(false);

  const ListFooterComponent = useCallback(
    () => (
      <ListFooter
        error={state.error}
        loading={state.loading && !state.refreshing}
      />
    ),
    [state.error, state.loading, state.refreshing]
  );

  const EmptyListComponent = useCallback(
    () => (
      <EmptyList
        notShow={state.loading || state.refreshing || state.error != null}
      />
    ),
    [state.loading, state.refreshing, state.error]
  );

  return (
    <View style={styles.root}>
      {showSearch ? (
        <Appbar.Header>
          <SearchBar
            dismiss={() => setShowSearch(false)}
            onSubmit={actions.onSubmitSearch}
          />
        </Appbar.Header>
      ) : (
        <Appbar.Header>
          <Appbar.Content title={title} subtitle={subtitle} />
          <Appbar.Action icon={"magnify"} onPress={() => setShowSearch(true)} />
          <Appbar.Action
            disabled={state.loading || state.refreshing}
            icon={state.grid ? "view-agenda" : "view-grid"}
            onPress={actions.toggleFeedView}
          />
        </Appbar.Header>
      )}

      {!showSearch ? (
        <FlatListBase
          listKey={`${state.grid ? "g" : "l"}`}
          setVisibleIndex={actions.setVisibleIndex}
          visibleIndex={state.visibleIndex}
          grid={state.grid}
          records={state.records}
          onEndReached={actions.onEndReached}
          //onEndReachedThreshold={0.01}
          onRefresh={() => actions.refreshFeed()}
          refreshing={state.refreshing}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={EmptyListComponent}
        />
      ) : (
        <FlatListBase
          listKey={`${state.grid ? "g" : "l"}`}
          setVisibleIndex={actions.setVisibleIndex}
          visibleIndex={state.visibleIndex}
          grid={state.grid}
          records={state.filteredRecords}
          onEndReached={actions.onEndReachedSearch}
          //onEndReachedThreshold={0.01}
          onRefresh={() => actions.refreshFeed()}
          refreshing={state.refreshing}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={EmptyListComponent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

export default FeedScreen;
