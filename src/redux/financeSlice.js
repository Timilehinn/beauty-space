import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  modal: false,
  withdrawModal: false,
  loadingBanks: false,
  failure: false,
  banks: [],
  validatedAccount: '',
  savedBankDetails: null,
  accountBalance: null,
  withdrawalErrors: [],
  addBankErrors: [],
}

export const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.modal = action.payload
    },
    setWithdrawModal: (state, action) => {
      state.withdrawModal = action.payload
    },
    setLoadingBanks: (state, action) => {
      state.loadingBanks = action.payload
    },
    setFailure: (state, action) => {
      state.failure = action.payload
    },
    setBanks: (state, action) => {
      state.banks = action.payload
    },
    setValidatedAccount: (state, action) => {
      state.validatedAccount = action.payload
    },
    setSavedBankDetails: (state, action) => {
      state.savedBankDetails = action.payload
    },
    setAccountBalance: (state, action) => {
      state.accountBalance = action.payload
    },
    setWithdrawalErrors: (state, action) => {
      state.withdrawalErrors = action.payload
    },
    setAddBankErrors: (state, action) => {
      state.addBankErrors = action.payload
    },
  },
})

export const getModal = (state) => state.finance.modal
export const getWithdrawModal = (state) => state.finance.withdrawModal
export const getLoadingBanks = (state) => state.finance.loadingBanks
export const getFailure = (state) => state.finance.failure
export const getBanks = (state) => state.finance.banks
export const getValidatedAccount = (state) => state.finance.validatedAccount
export const getSavedBankDetails = (state) => state.finance.savedBankDetails
export const getAccountBalance = (state) => state.finance.accountBalance
export const getWithdrawalErrors = (state) => state.finance.withdrawalErrors
export const getAddBankErrors = (state) => state.finance.addBankErrors

export const {
  setModal,
  setLoadingBanks,
  setBanks,
  setFailure,
  setValidatedAccount,
  setSavedBankDetails,
  setAccountBalance,
  setWithdrawalErrors,
  setAddBankErrors,
  setWithdrawModal,
} = financeSlice.actions
export default financeSlice.reducer
