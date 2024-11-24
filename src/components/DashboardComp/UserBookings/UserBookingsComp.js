'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Loader from '../../Loader/Loader'
import ServicesPaginationComp from '../Businesses/ServicesPaginationComp'
import SingleBookingComp from './SingleBookingComp'

import useCookieHandler from '../../../hooks/useCookieHandler'
import useLimitedRoute from '../../../hooks/useLimitedRoute'

import {
  getLast_Page,
  getUserBookings,
  setLast_Page,
  setUserBookings,
} from '../../../redux/userBookingsSlice'

export default function UserBookingsComp() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { token } = useCookieHandler('user_token')
  const { success, errorAuth, loadingfinished } = useLimitedRoute('User')

  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [currentPagination, setCurrentPagination] = useState(0)

  const last_page = useSelector(getLast_Page)
  const bookings = useSelector(getUserBookings)

  const getUserBookingsList = async (page = 1) => {
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/bookings?page=${page}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.status === 401) {
        router.push('/')
        return
      }

      const data = await res.json()

      if (data?.status === true) {
        dispatch(setUserBookings(data?.data.data))
        dispatch(setLast_Page(data?.data.last_page))

        setLoading(false)
        setFailure(false)
      }
    } catch (err) {
      setLoading(false)
      setFailure(true)
    }
  }

  useEffect(() => {
    if (!token) return
    getUserBookingsList(currentPagination)
  }, [token, currentPagination, dispatch])

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPagination(selectedPage + 1)
    setLoading(true)
    getUserBookingsList(selectedPage + 1)
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setFailure(true)
      })
  }

  return (
    <>
      <Loader
        failure={failure} //if your api or state fails and page should not show
        isLoading={loading} // if your api or state is still fetching
        redirectTo={'/'}
      />

      <main className='w-full h-full flex flex-col justify-start items-start gap-8 3xl:p-10 xl:p-10 md:p-10 sm:p-5'>
        <h1 className='text-xl 3xl:text-3xl'>Booking</h1>
        <div className='bg-white shadow-2fl rounded-md p-5 w-full overflow-auto scrollbar-hide 3xl:p-10 '>
          <SingleBookingComp />
          {bookings?.length >= 1 && (
            <ServicesPaginationComp
              pageCount={last_page}
              handlePageClick={handlePageChange}
            />
          )}
        </div>
      </main>
    </>
  )
}
