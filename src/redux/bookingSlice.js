import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  bookingsData: [],
  lastPage: null,
  totalBooking: 0,
}

export const bookingSlice = createSlice({
  name: 'business bookings',
  initialState,
  reducers: {
    setOwnerBookings: (state, action) => {
      state.bookingsData = action.payload
    },
    setLastPage: (state, action) => {
      state.lastPage = action.payload
    },
    setTotalBooking: (state, action) => {
      state.totalBooking = action.payload
    },
  },
})

export const getLastpage = (state) => state.booking.lastPage
export const getBusinessBookings = (state) => state.booking.bookingsData
export const getTotalBooking = (state) => state.booking.totalBooking

export const { setLastPage, setOwnerBookings, setTotalBooking } =
  bookingSlice.actions
export default bookingSlice.reducer
