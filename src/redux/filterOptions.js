import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  capacity: null,
  rating: null,
  amenities: [],
  mentorship: '',
  priceRangeFilter: { min: 1, max: 20 },
  distanceRangeFilter: { min: 200, max: 50000 },
  canFilter: false,
  filterViaCoordinates: false,
  coordinatesLat: null,
  datePicked: null,
  clearFilter: null,
  dateFilterPicked: null,
  address: '',
  duration: [],
  category: [],
  searchServices: [],
}

export const filterOptionSlice = createSlice({
  name: 'filteroptions',
  initialState,
  reducers: {
    setCapacity: (state, action) => {
      state.capacity = action.payload
    },
    setRating: (state, action) => {
      state.rating = action.payload
    },
    setAmenities: (state, action) => {
      state.amenities = action.payload
    },
    setMentorship: (state, action) => {
      state.mentorship = action.payload
    },
    setPriceRangeFilter: (state, action) => {
      state.priceRangeFilter = action.payload
    },
    setDistanceRangeFilter: (state, action) => {
      state.distanceRangeFilter = action.payload
    },
    setCanFilter: (state, action) => {
      state.canFilter = action.payload
    },
    setFilterViaCoordinates: (state, action) => {
      state.filterViaCoordinates = action.payload
    },
    setCoordinatesLatLng: (state, action) => {
      state.coordinatesLat = action.payload
    },
    setDatePicked: (state, action) => {
      state.datePicked = action.payload
    },
    setClearFilter: (state, action) => {
      state.clearFilter = action.payload
    },
    setDateFilterPicked: (state, action) => {
      state.dateFilterPicked = action.payload
    },
    setAddressDetails: (state, action) => {
      state.address = action.payload
    },
    setDuration: (state, action) => {
      state.duration = action.payload
    },
    setCategory: (state, action) => {
      state.category = action.payload
    },
    setSearchServices: (state, action) => {
      state.searchServices = action.payload
    },
  },
})

export const getCapacity = (state) => state.filteroptions.capacity
export const getRating = (state) => state.filteroptions.rating
export const getAmenities = (state) => state.filteroptions.amenities
export const getMentorship = (state) => state.filteroptions.mentorship
export const getPriceRangeFilter = (state) =>
  state.filteroptions.priceRangeFilter
export const getDistanceRangeFilter = (state) =>
  state.filteroptions.distanceRangeFilter
export const getCanFilter = (state) => state.filteroptions.canFilter
export const getFilterViaCoordinates = (state) =>
  state.filteroptions.filterViaCoordinates
export const getCoordinatesLatLng = (state) =>
  state.filteroptions.coordinatesLat
export const getDatePicked = (state) => state.filteroptions.datePicked
export const getClearFilter = (state) => state.filteroptions.clearFilter
export const getDateFilterPicked = (state) =>
  state.filteroptions.dateFilterPicked
export const getLocationDetails = (state) => state.filteroptions.address
export const getDuration = (state) => state.filteroptions.duration
export const getCategory = (state) => state.filteroptions.category
export const getSearchServices = (state) => state.filteroptions.searchServices

export const {
  setCapacity,
  setRating,
  setAmenities,
  setMentorship,
  setPriceRangeFilter,
  setDistanceRangeFilter,
  setCanFilter,
  setFilterViaCoordinates,
  setCoordinatesLatLng,
  setDatePicked,
  setClearFilter,
  setDateFilterPicked,
  setAddressDetails,
  setDuration,
  setCategory,
  setSearchServices,
} = filterOptionSlice.actions
export default filterOptionSlice.reducer
