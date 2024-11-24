'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Link from 'next/link'
import axios from 'axios'
import clsx from 'clsx'

import { groupServicesByGroup } from '../../utils/formatter'
import useCookieHandler from '../../hooks/useCookieHandler'
import ServiceListItem from './ServiceListItem'
import Image from 'next/image'
import WorkSpaceRating from '../rating'
import { BsClock, BsStarFill } from 'react-icons/bs'
import moment from 'moment'
import { FormatAmount } from '../../utils/formatAmount'
import { calculateTotalPriceAndMinHours } from '../../helper'
import { LuTag } from 'react-icons/lu'
import SimpleCalender from './ReactSimpleCalender'
import { BiCalendar, BiCheck, BiChevronLeft } from 'react-icons/bi'
import PaymentComp from './payment'
import {
  getDiscountDetails,
  setDiscountsDetails,
} from '../../redux/settingsMarketing'
import LoaderWithoutAuth from '../Loader/LoaderWithoutAuth'
import Breadcrumb from '../Breadcrumb/Breadcrumb'

const steps = [
  { label: 'Service', id: 1 },
  { label: 'Date', id: 2 },
  { label: 'Payment', id: 3 },
]

export default function BookingCheckout({ id }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const contextRef = useRef(null)
  const searchparams = useSearchParams()
  const { token } = useCookieHandler('user_token')

  const sid = searchparams.get('sid')
  const code = searchparams.get('discount')

  const [times, setTimes] = useState([])
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])
  const [fullPhotos, setFullPhotos] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [spaceData, setSpaceData] = useState(null)
  const [bookingDate, setBookingDate] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [pageFailure, setPageFailure] = useState(false)
  const [selectedTimes, setSelectedTimes] = useState([])
  const [startMonthDate, setStartMonthDate] = useState()
  const [workspaceData, setWorkspaceData] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [WorkspaceReviews, setWorkspaceReviews] = useState([])

  const [selectedDate, setSelectedDate] = useState([])
  const [disabledTimes, setDisabledTimes] = useState([])
  const [disabledDates, setDisabledDates] = useState([])
  const [selectedDates, setSelectedDates] = useState([])
  const [maxSelectableTimes, setMaxSelectableTimes] = useState(1)

  const [bookedTimes, setBookedTimes] = useState(null)

  const [addedServices, setAddedServices] = useState(false)
  const [addedDateTimes, setAddedDateTimes] = useState(false)
  const [paymentModal, setPaymentModal] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [submittingCode, setSubmittingCode] = useState(false)

  const discountDetails = useSelector(getDiscountDetails)

  let currentDate = moment(new Date()).subtract(1).format('YYYY-MM-DD')

  // Split the pathname to get the breadcrumb items
  const pathnames = pathname.split('/').filter((x) => x)

  const getSpaceDetails = async () => {
    if (!id) return

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${id}`,
        {
          headers: {
            'Content-type': 'application/json',
            // Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = res.data

      if (data?.status === true) {
        const newGroup = groupServicesByGroup(data.data.services)
        setServices(newGroup)

        setWorkspaceData(data?.data)
        setBookings(data?.data?.bookings)
        setWorkspaceReviews(data?.data.reviews)
        data?.data?.photos?.map((item) => {
          setFullPhotos((prev) => [...prev, item?.url])
        })
        setPageLoading(false)
      } else {
        setPageFailure(true)
        setPageLoading(false)
      }
    } catch (error) {
      setPageFailure(true)
      setPageLoading(false)
    }
  }

  const handleClear = () => {
    setSelectedDates([])
    setBookingDate([])
    setStartMonthDate(null)
    setSelectedTimes([])
  }

  function getHoursLength(data) {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()

    let _month = month.toString().length === 1 ? '0' + month.toString() : month
    let _day = day.toString().length === 1 ? '0' + day.toString() : day

    const range = data.open_hours.split('-')
    var range_1 = range[0].split(':')[0]
    var range_2 = range[1].split(':')[0].trim()

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
          ? current.toLocaleTimeString([], {
              hour: 'numeric',
              hour12: true,
            })
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
    return hours.length
  }

  function getHours(data) {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    const day = new Date().getDate()

    let _month = month.toString().length === 1 ? '0' + month.toString() : month
    let _day = day.toString().length === 1 ? '0' + day.toString() : day

    const range = data.open_hours.split('-')
    var range_1 = range[0].split(':')[0]
    var range_2 = range[1].split(':')[0].trim()

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
          ? current.toLocaleTimeString([], {
              hour: 'numeric',
              hour12: true,
            })
          : end.toLocaleTimeString([], { hour: 'numeric', hour12: true })
      // hours.push(`${startString  === '0 pm'?'12 pm':startString} - ${endString == '0 pm'?'12 pm':endString}`);
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
    setTimes(hours)
  }

  const formatDateOutputForMontly = (date) => {
    let currentDate = new Date(date)
    const nextMonthDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    )
    setSelectedDate([
      new Date(date).toISOString(),
      nextMonthDate?.toISOString(),
    ])
  }

  useEffect(() => {
    if (workspaceData?.type?.type === 'Monthly' && startMonthDate) {
      formatDateOutputForMontly(startMonthDate)
    }
  }, [startMonthDate])

  const transformSelectedDate = (type) => {
    if (type === 'Daily') {
      const output_dates = bookingDate?.map((date) => {
        const formattedDate = date?.toISOString()
        return formattedDate
      })
      setSelectedDate(output_dates)
    }
  }

  useEffect(() => {
    if (workspaceData?.type?.type !== 'Daily') return
    transformSelectedDate('Daily')
  }, [bookingDate])

  // fetches the most current availablity data
  let bookedDates = []

  async function fetchAvailability() {
    if (!sid) {
      return router.push(`/booking`)
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/validate-dates`,
        {
          id: sid,
        },
        {
          headers: {
            'Content-type': 'application/json',
          },
        }
      )

      const data = res.data

      if (data.status === true) {
        setSpaceData(data.data)
        getHours(data.data)

        let maxBooking = data.data.available_space

        // booking details
        const originalData = data.data.booking_dates

        const newArray = Object.entries(originalData).map(([date, names]) => ({
          [date]: names,
        }))

        var result = []

        // for hourly
        var fullyBookedDates = []

        newArray.forEach((obj) => {
          const key = Object.keys(obj)[0]
          const value = obj[key]
          // if the day is fully booked
          if (
            spaceData.type.type === 'Hourly' &&
            value.length === times.length * maxBooking
          ) {
            fullyBookedDates.push(key)
            setMaxSelectableTimes(getHoursLength(data.data) * maxBooking)
          }
          result.push(...value)
        })
        setDisabledDates(fullyBookedDates)

        const date_hours = groupHoursByDate(result, maxBooking)

        setBookedTimes(date_hours)
        // newArray.map(dates=>{
        //   // if(dates.)
        // })
        if (spaceData?.type?.type !== 'Hourly') {
          newArray.map((obj) => {
            if (obj[Object.keys(obj)[0]].length == maxBooking) {
              bookedDates.push(
                moment(new Date(Object.keys(obj)[0])).format('YYYY-MM-DD')
              )
            }
          })
          setMaxSelectableTimes(maxBooking)
        }

        // set booked dates for monthly and daily
        setDisabledDates(bookedDates)
      } else {
        router.push(`/booking`)
      }
    } catch (err) {}
  }

  useEffect(() => {
    fetchAvailability()
    getSpaceDetails()
  }, [id, token])

  function isObjectEmpty(obj) {
    return obj && Object.keys(obj).length === 0
  }

  // this function updates the selected hours in a day by disabling if an hour has been fully booked
  useEffect(() => {
    var booked_hours = []
    if (bookedTimes && !isObjectEmpty(bookedTimes)) {
      let plainDate = moment(new Date(selectedDates[0])).format('YYYY-MM-DD')
      if (bookedTimes[plainDate] && bookedTimes[plainDate].length > 0) {
        bookedTimes[plainDate].forEach((item) => {
          if (item.isFilled) {
            booked_hours.push(item.range)
          }
        })
        setDisabledTimes(booked_hours)
      } else {
        setDisabledTimes([])
      }
    }
  }, [selectedDates, bookedTimes])

  const canProceed = () => {
    const hasServices =
      workspaceData?.category?.id === 6 ||
      workspaceData?.category?.id === 7 ||
      workspaceData?.category?.id === 8
    if (hasServices) {
      if (selectedTimes.length === 0 || selectedServices.length === 0) {
        return false
      } else if (selectedTimes.length !== totalMinHours) {
        return false
      } else {
        return true
      }
    } else {
      if (selectedDates.length === 0) {
        return false
      } else if (
        spaceData?.type?.type === 'Hourly' &&
        selectedTimes.length === 0
      ) {
        return false
      } else {
        return true
      }
    }
  }

  const { totalPrice, totalMinHours } =
    calculateTotalPriceAndMinHours(selectedServices)

  const totalPriceAndMinHours = calculateTotalPriceAndMinHours(selectedServices)

  const discountPercentage = discountDetails || 0 // Default to 0 if percentage is not available
  const discountAmount =
    (totalPriceAndMinHours.totalPrice * discountPercentage) / 100
  const discountedPrice = totalPriceAndMinHours.totalPrice - discountAmount

  const handleStepOneServices = () => {
    setCurrentStep(2)
    setAddedServices(true)
    const servicesData = {
      selectedServices,
      addedServices: true,
      currentStep: 2,
    }
    localStorage.setItem('servicesData', JSON.stringify(servicesData))
  }

  const handleStepTwoDates = () => {
    setCurrentStep(3)
    setAddedDateTimes(true)

    const dateTimeObj = {
      selectedDates,
      selectedTimes,
      addedDateTimes: true,
      currentStep: 3,
    }

    localStorage.setItem('dateTimeObj', JSON.stringify(dateTimeObj))
  }

  const handleNavigate = (e) => {
    /**
     * The function `redirectToLogin` saves the current URL in local storage and redirects the user to
     * the login page.
     */
    const redirectToLogin = () => {
      const currentUrl = window.location.href
      localStorage.setItem('redirectBackToCheckout', currentUrl)
      router.push('/login')
    }

    if (!token) {
      redirectToLogin()
      return
    }

    try {
      function formatTime(time) {
        var _time = time.split('-')[1].trim()
        var num = _time.split(' ')[0].trim()
        var mod = _time.split(' ')[1].trim()
        if (mod === 'am') {
          return `${
            num.toString().length === 1 ? '0' + num.toString() : num
          }:00:00`
        } else if (mod === 'pm') {
          return `${parseInt(num) + 12}:00:00`
        }
        return _time
      }

      let sorted_date = selectedDates.sort(function (a, b) {
        const date1 = new Date(a)
        const date2 = new Date(b)
        return date1 - date2
      })

      var arr_times = []
      var plain_arr_time = []

      selectedTimes.map((time, i) => {
        var _time = time.split('-')[1].trim().split(' ')[0]
        plain_arr_time.push(time)
        arr_times.push(
          `${moment(selectedDates[0], 'YYYY-MM-DD').format(
            'YYYY-MM-DD'
          )} ${formatTime(time)}`
        )
      })

      const dateObj = {
        previewImage: workspaceData?.photos[0],
        ownerImage: workspaceData?.owner?.profile_url,
        workspaceId: workspaceData?.id,
        value: spaceData?.type?.type == 'Hourly' ? arr_times : sorted_date,
        selectedHourRanges:
          spaceData?.type?.type === 'Hourly' ? plain_arr_time : [],
        discountedPrice,
        totalMinHours,
        services: selectedServices,
      }

      localStorage.setItem('dateBooked', JSON.stringify(dateObj))

      setTimeout(() => {
        setPaymentModal(true)
      }, 500)
    } catch (error) {}
  }

  // Retrieve data from local storage and set states
  useEffect(() => {
    const storedServicesData = localStorage.getItem('servicesData')
    const storedDateTimeObj = localStorage.getItem('dateTimeObj')

    if (storedServicesData) {
      const parsedData = JSON.parse(storedServicesData)

      setSelectedServices(parsedData.selectedServices || [])
      setAddedServices(parsedData.addedServices || false)
      setCurrentStep(parsedData.currentStep || 1)
    }

    if (storedDateTimeObj) {
      const parsedData = JSON.parse(storedDateTimeObj)

      setSelectedDates(parsedData.selectedDates)
      setSelectedTimes(parsedData.selectedTimes)
      setAddedDateTimes(parsedData.addedDateTimes)
      setCurrentStep(parsedData.currentStep)
    }
  }, [])

  // Extract service names and min_hour
  const serviceNames = selectedServices.map((item) => item.name).join(', ')
  const minHour = selectedServices.length > 0 ? selectedServices[0].min_hour : 0

  const handleApplyDiscountCode = async () => {
    if (!token) {
      return
    }

    const formData = {
      promo_code: promoCode,
      workspace_id: workspaceData.id,
    }

    setSubmittingCode(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/discounts/promo-code/apply`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await res.json()

      if (data?.status === true) {
        toast.success('You discount has been applied successfully ')
        setSubmittingCode(false)
        dispatch(setDiscountsDetails(data?.data.percentage))
      } else {
        toast.error(data?.errors.message)
        setSubmittingCode(false)
        return
      }
    } catch (error) {
      setSubmittingCode(false)
    }
  }

  useEffect(() => {
    if (code) {
      setPromoCode(code)
      handleApplyDiscountCode()
    }
  }, [code])

  const handleClickOutside = (event) => {
    if (contextRef.current && !contextRef.current.contains(event.target)) {
      setPaymentModal(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <LoaderWithoutAuth failure={pageFailure} isLoading={pageLoading} />
      <main className='flex flex-col justify-start items-start gap-8 w-full py-[7rem] 3xl:w-[65%] 3xl:px-10 3xl:mx-auto xxl:px-[10rem] xl:px-[10rem] lg:px-16 md:px-5 sm:px-5'>
        <Breadcrumb />

        <div className='flex items-start gap-5 w-full xxl:w-[70%] lg:w-[90%] lg:flex-row md:flex-col sm:flex-col'>
          <section className='w-full flex flex-col justify-start items-start gap-10 lg:w-[70%]'>
            <header className='flex items-center w-full lg:ml-[6rem] lg:w-[65%] md:w-[70%] sm:w-[80%]'>
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className='flex justify-between items-start w-full last:w-0 '
                >
                  <div className='flex flex-col gap-3 items-center'>
                    {currentStep >= step.id ? (
                      <BiCheck className='text-green text-2xl' />
                    ) : (
                      <div
                        className={`w-2 h-2 rounded-full ${
                          currentStep >= step.id ? 'bg-green' : 'bg-gray'
                        }`}
                      />
                    )}
                    <span
                      className={`text-sm ${
                        currentStep >= step.id ? 'text-black' : 'text-lightgrey'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className='flex-1 h-1 bg-gray mt-3 '>
                      <div
                        className={`h-1 ${
                          currentStep > step.id ? 'bg-green' : ''
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </header>

            {addedServices && (
              <div className='border border-gray rounded-md w-full'>
                <div className='flex justify-between items-center w-full p-3'>
                  <p className=''>Services</p>
                  <button
                    type='button'
                    onClick={() => {
                      setCurrentStep(1)
                      setAddedServices(false)
                    }}
                    className='text-primary'
                  >
                    Change
                  </button>
                </div>

                <hr className='w-full border-gray' />
                <div className='grid content-center place-items-center justify-items-start p-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 w-full'>
                  <h5 className=''>Details</h5>
                  <div className='flex flex-col gap-3 w-full'>
                    <div className='flex flex-col gap-1 justify-end items-end'>
                      <p className='text-sm'>{serviceNames}</p>
                      <div className='flex items-center gap-3 text-lightgrey text-sm'>
                        <span className='flex items-center gap-2'>
                          <LuTag className='text-sm text-primary' />{' '}
                          {totalPrice}
                        </span>
                        <span className='flex items-center gap-2'>
                          <BsClock className='text-sm text-primary' />{' '}
                          {totalMinHours}
                          hr
                          {totalMinHours > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {addedDateTimes && (
              <div className='border border-gray rounded-md w-full'>
                <div className='flex justify-between items-center w-full p-3'>
                  <p className=''>Date & Time</p>
                  <button
                    type='button'
                    onClick={() => {
                      setCurrentStep(2)
                      setAddedDateTimes(false)
                    }}
                    className='text-primary'
                  >
                    Change
                  </button>
                </div>

                <hr className='w-full border-gray' />
                <div className='grid content-center place-items-center justify-items-start p-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 w-full'>
                  <h5 className=''>Details</h5>
                  <div className='flex flex-col gap-3 w-full'>
                    <div className='flex flex-col gap-1 justify-end items-end'>
                      <p className='text-sm'>{serviceNames}</p>
                      <span className='flex items-center gap-2 text-lightgrey text-sm'>
                        <BiCalendar className='text-sm text-primary' />{' '}
                        {selectedDates[0]} {selectedTimes[0]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className='flex flex-col justify-start items-start gap-4 w-full'>
                <h2 className='text-base font-medium'>Select Services</h2>
                <div
                  className={clsx(
                    'w-full flex flex-col justify-start items-start gap-5 overflow-auto scrollbar-hide border border-gray rounded-md p-4 '
                  )}
                >
                  {services.map((group) => {
                    return (
                      <div
                        key={group.id}
                        className='w-full flex flex-col justify-start items-start gap-4 '
                      >
                        {group.services.map((service, i) => (
                          <ServiceListItem
                            number={i + 1}
                            key={service.id}
                            isCheckout={true}
                            selectedServices={selectedServices}
                            setSelectedServices={setSelectedServices}
                            service={{
                              groupId: group.id,
                              ...service,
                            }}
                          />
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className='flex flex-col justify-start items-start gap-3 w-full'>
                <h3 className='font-medium'>Select Date & Time</h3>

                <div className='border border-gray p-4 rounded-md w-full xxl:h-[40vh] xl:h-auto lg:h-auto md:h-auto sm:h-auto'>
                  {workspaceData?.type?.type === 'Daily' && (
                    <SimpleCalender
                      mode='multiple'
                      selectedDates={selectedDates}
                      setSelectedDates={setSelectedDates}
                      disabled={disabledDates}
                      minSelectable={currentDate}
                      maxSelectableTimes={totalMinHours}
                    />
                  )}

                  {workspaceData?.type?.type === 'Monthly' && (
                    <SimpleCalender
                      mode='single'
                      selectedDates={selectedDates}
                      setSelectedDates={setSelectedDates}
                      disabled={disabledDates}
                      minSelectable={currentDate}
                      maxSelectableTimes={totalMinHours}
                    />
                  )}
                  {workspaceData?.type?.type === 'Yearly' && (
                    <SimpleCalender
                      mode='single'
                      selectedDates={selectedDates}
                      setSelectedDates={setSelectedDates}
                      disabled={disabledDates}
                      minSelectable={currentDate}
                      maxSelectableTimes={totalMinHours}
                    />
                  )}
                  {workspaceData?.type?.type === 'Hourly' && (
                    <SimpleCalender
                      mode='datetime'
                      selectedDates={selectedDates}
                      setSelectedDates={setSelectedDates}
                      times={times}
                      maxSelectableTimes={totalMinHours}
                      selectedTimes={selectedTimes}
                      setSelectedTimes={setSelectedTimes}
                      disabled={disabledDates}
                      disabledTimes={disabledTimes}
                      minSelectable={currentDate}
                    />
                  )}
                </div>

                <button
                  onClick={() => setCurrentStep(1)}
                  className='flex items-center gap-1'
                >
                  <BiChevronLeft /> Back
                </button>
              </div>
            )}

            {paymentModal && currentStep === 3 && (
              <div
                // ref={contextRef}
                onClick={() => setPaymentModal(false)}
                className='flex justify-center items-center fixed bg-lightblack top-0 left-0 w-full h-screen z-20'
              >
                <PaymentComp id={id} setPaymentModal={setPaymentModal} />
              </div>
            )}
          </section>

          <section className='flex flex-col justify-start items-start gap-5 rounded-md p-2 border border-gray lg:w-auto md:w-full sm:w-full'>
            <div className='flex items-center gap-2'>
              {fullPhotos[0] && (
                <Image
                  src={fullPhotos[0]}
                  alt='service photo'
                  width={100}
                  height={100}
                  className='object-cover object-center rounded-md'
                />
              )}
              <div className='flex flex-col gap-1'>
                <h4 className='font-semibold'>{workspaceData?.name}</h4>
                <span className='text-lightgrey text-sm'>
                  {workspaceData?.address}
                </span>

                {WorkspaceReviews?.length > 0 ? (
                  <WorkSpaceRating rating={WorkspaceReviews} counter={false} />
                ) : (
                  <div className='flex items-center gap-2'>
                    <BsStarFill className='text-purple' />
                    <span className=''>No ratings</span>{' '}
                  </div>
                )}
              </div>
            </div>

            <hr className='w-full border-gray ' />

            {selectedServices.length >= 1 && (
              <>
                <div className='flex flex-col justify-start items-start gap-3 w-full'>
                  {selectedServices.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className='flex justify-between items-center gap-5 w-full'
                      >
                        <div className='flex flex-col'>
                          <p className=''>{item.name}</p>
                          <span className='text-sm text-lightgrey'>
                            {item.type}
                          </span>
                        </div>

                        {item.type === 'walk-in' ? (
                          <p className=''> ₦{FormatAmount(item.price)}</p>
                        ) : (
                          <p className=''>
                            ₦{FormatAmount(item.home_service_price)}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
                <hr className='w-full border-gray ' />
              </>
            )}

            {selectedServices.length > 0 && (
              <div className='w-full flex justify-between items-center'>
                <p className='font-semibold'>Total:</p>
                <p className='text-base font-medium'>
                  ₦{FormatAmount(discountedPrice)}/
                  {totalPriceAndMinHours.totalMinHours}hr
                  {totalMinHours > 1 ? 's' : ''}
                </p>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleApplyDiscountCode()
              }}
              className='flex items-center w-full gap-5 flex-wrap'
            >
              <div className='relative lg:w-[70%] md:w-[90%] sm:w-full'>
                <input
                  type='text'
                  name='promo_code'
                  id='promo_code'
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder='Enter code here'
                  className='h-12 outline-none border border-lightgrey indent-6 w-full rounded-md bg-transparent lg:indent-7 md:indent-7 sm:indent-7'
                />
                <LuTag className='absolute top-4 left-2 text-sm' />
              </div>
              <button type='submit' className='text-primary'>
                {submittingCode ? 'Applying...' : 'Apply'}
              </button>
            </form>

            {!addedServices && currentStep === 1 && (
              <button
                onClick={handleStepOneServices}
                disabled={selectedServices.length === 0}
                className={clsx(
                  'h-12 flex justify-center items-center w-full text-white rounded-md ring-2 ring-white',
                  selectedServices.length === 0 ? 'bg-lightgrey ' : 'bg-black '
                )}
              >
                Continue
              </button>
            )}

            {currentStep === 2 && (
              <button
                onClick={handleStepTwoDates}
                disabled={
                  selectedDates.length === 0 ||
                  selectedTimes.length < totalMinHours
                }
                className={clsx(
                  'h-12 flex justify-center items-center w-full text-white rounded-md ring-2 ring-white',
                  selectedDates.length === 0 ||
                    selectedTimes.length < totalMinHours
                    ? 'bg-lightgrey '
                    : 'bg-black '
                )}
              >
                Confirm Appointment
              </button>
            )}

            {currentStep === 3 && (
              <button
                type='button'
                onClick={(e) => handleNavigate(e)}
                className={clsx(
                  'h-12 flex justify-center items-center w-full text-white rounded-md ring-2 ring-white bg-black'
                )}
              >
                Confirm Payment
              </button>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
