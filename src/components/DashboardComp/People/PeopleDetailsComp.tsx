'use client'

import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { GET_PEOPLE_DETAILS } from '../../../api/peopleRoutes'
import { handleResponse } from '../../../api/router'
import { People } from '../../../global/types'
import { useLimitedRoute } from '../../../hooks'
import { getUserInfo } from '../../../redux/admin_user'
import { getAppToken } from '../../../utils'
import Loader from '../../Loader/Loader'

export default function PeopleDetailsComp({ id }) {
  const { t } = useTranslation()
  const router = useRouter()
  const token = getAppToken()

  const [peopleDetails, setPeopleDetails] = useState<People | null>(null)
  const [loading, setLoading] = useState(true)
  const [failure, setFailure] = useState(false)
  const [sendMessageRequested, setSendMessageRequest] = useState(false)

  const { success, errorAuth, loadingfinished } = useLimitedRoute('Owner')

  const user = useSelector(getUserInfo)

  const getPoepleDeatils = async () => {
    setLoading(true)
    try {
      const res = await GET_PEOPLE_DETAILS(token, id)

      const { data, status, error } = handleResponse<People>(res)

      if (status) {
        setPeopleDetails(data)
        setLoading(false)
        setFailure(false)
      } else {
        throw new Error('An error occurred, kindly try again')
      }
    } catch (error) {
      setFailure(true)
      setLoading(false)
    } finally {
      setFailure(false)
      setLoading(false)
    }
  }

  // geting user details
  useEffect(() => {
    getPoepleDeatils()
  }, [token])

  const handleSendMessage = async () => {
    let newConvoInitMe = {
      id: user?.id,
      name: `${user?.first_name} ${user?.last_name}`,
      email: user?.email,
      photoUrl: user?.profile_url,
      welcomeMessage: '',
      role: 'default',
    }
    let otherUserConvoInfo = {
      id: peopleDetails?.id,
      name: `${peopleDetails?.first_name} ${peopleDetails?.last_name}`,
      email: peopleDetails?.email,
      photoUrl: peopleDetails?.profile_url,
      welcomeMessage: '',
      role: '',
    }
    window.localStorage.setItem(
      'newConvoInitMe',
      JSON.stringify(newConvoInitMe)
    )
    window.localStorage.setItem(
      'otherUserConvoInfo',
      JSON.stringify(otherUserConvoInfo)
    )
    setSendMessageRequest(!sendMessageRequested)
    router.push('/dashboard/inbox')
  }

  return (
    <>
      <Loader failure={failure} isLoading={loading} />
      <section className='flex flex-col justify-start items-start gap-3 w-full 3xl:p-10 xl:p-10 md:p-10 sm:p-5'>
        <article className='grid grid-cols-1 gap-5 w-full lg:grid-cols-3 '>
          <div className='col-span-1 grid grid-cols-1 content-center place-items-center gap-5 p-5 shadow-2fl rounded-lg bg-white '>
            <Image
              src={
                peopleDetails?.profile_url !== null
                  ? peopleDetails?.profile_url
                  : peopleDetails?.gender === 'Male'
                  ? 'https://d3upyygarw3mun.cloudfront.net/men_dark.png'
                  : 'https://d3upyygarw3mun.cloudfront.net/girl_light.png'
              }
              alt='profile picture'
              width={70}
              height={70}
              className='w-[70px] h-[70px] bg-cover bg-top rounded-full'
            />

            <h1 className='font-semibold '>
              {peopleDetails?.first_name} {peopleDetails?.last_name}
            </h1>

            <div className='flex justify-between items-center divide-x '>
              <div className='flex flex-col justify-center items-center px-4 '>
                <span className='text-[20px] font-medium'>
                  {peopleDetails?.booked_workspaces?.length}
                </span>
                <span className='text-[14px] font-light'>
                  {t('Businesses')}
                </span>
              </div>
            </div>

            <button
              type='button'
              onClick={handleSendMessage}
              className='w-[80%] h-14 border border-lightgrey flex items-center justify-center rounded-lg hover:bg-primary hover:text-white'
            >
              Send Message
            </button>
          </div>

          <div className='col-span-2 grid grid-cols-2 content-start place-items-start gap-5 w-full bg-white shadow-2fl rounded-md p-5'>
            <div className='people_underline flex flex-col gap-2 lg:mt-4 break-all '>
              <span className='text-sm text-primary '>{t('Email')}</span>
              <span className='font-medium '>{peopleDetails?.email}</span>
            </div>

            <div className='people_underline flex flex-col gap-2 lg:mt-4 '>
              <span className='text-sm text-primary '>{t('Phone Number')}</span>
              <span className='font-medium'>
                {peopleDetails?.phone_number !== null
                  ? peopleDetails?.phone_number
                  : 'Not filled'}
              </span>
            </div>

            <div className='people_underline flex flex-col gap-2 lg:py-3 break-all '>
              <span className='text-sm text-primary '>{t('Address')}</span>
              <span className='font-medium'>
                {peopleDetails?.address !== null
                  ? peopleDetails?.address
                  : 'Not filled'}
              </span>
            </div>

            {/* <div className='people_underline flex flex-col gap-2 lg:py-3 '>
              <span className='text-sm text-primary '>{t('Membership')}</span>
              <span className='font-medium'>{t('Customer')}</span>
            </div> */}

            {/* <div className='flex flex-col gap-2 lg:py-3 '>
              <span className='text-[14px] text-primary '>
                {t('Membership Status')}
              </span>
              <span className='font-medium'>{t('Active')}</span>
            </div> */}

            <div className='flex flex-col gap-2 lg:py-3 '>
              <span className='text-sm text-primary '>
                {t('Registration Date')}
              </span>
              <span className='font-medium'>
                {moment(peopleDetails?.created_at).format('LL')}
              </span>
            </div>
          </div>

          <div className='col-span-2 grid grid-cols-1 content-start place-items-center gap-3 w- h-[45vh] bg-white rounded-md shadow-2fl p-5 overflow-auto scrollbar-hide '>
            <h1 className='flex justify-start items-start gap-2 text-left mr-auto font-semibold'>
              <span className='text-primary'>
                {peopleDetails?.booked_workspaces.length}
              </span>
              {t('Businesses')}
            </h1>

            {peopleDetails?.booked_workspaces?.map((workspace, key) => (
              <section
                key={key}
                className='flex justify-between items-center gap-5 shadow-2fl rounded-lg p-2 w-full '
              >
                <div className='flex items-center lg:w-[40%] md:w-[40%] h-auto gap-2'>
                  <Image
                    src={
                      workspace?.photos
                        ? workspace?.photos[0].url
                        : 'https://d3upyygarw3mun.cloudfront.net/coding_set.jpeg'
                    }
                    alt='Image'
                    width={70}
                    height={70}
                    className='flex w-[80px] h-auto rounded-lg object-cover object-center '
                  />

                  <div className='flex flex-col'>
                    <span className='text-primary text-[12px] '>
                      {t('Business Name')}
                    </span>
                    <span className=' font-medium'>{workspace?.name}</span>
                  </div>
                </div>

                <div className='flex flex-col lg:mr-4 lg:w-[10%] md:w-[10%] md:mr-0 sm:w-[20%]'>
                  <span className='text-primary '> {t('Price')} </span>
                  <span className='font-medium'>&#8358;{workspace?.price}</span>
                </div>

                <div className='flex flex-col lg:w-[30%] md:w-[30%] sm:w-[30%]'>
                  <span className='text-primary '> {t('Location')} </span>
                  <span className=' font-medium'>{workspace?.address}</span>
                </div>
              </section>
            ))}
          </div>
        </article>
      </section>
    </>
  )
}
