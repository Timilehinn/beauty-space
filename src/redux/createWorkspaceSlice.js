import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  totalSteps: null,
  serviceData: {
    name: '',
    description: '',
    city: '',
    state: '',
    country: 'Nigeria',
    mentorship_available: 1,
    agreement: false,
    price: 0,
    status: 'Pending',
    type: '',
    category: 1,
    duration: 'Hourly',
    users: 1,
    available_space: 1,
    photos: [],
    amenities: [],
  },
  description: null,
  groupedServices: [],
}

const createWorkspace = createSlice({
  name: 'createWorkspace',
  initialState,
  reducers: {
    setTotalSteps: (state, action) => {
      state.totalSteps = action.payload
    },
    setServiceData: (state, action) => {
      state.serviceData = { ...state.serviceData, ...action.payload }
    },
    setDescription: (state, action) => {
      state.description = action.payload
    },
    setGroupedServices: (state, action) => {
      state.groupedServices = action.payload
    },
  },
})

export const getTotalSteps = (state) => state.createWorkspace.totalSteps
export const getDescription = (state) => state.createWorkspace.description
export const getServiceData = (state) => state.createWorkspace.serviceData
export const getGroupServices = (state) => state.createWorkspace.groupedServices

export const {
  setTotalSteps,
  setServiceData,
  setDescription,
  setGroupedServices,
} = createWorkspace.actions

export default createWorkspace.reducer
