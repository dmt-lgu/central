import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegionState {
  value: string[];
}

const initialState: RegionState = {
  value: [], // Initial empty list of regions
};

export const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    logout: (state) => {
      state.value = [];
    },
    setRegions: (state, action: PayloadAction<string[]>) => {
      state.value = action.payload;
    },
   
  },
});

export const { logout, setRegions } = regionSlice.actions;
export const selectRegions = (state: { region: RegionState }) => state.region.value;

export default regionSlice.reducer;
