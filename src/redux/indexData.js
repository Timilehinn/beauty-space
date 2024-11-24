import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  indexPageData: [],
  forBusinessData: [],
  aboutContent: [],
  teamContent: [],
  privacypolicyContent: [],
  selectedTabs: 'User Guidelines',
  cancelationContent: [],
  legalContent: [],
  assistanceContent: [],
  faqContent: [],
  activeQuestion: null,
  blogContent: [],
  blogDetailsContent: [],
  loginContent: [],
  pricingContent: [],
}

export const contentfulDataSlice = createSlice({
  name: 'index',
  initialState,
  reducers: {
    setIndexPageData: (state, action) => {
      state.indexPageData = action.payload
    },
    setForBusinessData: (state, action) => {
      state.forBusinessData = action.payload
    },
    setAboutContent: (state, action) => {
      state.aboutContent = action.payload
    },
    setTeamContent: (state, action) => {
      state.teamContent = action.payload
    },
    setPrivacyPolicyContent: (state, action) => {
      state.privacypolicyContent = action.payload
    },
    setSelectedTabs: (state, action) => {
      state.selectedTabs = action.payload
    },
    setLegalContent: (state, action) => {
      state.legalContent = action.payload
    },
    setAssistanceContent: (state, action) => {
      state.assistanceContent = action.payload
    },
    setCancelationContent: (state, action) => {
      state.cancelationContent = action.payload
    },
    setFaqContent: (state, action) => {
      state.faqContent = action.payload
    },
    setActiveQuestion: (state, action) => {
      state.activeQuestion = action.payload
    },
    setBlogContent: (state, action) => {
      state.blogContent = action.payload
    },
    setBlogDetailsContent: (state, action) => {
      state.blogDetailsContent = action.payload
    },
    setLoginContent: (state, action) => {
      state.loginContent = action.payload
    },
    setPricingContent: (state, action) => {
      state.pricingContent = action.payload
    },
  },
})

export const getIndexPageData = (state) => state.indexdata.indexPageData
export const getForBusinessData = (state) => state.indexdata.forBusinessData
export const getAboutContent = (state) => state.indexdata.aboutContent
export const getTeamContent = (state) => state.indexdata.teamContent
export const getPrivacyPolicyContent = (state) =>
  state.indexdata.privacypolicyContent
export const getSelectedTabs = (state) => state.indexdata.selectedTabs
export const getLegalContent = (state) => state.indexdata.legalContent
export const getAssistanceContent = (state) => state.indexdata.assistanceContent
export const getCancelationContent = (state) =>
  state.indexdata.cancelationContent
export const getFaqContent = (state) => state.indexdata.faqContent
export const getActiveQuestion = (state) => state.indexdata.activeQuestion
export const getBlogContent = (state) => state.indexdata.blogContent
export const getBlogDetailsContent = (state) =>
  state.indexdata.blogDetailsContent
export const getLoginContent = (state) => state.indexdata.loginContent
export const getPricingContent = (state) => state.indexdata.pricingContent

export const {
  setIndexPageData,
  setForBusinessData,
  setAboutContent,
  setTeamContent,
  setPrivacyPolicyContent,
  setSelectedTabs,
  setAssistanceContent,
  setCancelationContent,
  setLegalContent,
  setFaqContent,
  setActiveQuestion,
  setBlogContent,
  setBlogDetailsContent,
  setLoginContent,
  setPricingContent,
} = contentfulDataSlice.actions
export default contentfulDataSlice.reducer
