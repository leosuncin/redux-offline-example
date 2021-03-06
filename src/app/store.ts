import {
  configureStore,
  Action,
  SerializedError,
  ThunkAction,
  createListenerMiddleware,
  addListener,
  PreloadedState,
} from '@reduxjs/toolkit';

import filterSlice from '../features/filter/filterSlice';
import paginateSlice, {
  selectCurrentPage,
  selectPages,
} from '../features/paginate/paginateSlice';
import swSlice from '../features/sw/swSlice';
import todoSlice, { fetchAll, removeTodo } from '../features/todo/todoSlice';

const listener = createListenerMiddleware<RootState>();

listener.startListening({
  actionCreator: removeTodo.fulfilled,
  effect(_, { dispatch, getState }) {
    const currentPage = selectCurrentPage(getState());
    const pages = selectPages(getState());

    if (currentPage > pages) {
      // If the last page is empty, fetch the previous one
      (dispatch as AppDispatch)(fetchAll(currentPage - 1));
    } else if (currentPage < pages) {
      // If there are more todos, refetch current page
      (dispatch as AppDispatch)(fetchAll(currentPage));
    }
  },
});

listener.startListening({
  predicate(_action, currentState) {
    return currentState.sw!.hasPendingUpdate && currentState.sw!.updateAccepted;
  },
  effect() {
    navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });

    window.location.reload();
  },
});

export function makeStore(preloadedState?: Partial<PreloadedState<RootState>>) {
  return configureStore({
    reducer: {
      [todoSlice.name]: todoSlice.reducer,
      [filterSlice.name]: filterSlice.reducer,
      [paginateSlice.name]: paginateSlice.reducer,
      [swSlice.name]: swSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [addListener.type],
        },
      }).concat(listener.middleware),
    preloadedState,
  });
}

export const store = makeStore();

export type AppDispatch = typeof store.dispatch;
export type RootState = {
  [todoSlice.name]: ReturnType<typeof todoSlice.reducer>;
  [filterSlice.name]: ReturnType<typeof filterSlice.reducer>;
  [paginateSlice.name]: ReturnType<typeof paginateSlice.reducer>;
  [swSlice.name]?: ReturnType<typeof swSlice.reducer>;
};
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type AsyncThunkConfig<
  Options extends Partial<{
    rejectValue: unknown;
    pendingMeta: unknown;
    fulfilledMeta: unknown;
    rejectedMeta: unknown;
  }> = {},
> = {
  state: RootState;
  dispatch: AppDispatch;
  extra: unknown;
  serializedErrorType: SerializedError;
} & Options;
