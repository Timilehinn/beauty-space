'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import Link from 'next/link'

import { FaGift } from 'react-icons/fa'

import {
  getLoading,
  getUsersDiscounts,
  setFailure,
  setLoading,
  setUserDiscounts,
} from '../../redux/settingsMarketing'
import useCookieHandler from '../../hooks/useCookieHandler'
import { getAccountType } from '../../redux/admin_user'

export default function DiscountTicket() {
  const dispatch = useDispatch()
  const { token } = useCookieHandler('user_token')

  const loading = useSelector(getLoading)
  const usersDiscounts = useSelector(getUsersDiscounts)
  const accountType = useSelector(getAccountType)

  const getUsersDiscountTickets = async () => {
    dispatch(setLoading(true))
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/discounts/all`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (data?.status === true) {
        dispatch(setUserDiscounts(data.data))
        dispatch(setLoading(false))
        dispatch(setFailure(false))
      } else {
        dispatch(setLoading(false))
        dispatch(setFailure(true))
        return
      }
    } catch (error) {
      dispatch(setLoading(false))
      dispatch(setFailure(true))
    }
  }

  useEffect(() => {
    if (token && accountType === 'User') {
      getUsersDiscountTickets()
    } else return
  }, [dispatch, token, accountType])

  const filteredDiscounts = usersDiscounts?.data?.filter((items) => {
    return moment(items.expired_at).isAfter(moment())
  })

  if (loading)
    return <p className='text-lg text-center mx-auto w-full'>Loading...</p>

  return (
    <>
      {filteredDiscounts?.length !== 0 && accountType === 'User' ? (
        <main className='flex flex-col justify-start items-start gap-8 py-10 h-[25rem] 3xl:w-[65%] xxl:px-[10rem] mx-auto w-full xl:px-[10rem] lg:px-16 md:px-10 sm:px-5 '>
          <div className='bookingCard flex flex-col justify-start items-start self-start gap-3'>
            <h1 className='text-2xl font-semibold '>Discount Tickets</h1>
            <p className='text-lightgrey font-medium text-base 3xl:text-3xl'>
              You can use the available discount tickets to book for a
              service
            </p>
          </div>
          <div className='snap-x mx-auto snap-mandatory h-auto w-full flex items-start justify-start gap-10 overflow-x-scroll scrollbar-hide'>
            {filteredDiscounts?.map((items) => {
              return (
                <Link
                  href={`/booking/${items?.workspace?.slug}/checkout?sid=${items?.workspace?.id}&discount=${items.code}`}
                  key={items.id}
                  className='rounded-md shadow-2fl snap-start 3xl:w-[450px] xl:w-[350px] lg:w-[350px] md:w-[350px] sm:w-[350px] flex-shrink-0 flex flex-col items-start justify-start '
                >
                  <div className='relative w-full flex flex-col justify-start items-start gap-3 p-5 rounded-t-lg bg-purple text-white '>
                    <div className='flex justify-between items-center gap-5 w-full'>
                      <h2 className='uppercase font-light text-base'>
                        discounts
                      </h2>
                    </div>

                    <FaGift className='opacity-30 text-white text-8xl absolute top-4 right-20' />

                    <div className='flex flex-col gap-1'>
                      <h1 className='font-bold text-5xl uppercase'>
                        {items.percentage}% off
                      </h1>
                      <span className='text-sm font-light'>
                        {items?.workspace.name}
                      </span>
                    </div>
                  </div>

                  <div className='bg-white w-full p-2 flex flex-col gap-1 rounded-b-lg '>
                    <span className='font-semibold'>{items.code}</span>
                    <span className='font-light text-sm text-lightgrey'>
                      Expires at: {moment(items.expired_at).format('LLL')}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </main>
      ) : null}
    </>
  )
}
