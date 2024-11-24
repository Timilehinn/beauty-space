import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allPeople: [],
  userDetails: [],
  totalPeople: 0,
  lastPage: null,
  perPage: 0,
  error: [],
  filterToggle: false,
  accountType: null,
  users: [],
  userInfo: {
    id: null,
    email: '',
    phone_number: '',
    address: '',
    city: '',
    country: '',
    date_of_birth: '',
    first_name: '',
    last_name: '',
    gender: '',
    language: '',
    interest: '',
    photo: null,
    timezone: '',
    permissions: [],
    subscriptions: [],
    account_type: [],
  },

  loading: true,
  isFailure: false,
  workspaceFavourites: [],
  userType: [],
  currentUserPlan: null,
  referralCode: null,
}

export const adminAllUsers = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    setAllPeople: (state, action) => {
      state.allPeople = action.payload
    },
    setTotalPeople: (state, action) => {
      state.totalPeople = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload
    },
    setFilterToggle: (state, action) => {
      state.filterToggle = action.payload
    },
    setAccountType: (state, action) => {
      state.accountType = action.payload
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setIsFailure: (state, action) => {
      state.isFailure = action.payload
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload
    },
    setLastPage: (state, action) => {
      state.lastPage = action.payload
    },
    setWorkspaceFavourites: (state, action) => {
      state.workspaceFavourites = action.payload
    },
    setUserType: (state, action) => {
      state.userType = action.payload
    },
    setCurrentUserPlan: (state, action) => {
      state.currentUserPlan = action.payload
    },
    setReferralCode: (state, action) => {
      state.referralCode = action.payload
    },
  },
})

export const getUsers = (state) => state.adminPeople.users
export const getLoading = (state) => state.adminPeople.loading
export const getIsFailure = (state) => state.adminPeople.isFailure
export const getAccountType = (state) => state.adminPeople.accountType
export const getUserInfo = (state) => state.adminPeople.userInfo
export const getPerPage = (state) => state.adminPeople.perPage
export const getLastPage = (state) => state.adminPeople.lastPage
export const getAllUsers = (state) => state.adminPeople.allPeople
export const getFilterToggle = (state) => state.adminPeople.filterToggle
export const getWorkspaceFavorites = (state) =>
  state.adminPeople.workspaceFavourites
export const getUserType = (state) => state.adminPeople.userType
export const getCurrentUserPlan = (state) => state.adminPeople.currentUserPlan
export const getReferralCode = (state) => state.adminPeople.referralCode

export const {
  setError,
  setUsers,
  setLoading,
  setIsFailure,
  setPaginate,
  setAllPeople,
  setUserDetails,
  setAccountType,
  setTotalPeople,
  setFilterToggle,
  setUserInfo,
  setLastPage,
  setPerPage,
  setWorkspaceFavourites,
  setUserType,
  setCurrentUserPlan,
  setReferralCode,
} = adminAllUsers.actions
export default adminAllUsers.reducer
