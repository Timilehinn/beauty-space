import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUserObj: {},
};

export const userReducerSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setUserReducer: (state, action) => {
      state.currentUserObj = action.payload;
    },
  },
});

// export const getuserReducerObject = (state) => state.currentUser.currentUserObj;
export const { setUserReducer } = userReducerSlice.actions;
export default userReducerSlice.reducer;
