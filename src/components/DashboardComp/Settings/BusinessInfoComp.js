'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import PhoneInput from 'react-phone-number-input'
import { useTranslation } from 'react-i18next'
import { Field, Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'
import Cookies from 'universal-cookie'
import Image from 'next/image'

import { IoCameraReverseOutline } from 'react-icons/io5'

import { getUserInfo } from '../../../redux/admin_user'
import {
  getBusinessLogo,
  getPhoneNumber,
  getTextState,
  setBusinessLogo,
  setTextState,
} from '../../../redux/profileUpdateSlice'

// import 'react-phone-number-input/style.css'
import './addOn.scss'

import MultiSelectDropdown from './MultiSelectDropdown'

const timezone = [
  'Select timezone',
  'Africa/Lagos',
  'Africa/Accra',
  'America/New_York',
]
const accountTypeSales = ['User', 'Owner', 'Sales']
const accountTypeUsers = ['User', 'Owner']

export default function BusinessInfoComp() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const cookies = new Cookies()
  const router = useRouter()

  const userData = useSelector(getUserInfo)
  const textState = useSelector(getTextState)
  const businessLogo = useSelector(getBusinessLogo)
  // const phoneNumberValue = useSelector(getPhoneNumber)

  const [user, setUser] = useState(userData)
  const [errorMsg, setErrorMsg] = useState([])
  const [selectedServices, setSelectedServices] = useState([])

  const onImageChange = (e) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(e.target.files[0])

    fileReader.onload = (e) => {
      localStorage.setItem('business logo', e.target.result.toLocaleString())
    }

    dispatch(setBusinessLogo(URL.createObjectURL(e.target.files[0])))
  }

  const handleProfileUpdate = (e, incomingType) => {
    if (incomingType === 'language') {
      setUser({ ...user, language: e.target.value })
      const newdata = { ...textState, language: e.target.value }
      dispatch(setTextState(newdata))
    }

    if (incomingType === 'interest') {
      setUser({ ...user, interest: e.target.value })
      const newdata = { ...textState, interest: e.target.value }
      dispatch(setTextState(newdata))
    }

    if (incomingType === 'phone_number') {
      setUser({ ...user, phone_number: e })
      const newdata = { ...textState, phone_number: <em></em> }
      dispatch(setTextState(newdata))
    }

    if (incomingType === 'address') {
      setUser({ ...user, address: e.target.value })
      const newdata = { ...textState, address: e.target.value }
      dispatch(setTextState(newdata))
    }

    if (incomingType === 'city') {
      setUser({ ...user, city: e.target.value })
      const newdata = { ...textState, city: e.target.value }
      dispatch(setTextState(newdata))
    }

    if (incomingType === 'state') {
      setUser({ ...user, state: e.target.value })
      const newdata = { ...textState, state: e.target.value }
      dispatch(setTextState(newdata))
    }

    if (incomingType === 'country') {
      setUser({ ...user, country: e.target.value })
      const newdata = { ...textState, country: e.target.value }
      dispatch(setTextState(newdata))
    }

    if (incomingType === 'timezone') {
      setUser({ ...user, timezone: e.target.value })
      const newdata = { ...textState, timezone: e.target.value }
      dispatch(setTextState(newdata))
    }

    if (incomingType === 'account_type') {
      // dispatch in favour of email
      // if (user.account_type !== e.target.value) setReload(true)
      setUser({ ...user, account_type: e.target.value })
      const newdata = { ...textState, account_type: e.target.value }
      dispatch(setTextState(newdata))
      return
    }

    if (incomingType === 'position') {
      setUser({ ...user, position: e.target.value })
      const newdata = { ...textState, position: e.target.value }
      dispatch(setTextState(newdata))
      return
    }

    if (incomingType === 'company') {
      setUser({ ...user, company: e.target.value })
      const newdata = { ...textState, company: e.target.value }
      dispatch(setTextState(newdata))
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()

    const token = cookies.get('user_token')

    if (!token) {
      return
    }

    // Retrieve the photo value from localStorage
    const photoFromLocalStorage = localStorage.getItem('business logo')

    const outGoingData = {
      address: user?.address,
      phone_number: user?.phone_number,
      language: user?.language,
      city: user?.city,
      interest: user?.interest,
      country: user?.country,
      photo: photoFromLocalStorage || user.business_logo || businessLogo, // Use localStorage value if available
      timezone: user?.timezone,
      company: user?.company,
      position: user?.position,
      account_type: user?.account_type,
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/${user.id}/update`,
        {
          method: 'POST',
          body: JSON.stringify(outGoingData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()

      if (data?.status === false) {
        toast.error(data.errors)
        setErrorMsg(data.errors)
      } else {
        toast.success('Updated Successfully')
        router.refresh()
      }
    } catch (error) {
      // Handle the error (e.g., show a user-friendly message)
    }
  }

  return (
    <main className='flex flex-col justify-start items-start gap-10 xxl:w-[60%] xl:w-[60%] lg:w-full md:w-full sm:w-full  '>
      <header className='flex justify-between items-center  w-full'>
        <p className='font-medium'>{t('Business Information')}</p>
        <button
          type='submit'
          // onClick={updateProfile}
          className='px-5 h-12 rounded-full bg-primary text-white ring-2 ring-gray'
        >
          {t('Update')}
        </button>
      </header>

      <section className='border border-gray rounded-md p-5 w-full flex flex-col justify-start items-start gap-5'>
        <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
          <p className=''>Your photo</p>
          <div className='flex flex-col justify-start items-start gap-3 relative w-20'>
            <Image
              src={businessLogo || user?.business_logo || '/avatar.png'}
              className='w-20 h-20 object-cover object-top rounded-full '
              alt={user?.first_name + ' ' + user?.last_name + ' profile photo'}
              width={70}
              height={70}
            />

            <input
              type='file'
              id='file-input'
              onChange={onImageChange}
              className='hidden'
            />
            <label
              htmlFor='file-input'
              className='cursor-pointer absolute bottom-1 right-1 bg-white rounded-full w-8 h-8 flex justify-center items-center shadow-2fl hover:border hover:border-primary'
            >
              <IoCameraReverseOutline className='text-xl' />
            </label>
          </div>
        </div>
        <Formik>
          <Form className='flex flex-col justify-start items-start gap-5 w-full'>
            <hr className='w-full border-gray' />
            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
              <label htmlFor='language'>{t('Business Name')}</label>
              <Field
                type='text'
                name='business_name'
                placeholder='Nextboy barber...'
                className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
                value={user?.business_name || ''}
                onChange={(e) => handleProfileUpdate(e, 'business name')}
              />
            </div>

            <hr className='w-full border-gray' />
            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full '>
              <h1>Business Services</h1>
              <MultiSelectDropdown
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
              />
            </div>
            <hr className='w-full border-gray' />

            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full '>
              <label htmlFor='timezone'>{t('Timezone')}</label>
              <Field
                as='select'
                name='timezone'
                placeholder='Timezone'
                className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
                value={user?.timezone}
                onChange={(e) => handleProfileUpdate(e, 'timezone')}
              >
                {timezone.map((country, key) => {
                  return (
                    <option value={country} key={key}>
                      {' '}
                      {country}{' '}
                    </option>
                  )
                })}
              </Field>
            </div>
          </Form>
        </Formik>
      </section>
    </main>
  )
}
