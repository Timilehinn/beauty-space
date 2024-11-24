import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Cookies from 'universal-cookie'

import { setAccountRestoreObject } from '../redux/accountRestorer'
import { setEmailBackup, setIdBackup, setInit2FA } from '../redux/authRelated'

const useGithubAuth = (
  code,
  authType,
  setToast,
  setAccountActivatorPopOver
) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const cookies = new Cookies()
  const [token, setToken] = useState('cool')

  const getAccessToken = async () => {
    if (!code) {
      return
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/oauth/users`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            code,
          }),
        }
      )
      const data = await res.json()
      if (data.data.length) {
        let str = data.data[0]
        let mySubString = str.split(/[=&]/)
        return mySubString[1]
      }
      return null
    } catch (error) {
      return null
    }
  }

  const getUser = async (accessToken) => {
    try {
      const res = await fetch(`https://api.github.com/user`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = await res.json()

      if (data) {
        dispatch(setEmailBackup(data?.email))
        dispatch(setIdBackup(data?.id))
        return {
          email: data?.email,
          id: data?.id,
        }
      }
    } catch (error) {
      return null
    }
  }

  const signInGitAcct = async (provider, providerId) => {
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
        if (data?.data?.reactivate) {
          // user account is disabled;
          let restoreObject = {
            authBy: 'Github',
            provider,
            providerId,
          }
          dispatch(setAccountRestoreObject(restoreObject))
          setAccountActivatorPopOver(true)
          return
        }
        if (data?.data?.otp == 'sms') {
          dispatch(
            setInit2FA({
              type: 'sms',
              popup: true,
            })
          )
          return
        }
        if (data?.data?.otp == 'auth_code') {
          dispatch(
            setInit2FA({
              type: 'auth_code',
              popup: true,
            })
          )
          return
        }

        let message =
          data?.errors?.email ??
          data?.errors?.message ??
          'Unable to login at this time.'
        setToast({ message, color: 'red' })
        return
      }
      setToast({
        message: 'Login Successful! Redirecting....',
        color: 'green',
      })
      cookies.set('user_token', data?.data?.token, {
        path: '/',
        maxAge: 2600000,
        sameSite: 'none',
        secure: true,
      })
      setTimeout(() => {
        const isToRedirect = cookies.get('redirect_back_val')
        if (isToRedirect) {
          router.push(`/${isToRedirect}`)
          cookies.remove('redirect_back_val')
          return
        }
        router.push('/dashboard')
      }, 2000)
    } catch (error) {}
  }

  const signUpGithubAcct = async (email, providerId, provider) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/users/signup/oauth`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email,
            providerId,
            provider,
          }),
        }
      )
      const data = await res.json()
      if (data?.status === false) {
        let message = data?.errors?.email ?? 'Unable to signup at this time.'
        setToast({ message, color: 'red' })
        return
      }
      setToast({
        message: 'Signup successful. We wil redirect you to the app now',
        color: 'green',
      })
      cookies.set('user_token', data?.data?.token, {
        path: '/',
        maxAge: 2600000,
        sameSite: 'none',
        secure: true,
      })
      setTimeout(() => {
        const isToRedirect = cookies.get('redirect_back_val')
        if (isToRedirect) {
          router.push(`/${isToRedirect}`)
          cookies.remove('redirect_back_val')
          return
        }
        router.push('/dashboard')
      }, 3000)
    } catch (error) {}
  }

  const githubAuth = async () => {
    const accessToken = await getAccessToken()
    if (!accessToken) {
      return
    }
    const { email, id } = await getUser(accessToken)
    if (authType === 'signup') {
      await signUpGithubAcct(email, id, 'github')
      return
    }
    await signInGitAcct('github', id)
  }

  useEffect(() => {
    githubAuth()
  }, [code])

  return { token }
}

export default useGithubAuth
