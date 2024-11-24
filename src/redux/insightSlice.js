import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  transactionsDetails: [],
  totalAmount: 0,
  reviewsData: [],
  mostVisited: [],
  chartData: [],
  currentChart: [],
  totalTransactions: 0,
  totalReviews: 0,
  totalRatings: 0,
  monthlyReport: [],
  yearlyReport: [],
}

export const insightSlice = createSlice({
  name: 'insight',
  initialState,
  reducers: {
    setTransactionDetails: (state, action) => {
      state.transactionsDetails = action.payload
    },
    setTotalAmount: (state, action) => {
      state.totalAmount = action.payload
    },
    setReviewsData: (state, action) => {
      state.reviewsData = action.payload
    },
    setMostVisited: (state, action) => {
      state.mostVisited = action.payload
    },
    setChartData: (state, action) => {
      state.chartData = action.payload
    },
    setCurrentChart: (state, action) => {
      state.currentChart = action.payload
    },
    setTotalTransactions: (state, action) => {
      state.totalTransactions = action.payload
    },
    setTotalReviews: (state, action) => {
      state.totalReviews = action.payload
    },
    setTotalRatings: (state, action) => {
      state.totalRatings = action.payload
    },
    setMonthlyReport: (state, action) => {
      state.monthlyReport = action.payload
    },
    setYearlyReport: (state, action) => {
      state.yearlyReport = action.payload
    },
  },
})

export const getTotalTransactions = (state) => state.insight.totalTransactions
export const getTransactions = (state) => state.insight.transactionsDetails
export const getCurrentChart = (state) => state.insight.currentChart
export const getReviewsData = (state) => state.insight.reviewsData
export const getTotalAmount = (state) => state.insight.totalAmount
export const getMostVisited = (state) => state.insight.mostVisited
export const getChartData = (state) => state.insight.chartData
export const getTotalRatings = (state) => state.insight.totalRatings
export const getTotalReviews = (state) => state.insight.totalReviews
export const getMonthlyReport = (state) => state.insight.monthlyReport
export const getYearlyReport = (state) => state.insight.yearlyReport

export const {
  setTransactionDetails,
  setTotalAmount,
  setReviewsData,
  setMostVisited,
  setChartData,
  setCurrentChart,
  setTotalTransactions,
  setTotalRatings,
  setTotalReviews,
  setMonthlyReport,
  setYearlyReport,
} = insightSlice.actions
export default insightSlice.reducer
