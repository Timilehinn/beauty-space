'use client'

import { Formik } from 'formik'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { GiPadlock } from 'react-icons/gi'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { getAppToken } from '../../utils'
import { FORGET_PASSWORD } from '../../api/authRoutes'
import { requestResponse } from '../../hooks/requestResponse'
import { TextField } from '../loginComp/TextField'

const validate = Yup.object().shape({
  email: Yup.string()
    .email('Your email is incorrect. Check and re-enter a correct email.')
    .required('Email address is required'),
})

export default function Testing() {
  const router = useRouter()
  const { t } = useTranslation()
  const token = getAppToken()

  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * The function `handleForgetPassword` is an asynchronous function that handles the process of
   * resetting a user's password by sending a request to a server and displaying appropriate messages
   * based on the response.
   * @param email - The `handleForgetPassword` function you provided is used for handling the process of
   * resetting a user's password. The `email` parameter is the email address of the user who wants to
   * reset their password. This function initiates the password reset process by sending a request to the
   * server with the provided email
   * @returns The `handleForgetPassword` function returns nothing explicitly, as it is an asynchronous
   * function. However, it may return a promise that resolves to undefined if the function completes
   * successfully.
   */
  const handleForgetPassword = async (email) => {
    if (!email) return
    setIsSubmitting(true)
    try {
      const res = await FORGET_PASSWORD(token, email)

      const { data, status, error } = requestResponse(res)

      if (status) {
        setIsSubmitting(false)
        toast.success(
          'Check your email for futher steps to reset your password.'
        )

        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else {
        toast.error(error)
        setMessage(error)
        setIsSubmitting(false)
      }

      if (data.status === false) {
        setIsSubmitting(false)
        toast.error(data.errors.email[0])
        setMessage({
          text: data.errors.email[0],
          color: 'red',
        })
        return
      }
    } catch (error) {
      setIsSubmitting(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='h-screen w-full px-5 flex flex-col justify-center items-center gap-5 mx-auto xxl:w-[40%] special:w-[40%] xl:w-[40%] lg:w-[40%] md:w-full sm:w-full '>
      <div className='flex flex-col justify-center items-center gap-3 text-center  '>
        <div className='bg-gray rounded-full p-2 h-12 w-12 text-xl flex justify-center items-center '>
          <GiPadlock />
        </div>

        <h1 className='text-2xl font-semibold'>
          {t('Forgetten your password?')}
        </h1>
        <p className=''>
          {t(
            "Enter your email address. You'll be sent a link to reset your password"
          )}
        </p>
      </div>

      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={validate}
        onSubmit={(values) => {
          handleForgetPassword(values?.email)
        }}
      >
        {({ values, handleSubmit, handleChange, handleBlur }) => (
          <form
            onSubmit={handleSubmit}
            className='flex flex-col justify-start items-start gap-5 w-full '
          >
            <TextField
              name='email'
              type='email'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              placeholder='enter your email address e.g mail@company.com'
            />
            <button
              type='submit'
              className='w-full h-14 text-white rounded bg-purple '
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </Formik>

      {message && <span className='text-danger'>{message}</span>}

      <div className='text-base flex justify-center items-center gap-3'>
        {t('Remembered your password?')}
        <Link href='/'>
          <span className='text-purple underline'> {t(' Login')}</span>
        </Link>
      </div>
    </main>
  )
}
