import useCancelableThunkReducer from "use-cancelable-thunk-reducer";

import { loadListOf, loadCollections } from "../actions/collections";
import reducer, { initialState } from "../reducers/collections";

export default function useCollectionsReducer(target) {
  const [state, dispatch] = useCancelableThunkReducer(reducer, initialState);

  const loadList = () => dispatch(loadListOf(target));

  const onLoad = () => dispatch(loadCollections());

  const onEndReached = () => dispatch(loadListOf(target));

  return {
    state,
    actions: {
      loadList,
      onLoad,
      onEndReached,
    },
  };
}
