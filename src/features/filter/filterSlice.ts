import { createSlice, PayloadAction, Selector } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';

export type Filter = 'all' | 'active' | 'completed';

const filterSlice = createSlice({
  name: 'filter',
  initialState: 'all' as Filter,
  reducers: {
    changeFilter(_, action: PayloadAction<Filter>) {
      return action.payload;
    },
  },
});

export const { changeFilter } = filterSlice.actions;

export const selectFilter: Selector<RootState, Filter, never> = (state) =>
  state[filterSlice.name];

export default filterSlice;
