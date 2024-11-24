'use client'

import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BiEnvelope, BiUser } from 'react-icons/bi'
import { BsChatRightTextFill, BsClock } from 'react-icons/bs'
import { CiGrid42 } from 'react-icons/ci'
import { GoTag } from 'react-icons/go'
import { LuCalendarDays, LuPhone } from 'react-icons/lu'

import useCookieHandler from '../../hooks/useCookieHandler'
import { useClient } from '../../providers/clientContext'
import { getAccountType, getUserInfo } from '../../redux/admin_user'
import Breadcrumb from '../Breadcrumb/Breadcrumb'
import Loader from '../Loader/Loader'
import AssignStaff from './UserBookings/AssignStaff'

export default function BookingDetails({ id }) {
  const router = useRouter()
  const { token } = useCookieHandler('user_token')

  const [sendMessageRequested, setSendMessageRequest] = useState(false)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const userData = useSelector(getUserInfo)
  const { client } = useClient()
  const [businessDetails, setBusinessDetails] = useState(null)

  const user = useSelector((state) => state.adminPeople.users?.data)
  const accountType = useSelector(getAccountType)

  const initializeUser = () => {
    try {
      client?.initializeUser({
        uid: userData.id.toString(),
        username: userData?.first_name || 'No name',
        firstname: userData?.first_name,
        lastname: userData?.last_name,
        profileUrl: userData?.profile_url,
      })
    } catch (error) {}
  }

  useEffect(() => {
    if (client && userData) {
      initializeUser()
    }
  }, [userData, client])

  const getBookingDetails = async () => {
    if (!token) {
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/bookings/${id}`,
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
        setBookingDetails(data?.data)
        setBusinessDetails(data?.data.bookings[0]?.workspace)
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
    getBookingDetails()
  }, [token])

  const handleSendMessage = async () => {
    try {
      // softchatjs
      if (userData.id !== bookingDetails?.user?.id) {
        let newConvoInitMe = {
          uid: bookingDetails?.user?.id,
          username: bookingDetails?.user?.first_name || 'No name',
          firstname: bookingDetails?.user?.first_name,
          lastname: bookingDetails?.user?.last_name,
          email: bookingDetails?.user?.email,
          profileUrl: bookingDetails?.user?.profile_url,
        }
        const msClient = client.newConversation(newConvoInitMe, null)
        const conversation = msClient.create()
        router.push(
          `/dashboard/inbox?conversation=${conversation.conversation.conversationId}`
        )
      } else {
        //alert
        console.error('Cannot send message to self')
      }
    } catch (error) {
      console.error(error.message)
    }
    // let newConvoInitMe = {
    //   id: user?.id,
    //   name: `${user?.first_name} ${user?.last_name}`,
    //   email: user?.email,
    //   photoUrl: user?.profile_url,
    //   welcomeMessage: '',
    //   role: 'default',
    // }
    // //  let otherUserConvoInfo = {
    // //    id: person?.id,
    // //    name: `${person?.first_name} ${person?.last_name}`,
    // //    email: person?.email,
    // //    photoUrl: person?.profile_url,
    // //    welcomeMessage: '',
    // //    role: '',
    // //  }
    // window.localStorage.setItem(
    //   'newConvoInitMe',
    //   JSON.stringify(newConvoInitMe)
    // )
    // //  window.localStorage.setItem(
    // //    'otherUserConvoInfo',
    // //    JSON.stringify(otherUserConvoInfo)
    // //  )
    // setSendMessageRequest(!sendMessageRequested)
  }

  const startDate = new Date(bookingDetails?.bookings[0]?.start_date)
  const endDate = new Date(bookingDetails?.bookings[0]?.end_date)

  // Format the time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Loader isLoading={loading} failure={failure} />
      <main className='min-h-screen flex flex-col gap-8 py-10 lg:px-10 md:px-10 sm:px-5'>
        <Breadcrumb />

        <section className='grid grid-cols-1 content-start place-items-start gap-5 w-full lg:grid-cols-2  '>
          <div className='flex flex-col justify-start items-start gap-5 w-full h-auto border border-gray p-5 rounded-md lg:h-[25rem]'>
            <h4 className='font-semibold'>Customer</h4>

            <div className='flex justify-between items-start w-full'>
              <div className='flex justify-start items-start gap-3'>
                <Image
                  src={bookingDetails?.user?.profile_url || ''}
                  alt={bookingDetails?.user.first_name}
                  width={50}
                  height={50}
                  className='object-cover object-top rounded-full w-14 h-14 ring-2 ring-gray'
                />

                <div className='flex flex-col gap-3'>
                  <div className='flex justify-start items-center gap-3'>
                    <BiUser className='text-primary' />
                    <h4 className=''>
                      {bookingDetails?.user?.first_name}{' '}
                      {bookingDetails?.user?.last_name}
                    </h4>
                  </div>

                  <div className='flex justify-start items-center gap-3'>
                    <BiEnvelope className='text-primary' />
                    <span className=''>{bookingDetails?.user?.email}</span>
                  </div>

                  <div className='flex justify-start items-center gap-3'>
                    <LuPhone className='text-primary' />
                    <span className=''>
                      {bookingDetails?.user?.phone_number}
                    </span>
                  </div>

                  {accountType !== 'Staff' && (
                    <button
                      type='button'
                      onClick={handleSendMessage}
                      className='cursor-pointer bg-primary text-white h-12 px-5 rounded-md hover:bg-danger flex justify-center items-center gap-2'
                    >
                      <BsChatRightTextFill />
                      <span>Contact</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col justify-start items-start gap-5 w-full overflow-auto scrollbar-hide h-auto border border-gray p-5 rounded-md lg:h-[25rem]  '>
            <h4 className='font-semibold capitalize'>services</h4>

            <div className='flex flex-col justify-start items-start gap-5 w-full'>
              {bookingDetails?.bookings?.map((services) => {
                return (
                  <div
                    key={services?.id}
                    className='flex flex-col justify-start items-start gap-3'
                  >
                    <span className='uppercase text-lightgrey text-sm font-semibold'>
                      {
                        services?.user_space_services[0]?.space_service
                          ?.groups[0].name
                      }
                    </span>

                    <div className='flex flex-col gap-1'>
                      <span className=' font-semibold'>
                        {services?.user_space_services[0]?.space_service?.name}
                      </span>
                      <span className='text-sm'>
                        Amount: &#8358;
                        {services?.user_space_services[0]?.space_service?.price}
                      </span>
                      <span className='text-sm'>
                        Type:{' '}
                        {services?.user_space_services[0]?.space_service?.type}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='col-span-1 gap-5 grid grid-cols-1 content-start place-items-start rounded-md p-5 border border-gray h-auto w-full lg:h-[25rem]'>
            <h4 className='font-semibold capitalize'>Booking time</h4>

            <div className='flex flex-col justify-start items-start gap-3 w-full'>
              <div className='flex justify-start items-center gap-3'>
                <CiGrid42 className='text-primary' />
                <span className=''>
                  {bookingDetails?.bookings[0]?.workspace?.name}
                </span>
              </div>

              <div className='flex justify-start items-center gap-3'>
                <LuCalendarDays className='text-primary' />
                <span className=''>
                  {moment(bookingDetails?.bookings[0]?.booking_date).format(
                    'LL'
                  )}
                </span>
              </div>

              <div className='flex justify-start items-center gap-3'>
                <BsClock className='text-primary' />
                <span>
                  {formatTime(startDate)} - {formatTime(endDate)}
                </span>
              </div>

              <div className='flex justify-start items-center gap-3'>
                <GoTag className='text-primary' />
                <span className=''>&#8358;{bookingDetails?.amount_paid}</span>
              </div>

              {bookingDetails && accountType !== 'Staff' && (
                <AssignStaff
                  bookingId={bookingDetails.bookings?.[0]?.id}
                  workspaceId={businessDetails?.id}
                  staff={bookingDetails.bookings?.[0].staff}
                  refresh={() => getBookingDetails()}
                  bookingDate={bookingDetails.bookings?.[0]?.booking_date}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
