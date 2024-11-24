import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setSpaceModal, setWorkspace } from '../redux/workspaceSlice'

const useDeleteSpace = () => {
  const cookies = new Cookies()
  const [token, setToken] = useState()
  const [error, setError] = useState()
  const [response, setResponse] = useState()
  const [status, setStatus] = useState('Delete')
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

  const deleteSpace = async (id) => {
    try {
      setStatus('Deleting')

      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/workspaces/${id}/delete`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      setResponse(data)
      if (data?.status === true) {
        setStatus('Deleted')
        toast.success('Workspace Deleted successfully')
        dispatch(setSpaceModal(false))
        dispatch(setWorkspace(data?.data.data))
        setTimeout(() => {
          window.location.reload(true)
        }, 5000)
        return
      }
      if (data?.status === false) {
        setStatus('Delete')
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
    deleteSpace,
    errorMessage,
  }
}

export default useDeleteSpace
