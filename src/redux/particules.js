import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    coordinates:''
};

export const particulesSlice = createSlice({
  name: "particules",
  initialState,
  reducers: {
    setCoordinates: (state, action) => {
      state.coordinates = action.payload;
    },
  },
});

export const getCoordinates = (state) => state.particules.coordinates;
export const {
    setCoordinates,
} = particulesSlice.actions;
export default particulesSlice.reducer;
