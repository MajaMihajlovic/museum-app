import React, { memo } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "react-navigation-hooks";

export const LIST_ITEM_HEIGHT = 48;

// ListItem used in Search Tab

const ListItem = memo(({ name, id, description, media,collectionName  }) => {
  const { push } = useNavigation();
  return (
    <View >
        <TouchableOpacity
          testID="list-item"
          key={id}
          onPress={() => {
            push("Details", {  name, id, description, media, collectionName });
          }}
        >
          <Card.Title
            style={styles.text}
            title={name}
            subtitle={description}
            subtitleNumberOfLines={3}
          />
        </TouchableOpacity>
     
    </View>
  );
});

ListItem.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  description: PropTypes.string,
  theme: PropTypes.string,
  target: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  item: {
    
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  name: {
    flex: 1,
  },
  count: {
    padding: 8,
  },
  text: {
    paddingBottom: 5,
  },
});

export default ListItem;
