import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegionState {
  value: any;
}

const initialState: RegionState = {
  value: ["R1","R2","R3","R4A","R4B","R5","CAR","NCR","R6","R7","R8","R9","R10","R11","R12","R13","BARMM I","BARMM II"], // Initial empty list of regions
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
