import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userBookings: null,
  userBookingDetails: null,
  last_page: null,
}

export const userBookingsSlice = createSlice({
  name: 'userBookings',
  initialState,
  reducers: {
    setUserBookings: (state, action) => {
      state.userBookings = action.payload
    },
    setUserBookingDetails: (state, action) => {
      state.userBookingDetails = action.payload
    },
    setLast_Page: (state, action) => {
      state.last_page = action.payload
    },
  },
})

export const getLast_Page = (state) => state.userBookings.last_page
export const getUserBookings = (state) => state.userBookings.userBookings
export const getUserBookingsDetails = (state) =>
  state.userBookings.userBookingDetails

export const { setUserBookings, setUserBookingDetails, setLast_Page } =
  userBookingsSlice.actions
export default userBookingsSlice.reducer
