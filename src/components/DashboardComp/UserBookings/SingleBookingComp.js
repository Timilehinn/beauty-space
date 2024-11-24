'use client'

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'
import clsx from 'clsx'

import { IoFilterOutline } from 'react-icons/io5'
import { FaMagnifyingGlass } from 'react-icons/fa6'

import { getUserBookings } from '../../../redux/userBookingsSlice'
import WorkSpaceRating from '../../rating'
import { BiSolidRightArrow } from 'react-icons/bi'
import { GoArrowUpRight } from 'react-icons/go'
import { BsChatDots } from 'react-icons/bs'
import { useClient } from '../../../providers/clientContext'

export default function SingleBookingComp() {
  const [searchQuery, setSearchQuery] = useState('')
  const [spaceModal, setSpaceModal] = useState(null)
  const [selectedBookings, setSelectedBookings] = useState(null)
  const [sendMessageRequested, setSendMessageRequest] = useState(false)
  const { client } = useClient();
  const bookings = useSelector(getUserBookings)
  const user = useSelector((state) => state.adminPeople.users?.data);

  
  // const initializeUser = () => {
  //   try {
  //     client?.initializeUser({
  //       uid: user?.id,
  //       username: user?.last_name || 'No name',
  //       firstname: user?.first_name,
  //       lastname: user?.last_name,
  //       email: user?.email,
  //       profileUrl: user?.profile_url,
  //     });
  //     console.log('User initialized')
  //   } catch (error) {
  //     console.log(error)
  //   } 
  // }

  // useEffect(() => {
  //   if(client && user){
  //     initializeUser();
  //   }
  // },[client, user])

  // Filtered bookings based on search query
  const filteredBookings = bookings?.filter((item) =>
    item.bookings[0].workspace?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

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

  const startConversation = async () => {
    //  let otherUserConvoInfo = {
    //    id: person?.id,
    //    name: `${person?.first_name} ${person?.last_name}`,
    //    email: person?.email,
    //    photoUrl: person?.profile_url,
    //    welcomeMessage: '',
    //    role: '',
    //  }
    // window.localStorage.setItem(
    //   'newConvoInitMe',
    //   JSON.stringify(newConvoInitMe)
    // )
    //  window.localStorage.setItem(
    //    'otherUserConvoInfo',
    //    JSON.stringify(otherUserConvoInfo)
    //  )

    // softchatjs
    let newConvoInitMe = {
      uid: user?.id,
      username: `${user?.first_name} ${user?.last_name}`,
      firstname: user?.first_name,
      lastname: user?.last_name,
      email: user?.email,
      profileUrl: user?.profile_url,
    }
    const msClient = client.newConversation(newConvoInitMe, null);
    const conversation = msClient.create();
    router.push(`/dashboard/inbox?conversation=${conversation.conversation.conversationId}`);
  }

  const handleButtonClick = (id, item) => {
    if (spaceModal === id) {
      setSpaceModal(null)
      setSelectedBookings(null)
    } else {
      setSpaceModal(id)
      setSelectedBookings(item)
    }
  }

  return (
    <main className='w-full h-auto flex flex-col gap-8'>
      <header className='flex justify-between xl:items-center lg:items-center md:items-start sm:items-start w-full xl:flex-row lg:flex-row md:flex-col sm:flex-col sm:gap-5  '>
        <div className='flex xl:flex-row lg:flex-row md:flex-col sm:flex-col justify-between items-start gap-4 w-full'>
          <div className='relative w-full lg:w-[50%]'>
            <input
              type='text'
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search a booking'
              maxLength='44'
              className='bg-white outline-none rounded-md placeholder:text-lightblack h-12 border border-lightgrey lg:w-[300px]
                md:w-[200px] sm:min-w-full indent-8 3xl:h-16 '
            />
            <FaMagnifyingGlass className='absolute top-4 left-2 text-base text-lightgrey' />
          </div>

          {/* <button
            type='button'
            className='h-12 border border-lightgrey rounded-md px-5 flex justify-center items-center gap-2 3xl:h-16 3xl:text-4xl'
          >
            <IoFilterOutline /> <span>Filter</span>
          </button> */}
        </div>
      </header>

      {bookings?.length >= 1 ? (
        <div className='overflow-auto scrollbar-hide w-full'>
          <table className='w-full text-left'>
            <thead className='border-b border-dashgrey'>
              <tr>
                <th className='py-4 px-5'>Business Name</th>
                <th className='py-4 px-5'>Date</th>
                <th className='py-4 px-5'>Price</th>
                <th className='py-4 px-5'>Status</th>
                <th className='py-4 px-5'></th>
              </tr>
            </thead>
            <tbody className='w-full'>
              {filteredBookings?.map((item, index) => {
                const startDate = item?.bookings[0]?.start_date
                const endDate = item?.bookings[0]?.end_date
                const status = getStatus(startDate, endDate)

                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={clsx(
                        'border-b border-dashgrey last:border-b-0 '
                      )}
                    >
                      <td className='py-4 px-5'>
                        <div className='flex flex-col justify-start items-start gap-2'>
                          <h4 className='font-semibold'>
                            {item?.bookings[0]?.workspace?.name}
                          </h4>
                          <span className='text-lightgrey text-sm'>
                            {item?.bookings[0]?.workspace?.address}
                          </span>
                        </div>
                      </td>

                      <td className='py-4 px-5'>
                        <div className=''>
                          {moment
                            .utc(item?.bookings[0]?.start_date)
                            .format('LLL')}{' '}
                        </div>
                      </td>
                      <td className='py-4 px-5'>
                        <div className=''>{item?.amount_paid} </div>
                      </td>
                      <td className='py-4 px-5'>
                        <div
                          className={`p-2 flex justify-center items-center rounded-md capitalize ${getStatusClass(
                            status
                          )}`}
                        >
                          {status}
                        </div>
                      </td>
                      <td className='py-4 px-5'>
                        <button
                          onClick={() => handleButtonClick(item?.id, item)}
                          className='flex justify-start items-center gap-2'
                        >
                          <span className='text-primary'>Details</span>
                          <BiSolidRightArrow className='text-primary' />
                        </button>
                      </td>
                    </tr>

                    {spaceModal === item.id && (
                      <tr>
                        <td colSpan={5}>
                          <div className='flex justify-start items-start gap-3 w-full py-2 px-5 h-auto lg:flex-row md:flex-row sm:flex-col'>
                            <Image
                              src={item?.bookings[0]?.workspace.photos[0].url}
                              alt='service image'
                              width={300}
                              height={450}
                              className='object-cover object-center h-[300px] '
                            />

                            <div className='flex flex-col justify-start items-start gap-3'>
                              <div className='flex flex-col justify-start items-start gap-2'>
                                <h4 className='uppercase text-[10px] font-semibold'>
                                  services
                                </h4>
                                {item?.bookings?.map((services) => {
                                  return (
                                    <div
                                      key={services?.id}
                                      className='flex justify-start items-start gap-x-2 flex-wrap divide-x divide-gray'
                                    >
                                      <span>
                                        {
                                          services?.user_space_services[0]
                                            ?.space_service?.name
                                        }
                                      </span>
                                      <span className='px-2'>
                                        {
                                          services?.user_space_services[0]
                                            ?.space_service?.type
                                        }
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>

                              <div className='flex flex-col gap-2'>
                                <h4 className='uppercase text-[10px] font-semibold'>
                                  ratings
                                </h4>
                                <WorkSpaceRating
                                  rating={item?.bookings[0]?.reviews}
                                  counter={false}
                                />
                              </div>

                              <div className='flex flex-col gap-2'>
                                <h4 className='uppercase text-[10px] font-semibold'>
                                  booked
                                </h4>
                                <span className=''>
                                  {moment
                                    .utc(item?.bookings[0]?.start_date)
                                    .format('LL')}
                                </span>
                              </div>

                              <div className='flex flex-col gap-2'>
                                <h4 className='uppercase text-[10px] font-semibold'>
                                  message owner
                                </h4>
                                <button
                                  type='button'
                                  onClick={startConversation}
                                  className='text-primary text-2xl'
                                >
                                  <BsChatDots />
                                </button>
                              </div>

                              <Link
                                href={`/booking/${item?.bookings[0]?.workspace?.slug}?sid=${item?.bookings[0]?.workspace?.id}`}
                              >
                                <div className='flex items-center gap-2 text-primary underline'>
                                  View listing <GoArrowUpRight />
                                </div>
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='m-auto flex flex-col justify-center items-center gap-4 h-[80vh]'>
          <Image
            src='/empty-booking.png'
            alt='no booking image'
            width={200}
            height={200}
            className='3xl:w-[300px] '
          />
          <p className='text-xl text-lightgrey 3xl:text-4xl'>
            No bookings yet!
          </p>
        </div>
      )}
    </main>
  )
}
