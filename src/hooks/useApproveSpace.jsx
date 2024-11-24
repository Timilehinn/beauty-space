import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import { toast } from 'react-toastify'

const useApproveSpace = () => {
  const cookies = new Cookies()
  const [token, setToken] = useState()
  const [error, setError] = useState()
  const [response, setResponse] = useState()
  const [status, setStatus] = useState('Approve')
  const [errorMessage, setErrorMessage] = useState()

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

  const approveSpace = async (id) => {
    if (!token) {
      return
    }
    try {
      setStatus('Approving')
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/workspaces/${id}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      setResponse(data)
      if (data?.status === true) {
        toast.success('Workspace Approved successfully')
        // dispatch(setWorkspace(data?.data.data));
        setStatus('Approved')
        setTimeout(() => {
          window.location.reload(true)
        }, 3000)
        return
      }
      if (data?.status !== true) {
        setStatus('Approve')
        toast.error(data.errors[0])
        setErrorMessage(data.errors[0])
        return
      }
    } catch (error) {}
  }

  useEffect(() => {
    getCookie()
  }, [])

  return {
    error,
    token,
    status,
    response,
    errorMessage,
    approveSpace,
  }
}

export default useApproveSpace
