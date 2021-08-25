import React, { memo } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "react-navigation-hooks";
import {
  Card,
  Caption,
} from "react-native-paper";

import FavoriteFab from "./FavoriteFab";

// height of Card Title + Card Content
// used on getItemLayout of FlatList
export const CARD_OFFSET = 139;

// Columns on grid view
export const GRID_COLUMNS = 2;

const width = Dimensions.get("window").width;
const listImage = Math.round(width);
const gridImage = Math.round(width / GRID_COLUMNS - 4);

export const FeedItem = memo(
  ({ id, name, primaryimageurl, description, century, dated }) => {
    const { push } = useNavigation();

    return (
      <Card key={id} style={styles.root} elevation={0}>
        <Card.Title
          subtitleNumberOfLines={3}
          title={name}
          subtitle={description}
        />
        <TouchableOpacity
          testID="feed-item"
          onPress={() =>
            push("Details", {
              id,
              name,
              primaryimageurl,
              description,
              century,
              dated,
            })
          }
        >
          <Card.Cover
            source={{
              uri: `${primaryimageurl}?height=${listImage}&width=${listImage}`,
            }}
            style={styles.image}
          />
        </TouchableOpacity>
        <Card.Content>
          <Caption>{century}</Caption>
        </Card.Content>
        <FavoriteFab
          record={{
            id,
            name,
            primaryimageurl,
            description,
            century,
            dated,
          }}
          style={styles.fab}
        />
      </Card>
    );
  }
);

FeedItem.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  primaryimageurl: PropTypes.string,
  description: PropTypes.string,
  century: PropTypes.string,
  dated: PropTypes.string,
};

export const FeedItemGrid = memo(({ id, primaryimageurl, ...other }) => {
  const { push } = useNavigation();
  return (
    <Card key={id} style={styles.grid} elevation={0}>
      <TouchableOpacity
        testID="feed-item-grid"
        onPress={() => push("Details", { id, primaryimageurl, ...other })}
      >
        <Card.Cover
          source={{
            uri: `${primaryimageurl}?height=${gridImage}&width=${gridImage}`,
          }}
          style={styles.imageGrid}
        />
      </TouchableOpacity>
    </Card>
  );
});

FeedItemGrid.propTypes = {
  id: PropTypes.string,
  primaryimageurl: PropTypes.string,
};

const styles = StyleSheet.create({
  root: {
    marginTop: 24,
  },
  grid: {
    padding: 2,
  },
  image: {
    width: width,
    height: width,
  },
  imageGrid: {
    width: width / GRID_COLUMNS - 4,
    height: width / GRID_COLUMNS - 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
