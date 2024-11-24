import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import useCookieHandler from './useCookieHandler'
import { setTotalSpaces, setWorkspace } from '../redux/workspaceSlice'

const useGetWorkSpaces = (index) => {
  const [spaces, setSpaces] = useState(null)
  const [spacesError, setSpacesError] = useState(null)
  const [spacesStatus, setSpacesStatus] = useState(null)
  const [isSpacesLoading, setSpacesLoading] = useState(true)
  const [spacesFailedToLoad, setSpacesFailedToLoad] = useState(false)
  const [spacesSuccessfullyLoaded, setSpacesSuccessfullyLoaded] =
    useState(false)

  const dispatch = useDispatch()
  const { token } = useCookieHandler('user_token')

  const getSpaces = async (index) => {
    if (!token) {
      setSpacesLoading(true)
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces${
          index ? `?page=${index}` : ''
        }`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      setSpacesLoading(false)
      setSpaces(data?.data)
      dispatch(setTotalSpaces(data?.data.total))
      dispatch(setWorkspace(data?.data.data))
      setSpacesSuccessfullyLoaded(true)
      setSpacesFailedToLoad(false)

      if (data?.status !== true) {
        setSpacesStatus(true)
        setSpacesError(data.errors)
        setSpacesSuccessfullyLoaded(false)
        setSpacesFailedToLoad(true)
        setSpacesLoading(false)
        return
      }

      // if (res.status === 500) {
      //   navigate('/500')
      // } else if (res.status === 400) {
      //   navigate('/400')
      // }
    } catch (error) {
      setSpacesStatus(false)
      setSpacesSuccessfullyLoaded(false)
      setSpacesFailedToLoad(true)
      setSpacesLoading(false)
    }
  }

  useEffect(() => {
    getSpaces(index)
  }, [token])

  return {
    token,
    spaces,
    getSpaces,
    spacesError,
    spacesStatus,
    isSpacesLoading,
    spacesFailedToLoad,
    spacesSuccessfullyLoaded,
  }
}

export default useGetWorkSpaces
