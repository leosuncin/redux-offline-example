import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';

const swSlice = createSlice({
  name: 'sw',
  initialState: {
    hasPendingUpdate: false,
    updateAccepted: false,
  },
  reducers: {
    updateAvailable(state) {
      state.hasPendingUpdate = true;
    },
    acceptUpdate(state, action: PayloadAction<boolean>) {
      state.updateAccepted = action.payload;
    },
  },
});

export const { acceptUpdate, updateAvailable } = swSlice.actions;

export const selectHasPendingUpdate = (state: RootState): Boolean =>
  state.sw!.hasPendingUpdate;

export default swSlice;
