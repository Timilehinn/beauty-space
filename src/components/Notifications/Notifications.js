'use client'

import moment from 'moment'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { BiBell, BiCalendar, BiCheckDouble, BiUser } from 'react-icons/bi'
import { GrTransaction } from 'react-icons/gr'
import { TbLayoutGridAdd } from 'react-icons/tb'
import QuickSvg from '../../assets/icons/quickChat.svg'
import {
  getEmptyNotification,
  getFailure,
  getLoadingNotification,
  getNextUrl,
  getNotifications,
  setLoadingNotification,
  setNextUrl,
  setNotifications,
} from '../../redux/dashboard_related'
import { getAppToken } from '../../utils'
import Loader from '../Loader/Loader'

export default function NotificationsComp() {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const token = getAppToken()

  const [currentPagination, setCurrentPagination] = useState(1)

  const nextUrl = useSelector(getNextUrl)
  const failure = useSelector(getFailure)
  const loading = useSelector(getLoadingNotification)
  const notifications = useSelector(getNotifications)
  const emptyNotifications = useSelector(getEmptyNotification)

  const fetchNotifications = async (page = 1) => {
    dispatch(setLoadingNotification(true))

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/notifications?page=${page}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res?.json()
      if (data?.status === true) {
        const isUnread = data?.data?.data?.filter((x) => x?.seen === false)

        dispatch(setLoadingNotification(false))
        dispatch(setNotifications(data?.data.data))
        dispatch(setNextUrl(data?.data?.next_page_url))
      } else {
        dispatch(setLoadingNotification(false))
        toast.error('Error fetching notifications')
        return
      }
    } catch (error) {
      dispatch(setLoadingNotification(false))
    }
  }

  /**
   * The function `markAllAsSeen` asynchronously marks all notifications as seen by sending a POST
   * request for each notification and updating the local state accordingly.
   * @returns The `markAllAsSeen` function is returning a Promise.
   */
  const markAllAsSeen = async () => {
    try {
      // Create an array of promises for marking each notification as seen
      const markAsSeenPromises = notifications.map((notification) => {
        return fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/notifications/${notification.id}`,
          {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
      })

      // Wait for all promises to resolve
      await Promise.all(markAsSeenPromises)

      // Update local state to mark all notifications as seen
      dispatch(
        setNotifications(
          notifications.map((notification) => ({
            ...notification,
            seen: true,
          }))
        )
      )

      toast.success('All notifications marked as seen')
    } catch (error) {
      toast.error('Error marking notifications as seen')
    }
  }

  /**
   * The `handlePageChange` function updates the current pagination, fetches notifications for the
   * selected page, and handles loading notifications.
   * @param selectedPage - The `selectedPage` parameter in the `handlePageChange` function represents the
   * page number that the user has selected for pagination.
   */
  const handlePageChange = (selectedPage) => {
    setCurrentPagination(selectedPage + 1)
    dispatch(setLoadingNotification(false))
    fetchNotifications(selectedPage + 1)
      .then(() => dispatch(setLoadingNotification(false)))
      .catch(() => {
        dispatch(setLoadingNotification(false))
      })
  }

  useEffect(() => {
    fetchNotifications(currentPagination)
  }, [currentPagination, token, dispatch])

  return (
    <>
      <Loader failure={failure} isLoading={loading} />

      <main className='flex flex-col justify-start items-start gap-5 lg:p-10 md:p-10 sm:p-5 '>
        <div className='flex justify-between items-center gap-5 w-full'>
          <h1 className='text-[24px]'>{t('Notifications')}</h1>

          <button
            onClick={markAllAsSeen}
            className='text-primary flex items-center gap-2'
          >
            {t('Mark all as seen')} <BiCheckDouble />
          </button>
        </div>

        {emptyNotifications ? (
          <div className=''>
            <Image src={QuickSvg} width={120} height={120} alt='empty svg' />
            <p className=' text-xl font-semibold'>{t('No Notification!')}</p>
            <p>
              {t(
                'You have no notification yet. Your notification will be displayed here'
              )}
            </p>
          </div>
        ) : (
          <section className='flex flex-col justify-start items-start w-full'>
            {notifications?.map((item) => {
              return (
                <div
                  key={item.id}
                  className='w-full flex justify-start item-center gap-5 py-3 border-b border-gray last:border-none'
                >
                  {item.event === 'Bookings' && (
                    <span className='h-9 w-9 bg-white shadow-2fl rounded-full p-2 ring-2 ring-gray'>
                      <BiCalendar size={18} />
                    </span>
                  )}

                  {item.event === 'User Account' && (
                    <span className='h-9 w-9 bg-white shadow-2fl rounded-full p-2 ring-2 ring-gray'>
                      <BiUser size={18} />
                    </span>
                  )}

                  {item.event === 'Transactions' && (
                    <span className='h-9 w-9 bg-white shadow-2fl rounded-full p-2 ring-2 ring-gray'>
                      <GrTransaction size={18} />
                    </span>
                  )}

                  {item.event === 'Spaces' && (
                    <span className='h-9 w-9 bg-white shadow-2fl rounded-full p-2 ring-2 ring-gray'>
                      <TbLayoutGridAdd size={18} />
                    </span>
                  )}

                  {item.event !== 'Transactions' ||
                    item.event !== 'User Account' ||
                    (item.event !== 'Bookings' && (
                      <span className='h-9 w-9 bg-white shadow-2fl rounded-full p-2 ring-2 ring-gray'>
                        <BiBell size={18} />
                      </span>
                    ))}

                  <div className='flex justify-between items-center gap-5 w-full'>
                    <div className='flex flex-col justify-start items-start gap-2'>
                      <p className=''>
                        <span className='font-semibold'>{t(item?.event)}:</span>{' '}
                        <span> {t(item?.message)}</span>
                      </p>
                      <span className='text-primary text-sm'>
                        {t(moment(item?.updated_at).startOf('hour').fromNow())}
                      </span>
                    </div>

                    {item.seen === false && (
                      <div className='w-2 h-2 rounded-full bg-primary' />
                    )}
                  </div>
                </div>
              )
            })}
          </section>
        )}

        {nextUrl && (
          <button
            onClick={() => handlePageChange(currentPagination)}
            className='w-[150px] h-12 bg-primary text-white px-4 rounded-md mx-auto flex justify-center items-center'
          >
            {t('Load More')}
          </button>
        )}
      </main>
    </>
  )
}
