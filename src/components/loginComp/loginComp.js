'use client'

import { createClient } from 'contentful'
import { Form, Formik } from 'formik'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'universal-cookie'
import * as Yup from 'yup'

import { BsEyeSlash } from 'react-icons/bs'

import useGithubAuth from '../../hooks/useGithubAuth'
import checkForAuthentication from '../../utils/checkForAuthentication'
import VerifyCodePhoneNumber from '../authComponents/VerifyCodePhoneNumber'
import AccountActivator from './AccountActivator'
import { TextField } from './TextField'

// Redux slice
import { setAccountRestoreObject } from '../../redux/accountRestorer'
import {
  getChangedPlatform,
  getEmailBackup,
  getIdBackup,
  getInit2FA,
  setEmailBackup,
  setInit2FA,
  setToken,
} from '../../redux/authRelated'
import { getLoginContent, setLoginContent } from '../../redux/indexData'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

export default function LoginComponent() {
  const cookies = new Cookies()
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const router = useRouter()

  const idBackup = useSelector(getIdBackup)
  const emailbackup = useSelector(getEmailBackup)
  const changedPlatform = useSelector(getChangedPlatform)
  const loginContent = useSelector(getLoginContent)

  const [code, setCode] = useState(null)
  const init2FA = useSelector(getInit2FA)
  const [message, setMessage] = useState()
  const [btnMsg, setBtnMsg] = useState('Log in')
  const [passwordShown, setPasswordShown] = useState(false)
  const [isTraditional, setIstraditional] = useState(false)
  const [toast, setToast] = useState({ message: '', color: 'black' })
  const [accountActivatorPopOver, setAccountActivatorPopOver] = useState(false)

  const { token } = useGithubAuth(
    code,
    process.env.NEXT_PUBLIC_GITHUB_SECRET_KEY,
    'signin',
    setToast,
    setAccountActivatorPopOver
  )

  const [authenticated, setAuthenticated] = useState(null)

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'loginAndSignup',
        })
        dispatch(setLoginContent(res?.items[0]?.fields))
      } catch (error) {}
    }

    fetchHome()
  }, [])

  useEffect(() => {
    async function checkAuthentication() {
      if (authenticated !== 'loading') return

      try {
        const { success } = await checkForAuthentication()
        if (success) {
          setAuthenticated(true)
        } else {
          setAuthenticated(false)
        }
      } catch (error) {}
    }

    checkAuthentication()
  }, [authenticated])

  // ?brb

  const onSuccessGit = async (response, token) => {
    // ?brb
    try {
      setCode(response?.code)
    } catch (error) {}
  }

  const validate = Yup.object().shape({
    email: Yup.string()
      .email('Your email is incorrect. Check and re-enter a correct email.')
      .required('Email address is required'),
    password: Yup.string().required(
      'Your password is incorrect. Check and re-enter a correct password.'
    ),
  })

  const sendLoginRequest = async (
    email,
    password,
    setSubmitting,
    resetForm
  ) => {
    setMessage('')
    setBtnMsg('Loading...')
    try {
      setSubmitting(true)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await res.json()

      if (data?.status === false) {
        setSubmitting(false)
        if (data?.data?.reactivate) {
          let restoreObject = {
            authBy: 'EmailPassword',
            email,
            password,
          }
          dispatch(setAccountRestoreObject(restoreObject))
          setAccountActivatorPopOver(true)
          return
        }

        if (data?.data?.otp == 'sms') {
          setIstraditional(true)
          dispatch(setEmailBackup(email))
          dispatch(
            setInit2FA({
              type: 'sms',
              popup: true,
            })
          )
          return
        }

        if (data?.data?.otp == 'auth_code') {
          setIstraditional(true)
          dispatch(setEmailBackup(email))
          dispatch(
            setInit2FA({
              type: 'auth_code',
              popup: true,
            })
          )
          return
        }

        setMessage(data?.errors?.message)
        setBtnMsg('Error! Try Log in again.')
        return
      }

      setSubmitting(false)
      setBtnMsg('Success!')
      onSuccess('', data?.data?.token)
    } catch (error) {
      setSubmitting(false)
      setBtnMsg('Error occurred!')
    }
  }

  const onSuccess = (response, token) => {
    dispatch(setToken(token))

    if (response) {
      localStorage.setItem(
        'user_meta',
        JSON.stringify({
          id: userId,
          firstName: response?.first_name,
          lastName: response?.last_name,
          profileImgUrl: response?.profile_url,
          phone: response?.phone_number,
          email: response?.email,
        })
      )
    }

    // Remove any existing token before setting the new one
    cookies.remove('user_token')

    if (document.getElementById('rememberMe').checked) {
      cookies.set('user_token', token, {
        path: '/',
        maxAge: 2600000,
        sameSite: 'none',
        secure: true,
      })
    } else {
      cookies.set('user_token', token)
    }

    setTimeout(async () => {
      try {
        const redirectAfterLogin = localStorage.getItem(
          'redirectBackToCheckout'
        )

        if (redirectAfterLogin) {
          router.push(redirectAfterLogin)
          localStorage.removeItem('redirectBackToCheckout')
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error navigating:', error)
      }
    }, 2000)
  }

  return (
    <>
      {init2FA?.type === 'sms' && init2FA?.popup === true && (
        <VerifyCodePhoneNumber
          init2FA={init2FA}
          emailbackup={emailbackup}
          idBackup={idBackup}
          isTraditional={isTraditional}
        />
      )}

      {accountActivatorPopOver && (
        <AccountActivator
          setAccountActivatorPopOver={setAccountActivatorPopOver}
          onSuccess={onSuccess}
        />
      )}

      {init2FA?.type === 'auth_code' && init2FA?.popup === true && (
        <VerifyCodePhoneNumber
          init2FA={init2FA}
          emailbackup={emailbackup}
          idBackup={idBackup}
          isTraditional={isTraditional}
        />
      )}

      <section className='flex flex-col overflow-auto scrollbar-hide justify-start items-start gap-8 px-5 w-full'>
        <div className='flex flex-col gap-3 w-full'>
          <div className='flex flex-col justify-start items-start gap-2'>
            <h1 className='text-4xl text-black font-semibold w-full lg:w-[65%] md:text-3xl sm:text-2xl'>
              {loginContent?.item?.fields?.title}{' '}
              <span className='text-lightgrey'>
                {loginContent?.item?.fields?.subTitle}
              </span>
            </h1>
          </div>
          <div className='text-base flex justify-start items-start gap-3'>
            {t("Don't have an account?")}
            <Link href='/signup' className='text-purple font-semibold'>
              {t('Signup')}
            </Link>
          </div>
        </div>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validate}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            sendLoginRequest(
              values.email,
              values.password,
              setSubmitting,
              resetForm
            )
          }}
        >
          {({ isSubmitting, values, handleChange }) => (
            <Form className='flex flex-col justify-start items-start xl:gap-5 lg:gap-5 md:gap-5 sm:gap-3 w-full'>
              <TextField
                label='Email Address'
                name='email'
                type='email'
                value={values.email}
                onChange={handleChange}
                placeholder='mail@company.com'
                className='rounded-full indent-4 border border-lightgrey w-full h-14 focus:border-primary outline-none'
              />

              <div className='relative w-full'>
                <TextField
                  label='Password'
                  name='password'
                  type={passwordShown ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  placeholder='******'
                  className='rounded-full indent-4 border border-lightgrey w-full h-14 focus:border-primary outline-none'
                />
                <button
                  type='button'
                  onClick={() => setPasswordShown(!passwordShown)}
                  className='absolute top-[50px] right-4 cursor-pointer'
                >
                  <BsEyeSlash />
                </button>
              </div>

              <div className='flex justify-between justify-items-center w-full'>
                <div className='flex justify-start items-center gap-2'>
                  <input type='checkbox' name='rememberMe' id='rememberMe' />{' '}
                  Remember me
                </div>
                <Link
                  href='/forget-password'
                  className='underline font-semibold text-purple'
                >
                  Forgot your password?
                </Link>
              </div>

              {message && (
                <p className='w-full flex flex-col justify-start items-start gap-2 text-danger'>
                  {message}
                </p>
              )}

              <button
                type='submit'
                disabled={isSubmitting}
                className='h-14 rounded-full hover:bg-purple w-full bg-lightgrey text-white'
              >
                {' '}
                {btnMsg}{' '}
              </button>
            </Form>
          )}
        </Formik>
      </section>
    </>
  )
}
