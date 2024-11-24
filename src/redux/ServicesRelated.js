import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  images: [],
  serviceName: '',
  categoryName: '',
  servicePrice: 100,
  serviceDuration: 1,
  homeServicePrice: 0,
  hasHomeService: false,
  typeImages: {
    uri1: '',
    uri2: '',
    uri3: '',
    uri4: '',
  },
  idToEdit: null,
  loading: false,
  errMessage: null,
  display: 'service',
  suggestions: [],
  availableGroups: [],
  isModalOpen: false,
  typeModal: false,
  type: 'Minutes',
}

export const CreateServiceSlice = createSlice({
  name: 'create services',
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload
    },
    setImages(state, action) {
      state.images = action.payload
    },
    setServiceName(state, action) {
      state.serviceName = action.payload
    },
    setCategoryName(state, action) {
      state.categoryName = action.payload
    },
    setServicePrice(state, action) {
      state.servicePrice = action.payload
    },
    setServiceDuration(state, action) {
      state.serviceDuration = action.payload
    },
    setHomeServicePrice(state, action) {
      state.homeServicePrice = action.payload
    },
    setHasHomeService(state, action) {
      state.hasHomeService = action.payload
    },
    setTypeImages(state, action) {
      state.typeImages = action.payload
    },
    setIdToEdit(state, action) {
      state.idToEdit = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setErrMessage(state, action) {
      state.errMessage = action.payload
    },
    setDisplay(state, action) {
      state.display = action.payload
    },
    setSuggestions(state, action) {
      state.suggestions = action.payload
    },
    setAvailableGroups(state, action) {
      state.availableGroups = action.payload
    },
    setIsModalOpen(state, action) {
      state.isModalOpen = action.payload
    },
    setTypeModal(state, action) {
      state.typeModal = action.payload
    },
    setType(state, action) {
      state.type = action.payload
    },
  },
})

// Selectors
export const getItems = (state) => state.services.items
export const getImages = (state) => state.services.images
export const getServiceName = (state) => state.services.serviceName
export const getCategoryName = (state) => state.services.categoryName
export const getServicePrice = (state) => state.services.servicePrice
export const getServiceDuration = (state) => state.services.serviceDuration
export const getHomeServicePrice = (state) => state.services.homeServicePrice
export const getHasHomeService = (state) => state.services.hasHomeService
export const getTypeImages = (state) => state.services.typeImages
export const getIdToEdit = (state) => state.services.idToEdit
export const getLoading = (state) => state.services.loading
export const getErrMessage = (state) => state.services.errMessage
export const getDisplay = (state) => state.services.display
export const getSuggestions = (state) => state.services.suggestions
export const getAvailableGroups = (state) => state.services.availableGroups
export const getIsModalOpen = (state) => state.services.isModalOpen
export const getTypeModal = (state) => state.services.typeModal
export const getType = (state) => state.services.type

export const {
  setItems,
  setImages,
  setServiceName,
  setCategoryName,
  setServicePrice,
  setServiceDuration,
  setHomeServicePrice,
  setHasHomeService,
  setTypeImages,
  setIdToEdit,
  setLoading,
  setErrMessage,
  setDisplay,
  setSuggestions,
  setAvailableGroups,
  setIsModalOpen,
  setType,
  setTypeModal,
} = CreateServiceSlice.actions
export default CreateServiceSlice.reducer
