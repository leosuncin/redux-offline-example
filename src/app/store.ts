import {
  configureStore,
  Action,
  SerializedError,
  ThunkAction,
  createListenerMiddleware,
  addListener,
} from '@reduxjs/toolkit';

import filterSlice from '../features/filter/filterSlice';
import paginateSlice from '../features/paginate/paginateSlice';
import todoSlice from '../features/todo/todoSlice';

const listener = createListenerMiddleware();

export const store = configureStore({
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
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
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
