import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'

const useCookieHandler = (cookieToGet) => {
  const cookies = new Cookies()

  const [token, setToken] = useState()
  const [error, setError] = useState()
  const [errorMessage, setErrorMessage] = useState()

  const getCookie = () => {
    const gottenToken = cookies.get(cookieToGet)
    if (!gottenToken) {
      setError(true)
      setErrorMessage('Cookie seems not to be avaliable')

      return
    }
    setToken(gottenToken)
    setError(false)
    setErrorMessage('')
    return
  }

  useEffect(() => {
    getCookie()
  }, [cookieToGet])

  return { token, error, errorMessage }
}

export default useCookieHandler
