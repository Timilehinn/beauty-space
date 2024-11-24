import React from 'react'
import Rating from 'react-rating'
import { Range } from 'react-range'

import EmptyStar from '../../svgs/Star-empty.svg'
import FullStar from '../../svgs/full-star.svg'

const RangeSlider = ({
  min,
  max,
  step,
  values,
  setValues,
  title = 'Title',
  subTitle,
  isRating,
  setTriggerPriceFilter,
  setTriggerDistanceFilter,
  focusPoint,
}) => {
  return (
    <Range
      step={step}
      min={min}
      max={max}
      values={values}
      onChange={(value) => {
        title === 'Price Range' && setTriggerPriceFilter(true)
        title === 'Distance Proximity' && setTriggerDistanceFilter(true)
        setValues(value)
      }}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          className='bg-lightgrey rounded-xl w-full h-1 mt-[5rem] '
        >
          <div className='absolute top-[-90px] w-full flex flex-col justify-start items-start gap-2 '>
            <p className='text-lg font-semibold '>{title}</p>
            {subTitle && <p className=''>{subTitle}</p>}
            {isRating && (
              <Rating
                readonly
                initialRating={values[0]}
                emptySymbol={<EmptyStar className='space-x-6 w-4' />}
                fullSymbol={<FullStar />}
              />
            )}
            {!isRating && (
              <div className='relative w-full flex justify-between items-center'>
                <p className='font-semibold'>{values[0]}</p>

                <p className='font-semibold'>{values[1]}</p>
              </div>
            )}
          </div>

          {children}
        </div>
      )}
      renderThumb={({ props }) => {
        return (
          <div
            {...props}
            className='w-4 h-4 bg-primary rounded-full'
            style={{
              ...props.style,
            }}
          />
        )
      }}
    />
  )
}

export default RangeSlider
