import { useState, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'universal-cookie'

export default function useProtectedRoute(
  cookieToGet = 'user_token',
  shouldRouteOnError
) {
  const router = useRouter()
  const cookies = new Cookies()
  const [token, setToken] = useState()
  const [errorAuth, setError] = useState()
  const [success, setSuccess] = useState()
  const [loadingfinished, setloadingfinished] = useState(false)

  const getCookie = () => {
    const gottenToken = cookies.get(cookieToGet)
    if (!gottenToken) {
      setError(true)
      setloadingfinished(true)
      router.push('/') // Redirect to login page
      return
    }
    setToken(gottenToken)
    setError(false)
    setloadingfinished(true)
    return
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      getCookie()
    }, 500)
  }, [])

  useLayoutEffect(() => {
    if (!token) {
      return
    }

    setError(false)
    setSuccess(true)
  }, [token])

  if (errorAuth && shouldRouteOnError) {
    router.push('/')
  }

  return { success, errorAuth, loadingfinished }
}
