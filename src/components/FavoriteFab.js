import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FAB } from "react-native-paper";

import { toggleFavorite } from "../store/actions/favorites";

export const FavoriteFab = ({
  record,
  favorites,
  toggleFavorite,
  ...other
}) => {
  return (
    <FAB
      testID="favorite-fab"
      icon="heart"
      onPress={() => toggleFavorite(record)}
      color={favorites.find(f => f.id === record.id) ? "#d64541" : "black"}
      {...other}
    />
  );
};

FavoriteFab.propTypes = {
  record: PropTypes.object.isRequired,
  favorites: PropTypes.array.isRequired,
  toggleFavorite: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  favorites: state.favorites.records
});

export default connect(mapStateToProps, { toggleFavorite })(FavoriteFab);
