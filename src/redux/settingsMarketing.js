import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  discounts: [],
  loading: false,
  failure: false,
  createDiscountModal: false,
  selectedWorkspace: 1,
  percentage: null,
  start: '',
  expire: '',
  creating: false,
  errorMsg: [],
  discountContextMenu: false,
  deleteModal: false,
  dicountDetails: null,
  userDiscounts: [],
  currentPlan: [],
}

export const marketingSlice = createSlice({
  name: 'marketingDiscounts',
  initialState,
  reducers: {
    setDiscounts: (state, action) => {
      state.discounts = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setFailure: (state, action) => {
      state.failure = action.payload
    },
    setCreateDiscountModal: (state, action) => {
      state.createDiscountModal = action.payload
    },
    setSelectedWorkspace: (state, action) => {
      state.selectedWorkspace = action.payload
    },

    setPercentage: (state, action) => {
      state.percentage = action.payload
    },
    setStart: (state, action) => {
      state.start = action.payload
    },
    setExpire: (state, action) => {
      state.expire = action.payload
    },
    setErrorMsg: (state, action) => {
      state.errorMsg = action.payload
    },
    setCreating: (state, action) => {
      state.creating = action.payload
    },
    setDiscountContextMenu: (state, action) => {
      state.discountContextMenu = action.payload
    },
    setDeleteModal: (state, action) => {
      state.deleteModal = action.payload
    },
    setDiscountsDetails: (state, action) => {
      state.dicountDetails = action.payload
    },
    setUserDiscounts: (state, action) => {
      state.userDiscounts = action.payload
    },
    setCurrentPlan: (state, action) => {
      state.currentPlan = action.payload
    },
  },
})

export const getCreateDiscountModal = (state) =>
  state.marketingDiscounts.createDiscountModal
export const getDiscounts = (state) => state.marketingDiscounts.discounts
export const getLoading = (state) => state.marketingDiscounts.loading
export const getFailure = (state) => state.marketingDiscounts.failure
export const getSelectedWorkspace = (state) =>
  state.marketingDiscounts.selectedWorkspace
export const getPercentage = (state) => state.marketingDiscounts.percentage
export const getStart = (state) => state.marketingDiscounts.start
export const getExpire = (state) => state.marketingDiscounts.expire
export const getCreating = (state) => state.marketingDiscounts.creating
export const getErrorMsg = (state) => state.marketingDiscounts.errorMsg
export const getDiscountContextMenu = (state) =>
  state.marketingDiscounts.discountContextMenu
export const getDeleteModal = (state) => state.marketingDiscounts.deleteModal
export const getDiscountDetails = (state) =>
  state.marketingDiscounts.dicountDetails
export const getUsersDiscounts = (state) =>
  state.marketingDiscounts.userDiscounts
export const getCurrentPlan = (state) => state.marketingDiscounts.currentPlan

export const {
  setDiscounts,
  setLoading,
  setFailure,
  setCreateDiscountModal,
  setSelectedWorkspace,
  setDiscountContextMenu,
  setPercentage,
  setStart,
  setExpire,
  setCreating,
  setErrorMsg,
  setDeleteModal,
  setDiscountsDetails,
  setUserDiscounts,
  setCurrentPlan,
} = marketingSlice.actions

export default marketingSlice.reducer
