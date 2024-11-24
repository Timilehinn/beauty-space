'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import { setInit2FA, setToken } from '../../redux/authRelated'

import './addOn.scss'

export default function VerifyCodePhoneNumber({
  emailbackup,
  init2FA,
  idBackup,
  preventNavigate,
  isTraditional,
  setIsValidated,
  mobile_number,
}) {
  const cookies = new Cookies()

  const router = useRouter()
  const dispatch = useDispatch()

  const [secret, setSecret] = useState('')
  const [btnMsg, setBtnMsg] = useState('Continue')

  /**
   * The function `confirmAuthAppCode` is an asynchronous function that verifies a code using a POST
   * request to a specific endpoint and handles the response accordingly.
   * @returns The function `confirmAuthAppCode` returns nothing explicitly. It performs various
   * operations like making a POST request to verify a secret, updating state variables, dispatching
   * actions, setting cookies, and navigating to a different page based on certain conditions.
   */
  const confirmAuthAppCode = async () => {
    try {
      let bodyData

      if (isTraditional) {
        bodyData = {
          secret: secret,
          email: emailbackup,
        }
      } else {
        bodyData = {
          secret: secret,
          provider_id: idBackup,
        }
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/verify-secret`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        }
      )
      const data = await res.json()

      /* This code snippet is checking if the response data from a POST request does not have a `status`
     property or if the `status` property is falsy. If this condition is met, it means that the code
     verification process was unsuccessful or there was an error. */
      if (!data?.status) {
        toast.error(`Unable to verify code`)
        setBtnMsg('Continue')
        return
      }

      toast.success(`Code Verified`)
      setBtnMsg('Verified')

      /* The code snippet `dispatch(setInit2FA({ type: 'sms', popup: false }))` is dispatching an
      action to update the state related to two-factor authentication (2FA) initialization. */
      dispatch(
        setInit2FA({
          type: 'sms',
          popup: false,
        })
      )

      if (preventNavigate) {
        setIsValidated(true)
        return
      }

      dispatch(setToken(data?.data?.token))

      /* The `cookies.set('user_token', data?.data?.token, { path: '/', maxAge: 2600000, sameSite:
      'none', secure: true })` code snippet is setting a cookie named 'user_token' with the value of
      `data?.data?.token`. Here's a breakdown of the parameters used in the `cookies.set` method: */
      cookies.set('user_token', data?.data?.token, {
        path: '/',
        maxAge: 2600000,
        sameSite: 'none',
        secure: true,
      })

      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error) {}
  }

  /**
   * The function `sendSmsReq` sends an OTP code via SMS to a user's email address and displays success
   * or error messages using toast notifications.
   * @param initialized - The `initialized` parameter in the `sendSmsReq` function is a boolean value
   * that indicates whether the function is being called for the first time or for a subsequent resend
   * operation. If `initialized` is `true`, it means that the code is being sent for the first time, and
   * if
   * @returns The function `sendSmsReq` returns different messages based on the conditions:
   */
  const sendSmsReq = async (initialized) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/send-otp`,
        {
          method: 'POST',
          body: JSON.stringify({
            email: emailbackup,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await res.json()

      if (!data?.status) {
        toast.error(`Not able to sent code.`)
        return
      }

      if (initialized) {
        toast.success(`Code have been sent.`)
        return
      }

      toast.success(`Code resent.`)
    } catch (error) {}
  }

  /**
   * The function `verifySmsReq` is an asynchronous function that handles the verification of an OTP code
   * for a user through an API call, with error handling and success messages displayed using toast
   * notifications.
   * @param e - The `e` parameter in the `verifySmsReq` function is typically an event object that is
   * passed to the function when it is triggered, such as when a form is submitted. In this case, the
   * function is preventing the default behavior of the event using `e.preventDefault()` to handle form
   * @returns The function `verifySmsReq` returns either an error message if the code verification fails
   * or a success message if the code is verified successfully. It also sets the button message
   * accordingly and may navigate to the dashboard page if the verification is successful and conditions
   * are met.
   */
  const verifySmsReq = async (e) => {
    e.preventDefault()
    try {
      const token = cookies.get('user_token')

      if (!secret) {
        toast.error('Please put in the code')
        return
      }

      let dataBody

      if (mobile_number) {
        dataBody = {
          secret,
          email: emailbackup,
          phone_number: mobile_number,
        }
      }

      if (!mobile_number) {
        dataBody = {
          secret,
          email: emailbackup,
        }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/verify-otp
            `,
        {
          method: 'POST',
          body: JSON.stringify(dataBody),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      if (!data?.status) {
        toast.error(`Unable to verify code`)
        setBtnMsg('Continue')
        return
      }

      toast.success(`Code Verified`)
      setBtnMsg('Verified')

      if (preventNavigate) {
        setIsValidated(true)
        return
      }

      dispatch(setToken(data?.data?.token))

      cookies.set('user_token', data?.data?.token, {
        path: '/',
        maxAge: 2600000,
        sameSite: 'none',
        secure: true,
      })

      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error) {}
  }

  useEffect(() => {
    if (preventNavigate) {
      return
    }

    if (init2FA?.type == 'sms') {
      setTimeout(() => {
        sendSmsReq(true)
      }, 1000)
    }
  }, [])

  return (
    <main className='h-screen w-[100%] overflow-hidden z-10 bg-lightblack fixed inset-0 flex justify-center items-center '>
      <div className='px-5 py-10 bg-white rounded-xl shadow-2fl flex flex-col justify-center items-center gap-5'>
        <div className='flex flex-col justify-start items-start gap-2 text-left w-[50%] md:w-[70%] sm:w-full '>
          {init2FA?.type === 'auth_code' ? (
            <p className='font-medium'>
              To keep your account secure, we verify your identity. Enter the
              code generated by your authenticator app.
            </p>
          ) : (
            <p className='leading-6 lg:text-[16px] text-[13px] mt-[13px]'>
              One more thing. We sent a code to your phone number.{' '}
            </p>
          )}
        </div>

        {init2FA?.type === 'sms' && (
          <p className='text-primary'>
            Please check your phone for the verification code.
          </p>
        )}

        <div className='p-5 border border-lightgrey rounded-xl flex flex-col justify-center gap-5 xl:w-[70%] lg:w-[80%] md:w-full sm:w-full'>
          <p className='font-semibold'>Verification Code</p>
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            type='number'
            className='rounded-md h-12 p-2 border border-lightgrey outline-none'
          />
          <button
            type='button'
            onClick={
              init2FA?.type === 'sms' ? verifySmsReq : confirmAuthAppCode
            }
            className='px-5 h-14 rounded-lg flex items-center justify-center bg-purple text-white text-center'
          >
            {btnMsg}
          </button>
        </div>

        {init2FA?.type === 'sms' && (
          <div className='flex justify-start items-center gap-2'>
            Didn’t receive code?{' '}
            <span className='text-primary' onClick={sendSmsReq}>
              Resend code
            </span>
          </div>
        )}
      </div>
    </main>
  )
}
