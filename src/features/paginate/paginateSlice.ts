import { createSlice, Selector } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

import { fetchAll, removeTodo } from '../todo/todoSlice';

const initialState = {
  total: 0,
  currentPage: 1,
};

const paginateSlice = createSlice({
  name: 'paginate',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchAll.fulfilled, (state, action) => {
      state.total = action.meta.totalCount;
      state.currentPage = action.meta.arg ?? 1;
    });

    builder.addCase(removeTodo.fulfilled, (state) => {
      state.total -= 1;
    });
  },
});

export const selectTotal: Selector<RootState, number> = (state) =>
  state.paginate.total;

export const selectCurrentPage: Selector<RootState, number> = (state) =>
  state.paginate.currentPage;

export const selectPages: Selector<RootState, number> = (state) =>
  Math.ceil(state.paginate.total / 10);

export default paginateSlice;
