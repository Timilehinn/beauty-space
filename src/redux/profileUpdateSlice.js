import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  textState: {
    id: '1',
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    gender: '',
    date_of_birth: '',
    language: '',
    interest: '',
    phone_number: '',
    account_type: '',
    role: '',
    position: '',
    stacks: '',
    github: '',
    company: '',
    photo: '',
    new_password: '',
    old_password: '',
  },

  passwordChange: {
    new_password: '',
    old_password: '',
  },
  imgUpload: null,
  businessLogo: null,
}

export const profileUpdateSlice = createSlice({
  name: 'profileUpdate',
  initialState,
  reducers: {
    setTextState: (state, action) => {
      state.textState = action.payload
    },
    setPasswordChange: (state, action) => {
      state.signUpBody = action.payload
    },
    setImgUpload: (state, action) => {
      state.imgUpload = action.payload
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload
    },
    setBusinessLogo: (state, action) => {
      state.businessLogo = action.payload
    },
  },
})

export const getTextState = (state) => state.profileUpdate.textState
export const getPasswordChange = (state) => state.profileUpdate.textState
export const getImgUpload = (state) => state.profileUpdate.imgUpload
export const getPhoneNumber = (state) => state.profileUpdate.phoneNumber
export const getBusinessLogo = (state) => state.profileUpdate.businessLogo

export const {
  setTextState,
  setPasswordChange,
  setImgUpload,
  setPhoneNumber,
  setBusinessLogo,
} = profileUpdateSlice.actions
export default profileUpdateSlice.reducer
