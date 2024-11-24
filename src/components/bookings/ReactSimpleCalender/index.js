'use client'

import React, { useState } from 'react'
import moment from 'moment'
import { MdKeyboardArrowLeft } from 'react-icons/md'
import {
  ArrowDoubleLeft,
  ArrowDoubleRight,
  ArrowLeft,
  ArrowRight,
} from './assets/icons/arrows'

import styles from './index.module.css'
import clsx from 'clsx'

/**
 * @param Author email: makindetimi@gmail.com github: Timilehinn
 * @param disabled takes in an array of dates in format: 2023-4-13
 * @returns blocks out specified dates
 * @param selectedDates Array
 * @param setSelectedDates :- setStateAction
 * @param mode <string> :- "single" | "multiple" | "datetime" defines how many dates can be selected. with date time, you can select a date and then choose from a list of times
 * @param times Array :- take in an array of times Array<string> i.e ['2pm - 4pm', '4pm - 6pm']. times are defined by you
 * @param minSelectable <string> "YYYY-MM-DD" defines the minimum date that can be selected anything before is disabled
 * @param onSelect: ()=>void a function that determines what should happend when you click a date, should be used with single mode
 * @param setSelectedTimes: setStateAction - sets the selected times if mode is datetime
 * @param selectedTimes Array of times selected
 * @param maxSelectableTimes maximum number of times that can be selected
 * @param disabledTimes Array of disabled times
 */

function SimpleCalender({
  disabled,
  selectedDates,
  setSelectedDates,
  selectedTimes,
  setSelectedTimes,
  mode,
  minSelectable,
  onSelect,
  times,
  maxSelectableTimes,
  disabledTimes,
}) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [_times, showTimes] = useState(false)

  let currentDate = moment(new Date()).format('YYYY-MM-DD')

  let months = [
    { number: 0, title: 'sun' },
    { number: 1, title: 'mon' },
    { number: 2, title: 'tue' },
    { number: 3, title: 'wed' },
    { number: 4, title: 'thur' },
    { number: 5, title: 'fri' },
    { number: 6, title: 'sat' },
  ]
  const dayInMonth = new Date(year, month, 0).getDate()

  const daysArray = Array.from({ length: dayInMonth }, (_, i) => {
    return { number: i + 1, day: new Date(year, month - 1, i + 1).getDay() }
  })

  let initialBlocks = Array.from({ length: daysArray[0].day }, (_, i) => i + 1)

  function isDisabled(d) {
    var exists = disabled.find((day) => day == d)
    return exists
  }

  function prevMonth() {
    if (month == 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  function nextMonth() {
    if (month == 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  function prevYear() {
    setYear(year - 1)
  }

  function nextYear() {
    setYear(year + 1)
  }

  function selectedDate(d) {
    try {
      if (mode == 'single') {
        setSelectedDates([d])
      }
      if (mode == 'multiple') {
        const isSelected = selectedDates.find((date) => date == d)
        if (isSelected) {
          var filteredDates = selectedDates.filter((date) => date !== d)
          setSelectedDates(filteredDates)
        } else {
          setSelectedDates((prev) => {
            return [...prev, d]
          })
        }
      }
      /**
       *  datetime will override single, because it runs after a day is clicked/selected
       *  the onselect function won't run
       * */
      if (mode == 'datetime') {
        setSelectedDates([d])
        setSelectedTimes([])
        showTimes(true)
      } else if (mode == 'single' && onSelect !== undefined) {
        onSelect()
      }
    } catch (error) {}
  }

  var new_selectable = []
  function seletectTime(t) {
    if (selectedTimes.length + disabledTimes.length === maxSelectableTimes) {
      const isTimeSelected = selectedTimes.find((time) => time == t)
      if (isTimeSelected) {
        var filteredTimes = selectedTimes.filter((time) => time !== t)
        setSelectedTimes(filteredTimes)
      }
      return false
    }
    const isTimeSelected = selectedTimes.find((time) => time == t)
    if (isTimeSelected) {
      var filteredTimes = selectedTimes.filter((time) => time !== t)
      setSelectedTimes(filteredTimes)
    } else {
      setSelectedTimes((prev) => {
        return [...prev, t]
      })
    }
  }

  function showDisabledTimes(t) {
    const _t = disabledTimes.find((time) => time == t)
    if (_t) return true
    return false
  }

  function isTimeSelected(t) {
    const _ = selectedTimes.find((time) => time == t)
    return _ ? true : false
  }

  function isSelected(d) {
    const _ = selectedDates.find((date) => date == d)
    return _ ? true : false
  }

  function isCurrentDate(date) {
    return date === currentDate
  }

  let centerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  let calenderTitle = moment(
    new Date(`${year}-${month}-${new Date().getDate()}`)
  ).format('MMMM YYYY')

  const isSelectable = (d) => {
    if (minSelectable) {
      const d_1 = moment(d)
      const d_2 = moment(minSelectable)
      return d_1.isBefore(d_2)
    } else {
      return false
    }
  }

  const doesTimesArrayExist = () => {
    if (times == undefined) return false
    else if (times.length == 0 || undefined) return false
    else return true
  }

  return (
    <div className='w-full h-full flex justify-start items-center gap-5 lg:flex-row md:flex-row sm:flex-col'>
      <section className='lg:w-[330px] md:w-[350px] sm:w-full '>
        <div className='flex justify-between items-center w-full'>
          <div
            className='flex items-center gap-3'
            // style={{
            //   display: 'flex',
            //   flexDirection: 'row',
            //   alignItems: 'center',
            // }}
          >
            <button className={styles.arrow_btns} onClick={() => prevYear()}>
              <ArrowDoubleLeft />
            </button>

            <button onClick={() => prevMonth()} className={styles.arrow_btns}>
              <ArrowLeft />
            </button>
          </div>

          <p>{calenderTitle}</p>

          <div className='flex items-center gap-3'>
            <button onClick={() => nextMonth()} className={styles.arrow_btns}>
              <ArrowRight />
            </button>

            <button className={styles.arrow_btns} onClick={() => nextYear()}>
              <ArrowDoubleRight />
            </button>
          </div>
        </div>

        <div className={styles.month_label_container}>
          {months.map((month, i) => (
            <div
              key={i}
              className={styles.month_labels}
              style={{ ...centerStyle }}
            >
              {month.title}
            </div>
          ))}
        </div>

        <div className={styles.days_container}>
          {initialBlocks.map((_, i) => (
            <div key={i} className={styles.grid_null} />
          ))}

          {daysArray.map((day, i) => (
            <div key={i}>
              {isSelectable(
                `${year}-${
                  month.toString().length == 1 ? '0' + month : month
                }-${day.number}`
              ) ? (
                <div
                  className={styles.grid_disabled}
                  style={{ ...centerStyle }}
                >
                  {day.number}
                </div>
              ) : (
                <div>
                  {!isDisabled(
                    `${year}-${
                      month.toString().length == 1 ? '0' + month : month
                    }-${day.number}`
                  ) &&
                    isCurrentDate(
                      `${year}-${
                        month.toString().length == 1 ? '0' + month : month
                      }-${
                        day.number.toString().length === 1
                          ? '0' + day.number
                          : day.number
                      }`
                    ) && (
                      <div
                        onClick={() =>
                          isDisabled(
                            `${year}-${
                              month.toString().length == 1 ? '0' + month : month
                            }-${day.number}`
                          )
                            ? null
                            : selectedDate(`${year}-${month}-${day.number}`)
                        }
                        className={styles.grid_current_date}
                        style={{
                          ...centerStyle,
                          backgroundColor: isSelected(
                            `${year}-${month}-${day.number}`
                          )
                            ? 'black'
                            : '#4F9ED0',
                        }}
                      >
                        {day.number}
                      </div>
                    )}
                  {isDisabled(
                    `${year}-${
                      month.toString().length == 1 ? '0' + month : month
                    }-${day.number}`
                  ) && (
                    <div
                      className={styles.grid_disabled}
                      style={{ ...centerStyle }}
                    >
                      {day.number}
                    </div>
                  )}
                  {!isCurrentDate(
                    `${year}-${
                      month.toString().length == 1 ? '0' + month : month
                    }-${
                      day.number.toString().length === 1
                        ? '0' + day.number
                        : day.number
                    }`
                  ) &&
                    !isDisabled(
                      `${year}-${
                        month.toString().length == 1 ? '0' + month : month
                      }-${day.number}`
                    ) && (
                      <div
                        onClick={() =>
                          selectedDate(`${year}-${month}-${day.number}`)
                        }
                        style={{
                          backgroundColor: isSelected(
                            `${year}-${month}-${day.number}`
                          )
                            ? 'black'
                            : 'white',
                          color: !isSelected(`${year}-${month}-${day.number}`)
                            ? 'black'
                            : 'white',
                          ...centerStyle,
                        }}
                        className={styles.grid}
                      >
                        {day.number}
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className='h-full w-[1px] bg-gray xxl:h-full xxl:w-[1px] xl:h-full xl:w-[1px] lg:h-full lg:w-[1px] md:h-full md:w-[1px] sm:h-[1px] sm:w-full' />

      <div className=' h-[300px] flex flex-col justify-start items-start gap-3 lg:w-[250px] md:w-[220px] sm:w-full '>
        <span className=''>{moment(selectedDates[0]).format('LL')}</span>

        <div className='overflow-y-auto scrollbar-hide w-full h-[330px] flex flex-col justify-start gap-3'>
          {times &&
            times.map((time, i) => (
              <div key={i} className='w-full '>
                {showDisabledTimes(time) ? (
                  <div
                    className={clsx(
                      'opacity-[0.3] cursor-not-allowed h-10 rounded-md border flex justify-center items-center ',
                      isTimeSelected(time) ? 'border-lightgrey' : 'border-gray'
                    )}
                  >
                    {time}
                  </div>
                ) : (
                  <div
                    onClick={() => seletectTime(time)}
                    className={clsx(
                      'cursor-pointer h-10 border rounded-md flex justify-center items-center w-full ',
                      isTimeSelected(time)
                        ? 'text-white bg-primary border-lightgrey'
                        : 'text-black border-gray bg-transparent'
                    )}
                  >
                    {time}
                  </div>
                )}
              </div>
            ))}

          {!doesTimesArrayExist() && (
            <p style={{ color: 'black' }}>No Times Available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SimpleCalender
