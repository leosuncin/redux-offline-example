import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import todoSlice from '../features/todo/todoSlice';
import filterSlice from '../features/filter/filterSlice';

export const store = configureStore({
  reducer: {
    [todoSlice.name]: todoSlice.reducer,
    [filterSlice.name]: filterSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
