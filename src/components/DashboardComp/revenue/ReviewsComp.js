'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { IoStar, IoStarOutline } from 'react-icons/io5'
import Image from 'next/image'
import Link from 'next/link'
import Rating from 'react-rating'
import moment from 'moment'

import { FaRegStar } from 'react-icons/fa6'
import { LiaCommentDots } from 'react-icons/lia'

import useCookieHandler from '../../../hooks/useCookieHandler'
import TotalRating from './totalRating'
import Loader from '../../Loader/Loader'

import {
  getReviewsData,
  getTotalRatings,
  getTotalReviews,
  setReviewsData,
  setTotalReviews,
} from '../../../redux/insightSlice'

import { getAccountType } from '../../../redux/admin_user'

export default function ReviewsComp() {
  const dispatch = useDispatch()

  const { token } = useCookieHandler('user_token')

  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [lastPage, setLastPage] = useState(null)
  const [sortOrder, setSortOrder] = useState('latest')
  const [currentPagination, setCurrentPagination] = useState(1)

  const accountType = useSelector(getAccountType)
  const usersReviews = useSelector(getReviewsData)
  const totalReviews = useSelector(getTotalReviews)
  const totalRatings = useSelector(getTotalRatings)

  const getUserReviews = async (page = 1) => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/reviews?page=${page}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()

      if (data?.status === true) {
        dispatch(setReviewsData(data?.data?.data))
        dispatch(setTotalReviews(data?.data?.total))
        setLastPage(data?.data?.last_page)
        setLoading(false)
        setFailure(false)
      }
    } catch (err) {
      setLoading(false)
      setFailure(true)
    }
  }

  const getUsersReviewsRatings = async (rate) => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/reviews?rating=${rate}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()
      if (data?.status === true) {
        dispatch(setReviewsData(data?.data?.data))
        dispatch(setTotalReviews(data?.data?.total))
        setLastPage(data?.data?.last_page)
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
    getUserReviews(currentPagination)
  }, [token, dispatch, currentPagination])

  const ratingButtons = [
    { rating: 'All', onClick: () => getUserReviews(1) },
    { rating: 5, onClick: () => getUsersReviewsRatings(5) },
    { rating: 4, onClick: () => getUsersReviewsRatings(4) },
    { rating: 3, onClick: () => getUsersReviewsRatings(3) },
    { rating: 2, onClick: () => getUsersReviewsRatings(2) },
    { rating: 1, onClick: () => getUsersReviewsRatings(1) },
  ]

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPagination(selectedPage + 1)
    setLoading(true)
    getUserReviews(selectedPage + 1)
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setFailure(true)
      })
  }

  const handleSortChange = (event) => {
    setSortOrder(event.target.value)
  }

  return (
    <>
      <Loader
        failure={failure} //if your api or state fails and page should not show
        isLoading={loading} //if your api or state is still fetching
        redirectTo={
          accountType === 'Owner' ? '/dashboard/revenue' : '/dashboard/expenses'
        }
      />

      <section className='w-full flex flex-col justify-start items-start gap-5 overflow-auto xxl:h-[75vh] xl:h-[75vh] lg:h-[70vh] md:h-[80vh] '>
        <header className='flex justify-start items-center shadow-2xl bg-white h-14 rounded-xl'>
          {ratingButtons?.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`border border-gray h-full px-3 text-sm ${
                button.rating === 'All' ? 'rounded-l-xl' : ''
              }`}
            >
              {button.rating === 'All' ? (
                <span className='px-2'>{button.rating}</span>
              ) : (
                <span className='flex items-center gap-1'>
                  {button.rating}
                  <IoStarOutline />
                </span>
              )}
            </button>
          ))}
        </header>

        <div className='flex lg:w-auto lg:flex-row-reverse md:flex-row-reverse sm:flex-col-reverse justify-start items-center gap-3 w-full'>
          <div className='lg:w-[20rem] h-[10rem] w-full bg-white shadow-2fl p-5 rounded-lg flex flex-col justify-around items-start gap-5 '>
            <div className='flex items-center gap-2'>
              <FaRegStar className='text-lg' />
              <span className='text-base'>Total Ratings</span>
            </div>

            <div className='text-6xl'>
              {totalReviews > 0 ? (
                <TotalRating rating={usersReviews} />
              ) : (
                <div className='flex items-end gap-3'>
                  <h1 className=''>0.0</h1>
                  <span className='text-lightgrey text-base font-normal'>
                    {totalReviews} ratings
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className='lg:w-[20rem] h-[10rem] w-full bg-white shadow-2fl p-5 rounded-lg flex flex-col justify-around items-start gap-3 '>
            <div className='flex items-center gap-2'>
              <LiaCommentDots className='text-lg' />
              <span className='text-base '>Total Review</span>
            </div>
            <div className='text-6xl'>
              {totalReviews > 0 ? (
                <span className='text-lg'>{totalReviews}</span>
              ) : (
                <h1 className=''>0</h1>
              )}
            </div>
          </div>
        </div>

        <section className='bg-white rounded-lg p-5 w-full h-full flex flex-col justify-start items-start gap-3'>
          <div className='flex justify-between items-center w-full'>
            <h4 className='text-lg'>Reviews</h4>
            {totalReviews >= 1 && (
              <select
                name='sortOrder'
                id='sortOrder'
                onChange={handleSortChange}
                className='border border-lightgrey outline-none h-10 rounded-md'
              >
                <option value='latest'>Sory by latest</option>
                <option value='oldest'>Sory by oldest</option>
              </select>
            )}
          </div>

          {totalReviews >= 1 ? (
            <div className='flex flex-col justify-start items-start gap-5 w-full'>
              {usersReviews?.map((item) => {
                return (
                  <div
                    key={item?.id}
                    className='border border-gray p-5 rounded-md flex flex-col justify-start items-start gap-3 w-full '
                  >
                    <div className='flex justify-start items-start gap-3 lg:flex-row md:flex-row sm:flex-col'>
                      <Image
                        src={item?.workspace?.photos[0]?.url}
                        alt='Business picture'
                        width={100}
                        height={100}
                        className='object-cover object-top w-[100px] h-[100px] rounded-l-xl '
                      />
                      <div className='flex flex-col justify-start items-start gap-3'>
                        <div className='flex flex-col justify-start items-start gap-1'>
                          <h3 className=''>{item?.workspace?.name}</h3>
                          <span className='text-lightgrey'>
                            {item?.workspace?.address}
                          </span>
                        </div>

                        <Link
                          href={`/booking/${item?.workspace?.slug}?sid=${item?.workspace?.id}`}
                          className='underline text-primary'
                        >
                          View listing
                        </Link>
                      </div>
                    </div>
                    <hr className='w-full border-b border-gray' />
                    <div className='flex flex-col justify-start items-start gap-1'>
                      <span className=''>
                        {moment.utc(item?.workspace?.created_at).format('LL')}
                      </span>
                      <Rating
                        readonly
                        initialRating={item?.rating}
                        emptySymbol={<IoStarOutline />}
                        fullSymbol={<IoStar className='text-purple' />}
                      />
                      <p className=''>{item?.review}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center gap-3 m-auto '>
              <LiaCommentDots className='text-[5rem] text-lightgrey' />
              <p className='text-lightgrey'>No review available yet</p>
            </div>
          )}

          {totalReviews > 20 && (
            <button
              type='button'
              onClick={handlePageChange}
              className='mx-auto flex justify-center items-center rounded-full h-12 px-4 py-2 bg-gray'
            >
              View more{' '}
            </button>
          )}
        </section>
      </section>
    </>
  )
}
