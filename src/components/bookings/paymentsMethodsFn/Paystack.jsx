'use client'

import React, { useState } from 'react'
import { usePaystackPayment } from 'react-paystack'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import moment from 'moment'
import clsx from 'clsx'

// import PaymentSuccessful from '../../../components/payment-status'

import { groupHoursByDate } from '../GroupHoursByDate'
import useCookieHandler from '../../../hooks/useCookieHandler'
import ProfileUpdateModal from '../../../components/Modals/ProfileUpdateModal'

const Paystack = ({
  amount_paid,
  setIsSuccess,
  workspaceData,
  userDetails,
  transactionId,
  dateBooked,
  selectedHours,
}) => {
  const { token } = useCookieHandler('user_token')
  const userData = useSelector((state) => state.adminPeople.users)

  const config = {
    reference: transactionId,
    email: userDetails?.email,
    amount: amount_paid * 100,
    publicKey: `${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_API_KEY}`,
  }

  const onSuccess = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    setIsSuccess(true)
  }

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
  }

  const initializePayment = usePaystackPayment(config)

  function getHours(spaceData) {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()

    let _month = month.toString().length === 1 ? '0' + month.toString() : month
    let _day = day.toString().length === 1 ? '0' + day.toString() : day

    const range = spaceData.data.open_hours.split('-')
    let range_1 = range[0].split(':')[0]
    let range_2 = range[1].split(':')[0].trim()

    const start = new Date(`${year}-${_month}-${_day}T${range_1}:00:00`)
    const end = new Date(`${year}-${_month}-${_day}T${range_2}:00:00`)

    const hours = []
    let current = new Date(start)
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
      // hours.push(`${startString  === '0 pm'?'12 pm':startString} - ${endString == '0 pm'?'12 pm':endString}`);
      hours.push(
        `${
          startString[0] === '0'
            ? '12 ' + startString.substring(1, startString.length)
            : startString
        } - ${
          endString[0] === '0'
            ? '12 ' + endString.substring(1, endString.length)
            : endString
        }`
      )
    }

    return hours
  }

  async function proceedToPayment() {
    try {
      /* The line `if (!userData) return null` in the `proceedToPayment` function is a conditional
      check that ensures the function returns `null` if the `userData` variable is falsy (e.g.,
      `null`, `undefined`, `false`, etc.). */
      if (!userData) return null

      var bookedDates = []
      var bookedSpacesTaken = [] // after verifying availability
      var bookedHourlySpacesTaken = [] // after verifying availability
      var availabile_hours = []
      var canProceed = false

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/validate-dates`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: workspaceData?.id,
          }),
        }
      )

      const data = await res.json()

      if (data.status === true) {
        availabile_hours = getHours(data)
        let maxBooking = data.data.available_space
        const originalData = data.data.booking_dates

        const newArray = Object.entries(originalData).map(([date, names]) => ({
          [date]: names,
        }))

        if (newArray.length > 0) {
          if (data.data.type.type === 'Hourly') {
            var date_hours_arr = []
            newArray.forEach((obj) => {
              const key = Object.keys(obj)[0]
              const value = obj[key]
              // if the day is fully booked
              if (
                data.data.type.type === 'Hourly' &&
                value.length === availabile_hours.length * maxBooking
              ) {
                bookedSpacesTaken.push(key)
              }
              date_hours_arr.push(...value)
            })
            // newArray.map(obj => {
            //   if(obj[Object.keys(obj)[0]].length === value.length === times.length * maxBooking){
            //     // bookedDates.push(new Date(Object.keys(obj)[0]))
            //     bookedDates.push(moment(new Date(Object.keys(obj)[0])).format('YYYY-MM-DD HH:mm:ss'))
            //   }
            // })

            var groupedHours = groupHoursByDate(date_hours_arr, maxBooking)

            if (
              groupedHours[dateBooked[0].split(' ')[0].trim()] !== undefined
            ) {
              groupedHours[dateBooked[0].split(' ')[0].trim()].map((data) => {
                if (selectedHours.includes(data.range)) {
                  if (data.isFilled) {
                    bookedHourlySpacesTaken.push(data)
                  }
                }
              })
            }
          } else {
            newArray.map((obj) => {
              if (obj[Object.keys(obj)[0]].length == maxBooking) {
                // bookedDates.push(new Date(Object.keys(obj)[0]))
                bookedDates.push(
                  moment(new Date(Object.keys(obj)[0])).format('YYYY-MM-DD')
                )
              }
            })
          }

          bookedDates.map((date) => {
            if (dateBooked.includes(date)) {
              bookedSpacesTaken.push(date)
            }
          })
        }

        if (
          bookedSpacesTaken.length > 0 ||
          bookedHourlySpacesTaken.length > 0
        ) {
          toast.error('One or more services have been taken')
        } else {
          initializePayment(onSuccess, onClose)
        }
      }
    } catch (err) {}
  }

  return <>{initializePayment(onSuccess, onClose)}</>
}

export default Paystack
