'use client'

import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Toggle from 'react-toggle'

import useCookieHandler from '../../../hooks/useCookieHandler'
import { getUserInfo } from '../../../redux/admin_user'

import './addOn.scss'

export default function NotificationComp() {
  const { t } = useTranslation()
  const userInfo = useSelector(getUserInfo)
  const { token } = useCookieHandler('user_token')

  const handlePrivarySecurity = async (type, value) => {
    if (!token) {
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/settings`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
            booking_email:
              type == 'booking email'
                ? value
                : userInfo?.settings?.booking_email,
            booking_push_notification:
              type == 'push notification'
                ? value
                : userInfo?.settings?.booking_push_notification,
            login_email:
              type == 'login email' ? value : userInfo?.settings?.login_email,
          }),
        }
      )
      const data = await res.json()
      if (data?.status !== true) {
        toast.error(data?.errors.message)
        return
      }

      // if (type == 'booking email') {
      //   setBookingEmail(value)
      // }
      // if (type == 'push notification') {
      //   setPushNotification(value)
      // }
      // if (type == 'login email') {
      //   setLoginEmail(value)
      // }

      // setTriggerRecall((prev) => prev + 1)
    } catch (error) {}
  }

  return (
    <main className='flex flex-col justify-start items-start gap-5 xxl:w-[60%] xl:w-[60%] lg:w-full md:w-full sm:w-full'>
      <form className='w-full flex flex-col justify-start items-start gap-5 '>
        <h2 className='text-lg font-medium'>{t('Login')}</h2>

        <div className='flex justify-between items-center w-full border border-gray rounded-lg p-5'>
          <label htmlFor='email'>{t('Email')}</label>

          <Toggle
            defaultChecked={userInfo?.settings?.login_email}
            icons={false}
            onChange={() =>
              handlePrivarySecurity(
                'login email',
                !userInfo?.settings?.login_email
              )
            }
          />
        </div>
      </form>

      <form className='w-full flex flex-col justify-start items-start gap-5'>
        <h2 className='text-lg font-medium'>{t('Bookings')}</h2>

        <div className='border border-gray rounded-lg p-5 flex flex-col justify-start gap-3 w-full'>
          <div className='flex justify-between items-center w-full'>
            <label htmlFor='email'>{t('Email')}</label>

            <Toggle
              defaultChecked={userInfo?.settings?.booking_email}
              icons={false}
              onChange={() =>
                handlePrivarySecurity(
                  'booking email',
                  !userInfo?.settings?.booking_email
                )
              }
            />
          </div>

          <hr className='w-full border-gray' />

          <div className='flex justify-between items-center w-full '>
            <label htmlFor='push_notification'>{t('Push notification')}</label>

            <Toggle
              defaultChecked={userInfo?.settings?.booking_push_notification}
              icons={false}
              onChange={() =>
                handlePrivarySecurity(
                  'push notification',
                  !userInfo?.settings?.booking_push_notification
                )
              }
            />
          </div>
        </div>
      </form>
    </main>
  )
}
