'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import moment from 'moment'

import useCookieHandler from '../../../hooks/useCookieHandler'
import ServicesPaginationComp from '../Businesses/ServicesPaginationComp'

import { setActivites } from '../../../redux/accountActivitiesSlice'

export default function AccountActivities() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { token } = useCookieHandler('user_token')

  const [failure, setFailure] = useState(false)
  const [loadings, setLoadings] = useState(true)
  const [lastPage, setLastPage] = useState(null)
  const [currentPagination, setCurrentPagination] = useState(1)

  const data = useSelector((state) => state.activity.activities)

  const getActivities = async (page = 1) => {
    if (!token) return
    setLoadings(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/login/activities?page=${page}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
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
        dispatch(setActivites(data?.data))
        setLastPage(data?.data?.last_page)
      }

      if (data?.status === false) {
        setLoadings(false)
        setFailure(true)
      }
    } catch (error) {
      setLoadings(false)
      setFailure(false)
    }
  }

  useEffect(() => {
    getActivities(currentPagination)
  }, [token, currentPagination, dispatch])

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPagination(selectedPage + 1)
    setLoadings(true)
    getActivities(selectedPage + 1)
      .then(() => setLoadings(false))
      .catch(() => {
        setLoadings(false)
        setFailure(true)
      })
  }

  return (
    <main className='flex flex-col justify-start items-start gap-5  '>
      <div className='xxl:w-full xl:w-full md:w-full sm:min-w-[650px] overflow-auto scrollbar-hide'>
        <section className='grid grid-cols-12 content-between gap-2 py-3 px-5 w-full border-b border-gray lg:gap-5 '>
          <span className='col-span-2 font-semibold lg:text-base md:text-base sm:text-sm'>
            {' '}
            Date & Time{' '}
          </span>
          <span className='col-span-2 font-semibold lg:text-base md:text-base sm:text-sm '>
            {' '}
            Device{' '}
          </span>
          <span className='col-span-2 font-semibold lg:text-base md:text-base sm:text-sm'>
            {' '}
            Browser{' '}
          </span>

          <span className='col-span-2 font-semibold lg:text-base md:text-base sm:text-sm'>
            {' '}
            Platform{' '}
          </span>
          <span className='col-span-2 font-semibold lg:text-base md:text-base sm:text-sm'>
            {' '}
            IP address{' '}
          </span>
          <span className='col-span-2 font-semibold lg:text-base md:text-base sm:text-sm'>
            {' '}
            User Activity{' '}
          </span>
        </section>

        <section className='w-full '>
          {data.data
            ?.slice()
            ?.sort((a, b) => moment(a.created_at).diff(moment(b.created_at)))
            .map((activity) => {
              return (
                <div
                  key={activity.id}
                  className='grid grid-cols-12 content-between gap-2 py-3 px-5 w-full border-b border-gray last:border-b-0 lg:gap-5  '
                >
                  <span className='col-span-2 lg:text-base md:text-base sm:text-sm'>
                    {' '}
                    {moment(activity.created_at).format('LLL')}{' '}
                  </span>
                  <span className='col-span-2 lg:text-base md:text-base sm:text-sm capitalize'>
                    {' '}
                    {activity.device}{' '}
                  </span>
                  <span className='col-span-2 lg:text-base md:text-base sm:text-sm'>
                    {' '}
                    {activity.browser}{' '}
                  </span>

                  <span className='col-span-2 lg:text-base md:text-base sm:text-sm'>
                    {' '}
                    {activity.platform}{' '}
                  </span>
                  <span className='col-span-2 lg:text-base md:text-base sm:text-sm'>
                    {' '}
                    {activity.ip_address}{' '}
                  </span>
                  <span className='col-span-2 lg:text-base md:text-base sm:text-sm'>
                    {' '}
                    {activity.user_activity}{' '}
                  </span>
                </div>
              )
            })
            .reverse()}
        </section>
      </div>

      <ServicesPaginationComp
        pageCount={lastPage}
        handlePageClick={handlePageChange}
      />
    </main>
  )
}
