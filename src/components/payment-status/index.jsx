'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { BsCheckCircleFill, BsClock, BsStarFill } from 'react-icons/bs'
import { BiCalendar } from 'react-icons/bi'

import WorkSpaceRating from '../rating'
import useCookieHandler from '../../hooks/useCookieHandler'

export default function PaymentStatus({ id }) {
  const { token } = useCookieHandler('user_token')
  const [serviceDatas, setServiceData] = useState(null)
  const [businessDetails, setBusinessDetails] = useState(null)
  const [loading, setLoading] = useState(false)

  const getBookingDetails = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${id}`,
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()
      if (data?.status === true) {
        setBusinessDetails(data?.data)
        setLoading(false)
      } else {
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    const bookedData = localStorage.getItem('dateBooked')

    if (bookedData) {
      const parsedData = JSON.parse(bookedData)
      setServiceData(parsedData)
    }

    getBookingDetails()
  }, [token])

  if (loading) return <p className='text-lg'>Loading...</p>

  return (
    <main className='flex flex-col justify-center items-center gap-3 w-full mx-auto border border-gray p-3 rounded-md xxl:w-[30%] xl:w-[40%] lg:w-[40%] md:w-[80%] sm:w-[90%] '>
      <div className='flex flex-col justify-center items-center gap-3'>
        <BsCheckCircleFill className='text-green text-3xl' />
        <span className='font-semibold'>Appointment Booked Successfully</span>
      </div>

      <hr className='w-full border-gray' />

      <div className='flex flex-col items-start justify-start gap-3 w-full'>
        {businessDetails?.photos.length >= 1 && (
          <Image
            src={businessDetails?.photos[0].url}
            alt='service image'
            width={500}
            height={500}
            className='rounded-md object-cover xxl:h-[14rem] xl:h-[12rem] lg:h-[10rem] md:h-[10rem] sm:h-[10rem] w-full'
          />
        )}

        <div className='flex flex-col gap-1'>
          <h4 className='font-semibold'>{businessDetails?.name}</h4>
          <span className='text-lightgrey text-sm'>
            {businessDetails?.address}
          </span>

          {businessDetails?.reviews.length > 0 ? (
            <WorkSpaceRating
              rating={businessDetails?.reviews}
              counter={false}
            />
          ) : (
            <div className='flex items-center gap-2'>
              <BsStarFill className='text-purple' />
              <span className='text-sm'>No ratings</span>{' '}
            </div>
          )}
        </div>

        <hr className='w-full border-gray' />

        <div className='flex flex-col gap-3 w-full'>
          <h4 className='font-semibold'>Details</h4>

          <div className='flex justify-between items-center w-full gap-5'>
            <span className='text-sm'>Date</span>
            <span className='flex items-center gap-2 text-lightgrey text-sm'>
              <BiCalendar className='text-sm text-primary' />{' '}
              {serviceDatas?.value[0]}
            </span>
          </div>

          <div className='flex justify-between items-center w-full gap-5'>
            <span className='text-sm'>Duration</span>
            <span className='flex items-center gap-2 text-lightgrey text-sm'>
              <BsClock className='text-sm text-primary' />{' '}
              {serviceDatas?.totalMinHours}hr
              {serviceDatas?.totalMinHours > 1 ? 's' : ''}
            </span>
          </div>

          <div className='flex justify-between items-center w-full gap-5'>
            <span className='text-sm'>Price</span>
            <span className='flex items-center gap-2 text-lightgrey text-sm'>
              {serviceDatas?.discountedPrice}
            </span>
          </div>

          <div className='flex justify-between items-center w-full gap-5'>
            <span className='text-sm'>Service</span>
            <span className='flex items-center gap-2 text-lightgrey text-sm'>
              {serviceDatas?.services.map((item) => item.name).join(', ')}
            </span>
          </div>
        </div>

        <hr className='w-full border-gray' />

        <Link
          href='/booking'
          className='bg-black h-12 text-white ring-2 ring-gray w-full rounded-sm flex justify-center items-center'
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}
