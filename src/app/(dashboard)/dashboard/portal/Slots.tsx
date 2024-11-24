import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'

import { BsArrowLeft } from 'react-icons/bs'
import { ArrowLeft, ArrowRight } from '../../../../assets/icons'

import { Availability, OpeningHour } from '../../../../global/types'
import { getAvailability } from '../../../../utils'

function getHours(
  openingHours: Array<OpeningHour>,
  date: string,
  dayIndex: number
) {
  try {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()

    let _month = month.toString().length === 1 ? '0' + month.toString() : month
    let _day = day.toString().length === 1 ? '0' + day.toString() : day

    const availability = openingHours.find(
      (av: OpeningHour) => av.day === dayIndex
    )
    if (!availability) {
      return []
    }
    /**
     * opening_hours returning hours in like 09=>00 (from the backend)
     * So replacing to ':'
     */
    var range_1 = availability.opening_hours[0].replace('=>', ':')
    var range_2 = availability.opening_hours[1].replace('=>', ':')

    // var range_1 = "08:00";
    // var range_2 = "23:00";

    var currentHour = moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm:ss')
    const start = new Date(`${year}-${_month}-${_day}T${range_1}:00`)
    const end = new Date(`${year}-${_month}-${_day}T${range_2}:00`)

    /**
     * Check if the current hour of day is after the opening hour set by the business
     * This is used to prevent users from booking passed hours by filtering them out
     */
    const isOpeningHourElasped = moment(currentHour).isAfter(start)

    const hours = []
    const getCurrentHour = () => {
      /**
       * Check if the current date is same as selected date,
       * if it is, then filter out elapsed hours 'isOpeningHourElasped'
       */
      if (date === moment().format('YYYY-MM-DD')) {
        return isOpeningHourElasped ? new Date(currentHour) : new Date(start)
      } else {
        return new Date(start)
      }
    }
    const current = getCurrentHour()
    while (current < end) {
      const startString = current.toLocaleTimeString([], {
        hour: 'numeric',
        hour12: true,
      })
      current.setHours(current.getHours() + 1)
      const endString =
        current <= end
          ? current.toLocaleTimeString([], { hour: 'numeric', hour12: true })
          : end.toLocaleTimeString([], { hour: 'numeric', hour12: true })
      hours.push(
        `${
          startString[0] === '0'
            ? '12' + startString.substring(1, startString.length)
            : startString
        } - ${
          endString[0] === '0'
            ? '12' + endString.substring(1, endString.length)
            : endString
        }`
      )
    }
    return hours.map((h) => ({
      label: h,
      isSelected: false,
    }))
  } catch (error) {
    console.error(error)
    return []
  }
}

type Time = { label: string; isSelected: boolean }

type SlotProps = {
  containerWidth: number
  openingHours: Array<OpeningHour>
  onDone: (data: { date: string; hours: string[] }) => void
  duration: number
  goBack: () => void
}

type Day = {
  day: number
  isActive: boolean
  number: number
}

enum Display {
  CALENDER = 'calender',
  HOURS = 'hours',
}

export default function Slots(props: SlotProps) {
  const { containerWidth, openingHours, onDone, duration, goBack } = props

  var size = useMemo(() => {
    return Math.floor(containerWidth / 7)
  }, [containerWidth])

  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [daysArray, setDaysArray] = useState<
    Array<{ day: number; isActive: boolean; number: number }>
  >([])
  const [selectedDay, setSelectedDay] = useState<Day | null>(null)
  const [availableTimes, setAvaialableTimes] = useState<Array<Time>>([])
  const [display, setDisplay] = useState<Display>(Display.CALENDER)
  const [availability, setAvaialability] = useState<Array<Availability>>([])
  let days = [
    { number: 0, title: 'sun' },
    { number: 1, title: 'mon' },
    { number: 2, title: 'tue' },
    { number: 3, title: 'wed' },
    { number: 4, title: 'thur' },
    { number: 5, title: 'fri' },
    { number: 6, title: 'sat' },
  ]
  const dayInMonth = new Date(year, month, 0).getDate()
  let currentDate = moment().format('YYYY-MM-DD')
  const currentDayIndex = moment().day()

  const generateDaysArray = () => {
    const availabilityData = getAvailability(openingHours)
    var arr = Array.from({ length: dayInMonth }, (_, i) => {
      const dayIndex = new Date(year, month - 1, i + 1).getDay()
      return {
        number: i + 1,
        day: dayIndex,
        isActive: isDayActive(availabilityData, dayIndex),
      }
    })
    return { arr, availabilityData }
  }

  function prevMonth() {
    if (month == 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
    setSelectedDay(null)
  }

  function nextMonth() {
    if (month == 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
    setSelectedDay(null)
  }

  let initialBlocks = Array.from(
    { length: daysArray[0]?.day || 0 },
    (_, i) => i + 1
  )

  const isDayActive = (av: Array<Availability>, dayIndex: number) => {
    if (av.length > 0) {
      const _ = av.find((av) => av.day === dayIndex)
      if (_) {
        return _?.isSelected
      }
      return false
    }
    return true
  }

  useEffect(() => {
    const availabilityData = getAvailability(openingHours)
    var arr = Array.from({ length: dayInMonth }, (_, i) => {
      const dayIndex = new Date(year, month - 1, i + 1).getDay()
      return {
        number: i + 1,
        day: dayIndex,
        isActive: isDayActive(availabilityData, dayIndex),
      }
    })
    setAvaialability(availabilityData)
    // setSelectedDay({
    //   day: moment(currentDate).day(),
    //   isActive: true,
    //   number: moment(currentDate).date(),
    // });
    setDaysArray(arr)
  }, [openingHours, month, year])

  const isDisabled = (d: string) => {
    const d_1 = moment(d)
    const d_2 = moment(currentDate)
    return d_1.isBefore(d_2)
  }

  const onDateClick = (day: Day) => {
    var selectedDate = `${year}-${
      month.toString().length == 1 ? '0' + month : month
    }-${day.number}`
    if (!isDisabled(selectedDate)) {
      setDisplay(Display.HOURS)
      setSelectedDay(day)
      var times = getHours(openingHours, selectedDate, currentDayIndex)
      setAvaialableTimes(times)
    }
  }

  const selectTime = (time: Time) => {
    setAvaialableTimes((prev) => {
      return prev.map((t) => {
        if (t.label === time.label) {
          return { ...t, isSelected: !time.isSelected }
        }
        return t
      })
    })
  }

  const backToCalender = () => {
    setDisplay(Display.CALENDER)
    setAvaialableTimes([])
  }

  useEffect(() => {
    var times = getHours(openingHours, currentDate, currentDayIndex)
    setAvaialableTimes(times)
  }, [])

  const canProceed = useMemo(() => {
    var filtered = availableTimes.filter((a) => a.isSelected)
    return filtered.length === duration
  }, [availableTimes, duration])

  let calenderTitle = moment(
    new Date(`${year}-${month}-${new Date().getDate()}`)
  ).format('MMM, YYYY')

  return (
    <>
      {display === Display.HOURS && (
        <div
          className='font-jakarta w-full flex flex-col justify-between'
          style={{ height: 'calc(100vh - 70px)' }}
        >
          <div className='font-jakarta w-[100%] h-[100%] flex flex-col items-center px-[15px]'>
            <div className='font-jakarta w-full mb-[10px] rounded-[8px] py-[15px]'>
              <button
                onClick={backToCalender}
                className='font-jakarta flex items-center'
              >
                <BsArrowLeft size={25} />
                <p className='font-jakarta font-bold ml-[10px] font-[25px] font-jakarta'>
                  Select hours
                </p>
              </button>
              <p className='font-jakarta text-[14px] mt-[5px] font-jakarta'>
                Select a minimum of {duration} hours.
              </p>
            </div>
            {availableTimes.length === 0 && (
              <div className='flex flex-col items-center'>
                <p className='font-jakarta text-[14px] mt-[5px] font-jakarta'>
                  No more slots available for selected date
                </p>
              </div>
            )}
            <div className='font-jakarta flex items-center flex-wrap w-full'>
              {availableTimes.map((time, i) => (
                <button
                  onClick={() => selectTime(time)}
                  className={`p-[15px] mr-[10px] mb-[10px] flex items-center justify-center mb-[10px] rounded-[8px] py-[15px] border-[1px] ${
                    time.isSelected
                      ? 'border-accent_blue'
                      : 'border-[lightgrey]'
                  } `}
                >
                  <p
                    key={i}
                    className={`${
                      time.isSelected ? 'text-accent_blue' : 'text-black'
                    } text-[14px] font-jakarta`}
                  >
                    {time.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <div className='font-jakarta p-[16.5px] border-t-[1px] border-t-[lightgrey]'>
            <button
              disabled={!canProceed}
              onClick={() => {
                onDone({
                  date: `${year}-${month}-${selectedDay?.number}`,
                  hours: availableTimes
                    .filter((d) => d.isSelected)
                    .map((d) => d.label),
                })
                setDisplay(Display.CALENDER)
              }}
              style={{
                opacity: canProceed ? 1 : 0.5,
                cursor: canProceed ? 'pointer' : 'not-allowed',
              }}
              className='font-jakarta w-full flex items-center justify-center bg-accent_blue rounded-[8px] py-[15px] border-[1px] border-[lightgrey]'
            >
              <p className='font-jakarta text-[white] font-jakarta'>Done</p>
            </button>
          </div>
        </div>
      )}

      {display === Display.CALENDER && (
        <div>
          <div className='w-full flex items-center justify-between px-[15px] mb-[15px]'>
            <div className='font-jakarta rounded-[8px] py-[15px]'>
              <button
                onClick={goBack}
                className='font-jakarta flex items-center'
              >
                <BsArrowLeft size={25} />
                <p className='font-jakarta font-bold ml-[10px] font-[25px] font-jakarta'>
                  Select day
                </p>
              </button>
              <p className='font-jakarta text-[14px] mt-[5px] font-jakarta'>
                Available dates
              </p>
            </div>

            <div className='flex items-center'>
              <button
                onClick={prevMonth}
                className='border-[1px] border-[lightgrey] p-[10px] rounded'
              >
                <ArrowLeft size={10} />
              </button>
              <p className='font-jakarta mx-[35px] text-center'>
                {calenderTitle}
              </p>
              <button
                className='border-[1px] border-[lightgrey] p-[10px] rounded'
                onClick={nextMonth}
              >
                <ArrowRight size={10} />
              </button>
            </div>
          </div>

          <div
            className='font-jakarta flex items-center flex-wrap h-auto border-t-[1px] border-t-[lightgrey] border-b-[1px] border-b-[lightgrey]'
            style={{ width: `${size * 7}px` }}
          >
            <div className='font-jakarta w-[100%] flex items-center'>
              {days.map((day, i) => (
                <div
                  key={i}
                  className='font-jakarta flex items-center justify-center border-b-[1px] border-b-[lightgrey]'
                  style={{ width: `${size}px`, height: `${size}px` }}
                >
                  <p className='font-jakarta capitalize font-bold'>
                    {day.title}
                  </p>
                </div>
              ))}
            </div>

            {initialBlocks.map((item, i) => (
              <div
                key={i}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderBottom: '1px solid lightgrey',
                  borderRight: `${
                    i === initialBlocks.length - 1 ? '1px solid lightgrey' : ''
                  }`,
                }}
              />
            ))}

            {daysArray.map((day, i) => {
              var selectedDate = `${year}-${
                month.toString().length == 1 ? '0' + month : month
              }-${day.number}`
              var isEnabled = day.isActive && !isDisabled(selectedDate)
              var formattedDate = `${year}-${month}-${day.number}`
              const defaultDateStyles = `border-r-[1px] border-b-[1px] border-r-[lightgrey] border-b-[lightgrey] flex items-center justify-center ${
                selectedDay?.number !== day.number
                  ? 'bg-accent_blue'
                  : 'bg-[#E85187]'
              }`
              // const selectedDateStyles = `border-r-[1px] border-b-[1px] border-r-[lightgrey] border-b-[lightgrey] flex items-center justify-center bg-[#E85187]`

              // const today = formattedDate === selectedDate?

              return (
                <button
                  onClick={() => onDateClick(day)}
                  key={i}
                  className={defaultDateStyles}
                  disabled={!isEnabled}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity: isEnabled ? 1 : 0.5,
                    cursor: isEnabled ? 'pointer' : 'not-allowed',
                  }}
                >
                  <p className='font-jakarta text-[white]'>{day.number}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
