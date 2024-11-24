import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: [],
  emptyNotification: false,
  nextUrl: null,
  loadMoreBtn: 'Load More',
  loadingNotification: false,
  failure: false,
  currentTab: null,
  dspType: 'profile',
}

export const dashboardRelated = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload
    },
    setEmptyNotification: (state, action) => {
      state.emptyNotification = action.payload
    },
    setNextUrl: (state, action) => {
      state.nextUrl = action.payload
    },
    setLoadMoreBtn: (state, action) => {
      state.loadMoreBtn = action.payload
    },
    setLoadingNotification: (state, action) => {
      state.loadingNotification = action.payload
    },
    setFailure: (state, action) => {
      state.failure = action.payload
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload
    },
    setDspType: (state, action) => {
      state.dspType = action.payload
    },
  },
})

export const getNextUrl = (state) => state.dashboard.nextUrl
export const getFailure = (state) => state.dashboard.failure
export const getLoadMoreBtn = (state) => state.dashboard.loadMoreBtn
export const getNotifications = (state) => state.dashboard.notifications
export const getEmptyNotification = (state) => state.dashboard.emptyNotification
export const getLoadingNotification = (state) =>
  state.dashboard.loadingNotification
export const getDspType = (state) => state.dashboard.dspType
export const getCurrentTab = (state) => state.dashboard.currentTab

export const {
  setNotifications,
  setEmptyNotification,
  setNextUrl,
  setLoadMoreBtn,
  setLoadingNotification,
  setFailure,
  setCurrentTab,
  setDspType,
} = dashboardRelated.actions
export default dashboardRelated.reducer
