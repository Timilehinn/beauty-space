import React, { useState } from 'react'
import Cookies from 'universal-cookie'
import { toast } from 'react-toastify'

import './addOn.scss'

const AddSmsAuth = ({
  setPopUpSms,
  setPopUpVerifyPhoneNumber,
  email,
  setMobile_number,
}) => {
  const cookies = new Cookies()
  const [btnMsg, setBtnMsg] = useState('Add Number')
  const [phone_number, setPhone_Number] = useState()

  const sendSmsReq = async (e) => {
    e.preventDefault()
    if (!phone_number) {
      return
    }
    const token = cookies.get('user_token')
    if (!token) {
      alert('Not authenticated!!!')
      return
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/send-otp`,
        {
          method: 'POST',
          body: JSON.stringify({
            phone_number,
            email,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()

      if (!data?.status) {
        toast.error('Error adding phone number')
        setBtnMsg('Add Number')
        return
      }
      setMobile_number(phone_number)
      setBtnMsg('Added')
      // toast.success('Phone number added successfully');
      setPopUpVerifyPhoneNumber(true)
      setPopUpSms(false)
    } catch (error) {
      setBtnMsg('Add Number')
    }
  }

  return (
    <>
      <div
        onClick={() => null}
        className='h-full w-[100%] bg-lightblack fixed inset-0 flex justify-center items-center '
      >
        <div className='py-2 space-y-4 bg-white w-[100%] h-[auto] shadow-2fl rounded ml-[10px] pt-[20px] pb-[20px] pl-[10px] pr-[50px]'>
          <div className='h-[auto] flex flex-col justify-center'>
            <p className='leading-6 text-[#141115] text-[22px] font-semibold'>
              Add SMS Authentication
            </p>
            <p className='leading-6 text-[#141115] text-[16px] mt-[13px]'>
              Please add a phone number in profile tab before you continue.
            </p>
          </div>
          <div
            className='w-[512px] h-[146px] p-[10px] flex flex-col justify-center rounded bg-[ #FFFFFF]'
            style={{
              borderStyle: 'solid',
              borderColor: '#D4D4D4',
              borderWidth: 1,
            }}
          >
            <p className='leading-6 text-[19px]'>Phone Number</p>
            <div className='flex mt-[10px] gap-2'>
              <select className='outline-none' name='' id=''>
                <option value='nigeria'>Nigeria</option>
              </select>
              <input
                id='overideBorder'
                value={phone_number}
                onChange={(e) => setPhone_Number(e.target.value)}
                type='number'
                className='rounded w-[300px] h-[48px] bg-white p-[10px]'
              />
              <button
                onClick={sendSmsReq}
                className='w-[124px] h-[48px] p-[20px] rounded flex items-center justify-center bg-primary text-white'
              >
                {btnMsg}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddSmsAuth
