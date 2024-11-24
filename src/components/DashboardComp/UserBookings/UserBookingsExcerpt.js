import React, { useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { BiDotsHorizontal, BiDotsVertical, BiStar } from 'react-icons/bi'
import { FiDelete } from 'react-icons/fi'
import { BsEyeFill } from 'react-icons/bs'

import Rating from '../Businesses/rating'

const UserBookingExcerpt = ({ data, layout, deleteBookings }) => {
  const ref = useRef()
  const { t } = useTranslation()

  const [showCancel, setShowCancel] = useState(false)
  const [contextMenu, setContextMenu] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const dateInPastArrow = (firstDate, secondDate) =>
    firstDate.getTime() - new Date().getTime()

  const displayCancelDeterminer = async (workspaceType, bookingEndDate) => {
    let expiry =
      workspaceType === 'Hourly'
        ? 21600000
        : workspaceType === 'Daily'
        ? 43200000
        : 86400000
    const diff = dateInPastArrow(new Date(bookingEndDate))
    if (diff > expiry) {
      return true
    }
    return false
  }

  const shouldShowCancel = async () => {
    const result = await displayCancelDeterminer(
      data.bookings[0]?.workspace?.type.type,
      data.bookings[0]?.end_date
    )

    if (result) {
      setShowCancel(true)
      return
    }
    setShowCancel(false)
  }

  useEffect(() => {
    shouldShowCancel()
    const checkIfClickedOutside = (e) => {
      if (contextMenu && ref.current && !ref.current.contains(e.target)) {
        setContextMenu(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [contextMenu])

  return (
    <>
      {layout ? (
        <main className='flex justify-between items-center lg:gap-5 lg:h-[90px] md:gap-5 sm:gap-5  shadow-2fl rounded-md w-full'>
          <div className='xl:w-[25%] lg:w-[25%] md:w-[25%] sm:w-[50%] text-black flex flex-row gap-2 items-center'>
            <Image
              src={
                data?.bookings[0]?.workspace?.photos !== 0
                  ? data?.bookings[0]?.workspace?.photos[0].url
                  : 'https://cdn.pixabay.com/photo/2018/03/19/18/20/tea-time-3240766_960_720.jpg'
              }
              alt='space'
              width={90}
              height={60}
              className='max-w-24 h-16 rounded-lg object-cover object-center'
            />
            <span className='flex flex-col py-1'>
              {data?.bookings[0]?.workspace?.name}
              <span className='text-[10px]'>
                {data?.bookings[0]?.workspace?.address}
              </span>
            </span>
          </div>

          <div className='xl:w-[25%] lg:w-[25%] md:w-[25%] sm:w-[20%] lg:text-[14px] md:text-[12px] sm:text-[12px] text-black lg:flex lg:justify-center lg:items-center md:hidden sm:hidden'>
            {format(new Date(data.bookings[0].start_date), 'dd MMM yyyy')} -
            {format(new Date(data.bookings[0].end_date), 'dd MMM yyyy')}
          </div>

          <div className='xl:w-[10%] lg:w-[10%] md:w-[10%] lg:h-[36px] lg:flex lg:justify-center lg:items-center md:hidden sm:hidden px-3 rounded-md bg-dashgrey text-purple'>
            {data.bookings[0].status}{' '}
          </div>

          <div className='xl:w-[10%] lg:w-[10%] md:w-[10%] sm:w-[15%] text-black lg:text-[14px] md:text-[14px] sm:text-[12px] '>
            &#8358;{data.amount_paid}{' '}
          </div>

          <div className='xl:w-[5%] lg:w-[5%] md:w-[5%] sm:w-[7%] relative'>
            <button onClick={() => setContextMenu(data.id)} className='mr-5'>
              <BiDotsHorizontal className='text-2xl' />
            </button>

            {contextMenu === data.id && (
              <div
                ref={ref}
                className='absolute w-[120px] h-auto flex flex-col justify-center items-center mx-auto p-1 bg-white rounded-md shadow-2fl 
                z-10 lg:top-5 lg:right-12 sm:top-5 sm:right-4 '
              >
                <Link
                  href={`/dashboard/user/bookings/${data?.bookings?.[0]?.workspace?.slug}?bookingId=${data.id}`}
                  // as={`/dashboard/user/bookings/${data?.bookings?.[0]?.workspace?.slug}`}
                  className='hover:bg-white hover:text-black w-full h-[40px] flex justify-start items-center gap-2 px-2 rounded-md'
                >
                  <BsEyeFill />
                  Details
                </Link>

                {showCancel && (
                  <button
                    onClick={() => setDeleteModal(data.id)}
                    className='hover:bg-white w-full h-[40px] flex justify-start items-center gap-2 px-2 rounded-md'
                  >
                    <FiDelete />
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      ) : (
        <section className='grid grid-cols-1 shadow-2fl rounded-lg bg-white '>
          <div className='relative'>
            <Image
              className='w-full lg:h-[194px] md:h-[194px] sm:h-[150px] rounded-t-lg '
              src={
                data.bookings[0].workspace?.photos !== 0
                  ? data.bookings[0].workspace?.photos[0].url
                  : 'https://cdn.pixabay.com/photo/2018/03/19/18/20/tea-time-3240766_960_720.jpg'
              }
              alt='service image'
              width={300}
              height={300}
            />

            <button
              onClick={() => setContextMenu(data.id)}
              className='absolute top-3 right-3 z-10 '
            >
              <BiDotsVertical />
            </button>

            {contextMenu === data.id && (
              <div
                ref={ref}
                className='absolute w-[120px] h-[100px] flex flex-col justify-center items-center mx-auto px-1 bg-white rounded-md shadow-2fl 
                z-10 lg:top-5 lg:right-12 sm:top-5 sm:right-4'
              >
                <Link
                  href={`/dashboard/user/bookings/${data?.bookings?.[0]?.workspace?.slug}?bookingId=${data.id}`}
                  // as={`/dashboard/user/bookings/${data?.bookings?.[0]?.workspace?.slug}`}
                  className='hover:bg-white w-full h-[40px] flex justify-start items-center gap-2 px-2 rounded-md'
                >
                  <BsEyeFill />
                  Details
                </Link>

                <button
                  onClick={() => setDeleteModal(data.id)}
                  className='hover:bg-white w-full h-[40px] flex justify-start items-center gap-2 px-2 rounded-md'
                >
                  <FiDelete />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className='flex justify-between items-center px-1'>
            <div className='flex flex-col p-2'>
              <div className='flex flex-col gap-2'>
                <span className='flex flex-row items-center gap-2'>
                  <p className=''> {data.bookings[0]?.workspace?.name} </p>
                  <BiStar />
                  <span className='text-gold font-medium'>
                    {' '}
                    <Rating rating={data.bookings[0]?.workspace.reviews} />{' '}
                  </span>
                </span>
                <span className=' text-[14px]'> Space name </span>
              </div>
            </div>

            <p className='h-[36px] flex justify-center items-center px-3 rounded-md bg-lightgrey text-[#26A746]'>
              {data.bookings[0].status}{' '}
            </p>
          </div>
          <hr className='w-full border border-lightgrey' />

          <div className='flex lg:flex-row lg:justify-between lg:items-center px-4'>
            <div className='flex flex-col gap-2 py-2 '>
              <span className='text-gray-500  lg:text-[14px] md:text-[12px] sm:text-[12px]'>
                {format(new Date(data.bookings[0].start_date), 'dd MMM yyyy')} -{' '}
                {format(new Date(data.bookings[0].end_date), 'dd MMM yyyy')}
              </span>
              <span className=''> Date </span>
            </div>
          </div>

          <div className='grid lg:grid-cols-2 p-4'>
            <div className='flex flex-col'>
              <span className=''>&#8358; {data.amount_paid}</span>
              <span className=' text-[14px]'> Price </span>
            </div>

            <div className='flex flex-col justify-start items-start'>
              <span className='flex flex-row items-center gap-1 text-[12px]'>
                {/* <img src='/location2.png' alt='location' className='w-3 h-3' /> */}
                {data.bookings[0].workspace.address}
              </span>
              <span className=' text-[14px]'> Address </span>
            </div>
          </div>

          {/* {deleteModal === data.id && (
            <>
              <div className='overlay'></div>
              <article
                ref={ref}
                className='lg:h-[198px] lg:w-[400px] lg:left-[15rem] md:w-[400px] md:h-[198px] md:left-[10rem] sm:left-[10px] sm:w-[90%] sm:h-[190px]
              gap-1 mx-auto px-5 bg-white shadow-2fl rounded-md absolute z-10 flex flex-col justify-center  '
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M4 7H20'
                    stroke='#DA3D2A'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M10 11V17'
                    stroke='#DA3D2A'
                    fill='#DA3D2A'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M14 11V17'
                    stroke='#DA3D2A'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7'
                    stroke='#DA3D2A'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7'
                    stroke='#DA3D2A'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>

                <p className='font-semibold pt-2'>
                  {' '}
                  {t('Are you sure you want to cancel this booking?')}{' '}
                </p>
                <span>
                  {' '}
                  {t('There is no trash bin. You cannot restore it')}{' '}
                </span>

                <div className='flex gap-5 ml-auto justify-end flex-end pt-6 '>
                  <button
                    onClick={() => setDeleteModal(false)}
                    className='w-[79px] h-[38px] bg-transparent border border-lightgrey rounded-md'
                  >
                    {' '}
                    Cancel{' '}
                  </button>

                  <button
                    onClick={() => deleteBookings(data.id)}
                    className='bg-danger w-[79px] h-[38px] text-white rounded-md '
                  >
                    {' '}
                    Delete{' '}
                  </button>
                </div>
              </article>
            </>
          )} */}
        </section>
      )}

      {deleteModal === data.id && (
        <>
          <div className='overlay'></div>
          <article
            ref={ref}
            className='lg:h-[198px] lg:w-[400px] lg:left-[15rem] md:w-[400px] md:h-[198px] md:left-[10rem] sm:left-[10px] sm:w-[90%] sm:h-[190px]
              gap-1 mx-auto px-5 bg-white shadow-2fl rounded-md absolute z-10 flex flex-col justify-center  '
          >
            <FiDelete className='text-5xl' />

            <p className='font-semibold pt-2'>
              {' '}
              {t('Are you sure you want to cancel this booking?')}{' '}
            </p>
            <span> {t('There is no trash bin. You cannot restore it')} </span>

            <div className='flex gap-5 ml-auto justify-end flex-end pt-6 '>
              <button
                onClick={() => setDeleteModal(false)}
                className='w-[79px] h-[38px] bg-transparent border border-lightgrey rounded-md'
              >
                {' '}
                Cancel{' '}
              </button>

              <button
                onClick={() => deleteBookings(data.id)}
                className='bg-danger w-[79px] h-[38px] text-white rounded-md '
              >
                {' '}
                Delete{' '}
              </button>
            </div>
          </article>
        </>
      )}
    </>
  )
}

export default UserBookingExcerpt
