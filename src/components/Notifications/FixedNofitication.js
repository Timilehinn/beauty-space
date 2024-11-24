'use client'

import moment from 'moment'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { MdMessage } from 'react-icons/md'

import SmallQuickSvg from '../../assets/icons/SmallQuickChat.svg'
import {
  getEmptyNotification,
  getNotifications,
} from '../../redux/dashboard_related'

const FixedNofitication = ({ setOpenNotification }) => {
  const contextRef = useRef()
  const { t } = useTranslation()

  const notifications = useSelector(getNotifications)
  const emptyNotifications = useSelector(getEmptyNotification)

  const handleClickOutside = (event) => {
    if (contextRef.current && !contextRef.current.contains(event.target)) {
      setOpenNotification(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <main className='fixed w-full h-screen top-0 left-0 bg-lightblack z-20 flex lg:justify-end lg:items-end sm:justify-center sm:items-center '>
      <section
        ref={contextRef}
        className='bg-white absolute h-[400px] overflow-y-auto scrollbar-hide p-5 rounded-lg lg:top-14 lg:right-10 lg:w-[30%] md:top-10 sm:top-12 sm:w-[95%] '
      >
        {emptyNotifications ? (
          <div className=''>
            <Image
              src={SmallQuickSvg}
              width={120}
              height={120}
              alt='empty svg'
            />
            <p className='text-lg font-semibold'>{t('No Notification!')}</p>
            <span className='text-sm'>
              {t(
                'You have no notification yet. Your notification will be displayed here'
              )}
            </span>
          </div>
        ) : (
          <div className='flex flex-col justify-start items-start gap-5 w-full '>
            <div className='flex justify-between items-center w-full'>
              <h1 className='text-[16px] '>{t('Notifications')}</h1>
              <Link
                href='/dashboard/notifications'
                className='cursor-pointer text-[16px] text-primary'
                onClick={() => setOpenNotification(false)} // Added this line
              >
                {t('View all')}
              </Link>
            </div>

            <div className='flex flex-col justify-start items-start w-full'>
              {notifications?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className='flex justify-start item-center gap-3 cursor-pointer py-3 border-b border-gray last:border-none'
                  >
                    <span className='bg-white rounded-full shadow-2fl ring-2 ring-gray w-7 h-7 flex justify-center items-center p-2 text-sm '>
                      <MdMessage />
                    </span>

                    <p className='font-bold text-[13px]'>
                      {t(item?.event)}:{' '}
                      <span className='font-normal text-black '>
                        {t(item?.message)}
                      </span>
                      <span className='font-medium text-primary pl-2 '>
                        {t(moment(item?.updated_at).startOf('hour').fromNow())}
                      </span>
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default FixedNofitication
