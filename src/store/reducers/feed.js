import {
  FETCH_FEED__SENT,
  FETCH_FEED__FULFILLED,
  FETCH_FEED__REJECTED,
  TOGGLE_FEED_VIEW,
  SET_VISIBLE_INDEX,
  REFRESH_FEED__SENT,
} from "../actions/feed";

// todo:remove later
import {
  RESET_LIST,
  FILTER_RECORDS__SENT,
  FILTER_RECORDS__FULFILLED,
  FILTER_RECORDS__REJECTED,
  FILTER_RECORDS__RESET,
} from "../actions/explore";
export const feedInitialState = {
  loading: false,
  records: [],
  error: null,
  grid: false,
  visibleIndex: 0,
  filteredRecords: [],
  refreshing: false,
  page: 1,
};

const feedReducer = (state = feedInitialState, action) => {
  switch (action.type) {
    case FETCH_FEED__SENT:
      return { ...state, loading: true };

    case FETCH_FEED__FULFILLED:
      const { page, records } = action.payload;
      const toAdd = records.filter(
        (r) => !state.records.find((s) => s.id === r.id)
      );
      return {
        ...state,
        page,
        records: [...state.records, ...toAdd],
        loading: false,
        refreshing: false,
        error: null,
      };

    case FETCH_FEED__REJECTED:
      return {
        ...state,
        error: action.payload,
        loading: false,
        refreshing: false,
      };

    case REFRESH_FEED__SENT:
      return {
        ...state,
        records: [],
        loading: true,
        visibleIndex: 0,
        refreshing: true,
      };
    case TOGGLE_FEED_VIEW:
      return { ...state, grid: !state.grid };

    case SET_VISIBLE_INDEX:
      return { ...state, visibleIndex: action.payload };
    case FILTER_RECORDS__SENT:
      return { ...state, error: null, loading: true };

    case FILTER_RECORDS__REJECTED:
      return {
        ...state,
        error: action.payload,
        loading: false,
        nextSearchUrl: null,
      };

    case FILTER_RECORDS__FULFILLED:
      return {
        ...state,
        loading: false,
        error: null,
        filteredRecords: [...state.filteredRecords, ...action.payload.records],
        nextSearchUrl: null,
      };

    case FILTER_RECORDS__RESET:
      return {
        ...state,
        error: null,
        filteredRecords: [],
        nextSearchUrl: null,
      };
    case RESET_LIST:
      return { ...initialState };

    default:
      return state;
  }
};

export default feedReducer;
