'use client'

import clsx from 'clsx'
import { Field, Form, Formik } from 'formik'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-number-input/input'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { IoCameraReverseOutline } from 'react-icons/io5'
import { 
  getImgUpload,
  getTextState,
  setImgUpload,
  setTextState
 } from '../../../redux/profileUpdateSlice'
import { usePermissions } from '../../../hooks/usePermission'
import { getUserInfo, setUsers } from '../../../redux/admin_user'
import { getAppToken } from '../../../utils'
import { useClient } from '../../../providers/clientContext'

import 'react-phone-number-input/style.css'
import './addOn.scss'

const accountTypeUsers = ['User', 'Owner', 'Admin']

export default function UsersDetails() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const router = useRouter()
  const token = getAppToken()
  const { client } = useClient()
  const { hasPermission } = usePermissions()

  const [errorMsg, setErrorMsg] = useState([])

  const genderOption = ['Select gender', 'Male', 'Female']

  const userData = useSelector(getUserInfo)
  const textState = useSelector(getTextState)
  const imgUpload = useSelector(getImgUpload)

  const [user, setUser] = useState(userData)
  const [dateOfBirth, setDateOfBirth] = useState('')

  useEffect(() => {
    setUser(userData)
    if (userData.date_of_birth) {
      setDateOfBirth(new Date(userData.date_of_birth))
    } else {
      setDateOfBirth('')
    }
  }, [userData])

  /**
   * The `onImageChange` function reads an image file, stores it in localStorage, and dispatches an
   * action with the image URL.
   * @param e - The parameter `e` in the `onImageChange` function is an event object that is passed when
   * an image input field's value changes. It contains information about the event, such as the target
   * element that triggered the event and the files that were selected.
   */
  const onImageChange = (e) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(e.target.files[0])

    fileReader.onload = (e) => {
      localStorage.setItem('photo', e.target.result.toLocaleString())
    }

    dispatch(setImgUpload(URL.createObjectURL(e.target.files[0])))
  }

  const handleProfileUpdate = (e, incomingType) => {
    if (incomingType === 'first_name') {
      setUser({ ...user, first_name: e.target.value })
      const newdata = { ...textState, first_name: e.target.value }
      dispatch(setTextState(newdata))
      return
    }

    if (incomingType === 'last_name') {
      setUser({ ...user, last_name: e.target.value })
      const newdata = { ...textState, last_name: e.target.value }
      dispatch(setTextState(newdata))
      return
    }

    if (incomingType === 'gender') {
      setUser({ ...user, gender: e.target.value })
      const newdata = { ...textState, gender: e.target.value }
      dispatch(setTextState(newdata))
      return
    }

    if (incomingType === 'date_of_birth') {
      setUser({ ...user, date_of_birth: e })
      const newdata = { ...textState, date_of_birth: e }
      dispatch(setTextState(newdata))
      return
    }

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

    if (incomingType === 'email') {
      setUser({ ...user, email: e.target.value })
      const newdata = { ...textState, email: e.target.value }
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

  /**
   * The function `handleDateChange` takes a selected date input, validates the age based on the selected
   * date, and updates the user's date of birth accordingly.
   * @param e - The parameter `e` in the `handleDateChange` function is typically an event object that is
   * passed when the date input field triggers a change event. This event object contains information
   * about the event that occurred, such as the target element (in this case, the date input field) and
   * the new
   * @returns The function `handleDateChange` returns different values based on certain conditions:
   */
  const handleDateChange = (e) => {
    const selectedDate = e.target.value // Get the selected date string

    if (!selectedDate) {
      // If the date is null or empty, clear the user's date of birth
      setUsers({ ...user, date_of_birth: null })
      const newdata = { ...textState, date_of_birth: null }
      dispatch(setTextState(newdata))
      return
    }

    const presentYear = new Date().getFullYear()
    const pickedYear = new Date(selectedDate).getFullYear()
    const age = presentYear - pickedYear

    if (age < 14) {
      toast.error('Only 14 years and above are eligible.')
      return
    }

    const formattedDate = new Date(selectedDate)
    setUser({ ...user, date_of_birth: formattedDate.toISOString() })
    const newdata = {
      ...textState,
      date_of_birth: formattedDate.toISOString(),
    }
    dispatch(setTextState(newdata))
    setDateOfBirth(formattedDate)
  }

  const updateProfile = async (e) => {
    e.preventDefault()

    // const token = cookies.get('user_token')

    // if (!token) {
    //   return
    // }

    // Retrieve the photo value from localStorage
    const photoFromLocalStorage = localStorage.getItem('photo')

    const outGoingData = {
      first_name: user?.first_name,
      last_name: user?.last_name,
      address: user?.address,
      phone_number: user?.phone_number,
      email: user?.email,
      ...(user.date_of_birth && {
        date_of_birth: moment(user.date_of_birth).format('YYYY-MM-DD'),
      }),
      language: user?.language,
      city: user?.city,
      interest: user?.interest,
      gender: user?.gender,
      country: user?.country,
      photo: photoFromLocalStorage || user.photo || imgUpload, // Use localStorage value if available
      timezone: user?.timezone,
      company: user?.company,
      position: user?.position,
      account_type: user?.account_type[0]?.user_type?.type,
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

  const getInitials = (email) => {
    if (!email) return ''
    return email.charAt(0).toUpperCase()
  }

  const initial = getInitials(user?.first_name)

  const initializeUser = () => {
    try {
      client?.initializeUser({
        uid: userData.id.toString(),
        username: userData?.first_name || 'No name',
        firstname: userData?.first_name,
        lastname: userData?.last_name,
        profileUrl: userData?.profile_url,
      })
    } catch (error) {}
  }

  useEffect(() => {
    if (client && userData) {
      initializeUser()
    }
  }, [userData, client, token])

  return (
    <main className='flex flex-col justify-start items-start gap-10 xxl:w-[60%] xl:w-[60%] lg:w-full md:w-full sm:w-full '>
      <header className='flex justify-between items-center  w-full'>
        <p className='font-medium'>{t('Personal Information')}</p>
        <button
          type='submit'
          disabled={!hasPermission('users:update')}
          onClick={updateProfile}
          className={clsx(
            'px-5 h-12 rounded-full text-white ring-2 ring-gray',
            hasPermission('users:update') ? 'bg-primary' : 'bg-lightgrey'
          )}
        >
          {t('Update')}
        </button>
      </header>

      <section className='flex flex-col justify-start items-start gap-5 w-full border border-gray rounded-md p-5'>
        <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
          <p className=''>Your photo</p>
          <div className='flex flex-col justify-start items-start gap-3 relative w-20'>
            {imgUpload || user?.profile_url ? (
              <Image
                src={imgUpload || user?.profile_url}
                className='w-20 h-20 object-cover object-top rounded-full '
                alt={
                  user?.first_name + ' ' + user?.last_name + ' profile photo'
                }
                width={70}
                height={70}
              />
            ) : (
              <div className='w-20 h-20 object-cover object-top rounded-full flex justify-center items-center bg-primary text-4xl text-white'>
                {initial}
              </div>
            )}

            <input
              type='file'
              id='file-input'
              onChange={onImageChange}
              className='hidden'
            />
            <label
              htmlFor='file-input'
              className='cursor-pointer absolute bottom-1 right-1 bg-white rounded-full w-7 h-7 flex justify-center items-center shadow-2fl hover:border hover:border-primary'
            >
              <IoCameraReverseOutline className='text-xl' />
            </label>
          </div>
        </div>

        <hr className='w-full border-gray' />

        <Formik>
          <Form className='flex flex-col justify-start items-start gap-5 w-full'>
            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
              <label htmlFor='first_name'>{t('First Name')}</label>
              <Field
                type='text'
                name='first_name'
                placeholder='Eleanor Pena'
                className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
                value={user?.first_name || ''}
                onChange={(e) => handleProfileUpdate(e, 'first_name')}
              />
            </div>
            <hr className='w-full border-gray' />
            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
              <label htmlFor='last_name'>{'Last Name'}</label>
              <Field
                type='text'
                name='last_name'
                placeholder='EI'
                className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
                value={user?.last_name || ''}
                onChange={(e) => handleProfileUpdate(e, 'last_name')}
              />
            </div>
            <hr className='w-full border-gray' />
            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full '>
              <label htmlFor='email'>{t('Email')}</label>
              <Field
                type='email'
                name='email'
                placeholder='sara.cruz@examples.com'
                className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
                value={user?.email}
                onChange={(e) => handleProfileUpdate(e, 'email')}
              />
            </div>
            <hr className='w-full border-gray' />
            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
              <label htmlFor='gender'>{'Gender'}</label>
              <Field
                as='select'
                name='gender'
                value={user?.gender || ''}
                onChange={(e) => handleProfileUpdate(e, 'gender')}
                className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
              >
                {genderOption.map((data, key) => {
                  return (
                    <option key={key} value={data}>
                      {' '}
                      {data}{' '}
                    </option>
                  )
                })}
              </Field>
            </div>
            <hr className='w-full border-gray' />
            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
              <label htmlFor='date_of_birth'>{t('Date of Birth')}</label>

              <input
                type='date'
                name='date_of_birth'
                value={
                  dateOfBirth ? dateOfBirth.toLocaleDateString('en-CA') : ''
                }
                onChange={handleDateChange}
                className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
              />
            </div>

            <hr className='w-full border-gray' />

            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full '>
              <label htmlFor='PhoneNumber '>{t('Phone Number')}</label>

              <PhoneInput
                className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
                country='NG'
                defaultCountry='NG'
                placeholder='Enter phone number'
                value={user?.phone_number}
                onChange={(e) => handleProfileUpdate(e, 'phone_number')}
              />
            </div>

            <hr className='w-full border-gray' />

            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full '>
              <label htmlFor='Address'>{t('Address')}</label>

              <div className='flex flex-col justify-start items-start gap-5 w-full'>
                <Field
                  type='text'
                  name='address'
                  placeholder='2118 Thornridge Cir.sy'
                  className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
                  value={user?.address}
                  onChange={(e) => handleProfileUpdate(e, 'address')}
                />
                <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
                  <Field
                    type='text'
                    name='city'
                    placeholder='Lagos'
                    className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
                    value={user?.city}
                    onChange={(e) => handleProfileUpdate(e, 'city')}
                  />
                  <Field
                    type='text'
                    name='state'
                    placeholder='Lagos...'
                    className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
                    value={user?.state}
                    onChange={(e) => handleProfileUpdate(e, 'state')}
                  />
                </div>

                <div className='flex flex-col justify-start items-start gap-5 w-full'>
                  <Field
                    type='text'
                    name='country'
                    placeholder='Nigeria'
                    className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
                    value={user?.country}
                    onChange={(e) => handleProfileUpdate(e, 'country')}
                  />
                </div>
              </div>
            </div>

            <hr className='w-full border-gray' />

            <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full '>
              <label>{t('Account Type')} </label>
              <Field
                as='select'
                name='account_type'
                value={user?.account_type[0]?.user_type?.type}
                onChange={(e) => handleProfileUpdate(e, 'account_type')}
                className='h-12 border border-gray focus:border-lightgrey w-full outline-none rounded-md indent-2'
              >
                {accountTypeUsers.map((type, key) => (
                  <option value={type} key={key}>
                    {type}
                  </option>
                ))}
              </Field>
            </div>

            {!errorMsg.length === 0 &&
              Object.entries(errorMsg).map((err, key) => {
                return (
                  <ul className='px-5 pb-2'>
                    <li className='text-danger font-medium'>
                      {' '}
                      {err[0]}: {err[1]}{' '}
                    </li>
                  </ul>
                )
              })}
          </Form>
        </Formik>
      </section>
    </main>
  )
}
