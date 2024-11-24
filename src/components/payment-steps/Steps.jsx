import React from 'react'
import clsx from 'clsx'

const Steps = ({ current, availableSteps }) => {
  return (
    <div className='flex justify-between w-full lg:w-[568px] relative'>
      {availableSteps.map((step, index) => (
        <div
          key={index}
          className='flex flex-col justify-center items-center gap-y-2'
        >
          <div
            className={clsx({
              ['rounded-full w-8 border border-lightgrey bg-white h-8 flex items-center justify-center z-50']: true,
              ['!bg-primary text-white border-primary']: current === step,
            })}
          >
            {step.value}
          </div>
          <span>{step.text}</span>
        </div>
      ))}
      <hr className='border border-lightgrey w-[72%] lg:w-[80%] ml-8 absolute top-4' />
    </div>
  )
}

export default Steps
