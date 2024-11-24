import React from 'react'
import MultiRangeSlider from '../range'

const RangeComponent = ({ min, max, title, subTitle, setRange }) => {
  return (
    <div className='flex flex-col justify-start items-start gap-3 w-full'>
      <span className='text-xl font-semibold'>{title}</span>
      <MultiRangeSlider
        min={min}
        max={max}
        title={title}
        subTitle={subTitle}
        onChange={({ min, max }) => setRange({ min: min, max: max })}
      />
    </div>
  )
}

export default RangeComponent
