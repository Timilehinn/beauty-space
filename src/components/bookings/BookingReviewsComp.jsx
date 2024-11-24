'use client'

import React, { useState, useLayoutEffect } from 'react'
import Image from 'next/image'
import moment from 'moment'
import parse from 'html-react-parser'
import { IoStar } from 'react-icons/io5'

import WorkSpaceRating from '../rating'
import RatingBreakdown from '../rating-breakdown'

export default function BookingReviewsComp({ id }) {
  const [Rating, setRating] = useState([])
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [lastPage, setLastPage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [currentPagination, setCurrentPagination] = useState(0)
  const [sortOrder, setSortOrder] = useState('latest')

  function sumArr(arr) {
    return arr.reduce((x, y) => x + y, 0)
  }

  const calculateRatingAvg = (reviewsArrays) => {
    let reviewsArr = []
    const pushingRating = reviewsArrays?.map((item) => {
      reviewsArr = [...reviewsArr, item?.rating]
    })
    if (!reviewsArr.length) {
      return
    }
    const sumUp = sumArr(reviewsArr)
    const avg = sumUp / reviewsArr.length
    setAvgRating(avg)
  }

  const calPercentageRatings = () => {
    let reviewsArr = reviews?.map((item) => item?.rating) || []
    const totalReviews = reviewsArr.length

    const ratingCounts = [0, 0, 0, 0, 0] // Initialize array to hold counts for each rating

    reviewsArr.forEach((rating) => {
      ratingCounts[rating - 1]++ // Increment count for corresponding rating
    })

    const ratings = ratingCounts.map((count, index) => {
      const stars = index + 1
      const percentage = (count / totalReviews) * 100
      return { stars, percentage, users: count }
    })

    setRating(ratings) // Update state once with all ratings
  }

  const getReview = async (page = 1) => {
    setLoading(true)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${id}/reviews?page=${page}`
    )
    const data = await res.json()
    if (data?.status !== true) {
      setLoading(false)
      setFailure(true)
      return
    } else {
      const sortedReviews = data?.data?.data.sort((a, b) => {
        return sortOrder === 'latest'
          ? new Date(b.created_at) - new Date(a.created_at)
          : new Date(a.created_at) - new Date(b.created_at)
      })
      setReviews(sortedReviews)
      calculateRatingAvg(data?.data?.data)
      setLastPage(data?.data?.last_page)
      setLoading(false)
      setFailure(false)
    }
  }

  useLayoutEffect(() => {
    getReview(currentPagination)
  }, [currentPagination])

  useLayoutEffect(() => {
    if (reviews?.length) {
      calPercentageRatings()
    }
  }, [reviews])

  // Sorting the Rating array by percentage in descending order
  const sortedRating = Rating.slice().sort(
    (a, b) => b.percentage - a.percentage
  )

  const maskName = (name) => {
    if (!name) return ''
    return name[0] + '*'.repeat(name.length - 1)
  }

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPagination(selectedPage + 1)
    setLoading(true)
    getReview(selectedPage + 1)
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
    <main className='w-full flex flex-col justify-start items-start gap-5 '>
      <div className='flex justify-start items-center gap-10 w-full xl:flex-row lg:flex-row md:flex-row sm:flex-col'>
        <div className='flex flex-col gap-5 w-full lg:w-[80%] '>
          <h1 className='text-2xl lg:text-2xl md:text-2xl sm:text-xl'>
            Customers Rating Summary
          </h1>

          <div className='w-full'>
            {sortedRating?.map((info, index) => (
              <RatingBreakdown rating={info} key={index} />
            ))}
          </div>
        </div>

        <div className='flex flex-col justify-start items-start gap-2'>
          <p className='font-bold text-8xl lg:text-7xl md:text-7xl sm:text-6xl '>
            {avgRating.toFixed(1)}
          </p>

          {avgRating && (
            <WorkSpaceRating
              rating={reviews}
              showAvgRating={false}
              counter={false}
            />
          )}

          <h4 className='text-base text-lightgrey'>
            {reviews?.length} ratings
          </h4>
        </div>
      </div>

      <div className='flex flex-col justify-start items-start gap-5 w-full'>
        <div className='flex justify-between items-center w-full'>
          <h3 className='text-lg'> Customers Review </h3>
          <select
            name='sortOrder'
            id='sortOrder'
            className='border border-gray h-12 px-2 rounded-md outline-none bg-transparent'
            onChange={handleSortChange}
          >
            <option value='latest'>Sort by latest</option>
            <option value='oldest'>Sort by oldest</option>
          </select>
        </div>

        {reviews.map((info) => {
          let stars
          if (info?.rating === 1) {
            stars = [<IoStar className='text-purple' />]
          } else if (info?.rating === 2) {
            stars = [
              <IoStar className='text-purple' />,
              <IoStar className='text-purple' />,
            ]
          } else if (info?.rating === 3) {
            stars = [
              <IoStar className='text-purple' />,
              <IoStar className='text-purple' />,
              <IoStar className='text-purple' />,
            ]
          } else if (info?.rating === 4) {
            stars = [
              <IoStar className='text-purple' />,
              <IoStar className='text-purple' />,
              <IoStar className='text-purple' />,
              <IoStar className='text-purple' />,
            ]
          } else if (info?.rating === 5) {
            stars = [
              <IoStar className='text-purple' />,
              <IoStar className='text-purple' />,
              <IoStar className='text-purple' />,
              <IoStar className='text-purple' />,
              <IoStar className='text-purple' />,
            ]
          }

          const maskedFirstName = maskName(info?.user?.first_name)
          const maskedLastName = maskName(info?.user?.last_name)

          return (
            <div
              className='flex flex-col justify-start items-start gap-2 w-full'
              key={info?.id}
            >
              <div className='flex justify-start items-center gap-3'>
                <Image
                  src={info?.user?.profile || '/portrait1.jpg'}
                  alt='profile picture'
                  width={40}
                  height={40}
                  className='object-cover object-top rounded-full w-12 h-12'
                />
                <div className='flex flex-col justify-start items-start gap-2'>
                  <h4 className='font-semibold'>
                    {maskedFirstName} {maskedLastName}
                  </h4>
                  <span className='text-sm text-lightgrey'>
                    {moment(info?.created_at).startOf('day').fromNow()}
                  </span>
                </div>
              </div>

              <div className='flex justify-start items-center gap-2'>
                {stars?.map((star, index) => (
                  <React.Fragment key={index}>{star}</React.Fragment>
                ))}
              </div>

              <div className=''>{parse(info?.review + '')}</div>
            </div>
          )
        })}

        {reviews.length > 20 && (
          <button
            type='button'
            onClick={handlePageChange}
            className='mx-auto flex justify-center items-center rounded-full h-12 px-4 py-2 bg-gray'
          >
            View more{' '}
          </button>
        )}
      </div>
    </main>
  )
}
