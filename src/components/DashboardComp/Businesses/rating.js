import React, { useState, useEffect } from 'react'

const Rating = ({ rating }) => {
  const [avgrating, setAvgRating] = useState(0)

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

  useEffect(() => {
    calculateRatingAvg(rating)
  }, [])

  return <main>{avgrating.toFixed(1)}</main>
}

export default Rating
