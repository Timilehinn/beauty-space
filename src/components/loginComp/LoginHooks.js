import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from 'react-google-login'
import Cookies from 'universal-cookie'

// refresh token
import { refreshTokenSetup } from '../../utils/refreshToken'
import Gmail from '../../assets/icons/Gmail.svg'
import { setAccountRestoreObject } from '../../slices/accountRestorer'
import { useDispatch, useSelector } from 'react-redux'
import {
  setEmailBackup,
  setIdBackup,
  setInit2FA,
} from '../../slices/authRelated'

const clientId = process.env.GOOGLE_CLIENT_ID

function LoginHooks({ setToast, setAccountActivatorPopOver }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cookies = new Cookies()
  const [buttonText, setButtonText] = useState('Login with Gmail')

  const loginViaGoogleSocial = async (provider, providerId, email) => {
    dispatch(setEmailBackup(email))
    dispatch(setIdBackup(providerId))

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/users/login/oauth`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            provider,
            providerId,
          }),
        }
      )
      const data = await res.json()

      if (data?.status === false) {
        setButtonText('Login with Gmail')
        //? brb
        if (data?.data?.reactivate) {
          // user account is disabled;
          let restoreObject = {
            authBy: 'Google',
            provider,
            providerId,
          }
          dispatch(setAccountRestoreObject(restoreObject))
          setAccountActivatorPopOver(true)
          return
        }
        //? setting up 2fa
        if (data?.data?.otp == 'sms') {
          setButtonText('Login with Gmail')
          dispatch(
            setInit2FA({
              type: 'sms',
              popup: true,
            })
          )
          return
        }
        if (data?.data?.otp == 'auth_code') {
          setButtonText('Login with Gmail')
          dispatch(
            setInit2FA({
              type: 'auth_code',
              popup: true,
            })
          )
          return
        }
        setButtonText('Login with Gmail')
        let message =
          data?.errors?.email ??
          data?.errors?.message ??
          'Unable to login at this time.'
        setToast({ message, color: 'red' })
        return
      }
      setButtonText('Login Successful')
      setToast({ message: 'Login Successful! Redirecting....', color: 'green' })
      // ?brb
      cookies.set('user_token', data?.data?.token, {
        path: '/',
        maxAge: 2600000,
        sameSite: 'none',
        secure: true,
      })
      setTimeout(() => {
        const isToRedirect = cookies.get('redirect_back_val')
        if (isToRedirect) {
          navigate(`/${isToRedirect}`)
          cookies.remove('redirect_back_val')
          return
        }
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      setButtonText('Login with Gmail')
    }
  }

  const onSuccess = (res) => {
    setButtonText('Checking...')
    loginViaGoogleSocial(
      'google',
      res.profileObj.googleId,
      res.profileObj?.email
    )
    refreshTokenSetup(res)
  }

  const onFailure = (res) => {}

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: false,
    accessType: 'offline',
    // responseType: 'code',
    // prompt: 'consent',
  })

  return (
    <button
      onClick={signIn}
      className='border-2 border-[#D4D4D4] w-full py-2
    bg-transparent rounded shadow-none lg:flex lg:justify-center 
    lg:items-center lg:gap-4 md:gap-4 md:flex md:justify-center 
    md:items-center sm:flex sm:justify-center sm:items-center sm:gap-4 '
    >
      <Gmail />
      <span className='text-sm text-black'> {buttonText} </span>
    </button>
  )
}

export default LoginHooks
