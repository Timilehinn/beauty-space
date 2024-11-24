import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import Cookies from 'universal-cookie'
import { toast } from 'react-toastify'
import { BsXLg } from 'react-icons/bs'

import { getUserInfo } from '../../redux/admin_user'

import './addOn.scss'

const DeactivatePrompt = ({ setDisablingAccount }) => {
  const cookies = new Cookies()
  const router = useRouter()
  const [password, setPassword] = useState(null)

  const [loading, setLoading] = useState(false)
  const [btnMsg, setBtnMsg] = useState('Deactivate Account')

  const userData = useSelector(getUserInfo)

  const DeactivateReq = async (e) => {
    e.preventDefault()
    if (!password) {
      toast.error('Please input your password.')
      return
    }
    const token = cookies.get('user_token')
    if (!token) {
      alert('Not authenticated!!!')
      return
    }
    try {
      if (!userData?.id) {
        alert('No Id')
        return
      }
      setBtnMsg('Deativating...')
      setLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/${userData?.id}/deactivate-account`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password,
          }),
        }
      )
      const data = await res.json()

      if (data?.status !== true) {
        setBtnMsg('Deativate Account')
        setLoading(false)
        toast.error(Object.values(data?.errors)[0])
        return
      }
      setBtnMsg('Deativated')
      // account deactivation successful;
      toast.success(
        'Your account is deactivated successfully. We are sad to see you go.'
      )
      setTimeout(() => {
        router.push('/')
      }, 5000)
      return
    } catch (e) {
      setBtnMsg('Deativate Account')
      setLoading(false)
    }
  }

  const navigateFunction = () => {
    cookies.set('redirect_back_val', 'settings', { path: '/', maxAge: 700 })
    cookies.set('current_settings_tab_after_redirect', 'LoginSecurity', {
      path: '/',
      maxAge: 700,
    })
    router.push(`/forgetpassword`)
  }

  const noPasswordAlert = (
    <form className='py-2 space-y-4 bg-white w-[620px] h-[316px] rounded ml-[10px] p-[20px] pt-[20px] pb-[20px] shadow-xl mt-[20px] shadow-2fl'>
      <div
        onClick={() => setDisablingAccount(false)}
        className='flex justify-end w-[100%]'
      >
        <BsXLg />
      </div>
      <div className='h-[auto] flex flex-col justify-center items-center'>
        <p className=' mt-[30px] leading-6 '>
          You seem not to have any password tied to your account. Please click
          the button below to reset your password before you can deactivate
          account. This is for security reason. We will redirect you back here
          to continue after successful password reset.
        </p>
        <button
          disabled={loading}
          onClick={navigateFunction}
          className='w-[177px] h-[52px] p-[20px] rounded mt-[30px] flex items-center justify-center'
          id='overideBtnDeactivate'
        >
          {'Reset Password'}
        </button>
      </div>
    </form>
  )

  return (
    <main
      className='h-full w-[100%] bg-lightblack fixed inset-0 flex justify-center items-center '
      style={{ zIndex: 10000 }}
    >
      {!userData?.has_password ? (
        noPasswordAlert
      ) : (
        <form
          className='py-2 space-y-4 bg-white w-[620px] h-[316px] rounded ml-[10px] p-[20px] pt-[20px] pb-[20px] shadow-xl mt-[20px]'
          style={{ boxShadow: '1px 1px 2px #adadad' }}
        >
          <div
            onClick={() => setDisablingAccount(false)}
            className='flex justify-end w-[100%]'
          >
            <BsXLg />
          </div>
          <div className='h-[auto] flex flex-col justify-center items-center'>
            <p className=' mt-[30px] leading-6 '>
              Enter your password to confirm account deactivation
            </p>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id='overideBorder'
              type='password'
              className='mt-[30px] rounded w-[388px] h-[40px] bg-violet-100 p-[10px]'
            />
            <button
              disabled={loading}
              onClick={DeactivateReq}
              className='w-[177px] h-[52px] p-[20px] rounded mt-[30px] flex items-center justify-center'
              id='overideBtnDeactivate'
            >
              {btnMsg}
            </button>
          </div>
        </form>
      )}
    </main>
  )
}

export default DeactivatePrompt
