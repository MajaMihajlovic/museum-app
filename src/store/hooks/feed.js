import { useCallback } from "react";
import useCancelableThunkReducer from "use-cancelable-thunk-reducer";
import {
  loadFeed,
  toggleFeedView,
  setVisibleIndex,
  refreshFeed,
  search,
  resetSearch,
} from "../actions/feed";
import reducer, { feedInitialState } from "../reducers/feed";

const setVisibleIndexFactory =
  ({ viewableItems, changed }) =>
  (dispatch) => {
    if (viewableItems[0]) {
      const firstViewable = changed.find((el) => el.isViewable);
      if (firstViewable) {
        dispatch(
          setVisibleIndex(Math.min(viewableItems[0].index, firstViewable.index))
        );
      } else {
        dispatch(setVisibleIndex(viewableItems[0].index));
      }
    }
  };

export default function useFeedReducer(filter, propertyId) {
  const [state, dispatch] = useCancelableThunkReducer(
    reducer,
    feedInitialState
  );

  const _loadFeed = useCallback(
    (page) => dispatch(loadFeed(filter, page, propertyId)),
    [filter]
  );
  const _refreshFeed = useCallback(
    () => dispatch(refreshFeed(filter)),
    [filter]
  );
  const _toggleFeedView = useCallback(() => dispatch(toggleFeedView()), []);
  const _setVisibleIndex = useCallback(
    ({ viewableItems, changed }) =>
      dispatch(setVisibleIndexFactory({ viewableItems, changed })),
    []
  );
  const _onEndReached = useCallback(() => {
    if (state.loading == false) {
      state.page = state.page + 1;
      return _loadFeed(state.page);
    }
  }, []);

  const onSubmitSearch = (text) => {
    dispatch(resetSearch());
    dispatch(search(text));
  };

  //todo
  const onEndReachedSearch = () =>
    state.nextSearchUrl &&
    dispatch(loadListOf(target, state.nextSearchUrl, false, true));

  return {
    state,
    actions: {
      loadFeed: _loadFeed,
      refreshFeed: _refreshFeed,
      toggleFeedView: _toggleFeedView,
      setVisibleIndex: _setVisibleIndex,
      onEndReached: _onEndReached,
      onSubmitSearch,
      onEndReachedSearch,
    },
  };
}
