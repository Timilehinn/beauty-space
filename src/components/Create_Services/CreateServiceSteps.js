import clsx from 'clsx'
import React from 'react'
import { BiChevronRight } from 'react-icons/bi'
import {
  FaRegCalendarAlt,
  FaRegClock,
  FaRegListAlt,
  FaRegImages,
  FaRegFileAlt,
  FaTools,
} from 'react-icons/fa'

export default function CreateServiceSteps({
  setCurrentStep,
  currentStep,
  action,
  data,
}) {
  const steps = [
    { label: 'Appointment Details', icon: <FaRegCalendarAlt />, step: 0 },
    { label: 'Availability', icon: <FaRegClock />, step: 1 },
    { label: 'Limits', icon: <FaTools />, step: 2 },
    { label: 'Amenities', icon: <FaRegListAlt />, step: 3 },
    { label: 'Photos', icon: <FaRegImages />, step: 4 },
    { label: 'Agreement', icon: <FaRegFileAlt />, step: 5 },
  ]

  return (
    <div className='flex flex-col justify-start items-start xxl:w-[15%] xl:w-[20%] lg:w-[20%] md:w-full sm:w-full '>
      {steps.map((item) => (
        <div
          key={item.label}
          onClick={() => setCurrentStep(item.step)}
          className={clsx(
            'flex justify-start items-center gap-x-4 hover:bg-gray hover:rounded-md hover:text-black p-2 cursor-pointer w-full',
            action === 'edit' || item.step <= currentStep
              ? 'text-black'
              : 'text-lightgrey'
          )}
        >
          <span
            className={clsx(
              '',
              item.step === currentStep ? 'text-primary' : ''
            )}
          >
            {item.icon}
          </span>
          <span className='text-sm'>{item.label}</span>
          {item.step === currentStep && <BiChevronRight />}
        </div>
      ))}
    </div>
  )
}
