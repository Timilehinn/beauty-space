import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accountRestoreObject:''
};

export const accountRestorerSlice = createSlice({
  name: "accountRestorer",
  initialState,
  reducers: {
    setAccountRestoreObject: (state, action) => {
      state.accountRestoreObject = action.payload;
    },
  },
});

export const getAccountRestoreObject = (state) => state.accountRestorer.accountRestoreObject;
export const {
    setAccountRestoreObject,
} = accountRestorerSlice.actions;
export default accountRestorerSlice.reducer;
