import { fetchFeed, fetchCollections, loadCollectionItems } from "../../api/api";

// action types

export const FETCH_TARGET__SENT = "FETCH_TARGET__SENT";
export const FETCH_TARGET__FULFILLED = "FETCH_TARGET__FULFILLED";
export const FETCH_TARGET__REJECTED = "FETCH_TARGET__REJECTED";
export const RESET_LIST = "RESET_LIST";
export const FILTER_RECORDS__SENT = "FILTER_RECORDS__SENT";
export const FILTER_RECORDS__FULFILLED = "FILTER_RECORDS__FULFILLED";
export const FILTER_RECORDS__REJECTED = "FILTER_RECORDS__REJECTED";
export const FILTER_RECORDS__RESET = "FILTER_RECORDS__RESET";

export const FETCH_COLLECTIONS__SENT = "FETCH_COLLECTIONS__SENT";
export const FETCH_COLLECTIONS__FULFILLED = "FETCH_COLLECTIONS__FULFILLED";
export const FETCH_COLLECTIONS__REJECTED = "FETCH_COLLECTIONS__REJECTED";

// action creators

export const loadListOf =
  (target, url = null, desc = false, search = false) =>
  async (dispatch) => {
    dispatch({ type: FETCH_TARGET__SENT });
    try {
      const results = await loadCollectionItems(target);
      dispatch({
        type: search ? FILTER_RECORDS__FULFILLED : FETCH_TARGET__FULFILLED,
        payload: { ...results, target, desc },
      });
    } catch (err) {
      dispatch({
        type: search ? FILTER_RECORDS__REJECTED : FETCH_TARGET__REJECTED,
        payload: err.message,
      });
    }
  };

export const apiSearch = (target) => async (dispatch) => {
  dispatch({ type: FILTER_RECORDS__SENT });
  try {
    const results = await fetchFeed(null, null, target);
    if (results.records.length === 0) {
      dispatch({
        type: FILTER_RECORDS__REJECTED,
        payload: "Ništa za prikazati.",
      });
    } else {
      dispatch({
        type: FILTER_RECORDS__FULFILLED,
        payload: { ...results },
      });
    }
  } catch (err) {
    dispatch({ type: FILTER_RECORDS__REJECTED, payload: err.message });
  }
};

export const search =
  (value = "") =>
  async (dispatch) => {
    apiSearch(value)(dispatch);
  };

export const resetSearch = () => ({ type: FILTER_RECORDS__RESET });

export const loadCollections = (extra, next) => async (dispatch) => {
  dispatch({ type: FETCH_COLLECTIONS__SENT });
  try {
    const results = await fetchCollections();
    dispatch({
      type: FETCH_COLLECTIONS__FULFILLED,
      payload: {
        ...results,
      },
    });
  } catch (err) {
    dispatch({ type: FETCH_COLLECTIONS__REJECTED, payload: err.message });
  }
};
