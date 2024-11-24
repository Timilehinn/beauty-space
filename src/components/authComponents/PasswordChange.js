import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import Cookies from 'universal-cookie'
import { toast } from 'react-toastify'
import Link from 'next/link'

import { getUserInfo } from '../../redux/admin_user'

import './addOn.scss'

const PasswordChange = () => {
  const router = useRouter()
  const cookies = new Cookies()
  const { t } = useTranslation()

  const [old_password, setOld_password] = useState('')
  const [new_password, setNew_password] = useState('')
  const [confirm_password, setConfirm_password] = useState('')
  const [updateBtn, setUpdateBtn] = useState('Update Password')
  const [loading, setLoading] = useState(false)

  const userData = useSelector(getUserInfo)

  const checks = async () => {
    setLoading(true)
    setUpdateBtn('Updating....')
    if (!new_password || !old_password || !confirm_password) {
      toast.error('Missing Inputs.')
      setLoading(false)
      setUpdateBtn('Update Password')
      return false
    }
    if (new_password !== confirm_password) {
      toast.error('Password does not match!!!')
      setLoading(false)
      setUpdateBtn('Update Password')
      return false
    }
    const upperCaseWords = await new_password.match(/[A-Z]/g)
    const isNumberPresent = await new_password.match(/[0-9]/g)
    const lowerCaseWords = await new_password.match(/[a-z]/g)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
    const isSpecialChar = specialChars.test(new_password)

    if (!upperCaseWords) {
      setLoading(false)
      setUpdateBtn('Update Password')
      toast.error('Passwords must have at least one Uppercase letter.')
      return false
    }

    if (!lowerCaseWords) {
      setLoading(false)
      setUpdateBtn('Update Password')
      toast.error('Passwords must have at least one Lowercase letter.')
      return false
    }

    if (!isNumberPresent) {
      setLoading(false)
      setUpdateBtn('Update Password')
      toast.error('Passwords must have at least one number.')
      return false
    }

    if (!isSpecialChar) {
      setLoading(false)
      setUpdateBtn('Update Password')
      toast.error('Passwords must have at least one Symbol.')
      return
    }
    return true
  }

  const callApiForUpdatePassword = async (e) => {
    e.preventDefault()
    // check here
    const result = checks()
    const token = cookies.get('user_token')
    if (!result) {
      return
    }
    // sending api
    const res = await fetch(
      `${process.env.REACT_APP_BASE_URL}/users/${userData?.id}/password-reset`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password,
          new_password,
        }),
      }
    )
    const data = await res.json()
    if (data?.status === true) {
      toast.success('Password successfully updated')
      setUpdateBtn('Updated')
      setTimeout(() => {
        router.refresh()
      }, 1000)
    }

    if (data?.status !== true) {
      toast.error(data?.errors)
      setUpdateBtn('Try again')
    }
  }

  return (
    <main className='w-full flex flex-col justify-start items-start gap-5 '>
      <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
        <label htmlFor='old_password'>Current Password</label>

        <input
          type='password'
          value={old_password}
          onChange={(e) => setOld_password(e.target.value)}
          className='h-12 border border-lightgrey w-full outline-none rounded-md indent-2'
        />
      </div>

      <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
        <label htmlFor='new_password'>New Password</label>
        <input
          type='password'
          value={new_password}
          onChange={(e) => setNew_password(e.target.value)}
          className='h-12 border border-lightgrey w-full outline-none rounded-md indent-2'
        />
      </div>

      <div className='grid lg:grid-cols-2 lg:place-items-center lg:justify-items-start md:grid-cols-2 sm:grid-cols-1 sm:gap-3 w-full'>
        <label htmlFor='confirm_password'>Confirm New Password</label>
        <input
          type='password'
          value={confirm_password}
          onChange={(e) => setConfirm_password(e.target.value)}
          className='h-12 border border-lightgrey w-full outline-none rounded-md indent-2'
        />
      </div>

      <button
        disabled={loading}
        onClick={callApiForUpdatePassword}
        className='px-5 h-14 rounded-md bg-primary text-white w-auto flex items-center justify-center ml-auto'
      >
        {updateBtn}
      </button>
    </main>
  )
}

export default PasswordChange
