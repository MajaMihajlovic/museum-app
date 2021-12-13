import { fetchFeed } from "../../api/api";

export const FETCH_FEED__SENT = "FETCH_FEED__SENT";
export const FETCH_FEED__FULFILLED = "FETCH_FEED__FULFILLED";
export const FETCH_FEED__REJECTED = "FETCH_FEED__REJECTED";
export const TOGGLE_FEED_VIEW = "TOGGLE_FEED_VIEW";
export const SET_VISIBLE_INDEX = "SET_VISIBLE_INDEX";
export const REFRESH_FEED__SENT = "REFRESH_FEED__SENT";

export const RESET_LIST = "RESET_LIST";
export const FILTER_RECORDS__SENT = "FILTER_RECORDS__SENT";
export const FILTER_RECORDS__FULFILLED = "FILTER_RECORDS__FULFILLED";
export const FILTER_RECORDS__REJECTED = "FILTER_RECORDS__REJECTED";
export const FILTER_RECORDS__RESET = "FILTER_RECORDS__RESET";

export const refreshFeed = (filter, page, propertyId = null) => async (dispatch) => {
  dispatch({ type: REFRESH_FEED__SENT });
  try {
    console.log("refresh" + page+filter+propertyId)
    const results = await fetchFeed(null, page, filter, propertyId);
    dispatch({
      type: FETCH_FEED__FULFILLED,
      payload: {
        ...results,
      },
    });
  } catch (err) {
    dispatch({ type: FETCH_FEED__REJECTED, payload: err.message });
  }
};

export const toggleFeedView = () => ({ type: TOGGLE_FEED_VIEW });

export const setVisibleIndex = (index) => ({
  type: SET_VISIBLE_INDEX,
  payload: index,
});

export const apiSearch = (target, propertyId = null) => async (dispatch) => {
  dispatch({ type: FILTER_RECORDS__SENT });
  try {
    const results = await fetchFeed(null, null, target, propertyId);
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
export const loadFeed = (extra, page, propertyId) => async (dispatch) => {
  dispatch({ type: FETCH_FEED__SENT });

  try {
    const results = page
      ? await fetchFeed(null, page, extra, propertyId)
      : await fetchFeed(null, 1, extra, propertyId);
    dispatch({
      type: FETCH_FEED__FULFILLED,
      payload: {
        ...results,
      },
    });
  } catch (err) {
    dispatch({ type: FETCH_FEED__REJECTED, payload: err.message });
  }
};
