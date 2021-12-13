import {
  FETCH_TARGET__SENT,
  FETCH_TARGET__FULFILLED,
  FETCH_TARGET__REJECTED,
  RESET_LIST,
  FILTER_RECORDS__SENT,
  FILTER_RECORDS__FULFILLED,
  FILTER_RECORDS__REJECTED,
  FILTER_RECORDS__RESET,
  FETCH_COLLECTIONS__SENT,
  FETCH_COLLECTIONS__FULFILLED,
  FETCH_COLLECTIONS__REJECTED,
} from "../actions/collections";

export const initialState = {
  loading: false,
  refreshing: false,
  records: [],
  error: null,
  totalRecords: undefined,
  next: "",
  target: "",
  search: "",
  filteredRecords: [],
  nextSearchUrl: null,
  collections: [],
  loadingCollections: false,
};

const collectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TARGET__SENT:
      return { ...state, loading: true };

    case FETCH_TARGET__FULFILLED:
      const { info, records, target } = action.payload;
      return {
        ...state,
        records: [...state.records, ...records],
        page: info?.page,
        totalRecords: info?.totalrecords,
        loading: false,
        error: null,
        target
      };

    case FETCH_TARGET__REJECTED:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case FETCH_COLLECTIONS__SENT:
      return { ...state, loadingCollections: true };

    case FETCH_COLLECTIONS__FULFILLED:
      //const {  records } = action.payload;
      return {
        ...state,
        collections: action.payload.records,
        loadingCollections: false,
      };

    case FETCH_COLLECTIONS__REJECTED:
      return {
        ...state,
        error: action.payload,
        loadingCollections: false,
      };

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
        filteredRecords: [ ...action.payload.records],
        nextSearchUrl: action.payload.info.page,
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

export default collectionsReducer;
