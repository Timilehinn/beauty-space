'use client'

import { Form, Formik } from 'formik'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BsEyeSlash } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import BgImage from '../../../assets/beauty-portrait1.jpg'
import {
  getIsOauthObj,
  setIsOauthObj,
  setSignUpBody,
  setSignupEmail,
  setSignupPassword,
} from '../../../redux/authRelated'
import { TextField } from '../../loginComp/TextField'

import { getLoginContent } from '../../../redux/indexData'

const validate = Yup.object().shape({
  email: Yup.string()
    .email('Your email is incorrect. Check and re-enter a correct email.')
    .required('Email address is required'),
  password: Yup.string().required('Password is required'),
})

export default function RegisterEmail({ next }) {
  const dispatch = useDispatch()
  const isOauthObj = useSelector(getIsOauthObj)
  const loginContent = useSelector(getLoginContent)

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isOauthSigned, setIsOauthSigned] = useState({
    email: '',
    provider: '',
    providerId: '',
    usingSocial: false,
  })
  const [message, setMessage] = useState('')

  const isRegisteringViaSocial = () => {
    if (isOauthSigned?.usingSocial === true) {
      if (isOauthSigned?.provider === 'google') {
        return
      } else if (isOauthSigned?.provider === 'github') {
        dispatch(setIsOauthObj(isOauthSigned))
      }
    }
  }

  useEffect(() => {
    isRegisteringViaSocial()
    if (isOauthSigned?.provider === 'github') {
      toast.warn(
        "Hi, we still need you to fill up the your email below and continue. Don't worry, you will be able to signin with just github."
      )
    }
  }, [isOauthSigned])

  const checkIfCanContinueWithEmail = async (email) => {
    setLoading(true)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/email/verify`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    )
    const data = await response.json()

    setLoading(false)

    if (data.status === true) {
      dispatch(setSignupEmail(email))
      return { status: true, message: '' }
    }

    let message = data?.errors?.email[0]
    toast.error(message || 'There was an issue with your')
    return { status: false, message: '' }
  }

  const checkIfCanContinueWithPassword = async (password) => {
    setLoading(true)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/signup/validatepassword`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ password }),
      }
    )
    const data = await response.json()
    setLoading(false)
    if (data.status === true) {
      dispatch(setSignupPassword(password))
      return { status: true, message: '' }
    }

    let message = data?.errors?.password[0]
    toast.error(message)
    return { status: false, message: '' }
  }

  const checks = async (values, next) => {
    setMessage('')
    const upperCaseWords = values?.password.match(/[A-Z]/g)
    const isNumberPresent = values?.password.match(/[0-9]/g)
    const lowerCaseWords = values?.password.match(/[a-z]/g)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    const isSpecialChar = specialChars.test(values?.password)

    if (!upperCaseWords) {
      toast.error('Passwords must have at least one Uppercase letter.')
      return { status: false }
    }

    if (!lowerCaseWords) {
      toast.error('Passwords must have at least one Lowercase letter.')
      return { status: false }
    }

    if (!isNumberPresent) {
      toast.error('Passwords must have at least one number.')
      return { status: false }
    }

    if (!isSpecialChar) {
      toast.error('Passwords must have at least one special character.')
      return { status: false }
    }

    if (values?.password.length < 8) {
      toast.error('Passwords must be at least 8 characters long.')
      return { status: false }
    }

    if (values.password !== values.confirmPassword) {
      toast.error('Password mismatch, check and try again.')
      return { status: false }
    }

    const passwordCheckResult = await checkIfCanContinueWithPassword(
      values.password
    )
    if (!passwordCheckResult.status) {
      return { status: false }
    }

    const emailCheckResult = await checkIfCanContinueWithEmail(values.email)
    if (!emailCheckResult.status) {
      return { status: false }
    }

    return { status: true }
  }

  return (
    <main className='flex gap-5 h-screen overflow-hidden w-full xxl:px-[10rem] xl:px-[10rem] lg:px-16 md:px-10 sm:px-5'>
      <div className='xl:w-[50%] lg:h-[90%] lg:w-[50%] md:w-full sm:w-full m-auto hidden lg:block'>
        <Image
          src={BgImage}
          width={500}
          height={500}
          alt='Beauty Image'
          className='rounded-xl object-cover object-top w-full h-full shadow-2fl'
        />
      </div>

      <main className='flex flex-col justify-center items-start gap-5 px-5 xl:w-[50%] lg:w-[50%] md:w-full sm:w-full m-auto '>
        <header className='flex flex-col justify-start items-start gap-1 leading-10 xxl:w-[65%] xl:w-[65%] lg:w-[90%] md:w-[70%] sm:w-full '>
          <h1 className='font-semibold text-black xxl:text-4xl xl:text-4xl lg:text-2xl md:text-3xl sm:text-2xl '>
            {loginContent?.item?.fields?.title}{' '}
            <span className='text-lightgrey '>
              {loginContent?.item?.fields?.subTitle}
            </span>
          </h1>
          <div className='flex gap-3 w-full'>
            Already have an account?
            <Link href='/' className='text-purple font-semibold'>
              Login
            </Link>
          </div>
        </header>

        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validate}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const result = await checks(values, next)
            if (result.status === true) {
              dispatch(setSignUpBody(values))
              setSubmitting(true)
              setTimeout(() => {
                resetForm()
                setSubmitting(false)
                next(values) // Proceed to the next step
              }, 500)
            } else {
              setSubmitting(false)
            }
          }}
        >
          <Form className='flex flex-col justify-center items-center gap-5 w-full'>
            <TextField
              name='email'
              type='email'
              placeholder='Enter email address'
              className='rounded-full border border-lightgrey w-full h-14 indent-4 focus:border-primary outline-none'
            />
            <div className='flex justify-start items-center gap-5 w-full relative lg:flex-row md:flex-row sm:flex-col '>
              <TextField
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Create password'
                className='rounded-full border border-lightgrey w-full h-14 indent-4 focus:border-primary outline-none'
              />

              <TextField
                type={showPassword ? 'text' : 'password'}
                name='confirmPassword'
                placeholder='Confirm password'
                className='rounded-full border border-lightgrey w-full h-14 indent-4 focus:border-primary outline-none'
              />

              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute top-7 right-4'
              >
                <BsEyeSlash />
              </button>
            </div>

            <button
              type='submit'
              className='capitalize rounded-full h-14 bg-lightgrey text-white hover:bg-purple w-full '
            >
              {loading ? 'Checking...' : 'Create account'}
            </button>
          </Form>
        </Formik>
      </main>
    </main>
  )
}
