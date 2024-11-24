import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setSpaceModal, setWorkspace } from '../redux/workspaceSlice'

const useSalesUpdateSpace = () => {
  const cookies = new Cookies()
  const [token, setToken] = useState()
  const [error, setError] = useState()
  const [response, setResponse] = useState()
  const [status, setStatus] = useState('Update')
  const [errorMessage, setErrorMessage] = useState()

  const dispatch = useDispatch()

  const getCookie = () => {
    const gottenToken = cookies.get('user_token')
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

  const updateSpace = async (id, updateData) => {
    try {
      setStatus('Updating')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${id}/tp-update`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      )

      const data = await res.json()
      setResponse(data)
      if (data?.status === true) {
        setStatus('Updated')
        // dispatch(setWorkspace(data?.data.data))
        toast.success('Workspace updated successfully')
        dispatch(setSpaceModal(false))
        setTimeout(() => {
          window.location.reload(true)
        }, 5000)
        return
      }
      if (data?.status === false) {
        setStatus('Update')
        setError(data.errors)
        toast.error(data.errors)
        return
      }
    } catch (error) {}
  }

  useEffect(() => {
    getCookie()
  }, [])

  return {
    token,
    error,
    status,
    response,
    updateSpace,
    errorMessage,
  }
}

export default useSalesUpdateSpace
