'use client'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

import useProtectedRoute from '../../hooks/useProtectedRoute'
// import PaymentSteps from '../../components/payment-steps'
// import { FormatAmount } from '../../utils/formatAmount'
// import Loader from '../../components/Loader/Loader'
import Paystack from './paymentsMethodsFn/Paystack'

export default function PaymentComp({ id, setPaymentModal }) {
  const router = useRouter()
  const cookies = new Cookies()

  const { success, errorAuth, loadingfinished } = useProtectedRoute()

  const [dateBooked, setDateBooked] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)
  const [userDetails, setUserDetails] = useState({})
  const [canProceed, setCanProceed] = useState(false)
  const [blockPayment, setBlockPayment] = useState(true)
  const [selectedHours, setSelectedHours] = useState([])
  const [transactionId, setTranscationId] = useState('')
  const [workspaceData, setWorkspaceData] = useState({})
  const [bookingDetails, setBookingDetails] = useState(null)

  /* The above code is a React useEffect hook that retrieves data from the 'dateBooked' key in the
 localStorage, parses the data, and then sets the booking details, date booked, and selected hours
 based on the retrieved data. If the parsed data is not available, it navigates the user to the
 '/booking' route. */
  useEffect(() => {
    let retrievedObject = localStorage.getItem('dateBooked')
    let parsedDate = JSON.parse(retrievedObject)

    if (!parsedDate) {
      router.push('/booking')
      return
    }
    setBookingDetails(parsedDate)
    setDateBooked(parsedDate?.value)
    setSelectedHours(parsedDate?.selectedHourRanges)
  }, [])

  /**
   * The function `getAllDetails` fetches workspace details using a token and handles errors accordingly.
   * @returns The function `getAllDetails` is returning either the `transcationId` if there is an error
   * caught in the `try` block, or it is returning nothing explicitly (i.e., `undefined`) if the
   * execution completes without any errors.
   */
  const getAllDetails = async () => {
    const gottenToken = cookies.get('user_token')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${id}`,
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${gottenToken}`,
          },
        }
      )
      const data = await res.json()
      if (data?.status === false) {
        setBlockPayment(true)
        toast.error(data?.errors[0])
        // setTranscationId(uuidv4())
        return
      }

      setWorkspaceData(data?.data)
      setBlockPayment(false)
    } catch (error) {
      // setTranscationId(uuidv4())
    }
  }

  useLayoutEffect(() => {
    getAllDetails()
    // setTranscationId(uuidv4())
  }, [])

  const exchangeTokenForId = async () => {
    const token = cookies.get('user_token')
    if (!token) {
      return
    }
    try {
      const gottenToken = cookies.get('user_token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/retrieve-token`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${gottenToken}`,
          },
          body: JSON.stringify({
            token,
          }),
        }
      )
      const data = await res.json()
      if (data?.status !== true) {
        return
      }

      setTranscationId(uuidv4())
      setUserDetails(data?.data)
      const userData = data?.data
      return { userData }
    } catch (error) {
      // setTranscationId(uuidv4())
    }
  }

  const getHoursDistance = (a, b) => {
    if (bookingDetails?.totalMinHours > 0) return bookingDetails?.totalMinHours
    let hours = Math.abs(new Date(a) - new Date(b)) / 36e5
    if (dateBooked?.length == 1) {
      return '1'
    }
    return hours
  }

  const getFormattedDate = (dateArr) => {
    const newFormattedDateArray = dateArr?.map((x) => {
      const subtractedDate = moment(x, 'YYYY-MM-DD h A').subtract(1, 'hours')
      return subtractedDate.format('YYYY-MM-DD h A')
    })

    return newFormattedDateArray
  }

  getFormattedDate(dateBooked)

  const createBookingAfterPayment = async () => {
    try {
      const gottenToken = cookies.get('user_token')

      const outgoing = {
        workspaces_id: workspaceData?.id,
        user_id: userDetails?.id,
        booking_date: getFormattedDate(dateBooked),
        status: 'Pending',
      }

      var _services = []

      /* The above code is iterating over the services array in the bookingDetails object. For each
      service in the array, it is creating a new object with specific properties such as service_id,
      price, service_name, home_service_price, space_id, type, min_hour, and asset_id. These
      properties are extracted from the service object in the array. The code then pushes these new
      objects into the _services array. Finally, it assigns the _services array to the outgoing
      object's services property. */
      if (bookingDetails.services.length > 0) {
        bookingDetails.services.map((service, i) => {
          _services.push({
            service_id: service.id,
            price: service.price,
            service_name: service.name,
            home_service_price: service.home_service_price,
            space_id: workspaceData?.id,
            type: service?.type || 'walk-in',
            min_hour: service.min_hour,
            asset_id: service?.groupId ? service?.groupId : null,
          })
        })
        outgoing.services = _services
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/bookings`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${gottenToken}`,
            'Content-type': 'application/json',
          },
          body: JSON.stringify(outgoing),
        }
      )

      const data = await res.json()

      if (data.status === true) {
        toast.success('Your payment was successful, see you soon.')
        setPaymentModal(false)
        setCanProceed(true)
        setTimeout(() => {
          router.push(`/booking/${id}/booking-status`)
          // localStorage.removeItem('dateBooked')
          localStorage.removeItem('dateTimeObj')
          localStorage.removeItem('servicesData')
        }, 3000)
      } else {
        // setTranscationId(uuidv4())
        setPaymentModal(false)
        toast.error('An error occurred, try again')
        return
      }

      const currentDate = new Date()
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')

      const result = await recordPaymentTransaction(
        data?.data?.id,
        formattedDate,
        transactionId,
        userDetails?.id
      )
    } catch (error) {
      // setTranscationId(uuidv4())
    }
  }

  /**
   * The function calculates the payment amount based on different conditions related to workspace type,
   * booking services, and booking dates.
   * @returns The function `amount_payment` is returning a calculated payment amount based on different
   * conditions. If the `workspaceData` type is 'Monthly' or 'Yearly', it calculates the payment as 10%
   * of the price plus the price itself. If there are services booked (`bookingDetails.services.length >
   * 0`), it calculates the payment as 10% of the total price plus the total price
   */
  const amount_payment = () => {
    if (
      workspaceData?.type?.type === 'Monthly' ||
      workspaceData?.type?.type === 'Yearly'
    ) {
      return (
        (10 / 100) * parseInt(workspaceData?.price) +
        parseInt(workspaceData?.price)
      )
    } else if (bookingDetails?.services.length > 0) {
      return (
        (10 / 100) * parseInt(bookingDetails?.discountedPrice) +
        parseInt(bookingDetails?.discountedPrice)
      )
    } else {
      return (
        (10 / 100) * (parseInt(workspaceData?.price) * dateBooked.length) +
        parseInt(workspaceData?.price) * dateBooked.length
      )
    }
  }

  const recordPaymentTransaction = async (bookingId, tDate, tId, userId) => {
    workspaceData?.type?.type === 'Monthly'
      ? (10 / 100) * parseInt(workspaceData?.price) +
        parseInt(workspaceData?.price)
      : (10 / 100) * (parseInt(workspaceData?.price) * dateBooked.length) +
        parseInt(workspaceData?.price) * dateBooked.length

    try {
      const payload = {
        amount_paid: amount_payment(),
        user_id: userId,
        workspace_bookings_id: bookingId,
        payment_status: 'success',
        transaction_date: tDate,
        transaction_id: tId,
      }

      const gottenToken = cookies.get('user_token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${gottenToken}`,
          },
          body: JSON.stringify(payload),
        }
      )
      const data = await res.json()
      if (data.status !== true) {
        // setTranscationId(uuidv4())
        return
      }
      setCanProceed(true)
    } catch (error) {
      // setTranscationId(uuidv4())
    }
  }

  useEffect(() => {
    exchangeTokenForId()
    return () => {}
  }, [])

  useEffect(() => {
    isSuccess && createBookingAfterPayment()
  }, [isSuccess])

  return (
    <Paystack
      amount_paid={amount_payment()}
      blockPayment={blockPayment}
      workspaceData={workspaceData}
      setIsSuccess={setIsSuccess}
      userDetails={userDetails}
      transactionId={transactionId}
      dateBooked={dateBooked}
      selectedHours={selectedHours}
    />
  )
}
