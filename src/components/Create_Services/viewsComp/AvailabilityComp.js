import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import clsx from 'clsx'

import { BiCheck, BiPlus, BiX } from 'react-icons/bi'

import { getServiceData } from '../../../redux/createWorkspaceSlice'

const defaultAvailability = [
  { day: 0, opening_hours: [], isSelected: false },
  {
    day: 1,
    opening_hours: [{ start: '09:00', end: '17:00' }],
    isSelected: true,
  },
  {
    day: 2,
    opening_hours: [{ start: '09:00', end: '17:00' }],
    isSelected: false,
  },
  {
    day: 3,
    opening_hours: [{ start: '09:00', end: '17:00' }],
    isSelected: false,
  },
  {
    day: 4,
    opening_hours: [{ start: '09:00', end: '17:00' }],
    isSelected: false,
  },
  {
    day: 5,
    opening_hours: [{ start: '09:00', end: '17:00' }],
    isSelected: false,
  },
  { day: 6, opening_hours: [], isSelected: false },
]

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const hours24 = [
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
  '24:00',
]

const convertTo12Hour = (time) => {
  const [hour, minute] = time.split(':')
  const intHour = parseInt(hour, 10)
  const period = intHour >= 12 ? 'PM' : 'AM'
  const adjustedHour = intHour % 12 === 0 ? 12 : intHour % 12
  return `${adjustedHour}:${minute} ${period}`
}

export default function AvailabilityComp({ prev, next, action }) {
  const { t } = useTranslation()
  const [openHours, setOpenHours] = useState(defaultAvailability)

  const serviceData = useSelector(getServiceData)

  const toggleSelection = (index) => {
    setOpenHours(
      openHours.map((item, idx) =>
        idx === index ? { ...item, isSelected: !item.isSelected } : item
      )
    )
  }

  const handleTimeChange = (dayIndex, timeIndex, type, value) => {
    setOpenHours((prevOpenHours) =>
      prevOpenHours.map((item, idx) => {
        if (idx === dayIndex) {
          const updatedHours = item.opening_hours.map((timeSlot, tIdx) => {
            if (tIdx === timeIndex) {
              const start = type === 'start' ? value : timeSlot.start
              const end = type === 'end' ? value : timeSlot.end

              if (!start || !end) {
                return timeSlot
              }

              const startMinutes =
                parseInt(start.split(':')[0]) * 60 +
                parseInt(start.split(':')[1])
              const endMinutes =
                parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1])

              if (start === end || endMinutes <= startMinutes) {
                toast.error(
                  'Closing hour must be at least 1 hour after opening hour and not equal to opening hour.'
                )
                return timeSlot
              }

              return { start, end }
            }
            return timeSlot
          })

          return { ...item, opening_hours: updatedHours }
        }
        return item
      })
    )
  }

  const addTimeSlot = (dayIndex) => {
    setOpenHours((prevOpenHours) =>
      prevOpenHours.map((item, idx) => {
        if (idx === dayIndex) {
          return {
            ...item,
            opening_hours: [
              ...item.opening_hours,
              { start: '09:00', end: '17:00' },
            ],
          }
        }
        return item
      })
    )
  }

  const removeTimeSlot = (dayIndex, timeIndex) => {
    setOpenHours((prevOpenHours) =>
      prevOpenHours.map((item, idx) => {
        if (idx === dayIndex) {
          const updatedHours = item.opening_hours.filter(
            (_, tIdx) => tIdx !== timeIndex
          )
          return { ...item, opening_hours: updatedHours }
        }
        return item
      })
    )
  }

  const convertServerDataToOpenHours = (serverData) => {
    if (!Array.isArray(serverData)) {
      return defaultAvailability
    }

    return serverData.map((item) => {
      const { day, is_selected, opening_hours } = item
      const hours = []

      for (let i = 0; i < opening_hours.length; i += 2) {
        hours.push({ start: opening_hours[i], end: opening_hours[i + 1] })
      }

      return {
        day,
        isSelected: is_selected,
        opening_hours: hours,
      }
    })
  }

  useEffect(() => {
    const storedOpenHours = JSON.parse(localStorage.getItem('openHours'))
    if (storedOpenHours) {
      setOpenHours(storedOpenHours)
    } else if (serviceData?.opening_hours) {
      const convertedData = convertServerDataToOpenHours(
        serviceData.opening_hours
      )
      setOpenHours(convertedData)
    }
  }, [serviceData])

  const onNext = () => {
    const formattedOpenHours = openHours.map((item) => {
      const times = item.opening_hours.flatMap(({ start, end }) => [start, end])
      return {
        day: item.day,
        isSelected: item.isSelected,
        opening_hours: times,
        opening_hour: times,
      }
    })

    if (action !== 'edit') {
      localStorage.setItem('openHours', JSON.stringify(openHours))
    }
    next({ open_hours: formattedOpenHours })
  }

  return (
    <main className='flex flex-col justify-start items-start gap-5 w-full border border-gray p-5 rounded-md'>
      <div className='flex flex-col gap-2'>
        <h4 className=''>Availability</h4>
        <p className='font-light'>
          What time does your business open and close for the day?
        </p>
      </div>

      <hr className='w-full border-gray' />

      <div className='w-full flex flex-col justify-between items-center gap-7 '>
        {openHours.map((item, dayIndex) => {
          return (
            <div
              key={item.day}
              className='flex flex-col justify-between items-center w-full'
            >
              <div className='flex items-center gap-4 w-full lg:flex-nowrap md:flex-nowrap sm:flex-wrap'>
                <button
                  type='button'
                  className={`w-6 h-5 flex items-center justify-center border border-gray rounded ${
                    item.isSelected
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-black'
                  }`}
                  onClick={() => toggleSelection(dayIndex)}
                >
                  {item.isSelected && <BiCheck />}
                </button>

                <span
                  className={clsx(
                    'w-1/3',
                    !item.isSelected ? 'line-through text-lightgrey' : ''
                  )}
                >
                  {dayNames[item.day]}
                </span>

                <div className='flex items-center gap-3 w-full'>
                  <div className='flex flex-col gap-3'>
                    {item.opening_hours.map((timeSlot, timeIndex) => (
                      <div
                        key={timeIndex}
                        className='flex items-center gap-4 w-full'
                      >
                        <select
                          value={timeSlot.start}
                          className='w-[120px] border border-lightgrey rounded-md p-2 outline-none'
                          onChange={(e) =>
                            handleTimeChange(
                              dayIndex,
                              timeIndex,
                              'start',
                              e.target.value
                            )
                          }
                          disabled={!item.isSelected}
                        >
                          {hours24.map((hour) => (
                            <option key={hour} value={hour}>
                              {convertTo12Hour(hour)}
                            </option>
                          ))}
                        </select>
                        <span> - </span>
                        <select
                          value={timeSlot.end}
                          className='w-[120px] border border-lightgrey rounded-md p-2 outline-none'
                          onChange={(e) =>
                            handleTimeChange(
                              dayIndex,
                              timeIndex,
                              'end',
                              e.target.value
                            )
                          }
                          disabled={!item.isSelected}
                        >
                          {hours24.map((hour) => (
                            <option key={hour} value={hour}>
                              {convertTo12Hour(hour)}
                            </option>
                          ))}
                        </select>

                        {item.opening_hours.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeTimeSlot(dayIndex, timeIndex)}
                            className='text-xl'
                            disabled={!item.isSelected}
                          >
                            <BiX />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {item.opening_hours.length === 0 && (
                    <span className='text-lightgrey lg:w-[45%]'>
                      Unavailable
                    </span>
                  )}

                  <button
                    type='button'
                    onClick={() => addTimeSlot(dayIndex)}
                    className='text-xl'
                    disabled={!item.isSelected}
                  >
                    <BiPlus />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className='flex items-center gap-5 ml-auto'>
        <button
          onClick={() => prev(serviceData)}
          className='rounded-full h-12 w-[150px] text-black border border-lightgrey '
        >
          {t('Prev')}
        </button>

        <button
          onClick={onNext}
          className='rounded-full h-12 w-[150px] text-white bg-primary ring-2 ring-gray'
        >
          {t('Next')}
        </button>
      </div>
    </main>
  )
}
