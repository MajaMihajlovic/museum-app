import useCancelableThunkReducer from "use-cancelable-thunk-reducer";

import { loadListOf, loadCollections } from "../actions/explore";
import reducer, { initialState } from "../reducers/explore";

export default function useExploreReducer(target) {
  const [state, dispatch] = useCancelableThunkReducer(reducer, initialState);

  const loadList = () => dispatch(loadListOf(target));

  const onLoad = () => dispatch(loadCollections());

  const onEndReached = () =>
    state.page && dispatch(loadListOf(target, state.page));


  return {
    state,
    actions: {
      loadList,
      onLoad,
      onEndReached,
    }
  };
}
