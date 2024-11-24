import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'
import { MdClose } from 'react-icons/md'
import { useDispatch } from 'react-redux'

import { setUsers } from '../../redux/admin_user'

export default function ProfileUpdateModal({ showModal, userData }) {
  const cookies = new Cookies()
  const [loading, setLoading] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')
  const dispatch = useDispatch()

  const onPhoneChange = (value) => {
    const numericValue = value.replace(/\D/g, '')
    setPhone(numericValue)
  }

  const canProceed = () => {
    if (firstname && lastname && phone.length > 5) return true
    return false
  }

  const updateProfile = async () => {
    try {
      var body = {
        first_name: firstname,
        last_name: lastname,
        phone,
      }
      setLoading(true)
      const token = cookies.get('user_token')
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/users/${userData.id}/update`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      )
      const data = await res.json()
      if (data?.status !== true) {
        toast.error('Something went wrong while creating your account')
      } else {
        dispatch(
          setUsers({
            status: true,
            data: {
              ...userData,
              first_name: firstname,
              last_name: lastname,
              phone_number: phone,
            },
          })
        )
        toast.success('Profile updated successfully.')
        showModal(true)
      }
    } catch (err) {
      console.log(err)
      toast.error('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className='fixed top-0 left-0 w-full z-[10] h-screen flex justify-center items-center bg-[#0808088f] '>
      <div className='flex flex-col justify-start items-start gap-8 bg-white shadow-2fl rounded-md p-5 xxl:w-[40%] xl:w-[40%] lg:w-[40%] md:w-[80%] sm:w-[90%] '>
        <header className='flex justify-between items-center w-full'>
          <div>
            <h1 className='text-lg font-semibold'>Complete your profile</h1>
            <h3 className=''>
              You need to complete your profile setup to continue
            </h3>
          </div>

          <button
            type='button'
            onClick={() => showModal(false)}
            className='cursor-pointer text-lg'
          >
            <MdClose />{' '}
          </button>
        </header>
        <input
          className={`placeholder:italic border border-lightgrey rounded w-full indent-3 h-[56px] p-0 outline-none shadow-none focus:border-primary`}
          label='First name'
          placeholder='First name'
          type='text'
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          className={`placeholder:italic border border-lightgrey rounded w-full indent-3 h-[56px] p-0 outline-none shadow-none focus:border-primary my-1`}
          label='Last name'
          placeholder='Last name'
          type='text'
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <input
          className={`placeholder:italic border border-lightgrey rounded w-full indent-3 h-[56px] p-0 outline-none shadow-none focus:border-primary`}
          label='Phone number'
          placeholder='e.e +234 123 456 789'
          type='text'
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
        <button
          disabled={!canProceed()}
          onClick={updateProfile}
          className={`border h-12 rounded-md ${
            canProceed()
              ? 'bg-primary hover:cursor-pointer'
              : 'bg-lightgrey hover:not-allowed'
          }  w-full text-white`}
        >
          {loading ? 'Loading...' : 'Save'}
        </button>
      </div>
    </article>
  )
}
