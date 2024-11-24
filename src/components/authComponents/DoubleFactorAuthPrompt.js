import React, { useState, useEffect, useRef } from 'react'
import Cookies from 'universal-cookie'
import { BsXLg } from 'react-icons/bs'
import { toast } from 'react-toastify'
import './addOn.scss'

const DoubleFactorAuthPrompt = ({
  setPopUp2faAuth,
  popUp2faAuth,
  getQR_Code,
  modalText,
  handleAddClick,
}) => {
  const authRef = useRef()
  const cookies = new Cookies()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState(null)
  const [btnMsg, setBtnMsg] = useState('Confirm Password')

  const passwordCheck = async (e) => {
    e.preventDefault()
    if (!password) {
      toast.error('Please input your password.')
      return
    }
    const token = cookies.get('user_token')
    try {
      setBtnMsg('Checking...')
      setLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/signup/validatepassword`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            password,
          }),
        }
      )
      const data = await res.json()

      if (data?.status !== true) {
        setBtnMsg('Check Password')
        setLoading(false)
        toast.error(Object.values(data?.errors)[0])
        return
      }
      setBtnMsg('Checked')
      // account deactivation successful;
      setPopUp2faAuth(false)
      if (getQR_Code) {
        toast.success(
          'Your password is validated successfully. Qr code will be generated in few seconds.'
        )
        setTimeout(() => {
          getQR_Code()
        }, 5000)
      } else {
        toast.success('Your password is validated successfully. ')
        handleAddClick()
      }
      return
    } catch (e) {
      setBtnMsg('Check Password')
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        popUp2faAuth &&
        authRef.current &&
        !authRef.current.contains(e.target)
      ) {
        setPopUp2faAuth(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [popUp2faAuth])

  return (
    <main
      ref={authRef}
      className='h-screen w-full overflow-hidden bg-lightblack fixed inset-0 top-0 left-0 flex justify-center items-center '
    >
      <form className='shadow-2fl bg-white rounded-lg w-[95%] m-auto p-5 flex flex-col justify-start items-start gap-5 lg:w-auto '>
        <div className='flex justify-between items-center w-full'>
          <h2 className='text-lg font-medium'>Password Validation</h2>
          <button
            type='button'
            onClick={() => setPopUp2faAuth(false)}
            className='text-2xl'
          >
            <BsXLg />
          </button>
        </div>
        <hr className='w-full border-gray' />

        <div className='flex flex-col justify-start items-start gap-5 w-full '>
          <p className='w-full lg:w-[70%] '>
            {modalText
              ? modalText
              : 'Enter your password to continue with authentication setup'}
          </p>
          <input
            id='overideBorder'
            type='password'
            className='rounded w-full indent-3 h-12'
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={passwordCheck}
            className='h-12 px-5 w-full rounded-full flex items-center justify-center bg-primary text-white text-[17px]'
          >
            {btnMsg}
          </button>
        </div>
      </form>
    </main>
  )
}

export default DoubleFactorAuthPrompt
