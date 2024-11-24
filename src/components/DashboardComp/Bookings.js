'use client'

import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BiCalendar } from 'react-icons/bi'
import { FaMagnifyingGlass } from 'react-icons/fa6'

import Loader from '../../components/Loader/Loader'
import useCookieHandler from '../../hooks/useCookieHandler'
import ServicesPaginationComp from './Businesses/ServicesPaginationComp'
import { useLimitedRoute } from '../../hooks'
import {
  getBusinessBookings,
  getLastpage,
  getTotalBooking,
  setLastPage,
  setOwnerBookings,
  setTotalBooking,
} from '../../redux/bookingSlice'
import { getSearchToggle, setSearchToggle } from '../../redux/search_bookin'

export default function DashboardBookingComp() {
  const ref = useRef()
  const router = useRouter()
  const dispatch = useDispatch()

  const { token } = useCookieHandler('user_token')
  const { success, errorAuth, loadingFinished } = useLimitedRoute([
    'Owner',
    'Staff',
  ])

  const [loading, setLoading] = useState(true)
  const [isFailure, setIsFailure] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPagination, setCurrentPagination] = useState(0)

  const lastPage = useSelector(getLastpage)
  const searchModal = useSelector(getSearchToggle)
  const bookings = useSelector(getBusinessBookings)
  const totalBookings = useSelector(getTotalBooking)

  const getBookings = async (page = 1) => {
    if (!token) {
      return
    }
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
        dispatch(setOwnerBookings(data?.data.data))
        dispatch(setTotalBooking(data?.data.total))
        dispatch(setLastPage(data?.data?.last_page))
        setLoading(false)
        setIsFailure(false)
      }
    } catch (err) {
      setLoading(false)
      setIsFailure(true)
    }
  }

  useEffect(() => {
    if (!token) return
    getBookings(currentPagination)
  }, [token, currentPagination, dispatch])

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPagination(selectedPage + 1)
    setLoading(true)
    getUserTransactions(selectedPage + 1)
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setIsFailure(true)
      })
  }

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (searchModal && ref.current && !ref.current.contains(e.target)) {
        dispatch(setSearchToggle(false))
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [searchModal])

  const getStatus = (startDate, endDate) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > now) {
      return 'upcoming'
    } else if (end < now) {
      return 'past'
    } else {
      return 'happening'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-[#FCDC94] text-black'
      case 'past':
        return 'text-black bg-dashgrey'
      case 'happening':
        return 'bg-[#95D2B3] text-black'
      default:
        return ''
    }
  }

  const filteredBookings = bookings?.filter((item) => {
    const workspaceName = item?.bookings[0]?.workspace?.name?.toLowerCase()
    const query = searchQuery.toLowerCase()
    return workspaceName?.includes(query)
  })

  return (
    <>
      <Loader isLoading={loading} failure={isFailure} />
      <main className='flex flex-col gap-4 py-5 lg:px-10 md:px-10 sm:px-5 '>
        <h1 className='text-xl 3xl:text-3xl'>
          Booking{totalBookings.length >= 1 ? 's' : ''}
        </h1>

        <section className='flex flex-col justify-start items-start gap-10 w-full h-[80vh] bg-white rounded-lg p-5 overflow-auto scrollbar-hide'>
          <div className='relative w-full lg:w-[40%]'>
            <input
              id='search'
              type='text'
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search booking...'
              maxLength='44'
              autoComplete='off'
              className='bg-transparent h-12 rounded-md indent-6 outline-none border border-lightgrey w-full'
            />
            <FaMagnifyingGlass className='absolute top-4 left-2 text-sm text-lightgrey' />
          </div>

          {totalBookings >= 1 ? (
            <section className='lg:w-full  md:min-w-[650px] sm:min-w-[650px] '>
              <header className='grid grid-cols-8 content-between gap-2 py-3 px-5 w-full border-b border-gray lg:gap-5 '>
                <span className='col-span-2 font-semibold lg:text-base md:text-base sm:text-sm'>
                  Client
                </span>
                <span className='col-span-2 font-semibold lg:text-base md:text-base sm:text-sm '>
                  Appointment Date
                </span>
                <span className='col-span-2 font-semibold lg:text-base md:text-base sm:text-sm'>
                  Service
                </span>
                <span className='col-span-2 font-semibold lg:text-base md:text-base sm:text-sm'>
                  Status
                </span>
              </header>

              <div className='w-full'>
                {filteredBookings?.map((item) => {
                  const startDate = item?.bookings[0]?.start_date
                  const endDate = item?.bookings[0]?.end_date
                  const status = getStatus(startDate, endDate)
                  return (
                    <div
                      key={item.id}
                      className='grid grid-cols-8 content-between gap-2 py-3 px-5 w-full border-b border-gray last:border-b-0 lg:gap-5'
                    >
                      <span className='col-span-2 lg:text-base md:text-base sm:text-sm'>
                        {item?.user?.first_name} {item?.user?.last_name}
                      </span>
                      <span className='col-span-2 lg:text-base md:text-base sm:text-sm capitalize'>
                        {moment
                          .utc(item?.bookings[0]?.start_date)
                          .format('LLL')}
                      </span>
                      <div className='col-span-2 flex flex-col lg:text-base md:text-base sm:text-sm'>
                        <span className='text-black text-sm'>
                          {
                            item?.bookings[0]?.user_space_services[0]
                              ?.space_service?.name
                          }
                        </span>
                        <span className='text-lightgrey'>
                          {item?.bookings[0]?.workspace?.name}
                        </span>
                      </div>
                      <span
                        className={`p-2 flex justify-center items-center rounded-md capitalize ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                      <Link
                        href={`/dashboard/bookings/${item.id}`}
                        className='flex justify-start items-center gap-2 text-sm text-primary'
                      >
                        Details
                      </Link>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : (
            <div className='flex flex-col justify-center items-center gap-3 w-full m-auto text-lightgrey'>
              <BiCalendar className='text-[6rem]' />
              <span>No booking yet</span>
            </div>
          )}

          {totalBookings > 20 && (
            <ServicesPaginationComp
              pageCount={lastPage}
              handlePageClick={handlePageChange}
            />
          )}
        </section>
      </main>
    </>
  )
}
