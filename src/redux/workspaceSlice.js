import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  workspace: [],
  workspacesDetails: {
    id: 0,
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    description: '',
    available_space: 0,
    mentorship_available: 0,
    price: null,
    bookings: [],
    amenities: [],
    reviews: [],
    photos: [],
    category: 0,
    services: [],
  },
  totalSpaces: 0,
  perPage: 0,
  lastPage: null,
  spaceModal: false,
  unStructuredServices: [],
  serviceGroups: [],
  currentBusiness: null,
}

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspace: (state, action) => {
      state.workspace = action.payload
    },
    setWorkspaceDetails: (state, action) => {
      state.workspacesDetails = action.payload
    },
    setTotalSpaces: (state, action) => {
      state.totalSpaces = action.payload
    },
    setSpaceModal: (state, action) => {
      state.spaceModal = action.payload
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload
    },
    setLastPage: (state, action) => {
      state.lastPage = action.payload
    },
    setUstructuredServices: (state, action) => {
      state.unStructuredServices = action.payload
    },
    setServiceGroups: (state, action) => {
      state.serviceGroups = action.payload
    },
    setCurrentBusiness: (state, action) => {
      state.currentBusiness = action.payload
    },
  },
})

export const getPerPage = (state) => state.workspaces.perPage
export const getLastPage = (state) => state.workspaces.lastPage
export const getSpaceModal = (state) => state.workspaces.spaceModal
export const getTotalSpaces = (state) => state.workspaces.totalSpaces
export const getWorkspaceData = (state) => state.workspaces.workspace
export const getWorkspaceDetails = (state) => state.workspaces.workspacesDetails
export const getServiceGroups = (state) => state.workspaces.serviceGroups
export const getUnstructuredServices = (state) =>
  state.workspaces.unStructuredServices
export const getCurrentBusiness = (state) => state.workspaces.currentBusiness

export const {
  setWorkspace,
  setWorkspaceDetails,
  setTotalSpaces,
  setSpaceModal,
  setLastPage,
  setPerPage,
  setServiceGroups,
  setUstructuredServices,
  setCurrentBusiness,
} = workspaceSlice.actions
export default workspaceSlice.reducer
