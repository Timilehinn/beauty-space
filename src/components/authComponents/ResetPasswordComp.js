'use client'

import { Form, Formik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'
import * as Yup from 'yup'

import { FaEyeSlash } from 'react-icons/fa'
import { GiPadlock } from 'react-icons/gi'

import useCookieHandler from '../../hooks/useCookieHandler'
import { TextField } from '../loginComp/TextField'

const validate = Yup.object().shape({
  password: Yup.string().required(
    'Your password is incorrect. Check and re-enter a correct password.'
  ),
  confirmPassword: Yup.string().when('password', {
    is: (val) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf([Yup.ref('password')], 'Password does not match'),
  }),
})

export default function ResetPasswordComp() {
  const router = useRouter()
  const cookies = new Cookies()
  const { t } = useTranslation()
  const { token } = useCookieHandler('user_token', true)

  /* The code snippet is using the `useSearchParams` hook from Next.js to access and parse the search
      parameters in the URL. */
  const searchParams = useSearchParams()
  const activation_code = searchParams.get('activation_code')

  const [message, setMessage] = useState()
  const [msgColor, setMsgColor] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [btnMsg, setBtnMsg] = useState('Reset Password')
  const [passwordShown, setPasswordShown] = useState(false)

  /**
   * The function `togglePasswordVisibility` toggles the visibility of a password input field.
   */
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true)
  }

  /**
   * The function checks if a password meets certain criteria such as having uppercase and lowercase
   * letters, numbers, symbols, and a minimum length of 8 characters.
   * @param password - The function `checks` is an asynchronous function that takes a `password` as a
   * parameter. It checks the password against certain criteria such as having at least one uppercase
   * letter, one lowercase letter, one number, one symbol, and being at least 8 characters long. If the
   * password does not meet
   * @returns The function `checks` is returning `true` if the password meets all the specified criteria
   * (at least one uppercase letter, at least one lowercase letter, at least one number, at least one
   * symbol, and a minimum length of 8 characters). If any of these criteria are not met, an error
   * message is set and the function returns without reaching the `true` return statement.
   */
  const checks = async (password) => {
    setMessage('')
    const upperCaseWords = await password?.match(/[A-Z]/g)
    const isNumberPresent = await password?.match(/[0-9]/g)
    const lowerCaseWords = await password?.match(/[a-z]/g)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    const isSpecialChar = specialChars.test(password)

    if (!upperCaseWords) {
      setMessage('Passwords must have at least one Uppercase letter.')
      setMsgColor('red')
      return
    }

    if (!lowerCaseWords) {
      setMessage('Passwords must have at least one Lowercase letter.')
      setMsgColor('red')
      return
    }

    if (!isNumberPresent) {
      setMessage('Passwords must have at least one number.')
      setMsgColor('red')
      return
    }

    if (!isSpecialChar) {
      setMessage('Passwords must have at least one Symbol.')
      setMsgColor('red')
      return
    }

    if (password.length < 8) {
      setMessage('Passwords must be at least 8 characters long.')
      setMsgColor('red')
      return
    }
    return true
  }

  const resetPassword = async (password) => {
    if (!password) {
      toast.info('Please enter new password')
      return
    }

    if (!activation_code) {
      toast.error('Unathorized, Token not found')
      return
    }

    const result = await checks(password)
    console.log('result', result)
    if (!result) {
      return
    }

    setBtnMsg('Resetting.......')
    setIsLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password,
            activation_code,
          }),
        }
      )
      const data = await res.json()

      if (data.status === false) {
        setBtnMsg('Reset Password')
        setIsLoading(false)

        if (data?.errors?.password) {
          setMsgColor('red')
          setMessage(data.errors.password)
          return
        }
        return
      }

      setBtnMsg('Success!!!')
      setMsgColor('green')
      setMessage('Password Reset Successful!')

      setTimeout(() => {
        setIsLoading(false)
        const isToRedirect = cookies.get('redirect_back_val')

        if (isToRedirect) {
          router.push(`/${isToRedirect}`)
          cookies.remove('redirect_back_val')
          return
        }
        router.push('/')
      }, 2000)

      return 'success'
    } catch (error) {
      setMsgColor('red')
      setBtnMsg('Reset Password')
      setIsLoading(false)
    }
  }

  return (
    <main className='flex flex-col justify-center items-center gap-5 m-auto p-5 h-screen xxl:w-[40%] xl:w-[40%] lg:w-[50%] md:w-full sm:w-full '>
      <header className='flex flex-col justify-center items-center gap-3 w-full'>
        <span className='bg-gray rounded-full p-2 h-12 w-12 text-xl flex justify-center items-center '>
          <GiPadlock />
        </span>

        <h1 className='text-2xl font-semibold'>
          {' '}
          {t('Reset your password?')}{' '}
        </h1>
        <p className='sm:w-full lg:w-3/4 text-center'>
          {t('Enter your new password to your account')}
        </p>
      </header>

      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validate}
        onSubmit={async (values) => {
          await resetPassword(values.password)
        }}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form className='flex flex-col justify-start items-start gap-5 w-full'>
            <div className='relative w-full '>
              <TextField
                name='password'
                onBlur={handleBlur}
                label='New Password'
                placeholder='******'
                onChange={handleChange}
                value={values.password}
                type={passwordShown ? 'text' : 'password'}
              />
              <button
                type='button'
                onClick={togglePasswordVisiblity}
                className='absolute top-[3rem] right-3 z-10'
              >
                <FaEyeSlash />
              </button>
            </div>

            <div className='relative w-full '>
              <TextField
                type={passwordShown ? 'text' : 'password'}
                onBlur={handleBlur}
                placeholder='*******'
                name='confirmPassword'
                onChange={handleChange}
                label='Confirm Password'
                value={values.confirmPassword}
              />
              <button
                type='button'
                onClick={togglePasswordVisiblity}
                className='absolute top-[3rem] right-3 z-10'
              >
                <FaEyeSlash />
              </button>
            </div>

            {message?.length > 0 && (
              <ul className='pl-5 text-sm list-disc'>
                <li className='text-danger'>{message}</li>
              </ul>
            )}

            <button
              type='submit'
              disabled={isLoading}
              className='rounded-md h-14 bg-lightgrey text-white hover:bg-purple w-full'
            >
              {' '}
              {btnMsg}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  )
}
