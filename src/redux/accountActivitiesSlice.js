import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activities: [],
}

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setActivites: (state, action) => {
      state.activities = action.payload
    },
  },
})

export const { setActivites } = activitiesSlice.actions
export default activitiesSlice.reducer
