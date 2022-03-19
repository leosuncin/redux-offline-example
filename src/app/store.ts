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
import paginateSlice from '../features/paginate/paginateSlice';
import todoSlice from '../features/todo/todoSlice';

const listener = createListenerMiddleware();

export function makeStore(preloadedState?: Partial<PreloadedState<RootState>>) {
  return configureStore({
    reducer: {
      [todoSlice.name]: todoSlice.reducer,
      [filterSlice.name]: filterSlice.reducer,
      [paginateSlice.name]: paginateSlice.reducer,
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
