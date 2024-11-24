import React, { useState, useEffect } from 'react'
import Rating from 'react-rating'
import { IoStar, IoStarOutline } from 'react-icons/io5'

const WorkSpaceRating = ({ rating, showAvgRating = true, counter = true }) => {
  const [avgrating, setAvgRating] = useState(0)

  useEffect(() => {
    // Calculate average rating when the 'rating' prop changes
    const calculateRatingAvg = () => {
      if (!rating?.length) {
        setAvgRating(0)
        return
      }

      const sumUp = rating.reduce((acc, item) => acc + item.rating, 0)
      const avg = sumUp / rating.length
      setAvgRating(avg.toFixed(1))
    }

    calculateRatingAvg()
  }, [rating])

  const hasRating = avgrating > 0

  return (
    <div className='flex justify-start items-center gap-2 text-base'>
      {hasRating && showAvgRating && <span className=''>{avgrating}</span>}

      <Rating
        readonly
        initialRating={avgrating}
        emptySymbol={<IoStarOutline />}
        fullSymbol={<IoStar className='text-purple' />}
      />

      {hasRating && counter && (
        <span className='text-[14px]'>({rating.length})</span>
      )}
    </div>
  )
}

export default WorkSpaceRating
