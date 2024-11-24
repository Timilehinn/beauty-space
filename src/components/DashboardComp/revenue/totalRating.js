'use client'

import React, { useState, useEffect } from 'react'

const TotalRating = ({ rating }) => {
  const [avgRating, setAvgRating] = useState(0)

  useEffect(() => {
    const calculateRatingAvg = (reviewsArrays) => {
      if (!Array.isArray(reviewsArrays) || reviewsArrays.length === 0) {
        setAvgRating(0)
        return
      }
      let reviewsArr = []
      reviewsArrays.forEach((item) => {
        if (item && typeof item.rating === 'number') {
          reviewsArr.push(item.rating)
        }
      })
      if (!reviewsArr.length) {
        setAvgRating(0)
        return
      }
      const sumUp = reviewsArr.reduce((total, rating) => total + rating, 0)
      const avg = sumUp / reviewsArr.length
      setAvgRating(avg)
    }

    calculateRatingAvg(rating)
  }, [rating])

  return <span>{avgRating.toFixed(1)}</span>
}

export default TotalRating
