import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  searchResults: [],
  error: [],
  searchToggle: false,
}

export const bookingSearch = createSlice({
  name: 'searchBookin',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setSearchToggle: (state, action) => {
      state.searchToggle = action.payload
    },
  },
})

export const getSearchResults = (state) => state.searchBookin.searchResults
export const getSearchToggle = (state) => state.searchBookin.searchToggle

export const { setSearchResults, setError, setSearchToggle } =
  bookingSearch.actions
export default bookingSearch.reducer
