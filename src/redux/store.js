import { combineReducers, configureStore } from '@reduxjs/toolkit'

import admin_user from './admin_user'
import surveySlice from './BookingSurvey'
import insightSlice from './insightSlice'
import bookingSlice from './bookingSlice'
import financeSlice from './financeSlice'
import particulesSlice from './particules'
import bookingSearch from './search_bookin'
import authRelatedSlice from './authRelated'
import contentfulDataSlice from './indexData'
import workspaceSlice from './workspaceSlice'
import filterOptionSlice from './filterOptions'
import userReducerSlice from './userReducerSlice'
import userBookingsSlice from './userBookingsSlice'
import dashboard_related from './dashboard_related'
import accountRestorerSlice from './accountRestorer'
import profileUpdateSlice from './profileUpdateSlice'
import createWorkspaceSlice from './createWorkspaceSlice'
import accountActivitiesSlice from './accountActivitiesSlice'
import ServicesRelated from './ServicesRelated'
import settingsMarketing from './settingsMarketing'

const reducer = combineReducers({
  authrelated: authRelatedSlice,
  filteroptions: filterOptionSlice,
  particules: particulesSlice,
  profileUpdate: profileUpdateSlice,
  insight: insightSlice,
  userBookings: userBookingsSlice,
  accountRestorer: accountRestorerSlice,
  workspaces: workspaceSlice,
  createWorkspace: createWorkspaceSlice,
  survey: surveySlice,
  currentUser: userReducerSlice,
  adminPeople: admin_user,
  searchBookin: bookingSearch,
  activity: accountActivitiesSlice,
  finance: financeSlice,
  indexdata: contentfulDataSlice,
  dashboard: dashboard_related,
  booking: bookingSlice,
  services: ServicesRelated,
  marketingDiscounts: settingsMarketing,
})

export const makeStore = () =>
  configureStore({
    reducer: reducer,
    devTools: true,
  })
