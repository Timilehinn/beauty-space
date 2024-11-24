import React from 'react'
import { BsStarFill } from 'react-icons/bs'

const RatingBreakdown = ({ rating }) => {
  const { stars, users } = rating

  const progress = (stars / 5) * 100 // Calculate progress

  return (
    <div className='flex items-center space-x-3 my-4'>
      <p className='flex justify-start items-center gap-2'>
        {stars} <span>star</span>{' '}
      </p>
      <div className='w-full h-3 bg-gray rounded-full'>
        <div
          className='h-full bg-purple rounded-full'
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span>{users}</span>
    </div>
  )
}

export default RatingBreakdown
