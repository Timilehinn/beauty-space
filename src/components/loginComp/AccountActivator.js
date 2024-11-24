'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'universal-cookie'
import { BsXLg } from 'react-icons/bs'

import { getAccountRestoreObject } from '../../redux/accountRestorer'
import { setEmailBackup, setInit2FA } from '../../redux/authRelated'

const AccountActivator = ({ setAccountActivatorPopOver, onSuccess }) => {
  const router = useRouter()
  const cookies = new Cookies()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const accountRestoreObject = useSelector(getAccountRestoreObject)
  const [btnMsg, setBtnMsg] = useState('Activate')
  const [message, setMessage] = useState(null)

  /**
   * The `loginViaEmail` function handles user login via email, including handling different scenarios
   * like Two-Factor Authentication setup based on API response.
   * @param email - The `email` parameter in the `loginViaEmail` function is the user's email address
   * used for logging in.
   * @param password - The `password` parameter in the `loginViaEmail` function is used to store the
   * user's password input for logging in via email. It is passed as an argument to the function along
   * with the `email` parameter when the function is called. The function then uses this password to
   * authenticate the user
   * @returns In the `loginViaEmail` function, different return statements are used based on the
   * conditions met during the API call and data processing. Here is a breakdown of the possible return
   * scenarios:
   */
  const loginViaEmail = async (email, password) => {
    try {
      setLoading(true)
      setMessage(null)

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
            reactivate: true,
          }),
        }
      )

      const data = await res.json()

      if (data?.status === false) {
        setLoading(false)
        setBtnMsg('Activate')

        /* This code block is checking if the response data from the API contains an `otp` field with a
       value of `'sms'`. If this condition is met, it means that the user needs to set up Two-Factor
       Authentication (2FA) using SMS. */
        if (data?.data?.otp == 'sms') {
          dispatch(setEmailBackup(email))
          dispatch(
            setInit2FA({
              type: 'sms',
              popup: true,
            })
          )
          return
        }

        /* This code block is checking if the response data from the API contains an `otp` field with a
       value of `'auth_code'`. If this condition is met, it means that the user needs to set up
       Two-Factor Authentication (2FA) using an authentication code. */
        if (data?.data?.otp == 'auth_code') {
          dispatch(setEmailBackup(email))
          dispatch(
            setInit2FA({
              type: 'auth_code',
              popup: true,
            })
          )
          return
        }

        /* This code snippet is setting a message to be displayed to the user based on the response
       received from an API call. Here's a breakdown of what it's doing: */
        setMessage({
          text:
            Object.values(data?.errors)[0] ??
            'There was an error activating this account. Please try again or contact support.',
          color: 'red',
        })

        return
      }

      setBtnMsg('Success!')
      setMessage({
        text: 'Great! We are glad to have you back!',
        color: 'green',
      })

      onSuccess('', data?.data?.token)
      return
    } catch (error) {
      setLoading(false)
      setBtnMsg('Activate')

      setMessage({
        text: 'There was an error activating this account. Please try again, check your internet connection or contact support.',
        color: 'red',
      })
    }
  }

  /**
   * The `loginViaGoogleSocial` function handles the login process via Google social authentication,
   * including handling different scenarios based on the API response.
   * @param provider - The `provider` parameter in the `loginViaGoogleSocial` function is used to
   * specify the social login provider, such as Google in this case. It is a string that indicates the
   * source of authentication for the user, in this scenario, it would be 'google'. This parameter helps
   * the function determine
   * @param providerId - The `providerId` parameter in the `loginViaGoogleSocial` function is the unique
   * identifier associated with the user's account on the social login provider (in this case, Google).
   * It is used to identify the user when making requests to the authentication provider for login
   * purposes. This identifier helps the application
   * @returns In the provided code snippet, the `loginViaGoogleSocial` function returns different
   * actions based on the response from the API call. Here is a breakdown of the possible return
   * scenarios:
   */
  const loginViaGoogleSocial = async (provider, providerId) => {
    setMessage(null)
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/login/oauth`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            provider,
            providerId,
            reactivate: true,
          }),
        }
      )

      const data = await res.json()

      if (data?.status === false) {
        setLoading(false)
        setBtnMsg('Activate')

        /* This code block is checking if the response data from the API contains an `otp` field with a
        value of `'sms'`. If this condition is met, it means that the user needs to set up
        Two-Factor Authentication (2FA) using SMS. If this condition is true, the code dispatches
        actions to set the email backup, and initialize 2FA with type 'sms' and a popup set to true.
        This is part of the logic to handle different authentication scenarios based on the response
        from the API. */
        if (data?.data?.otp == 'sms') {
          dispatch(setEmailBackup(email))
          dispatch(
            setInit2FA({
              type: 'sms',
              popup: true,
            })
          )
          return
        }

        /* This code block is checking if the response data from the API contains an `otp` field with a
        value of `'auth_code'`. If this condition is met, it means that the user needs to set up
        Two-Factor Authentication (2FA) using an authentication code. */
        if (data?.data?.otp == 'auth_code') {
          dispatch(setEmailBackup(email))
          dispatch(
            setInit2FA({
              type: 'auth_code',
              popup: true,
            })
          )
          return
        }

        setMessage({
          text:
            Object.values(data?.errors)[0] ??
            'There was an error activating this account. Please try again or contact support.',
          color: 'red',
        })

        return
      }

      setBtnMsg('Success!')

      setMessage({
        text: 'Great! We are glad to have you back. Redirecting you now.',
        color: 'green',
      })

      /* The `cookies.set('user_token', data?.data?.token, { path: '/', maxAge: 2600000, sameSite:
     'none', secure: true })` code snippet is setting a cookie named 'user_token' in the browser
     with the value of `data?.data?.token`. Here's a breakdown of the parameters used in the
     `cookies.set` method: */
      cookies.set('user_token', data?.data?.token, {
        path: '/',
        maxAge: 2600000,
        sameSite: 'none',
        secure: true,
      })

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      setLoading(false)
      setBtnMsg('Activate')

      setMessage({
        text: 'There was an error activating this account. Please try again, check your internet connection or contact support.',
        color: 'red',
      })
    }
  }

  /**
   * The function `signInGitAcct` handles the sign-in process for a user using a Git account, including
   * handling different scenarios like setting up Two-Factor Authentication and setting a user token
   * cookie upon successful activation.
   * @param provider - The `provider` parameter in the `signInGitAcct` function is used to specify the
   * authentication provider being used for signing in. This could be a social login provider like
   * Google, Facebook, GitHub, etc. It helps the function identify where the user is trying to sign in
   * from.
   * @param providerId - The `providerId` parameter in the `signInGitAcct` function is used to specify
   * the unique identifier associated with the user's account on the authentication provider's platform.
   * This identifier is typically provided by the authentication provider when a user signs in using
   * their account.
   * @returns The `signInGitAcct` function returns different outcomes based on the response data from an
   * API call:
   */
  const signInGitAcct = async (provider, providerId) => {
    try {
      setLoading(true)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/login/oauth`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            provider,
            providerId,
            reactivate: true,
          }),
        }
      )
      const data = await res.json()

      if (data?.status === false) {
        setLoading(false)
        setBtnMsg('Activate')

        /* This code block is checking if the response data from an API call contains an `otp` field
       with a value of `'sms'`. If this condition is met, it means that the user needs to set up
       Two-Factor Authentication (2FA) using SMS. */
        if (data?.data?.otp == 'sms') {
          dispatch(setEmailBackup(email))
          dispatch(
            setInit2FA({
              type: 'sms',
              popup: true,
            })
          )
          return
        }

        /* This code block is checking if the response data from the API contains an `otp` field with a
      value of `'auth_code'`. If this condition is met, it means that the user needs to set up
      Two-Factor Authentication (2FA) using an authentication code. */
        if (data?.data?.otp == 'auth_code') {
          dispatch(setEmailBackup(email))
          dispatch(
            setInit2FA({
              type: 'auth_code',
              popup: true,
            })
          )
          return
        }

        // let message = data?.errors?.email ?? "Unable to login at this time.";
        setMessage({
          text: 'There was an error activating this account. Please try again or contact support.',
          color: 'red',
        })

        return
      }
      setBtnMsg('Success!')

      setMessage({
        text: 'Great! We are glad to have you back. Redirecting you now',
        color: 'green',
      })

      /* This code snippet is setting a cookie named 'user_token' in the browser with the value of
     `data?.data?.token`. Here's a breakdown of the parameters used in the `cookies.set` method: */
      cookies.set('user_token', data?.data?.token, {
        path: '/',
        maxAge: 2600000,
        sameSite: 'none',
        secure: true,
      })

      setTimeout(() => {
        router.push('/dashboard')
      }, 5000)
    } catch (error) {
      setLoading(false)
      setBtnMsg('Activate')
      setMessage({
        text: 'There was an error activating this account. Please try again, check your internet connection or contact support.',
        color: 'red',
      })
    }
  }

  /**
   * The `reactivateAccount` function handles reactivating a user account by signing in through
   * different authentication methods based on the accountRestoreObject's authBy property.
   * @param e - The `e` parameter in the `reactivateAccount` function is typically an event object,
   * commonly used in React applications to handle events like form submissions or button clicks. In
   * this case, the `e.preventDefault()` method is called to prevent the default behavior of the event,
   * such as form submission causing
   * @returns The `reactivateAccount` function returns either a call to `signInGitAcct`,
   * `loginViaGoogleSocial`, or `loginViaEmail` based on the authentication method specified in the
   * `accountRestoreObject`.
   */
  const reactivateAccount = (e) => {
    e.preventDefault()
    try {
      setBtnMsg('Reactivating...')
      if (accountRestoreObject?.authBy === 'Github') {
        signInGitAcct(
          accountRestoreObject?.provider,
          accountRestoreObject?.providerId
        )
        return
      }
      if (accountRestoreObject?.authBy === 'Google') {
        loginViaGoogleSocial(
          accountRestoreObject?.provider,
          accountRestoreObject?.providerId
        )
        return
      }
      if (accountRestoreObject?.authBy === 'EmailPassword') {
        loginViaEmail(
          accountRestoreObject?.email,
          accountRestoreObject?.password
        )
        return
      }
    } catch (error) {}
  }

  return (
    <main className='h-screen w-screen bg-lightblack fixed inset-0 flex justify-center items-center'>
      <form className='p-5 bg-white rounded-xl shadow-2fl m-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col justify-center items-center gap-5'>
        <button
          type='button'
          onClick={() => setAccountActivatorPopOver(false)}
          className='flex justify-end items-end '
        >
          <BsXLg />
        </button>

        <div className='flex flex-col justify-center items-center gap-5'>
          <p className=''>
            You deactivated your account. Do you wish to restore it?
          </p>
          {/* <input value={password} onChange={(e) => setPassword(e.target.value)} id="overideBorder" type="password" className='mt-[30px] rounded w-[388px] h-[40px] bg-violet-100 p-[10px]' /> */}
          <button
            disabled={loading}
            onClick={reactivateAccount}
            className='px-5 h-12 rounded-xl flex items-center justify-center bg-purple text-white'
          >
            {btnMsg}
          </button>

          {/* {message && (
            <p className={`text-[${message?.color}]`}>{message?.text}</p>
          )} */}
        </div>
      </form>
    </main>
  )
}

export default AccountActivator
