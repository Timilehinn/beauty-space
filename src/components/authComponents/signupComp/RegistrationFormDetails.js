'use client'

import clsx from 'clsx'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { IoCameraReverseOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'
import * as Yup from 'yup'

import {
  getInterest,
  getIsOauthObj,
  getSignUpBody,
  getSignUpWorkspace,
  getSignupEmail,
  getSignupPassword,
} from '../../../redux/authRelated'
import { getImgUpload, setImgUpload } from '../../../redux/profileUpdateSlice'
import { TextField } from '../../loginComp/TextField'

import BookingAutoComplete from '../../search/auto_complete_places'

const servicesArray = [
  'Spa',
  'Barbering',
  'Makeup studio',
  'Hair',
  'Tattoo and Piercing',
  'Skincare Clinic',
]

export default function RegistrationFormDetails({ next, prev, setRegPayload }) {
  const router = useRouter()
  const cookies = new Cookies()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState([])
  const [address, setAddress] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])

  const signUpBody = useSelector(getSignUpBody)
  const isOauthObj = useSelector(getIsOauthObj)
  const signupEmail = useSelector(getSignupEmail)
  const accountType = useSelector(getSignUpWorkspace)
  const imgUpload = useSelector(getImgUpload)
  const signupPassword = useSelector(getSignupPassword)
  const signupInterest = useSelector(getInterest)

  useEffect(() => {
    const storedFormData = JSON.parse(
      localStorage.getItem('profileFormDetails')
    )
    if (storedFormData) {
      setServices(storedFormData.selectedServices || [])
      setAddress(storedFormData.address || null)
    }

    const storedPhoto = localStorage.getItem('photo')
    if (storedPhoto) {
      dispatch(setImgUpload(storedPhoto))
    }
  }, [])

  const handleServiceToggle = (service) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(service)
        ? prevSelected.filter((s) => s !== service)
        : [...prevSelected, service]
    )
  }

  const onImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const fileReader = new FileReader()

    fileReader.onload = (e) => {
      localStorage.setItem('photo', e.target.result)
    }

    fileReader.onerror = (error) => {
      console.error('Error reading file:', error)
    }

    fileReader.readAsDataURL(file)

    const imageUrl = URL.createObjectURL(file)
    dispatch(setImgUpload(imageUrl))

    return () => URL.revokeObjectURL(imageUrl)
  }

  const getInitials = (email) => {
    if (!email) return ''
    return email.charAt(0).toUpperCase()
  }

  const initial = getInitials(signupEmail)

  const validate =
    isOauthObj?.usingSocial === false
      ? Yup.object().shape({
          first_name: Yup.string()
            .notOneOf(
              ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              'Numbers are not allowed'
            )
            .min(3, 'Minimum of 3 characters')
            .max(15, 'Must be 15 characters or less')
            .required('Enter your firstname'),
          last_name: Yup.string()
            .notOneOf(
              ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              'Numbers are not allowed'
            )
            .min(3, 'Minimum of 3 characters')
            .max(20, 'Must be 20 characters or less')
            .required('Enter your last name'),
          gender: Yup.string().required('Select a gender'),
          business_name: Yup.string()
            .notOneOf(
              ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              'Numbers are not allowed'
            )
            .min(3, 'Minimum of 3 characters')
            .max(20, 'Must be 20 characters or less')
            .required('Please enter your business name'),
          state: Yup.string()
            .notOneOf(
              ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              'Numbers are not allowed'
            )
            .min(3, 'Minimum of 3 characters')
            .max(20, 'Must be 20 characters or less')
            .required('Please enter your state'),
          city: Yup.string()
            .notOneOf(
              ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
              'Numbers are not allowed'
            )
            .min(3, 'Minimum of 3 characters')
            .max(20, 'Must be 20 characters or less')
            .required('Please enter your city'),
        })
      : null

  const submitFormForReg = async (values) => {
    const formData = {
      ...values,
      selectedServices,
      address,
    }

    // Check if gender is not selected
    if (!values.gender) {
      toast.error('Please select a gender.')
      return
    }

    try {
      let body = {
        stacks: [],
        profile_url: imgUpload,
        email: signupEmail,
        password: signupPassword,
        address: address,
        account_type: accountType,
        services: selectedServices,
        ...values,
      }

      if (accountType === 'User') {
        body = { ...body, interest: signupInterest }
      }
      setRegPayload({ payload: body, formData })
      next()
      return

      // setLoading(true)

      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'content-type': 'application/json',
      //     },
      //     body: JSON.stringify(body),
      //   }
      // )
      // const data = await res.json()

      // if (data?.status !== true) {
      //   localStorage.setItem('profileFormDetails', JSON.stringify(formData))
      //   const errorMessages = Object.values(data.errors).flat()
      //   setMessage(errorMessages)
      // } else {
      //   localStorage.removeItem('profileFormDetails')
      //   localStorage.removeItem('interest')
      //   localStorage.removeItem('accountType')
      //   localStorage.removeItem('photo')
      //   cookies.remove('user_token', { path: '/' })

      //   cookies.set('user_token', data?.data?.token, {
      //     path: '/',
      //     maxAge: 2600000,
      //     sameSite: 'none',
      //     secure: true,
      //   })

      //   toast.success('Account created successfully.')
      //   router.push('/dashboard')
      // }
    } catch (err) {
      toast.error('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='bg-dashgrey w-full h-screen flex flex-col justify-center items-center'>
      <Formik
        initialValues={{
          first_name: '',
          last_name: '',
          business_name: '',
          state: '',
          city: '',
          gender: '',
          referral_code: '',
        }}
        validationSchema={validate}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // if (isOauthObj?.usingSocial === true) {
          //   dispatch(setSignUpBody(values))
          //   setSubmitting(true)
          //   setTimeout(() => {
          //     resetForm()
          //     setSubmitting(false)
          //   }, 500)
          //   return
          // }

          submitFormForReg(values, next, setSubmitting, resetForm)
        }}
      >
        <Form className='bg-white p-5 rounded-md shadow-2fl w-full h-screen lg:w-[45%] lg:h-[80%] overflow-y-auto scrollbar-hide flex flex-col justify-start items-start gap-8'>
          <div className='flex justify-between items-center w-full'>
            <h1 className='text-xl'>BeautySpace</h1>

            <div className='flex gap-5'>
              <button
                type='button'
                onClick={() => prev()}
                className='h-10 w-16 px-5 text-white bg-lightgrey rounded-3xl flex justify-center items-center'
              >
                <FaArrowLeft />
              </button>
              <button
                type='submit'
                className='h-10 w-16 px-5 text-white bg-purple rounded-3xl flex justify-center items-center'
              >
                <FaArrowRight />
              </button>
            </div>
          </div>

          <h1 className='text-xl'>Create your profile</h1>

          <div className='border border-dashgrey rounded-md flex flex-col gap-5 w-full p-5'>
            <div className='flex flex-col justify-start items-start gap-3 relative w-20 '>
              {imgUpload ? (
                <Image
                  src={imgUpload}
                  className='w-20 h-20 object-cover object-top rounded-full'
                  alt='profile picture'
                  width={70}
                  height={70}
                />
              ) : (
                <div className='w-20 h-20 bg-lightgreen flex items-center justify-center rounded-full'>
                  <span className='text-4xl font-semibold text-black'>
                    {initial}
                  </span>
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

            <div className='flex flex-col gap-2'>
              <h4 className='font-semibold'>Email</h4>
              <span className='text-base'>{signupEmail && signupEmail}</span>
            </div>

            <div className='flex flex-col gap-8 w-full'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                <TextField
                  type='text'
                  name='first_name'
                  label={`firstname`}
                  placeholder='Jane'
                  className='h-12 w-full border border-lightgrey focus:border-primary outline-none indent-4 rounded-full'
                />
                <TextField
                  type='text'
                  name='last_name'
                  label={`lastname`}
                  placeholder='Doe'
                  className='h-12 w-full border border-lightgrey focus:border-primary outline-none indent-4 rounded-full'
                />
              </div>

              <div className='grid grid-cols-1 w-full lg:grid-cols-2 gap-5'>
                <TextField
                  type='text'
                  name='business_name'
                  label={`What's your  business name`}
                  placeholder='Beauty Saloon'
                  className='h-12 w-full border border-lightgrey focus:border-primary outline-none indent-4 rounded-full'
                />

                <div className='flex flex-col justify-start items-start gap-2 w-full'>
                  <label htmlFor='gender' className='font-medium'>
                    Gender
                  </label>
                  <Field
                    as='select'
                    name='gender'
                    className='border border-lightgrey rounded-full px-2 w-full h-12 outline-none focus:border-primary'
                  >
                    <option value=''>Select a gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                  </Field>

                  <ErrorMessage
                    component='span'
                    name='gender'
                    className='text-danger text-sm'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-5 w-full'>
                <div className='flex flex-col gap-3 w-full relative'>
                  <label htmlFor='address'>
                    {t(`Where's your business located`)}
                  </label>
                  <BookingAutoComplete
                    setAddressPicked={setAddress}
                    noAbsoulte='absolute'
                    placeholder='No 20, Idowu Kolade street'
                    extraInputStyling={true}
                  />
                </div>

                <div className='grid grid-cols-1 w-full lg:grid-cols-2 gap-5'>
                  <TextField
                    type='text'
                    name='state'
                    placeholder='State'
                    className='h-12 w-full border border-lightgrey focus:border-primary outline-none indent-4 rounded-full'
                  />
                  <TextField
                    type='text'
                    name='city'
                    placeholder='City'
                    className='h-12 w-full border border-lightgrey focus:border-primary outline-none indent-4 rounded-full'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-5 w-full'>
                <label htmlFor='services'>
                  {t(`What services do your business offer?`)}
                </label>
                <div className='flex justify-start items-start gap-5 flex-wrap'>
                  {servicesArray.map((item, index) => {
                    const isSelected = selectedServices.includes(item)
                    return (
                      <button
                        type='button'
                        key={index}
                        onClick={() => handleServiceToggle(item)}
                        className={clsx(
                          'h-10 px-5 rounded-3xl border',
                          isSelected
                            ? 'bg-purple text-white ring-purple'
                            : 'border-lightgrey'
                        )}
                      >
                        {item}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className='flex flex-col justify-start items-start gap-2 w-full'>
                <label htmlFor='referral_code'>
                  {`Referral Code (optional):`}{' '}
                </label>
                <TextField
                  type='text'
                  name='referral_code'
                  placeholder='referral_code'
                  className='h-12 w-full border border-lightgrey focus:border-primary outline-none indent-4 rounded-full'
                />
              </div>

              {message.length > 0 && (
                <ul className='flex flex-col justify-start items-start gap-3 list-disc text-purple'>
                  {message.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Form>
      </Formik>
    </main>
  )
}
