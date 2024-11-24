import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  surveyjson: {},
}

export const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setSurveyjson: (state, action) => {
      state.surveyjson = action.payload
    },
  },
})

export const { setSurveyjson } = surveySlice.actions
export default surveySlice.reducer
