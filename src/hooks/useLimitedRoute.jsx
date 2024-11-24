'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Cookies from 'universal-cookie'

const useLimitedRoute = (allowedAccountTypes) => {
  const cookies = new Cookies()
  const router = useRouter()
  const [errorAuth, setError] = useState()
  const [loadingFinished, setLoadingFinished] = useState(false)
  const [success, setSuccess] = useState()
  const isMounted = useRef(false) // This will track the initial mount

  const checkAcctType = async () => {
    const token = cookies.get('user_token')
    if (!token) {
      setError(true)
      setLoadingFinished(true)
      router.push('/') // Redirect to login page
      return
    }
    try {
      const gottenToken = cookies.get('user_token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/retrieve-token`,
        {
          method: 'POST',
          body: JSON.stringify({
            token,
          }),
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${gottenToken}`,
          },
        }
      )
      const data = await res.json()
      if (data?.status !== true) {
        setError(true)
        setLoadingFinished(true)
        router.back() // router.push back to previous page
        return
      }
      let accountType = data?.data?.account_type[0]?.user_type?.type
      if (!accountType) {
        setError(true)
        setLoadingFinished(true)
        router.back() // router.push back to previous page
        return
      }
      if (!allowedAccountTypes.includes(accountType)) {
        setError(true)
        setLoadingFinished(true)
        router.back() // router.push back to previous page
        return
      }
      setError(false)
      setSuccess(true)
      setLoadingFinished(true)
    } catch (error) {
      setError(true)
      setLoadingFinished(true)
      router.back() // router.push back to previous page
    }
  }

  useEffect(() => {
    if (!isMounted.current) {
      checkAcctType()
      isMounted.current = true
    }
  }, [])

  return { success, errorAuth, loadingFinished }
}

export default useLimitedRoute
