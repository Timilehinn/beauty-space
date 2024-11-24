import { useState, useEffect } from 'react'

import useCookieHandler from './useCookieHandler'

const useFetchApiData = (methodType, endpoint) => {
  const [data, setData] = useState([])

  const [isPending, setIsPending] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [failure, setFailure] = useState(false)
  const [error, setError] = useState(null)

  const { token } = useCookieHandler('user_token')

  const getApiData = () => {
    fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/${endpoint}`, {
      method: methodType?.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          throw Error('could not fetch the data')
        }
        return response.json()
      })
      .then((data) => {
        setData(data?.data)
        setIsPending(false)
        setIsSuccess(true)
        setFailure(false)
      })
      .catch((err) => {
        setFailure(true)
        setIsPending(false)
        setIsSuccess(false)
        setError(err.message)
      })
  }

  useEffect(() => {
    setTimeout(() => {
      setIsPending(true)
      if (!token) {
        return
      }
      getApiData()
    }, 1000)
  }, [endpoint, token])

  return {
    data,
    error,
    failure,
    isSuccess,
    isPending,
    getApiData,
  }
}

export default useFetchApiData
