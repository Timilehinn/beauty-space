'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import moment from 'moment'
import axios from 'axios'

import { RWebShare } from 'react-web-share'
import Image from 'next/image'
import clsx from 'clsx'

import parse from 'html-react-parser'
import ScrollIntoView from 'react-scroll-into-view'
import { BiChevronDown, BiChevronLeft, BiChevronUp } from 'react-icons/bi'

import {
  MdChevronLeft,
  MdGridView,
  MdLocationOn,
  MdOutlinedFlag,
  MdQrCode,
} from 'react-icons/md'
import { RxHeart, RxHeartFilled, RxShare1 } from 'react-icons/rx'
import { BsStarFill } from 'react-icons/bs'
import { CgSmileUpside } from 'react-icons/cg'
import { IoPricetagOutline } from 'react-icons/io5'
import { FaClock, FaLocationDot } from 'react-icons/fa6'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import useCookieHandler from '../../../hooks/useCookieHandler'
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import { calculateTotalPriceAndMinHours } from '../../../helper'
import {
  getAccountType,
  getWorkspaceFavorites,
} from '../../../redux/admin_user'

import Loader from '../../Loader/Loader'
import WorkSpaceRating from '../../rating'
import GroupImages from '../../bookings/GroupImages'
import { FormatAmount } from '../../../utils/formatAmount'
import ServiceListItem from '../../bookings/ServiceListItem'
import { groupServicesByGroup } from '../../../utils/formatter'
import WorkspaceMap from '../../workspace-map'
import AmentyComp from '../../amenities'
import GallaryCaraosel from '../../../helper/Gallary'
import BookingReviewsComp from '../../bookings/BookingReviewsComp'
import SimpleCalender from '../../bookings/ReactSimpleCalender'
import QrCodeModal from '../../Modals/QrCodeModal'
import RadioInputWifOtherOpt from '../../Inputs/radioInputWifOtherOpt'
import Breadcrumb from '../../Breadcrumb/Breadcrumb'
import { toast } from 'react-toastify'

export default function ExploreDetailsComp({ id }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchparams = useSearchParams()

  const sid = searchparams.get('sid')
  const Review = searchparams.get('Review')

  const hiddenDatePicker = useRef(null)
  /* The above code is using JavaScript to get the current day of the week and store it in the variable
  `currentDay`. */
  const currentDay = new Date().getDay()

  const { token } = useCookieHandler('user_token')

  const [active, setActive] = useState('Services')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [workspaceData, setWorkspaceData] = useState(null)
  const [photos, setPhotos] = useState([])
  const [bookings, setBookings] = useState([])
  const [fullPhotos, setFullPhotos] = useState([])

  const [open_hours, setOpen_Hours] = useState(null)

  // Amenities
  const [OtherOptions, setOtherOptions] = useState([])
  const [BasicOptions, setBasicOptions] = useState([])
  const [SeatingOptions, setSeatingOptions] = useState([])
  const [EquipmentOptions, setEquipmentOptions] = useState([])
  const [FacilitiesOptions, setFacilitiesOptions] = useState([])

  const [WorkspaceReviews, setWorkspaceReviews] = useState([])

  const [viewAll, setViewAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [failure, setFailure] = useState(false)
  const [selectedDate, setSelectedDate] = useState([])
  const [disabledDates, setDisabledDates] = useState([])
  const [selectedDates, setSelectedDates] = useState([])
  const [selectedTimes, setSelectedTimes] = useState([])
  const [times, setTimes] = useState([])
  const [maxSelectableTimes, setMaxSelectableTimes] = useState(1)
  const [disabledTimes, setDisabledTimes] = useState([]) // '11 am - 12 pm'
  const [spaceData, setSpaceData] = useState(null)

  const [view, setView] = useState('service_view') // 'service_view' | 'calender_view'
  const [services, setServices] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [openBottomSheet, setOpenBottomSheet] = useState(false)
  const [qrCodeModal, setQrCodeModal] = useState(false)
  const [bookedTimes, setBookedTimes] = useState({})

  let currentDate = moment(new Date()).subtract(1).format('YYYY-MM-DD')
  const currentDayData = workspaceData?.opening_hours?.find(
    (day) => day.day === currentDay
  )

  const [startFrom, setStartFrom] = useState(0)
  const [options, setOptions] = useState([
    {
      displayText: '',
      date: '',
    },
  ])
  const [hourlyTimeOption, setHourlyTimeOption] = useState([])
  //   const [workspaceFavourites, setWorkspaceFavourites] = useState([])
  const [isFavourited, setIsFavoutited] = useState(false)
  const [startMonthDate, setStartMonthDate] = useState()
  const [bookingDate, setBookingDate] = useState([])
  const [reportModal, setReportModal] = useState(false)
  const [selectedValue, setSelectedValue] = useState('')
  const [errors, setErrors] = useState([])
  const [toggleAvailability, setToggleAvailability] = useState(false)

  const workspaceFavourites = useSelector(getWorkspaceFavorites)
  const accountType = useSelector(getAccountType)

  const getWorkspaceDetails = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.status === 401) {
        router.push('/')
        return
      }

      const data = await res.json()

      if (data?.status === true) {
        setWorkspaceData(data?.data)
        setOpen_Hours(data?.data?.open_hours)
        setWorkspaceReviews(data?.data.reviews)
        setBookings(data?.data?.bookings)

        const newGroup = groupServicesByGroup(data.data.services)
        setServices(newGroup)

        if (
          data.data.category.id === 6 ||
          data.data.category.id === 7 ||
          data.data.category.id === 8
        ) {
          setView('service_view')
        }

        const seatingOptions = []
        const basicOptions = []
        const facilitiesOptions = []
        const equipmentOptions = []
        const otherOptions = []

        data?.data?.amenities?.forEach((amenity) => {
          const { name, amenitygroups } = amenity?.amenities_item

          if (
            amenitygroups?.name === 'Seating' &&
            !seatingOptions.includes(name)
          ) {
            seatingOptions.push(name)
          } else if (
            amenitygroups?.name === 'Basic' &&
            !basicOptions.includes(name)
          ) {
            basicOptions.push(name)
          } else if (
            amenitygroups?.name === 'Facilities' &&
            !facilitiesOptions.includes(name)
          ) {
            facilitiesOptions.push(name)
          } else if (
            amenitygroups?.name === 'Equipment' &&
            !equipmentOptions.includes(name)
          ) {
            equipmentOptions.push(name)
          } else if (
            amenitygroups?.name === 'Others' &&
            !otherOptions.includes(name)
          ) {
            otherOptions.push(name)
          }
        })

        setSeatingOptions(seatingOptions)
        setBasicOptions(basicOptions)
        setFacilitiesOptions(facilitiesOptions)
        setEquipmentOptions(equipmentOptions)
        setOtherOptions(otherOptions)

        data?.data?.photos?.forEach((item) => {
          setFullPhotos((prev) => [...prev, item?.url])
        })

        setFailure(false)
        setLoading(false)
      } else {
        setFailure(true)
        setLoading(false)
      }
    } catch (error) {}
  }

  useEffect(() => {
    getWorkspaceDetails()
  }, [token, id])

  const handleSelectionChange = (value) => {
    setSelectedValue(value)
  }

  useEffect(() => {
    const newPhotos = workspaceData?.photos
    setPhotos(newPhotos?.slice(0, 5))
  }, [workspaceData])

  /**
   * The function `getNextHour` takes a time in the format "HH:mm" and an incremental value, and returns
   * the time that is the specified number of hours ahead.
   * @param time - The `time` parameter in the `getNextHour` function is a string representing a time in
   * the format "HH:MM" (hours and minutes). The function increments the hour part of the time by the
   * `incremental` value and returns the updated time in the same format.
   * @param incremental - It looks like the code you provided is a function called `getNextHour` that
   * takes two parameters: `time` and `incremental`. The function is designed to increment the hour part
   * of a time by the value of `incremental` and return the updated time in the format HH:mm.
   * @returns The function `getNextHour` takes two parameters, `time` and `incremental`. It increments
   * the hour part of the `time` by the `incremental` value and returns the updated time in the format
   * HH:mm. If the incremented hour reaches 24, it resets to 00.
   */
  const getNextHour = (time, incremental) => {
    const firstTwo = time.slice(0, 2)
    const lastTwo = time.slice(-2)
    let firstTwoOperatedByAddition = parseInt(firstTwo) + incremental
    if (firstTwoOperatedByAddition == 24) {
      firstTwoOperatedByAddition = '00'
    }
    if (firstTwoOperatedByAddition < 10) {
      firstTwoOperatedByAddition = `0${firstTwoOperatedByAddition}`
    }
    if (typeof firstTwoOperatedByAddition === 'number') {
      firstTwoOperatedByAddition = firstTwoOperatedByAddition.toString()
    }
    return `${firstTwoOperatedByAddition}:${lastTwo}`
  }

  function tConv24(time24) {
    var ts = time24
    var H = +ts.substr(0, 2)
    var h = H % 12 || 12
    h = h < 10 ? '0' + h : h // leading 0 at the left for 1 digit hours
    var ampm = H < 12 ? ' AM' : ' PM'
    ts = h + ts.substr(2, 3) + ampm
    return ts
  }

  const handleTimeFormation = () => {
    if (!open_hours) return
    const timeArr = open_hours.split(/(\s+)/)
    const firstTwo = timeArr[0].slice(0, 2)
    const lastTwo = timeArr[timeArr.length - 1].slice(0, 2)
    let timeDistance = parseInt(lastTwo) - parseInt(firstTwo)
    const dummyArr = [...Array(timeDistance).keys()]
    const newIso = new Date(`${moment().format('YYYY-M-D')} ${timeArr[0]}`)

    let newOptionArray = []
    options.map((x) => {
      if (!x?.date) return

      dummyArr.map((y, i) => {
        const newIso = new Date(
          `${moment(x?.date).format('YYYY-M-D')} ${getNextHour(timeArr[0], i)}`
        )
        const newObj = {
          date: newIso.toISOString(),
          displayText: `${tConv24(getNextHour(timeArr[0], i))}-${tConv24(
            getNextHour(timeArr[0], i + 1)
          )}${'....'}${moment(x?.date).format('YYYY-MMM-Do')} `,
        }
        newOptionArray = [...newOptionArray, newObj]
      })
    })
    setHourlyTimeOption(newOptionArray)
  }

  useEffect(() => {
    handleTimeFormation()
  }, [options, open_hours])

  useEffect(() => {
    const newPhotos = workspaceData?.photos
    if (viewAll) {
      setPhotos(newPhotos)
      return
    }
    setPhotos(newPhotos?.slice(0, 5))
  }, [viewAll])

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

  const handleViewAll = () => {
    setViewAll(!viewAll)
    setStartFrom(0)
  }

  const handleActiveTabs = (name) => {
    setActive(name)
  }

  const formatAvailiablilty = () => {
    let cache = []
    try {
      const presentYear = new Date().getFullYear()
      const presentMonth = new Date().getMonth() + 1
      const presentDay = new Date().getDate()
      const presentHour = new Date().getHours()
      // const presentHour = 13;
      function addHoursToDate(date, hours) {
        return new Date(new Date(date).setHours(date.getHours() + hours))
      }
      const timeAvaliable = bookings?.filter((item) => {
        const bookedYear = new Date(item?.date).getFullYear()
        const bookedMonth = new Date(item?.date).getMonth() + 1
        const bookedDay = new Date(item?.date).getDate()
        const bookedHours = new Date(item?.date).getHours()
        if (
          bookedHours > presentHour &&
          presentDay == bookedDay &&
          presentYear == bookedYear &&
          presentMonth == bookedMonth
        ) {
          let backupCache = [...cache]
          cache = [...cache, item?.id]
          if (!backupCache.includes(item?.id)) {
            return item
          }
        }
        if (
          presentYear == bookedYear &&
          presentMonth == bookedMonth &&
          presentDay < bookedDay
        ) {
          if (!cache.includes(item?.id) && presentDay != bookedDay) {
            cache = [...cache, item?.id]
            return item
          }
        }
      })
      timeAvaliable.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
      })

      const isToday = (someDate) => {
        const today = new Date()
        return (
          someDate.getDate() == today.getDate() &&
          someDate.getMonth() == today.getMonth() &&
          someDate.getFullYear() == today.getFullYear()
        )
      }

      timeAvaliable.reverse().map((x) => {
        let formattedTimeOption
        const writtenTime = moment(x?.date).format('ha')
        const writtenTime2 = addHoursToDate(new Date(x?.date), 1)
        const writtenTime2Parsed = moment(writtenTime2).format('ha')
        const timeParsed = parseInt(moment(x?.date).format('ha'))
        const closedTime = timeParsed + 1
        if (isToday(new Date(x?.date))) {
          formattedTimeOption = `${writtenTime} - ${writtenTime2Parsed}   today`
        } else {
          formattedTimeOption = `${writtenTime} - ${writtenTime2Parsed}   ${moment(
            x?.date
          ).format('MMM Do YY')}`
        }
        setOptions((prev) => [
          ...prev,
          {
            displayText: formattedTimeOption,
            date: x?.date,
          },
        ])
      })

      return today
    } catch (error) {}
  }

  useEffect(() => {
    if (!bookings?.length) return
    formatAvailiablilty()
  }, [bookings])

  const dismissDropdown = () => {
    setIsMenuOpen(false)
  }

  useOnClickOutside(hiddenDatePicker, () => dismissDropdown())

  const isWorkspaceFavourited = () => {
    const findLovedWorkspace = workspaceFavourites?.find(
      (space) => space?.id == workspaceData?.id && space?.pivot?.favourite
    )
    if (!findLovedWorkspace) {
      setIsFavoutited(false)
      return
    }
    setIsFavoutited(true)
    return true
  }

  useEffect(() => {
    isWorkspaceFavourited()
  }, [workspaceData])

  const getOnlyAvaliableDates = (bookings, booked_dates) => {
    const filteredArr = bookings?.filter((booking, number) => {
      for (let index = 0; index < booked_dates.length; index++) {
        const element = booked_dates[index]

        if (element?.booking_date === booking?.date) {
          return booking
        }
      }
    })
    return filteredArr
  }

  /**
   * The function `handleReportContent` sends a POST request to report a workspace with specified reasons
   * and displays success or error messages accordingly.
   */
  const handleReportContent = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${workspaceData.id}/report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            workspace_id: workspaceData.id,
            reason: selectedValue,
          }),
        }
      )

      const data = await res.json()

      if (data?.status === true) {
        setReportModal(false)
        setTimeout(() => {
          toast.success(
            'You have successfully report this business, we will review your submission and do something about it.'
          )
          // window.location.reload()
          router.refresh()
        }, [2000])
      } else {
        setErrors([
          ...(data?.errors?.workspace_id || []),
          ...(data?.errors?.reason || []),
        ])
      }
    } catch (error) {
    } finally {
      toast.error(data?.errors?.message)
    }
  }

  const handleViewOnMap = () => {
    setActive('Location')
  }

  const workspaceFavouriteSetter = async () => {
    const isFavourite = isFavourited ? 'unfavourite' : 'favourite'
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${workspaceData?.id}/${isFavourite}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()
      if (data?.status === false) {
        return
      }
      setIsFavoutited(!isFavourited)
    } catch (error) {}
  }

  const { totalPrice, totalMinHours } =
    calculateTotalPriceAndMinHours(selectedServices)

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

  /**
   * The `handleNavigate` function processes selected dates and times, formats them, stores relevant data
   * in local storage, and then navigates to the payment page after a delay.
   * @param e - The `handleNavigate` function you provided takes an event parameter `e`, which is
   * commonly used in event handling functions in JavaScript to represent the event that occurred. This
   * parameter can be used to access information about the event that triggered the function, such as the
   * target element or event type.
   * @returns The `handleNavigate` function does not explicitly return anything. It performs a series of
   * operations within a try-catch block, including formatting time, sorting dates, creating arrays of
   * times, constructing a `dateObj` object, storing it in local storage, and then navigating to a
   * payment page after a timeout. The function does not have a return statement that would return a
   * specific value.
   */
  const handleNavigate = (e) => {
    try {
      /**
       * The function `formatTime` takes a time string in the format "hh:mm am/pm" and returns it in a
       * 24-hour format "hh:mm:ss".
       * @param time - The `formatTime` function takes a time string as input and returns a formatted
       * time string in the format `HH:00:00`.
       * @returns The `formatTime` function is returning a formatted time string in the format
       * "HH:00:00" based on the input time string. If the time string contains 'am', it returns the
       * hour followed by ':00:00'. If the time string contains 'pm', it adds 12 to the hour and
       * returns the result followed by ':00:00'. If the time string does not
       */
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

      if (!canProceed()) return

      let sorted_date = selectedDates.sort(function (a, b) {
        const date1 = new Date(a)
        const date2 = new Date(b)
        return date1 - date2
      })

      var arr_times = []
      var plain_arr_time = []

      /* The above code snippet is using the `map` function to iterate over the elements in the
      `selectedTimes` array. For each element (referred to as `time`), it is splitting the time
      string by the '-' character, trimming any extra spaces, and then splitting the resulting
      string by spaces to extract the time part. */
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
        totalPrice,
        totalMinHours,
        services: selectedServices,
      }

      localStorage.setItem('dateBooked', JSON.stringify(dateObj))

      setTimeout(() => {
        router.push(`/booking/${id}/payment`)
      }, 500)
    } catch (error) {}
  }

  const handleClear = () => {
    // setSelectedDate([])
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
          ? current.toLocaleTimeString([], { hour: 'numeric', hour12: true })
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

  // fetches the most current availablity data
  let bookedDates = []

  async function fetchAvailability() {
    try {
      if (!sid) {
        return router.push(`/booking`)
      }

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
  }, [])

  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0
  }

  // this function updates the selected hours in a day by disabling if an hour has been fully booked
  useEffect(() => {
    var booked_hours = []
    if (!isObjectEmpty(bookedTimes)) {
      let plainDate = moment(new Date(selectedDates[0])).format('YYYY-MM-DD')
      if (bookedTimes[plainDate] && bookedTimes[plainDate].length > 0) {
        bookedTimes[plainDate].map((item) => {
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

  function showCalenderView() {
    setView('calender_view')
  }

  useEffect(() => {
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )

    if (isMobileDevice) {
      // Prompt the user to download the app
      setOpenBottomSheet(true)
      // You can show a modal or a banner with a download link here
    }
  }, [])

  const totalPriceAndMinHours = calculateTotalPriceAndMinHours(selectedServices)

  const dayNames = [
    'Sundays',
    'Mondays',
    'Tuesdays',
    'Wednesdays',
    'Thursdays',
    'Fridays',
    'Saturdays',
  ]

  const formatHours = (hoursArray) => {
    if (hoursArray.length === 0) return 'Unavailable'
    const [open, close] = hoursArray
    const openTime = open.replace('=>', ':')
    const closeTime = close.replace('=>', ':')
    return `${openTime} - ${closeTime}`
  }

  const truncateDescription = (description) => {
    if (!description) return ''
    return description.length > 250
      ? description.slice(0, 250) + '...'
      : description
  }

  const handleBookingNavigate = () => {
    if (selectedServices.length > 0) {
      const servicesData = {
        selectedServices,
        addedServices: true,
        currentStep: 2,
      }

      localStorage.setItem('servicesData', JSON.stringify(servicesData))

      router.push(`/booking/${id}/checkout?sid=${workspaceData?.id}`)
    } else {
      toast.error('Kindly select at least one service you will like to book')
    }
  }

  return (
    <>
      <Loader isLoading={loading} failure={failure} />
      <main className='flex flex-col justify-start items-start gap-5 w-full px-5 pt-10 min-h-full lg:px-10'>
        <Link
          href='/dashboard/explore'
          className='text-xl font-semibold flex flex-row items-center gap-1'
        >
          <BiChevronLeft className='text-2xl' /> Explore
        </Link>

        <Breadcrumb />

        <h1 className='3xl:text-6xl xl:text-5xl lg:text-4xl md:text-4xl sm:text-2xl font-bold'>{`${workspaceData?.name}`}</h1>

        <header
          className='w-full flex xl:flex-row lg:flex-row lg:justify-between lg:items-center md:flex-col md:justify-start md:items-start md:gap-5 sm:flex-col
          sm:justify-start sm:items-start sm:gap-5 '
        >
          <div className='flex justify-start items-center gap-3 flex-wrap '>
            <div className='flex justify-start items-center gap-1 flex-wrap'>
              <span className='flex justify-start items-center gap-1'>
                <MdLocationOn className='text-base' />
                {workspaceData?.address}
              </span>
              <ScrollIntoView selector='#viewMap'>
                <button
                  type='button'
                  onClick={handleViewOnMap}
                  className='cursor-pointer text-primary font-medium'
                >
                  View on map
                </button>
              </ScrollIntoView>
            </div>

            {WorkspaceReviews.length > 0 ? (
              <WorkSpaceRating rating={WorkspaceReviews} />
            ) : (
              <div className='flex items-center gap-2'>
                <BsStarFill className='text-purple' />
                <span className=''>No ratings</span>{' '}
              </div>
            )}
          </div>

          <div className='flex justify-start items-center gap-3 flex-wrap'>
            <button
              type='button'
              onClick={() => workspaceFavouriteSetter()}
              className='border border-lightgrey rounded-full h-10 w-10 p-2 flex justify-center items-center gap-2 hover:bg-primary hover:border-none hover:text-white '
            >
              {isFavourited ? (
                <RxHeartFilled className='text-chartColor text-xl ' />
              ) : (
                <RxHeart className='text-xl' />
              )}
            </button>

            <button
              type='button'
              onClick={() => setQrCodeModal(true)}
              className='border border-lightgrey rounded-full h-10 w-10 p-2 flex justify-center items-center gap-2 hover:bg-primary hover:border-none hover:text-white '
            >
              <MdQrCode className='text-xl' />
            </button>

            <RWebShare
              data={{
                text: workspaceData?.description,
                url: pathname,
                title: workspaceData?.name,
              }}
              onClick={() => {}}
            >
              <button
                type='button'
                className='flex justify-center items-center gap-2 border border-lightgrey rounded-full h-10 w-10 p-2 hover:bg-primary hover:border-none hover:text-white'
              >
                <RxShare1 className='text-xl' />
              </button>
            </RWebShare>

            {accountType === 'User' && (
              <button
                type='button'
                onClick={() => setReportModal(true)}
                className='border border-lightgrey rounded-full h-10 w-10 p-2 flex justify-center items-center gap-2 hover:bg-primary hover:border-none hover:text-white '
              >
                <MdOutlinedFlag className='text-xl' />
              </button>
            )}
          </div>
        </header>

        {photos?.length && (
          <div className='relative w-auto rounded-xl '>
            <div className=' overflow-x-auto scrollbar-hide bg-transparent flex gap-5 xl:h-[500px] md:h-[300px] sm:h-[200px]'>
              {photos?.map((img) => (
                <Image
                  src={img.url}
                  key={img.id}
                  width={300}
                  height={300}
                  alt='Business image'
                  className='xl:h-full xl:w-[300px] lg:w-[300px] md:h-[300px] md:w-[200px] sm:w-[200px] sm:h-[200px] object-cover object-center rounded-md rounded-l-xl'
                />
              ))}
            </div>

            <button
              type='button'
              onClick={handleViewAll}
              className='h-12 px-5 shadow-2fl rounded-lg flex justify-center items-center gap-2 absolute bottom-5 right-5 bg-primary 
                text-white hover:bg-black '
            >
              <MdGridView className='text-xl' />
              {!viewAll ? 'View All' : 'Collapse All'}
            </button>
          </div>
        )}

        <section className='flex w-full py-10 xl:flex-row xl:gap-10 lg:gap-10 lg:flex-row md:flex-col md:gap-10 sm:flex-col sm:gap-5 '>
          <section className='xxl:w-[70%] xl:w-[60%] lg:w-[60%] md:w-full sm:w-full flex flex-col justify-start items-start gap-5 '>
            <div className='flex justify-start items-center gap-5'>
              <button
                onMouseDown={() => handleActiveTabs('Services')}
                className={clsx(
                  'hover:border-b-2 hover:border-primary hover:text-primary capitalize font-medium ',
                  active === 'Services'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-black'
                )}
              >
                {' '}
                services{' '}
              </button>
              <button
                onMouseDown={() => handleActiveTabs('About')}
                className={clsx(
                  'hover:border-b-2 hover:border-primary hover:text-primary capitalize font-medium ',
                  active === 'About'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-black'
                )}
              >
                {' '}
                about{' '}
              </button>
              <button
                onMouseDown={() => handleActiveTabs('Reviews')}
                className={clsx(
                  'flex justify-start items-center gap-3 hover:border-b-2 hover:border-primary hover:text-primary capitalize font-medium ',
                  active === 'Reviews'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-black'
                )}
              >
                {' '}
                reviews{' '}
                <span
                  className={clsx(
                    ' rounded-full p-1 h-6 w-6 flex justify-center items-center text-sm',
                    active === 'Reviews'
                      ? 'bg-primary text-white'
                      : 'bg-lightgrey text-black'
                  )}
                >
                  {WorkspaceReviews.length}
                </span>
              </button>
            </div>

            <div className='w-full'>
              {active === 'Services' && (
                <div className='w-full'>
                  <div className='flex flex-col justify-start items-start gap-4 w-full'>
                    <h2 className='text-lg font-medium'>Available Services</h2>
                    <div
                      className={clsx(
                        'w-full flex flex-col justify-start items-start gap-5 overflow-auto scrollbar-hide border border-gray rounded-md p-2 ',
                        services.length > 3 ? 'h-[500px]' : 'h-auto'
                      )}
                    >
                      {services.map((group) => {
                        return (
                          <div
                            key={group.id}
                            className='w-full flex flex-col justify-start items-start gap-5 px-4 '
                          >
                            <GroupImages
                              urls={group.asset_urls}
                              spaceName={workspaceData?.name}
                            />
                            <div className='w-full flex flex-col justify-start items-start gap-4 '>
                              {group.services.map((service, i) => (
                                <ServiceListItem
                                  number={i + 1}
                                  key={service.id}
                                  selectedServices={selectedServices}
                                  setSelectedServices={setSelectedServices}
                                  service={{
                                    groupId: group.id,
                                    ...service,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {active === 'About' && (
                <div className='flex flex-col justify-start items-start gap-5'>
                  <h3 className='text-lg font-medium '>
                    About {`${workspaceData?.name}`}{' '}
                  </h3>
                  <div className='font-light text-base'>
                    {parse(`${workspaceData?.description}`)}
                  </div>

                  <div className='flex flex-col justify-start items-start gap-3 w-full'>
                    <h3 className='text-lg font-medium '> Location </h3>
                    <div className='flex items-center gap-3 text-sm'>
                      <FaLocationDot />
                      <span>{workspaceData?.address}</span>
                    </div>

                    <WorkspaceMap
                      space_data={workspaceData}
                      staticView={true}
                      latValue={workspaceData?.lat}
                      lngValue={workspaceData?.lng}
                    />
                  </div>

                  {(BasicOptions?.length > 0 ||
                    SeatingOptions?.length > 0 ||
                    FacilitiesOptions?.length > 0 ||
                    EquipmentOptions?.length > 0 ||
                    OtherOptions?.length > 0) && (
                    <div className='flex flex-col justify-start items-start gap-3 w-full '>
                      <h1 className='text-lg font-medium'>Amenities</h1>
                      <div className='border border-gray rounded-md p-2 w-full divide-y divide-gray flex flex-col gap-3 '>
                        {BasicOptions?.length > 0 && (
                          <AmentyComp label='Basic' options={BasicOptions} />
                        )}

                        {SeatingOptions?.length > 0 && (
                          <AmentyComp
                            label='Seating'
                            options={SeatingOptions}
                          />
                        )}

                        {FacilitiesOptions?.length > 0 && (
                          <AmentyComp
                            label='Facilities'
                            options={FacilitiesOptions}
                          />
                        )}

                        {EquipmentOptions?.length > 0 && (
                          <AmentyComp
                            label='Equipment'
                            options={EquipmentOptions}
                          />
                        )}

                        {OtherOptions?.length > 0 && (
                          <AmentyComp label='Others' options={OtherOptions} />
                        )}
                      </div>
                    </div>
                  )}

                  <div className='flex flex-col gap-4 w-full'>
                    <h4 className='text-lg font-medium'>Owner</h4>
                    <div className='flex justify-start items-center gap-3'>
                      <Image
                        src={
                          workspaceData?.owner?.profile_url || '/portrait1.jpg'
                        }
                        alt='profile picture'
                        width={50}
                        height={50}
                        className='object-cover object-top rounded-full w-16 h-16'
                      />
                      <div className='flex flex-col justify-start items-start gap-1'>
                        <h3 className='text-lg'>
                          {workspaceData?.owner?.first_name}{' '}
                          {workspaceData?.owner?.last_name}
                        </h3>
                        <span className='text-sm'>Business Owner</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {active === 'Reviews' && (
                <>
                  {WorkspaceReviews.length > 0 ? (
                    <BookingReviewsComp id={workspaceData?.slug} />
                  ) : (
                    <div className='flex flex-col justify-center items-center gap-3 text-center py-10'>
                      <CgSmileUpside className='text-6xl' />
                      <h1 className='text-3xl'>No reviews!</h1>
                      <p className='text-base text-lightgrey'>
                        This service does not have a review yet, place a booking
                        with {`${workspaceData?.name}`} and come back to leave a
                        review about your experience about their service.{' '}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <section className='xxl:w-[30%] xl:w-[40%] lg:w-[40%] md:w-full sm:w-full flex flex-col gap-5 '>
            <div className='border border-gray rounded-md p-5 flex flex-col gap-3'>
              {view === 'service_view' && (
                <div className=' flex flex-col gap-3 '>
                  <h1 className='text-3xl font-semibold'>
                    {workspaceData?.name}
                  </h1>
                  <div className='font-light'>
                    {parse(truncateDescription(workspaceData?.description))}
                  </div>

                  <div className='flex justify-between items-center flex-wrap'>
                    <span className='font-medium text-lg'>
                      Starting at &#8358;{workspaceData?.price}
                    </span>

                    {WorkspaceReviews.length > 0 ? (
                      <WorkSpaceRating
                        rating={WorkspaceReviews}
                        counter={false}
                      />
                    ) : (
                      <div className='flex items-center gap-2'>
                        <BsStarFill className='text-purple' />
                        <span className=''>No ratings</span>{' '}
                      </div>
                    )}
                  </div>

                  {selectedServices.length > 0 && (
                    <div className='w-full flex justify-between items-center'>
                      <p className='text-lg font-semibold'>Total:</p>
                      <p className='text-base font-medium'>
                        ₦{FormatAmount(totalPriceAndMinHours.totalPrice)}/
                        {totalPriceAndMinHours.totalMinHours}hr
                        {totalMinHours > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  <button
                    disabled={selectedServices.length === 0}
                    onClick={handleBookingNavigate}
                    className={clsx(
                      'text-white w-full rounded-md h-12 ring-2 ring-white hover:text-white flex justify-center items-center',
                      selectedServices.length > 0 ? 'bg-black' : 'bg-lightgrey'
                    )}
                  >
                    Book Now
                  </button>
                </div>
              )}

              {/* {view === 'calender_view' && (
                <div className='relative flex flex-col justify-start items-start gap-5 w-full '>
                  {selectedServices.length > 0 && (
                    <div className='flex flex-col justify-start items-start gap-3 w-full'>
                      <button
                        type='button'
                        className='flex justify-start items-center gap-1 border border-lightgrey h-10 px-2 rounded-md capitalize hover:bg-primary hover:border-none hover:text-white'
                        onClick={() => setView('service_view')}
                      >
                        <MdChevronLeft className='text-xl' /> back
                      </button>

                      <div className='flex flex-col justify-start items-start gap-2 w-full'>
                        <span className='flex justify-start items-center gap-2'>
                          <FaClock className='text-primary' />
                          <p>
                            {totalMinHours} hour{totalMinHours > 1 ? 's' : ''}
                          </p>
                        </span>

                        <span className='flex justify-start items-center gap-2'>
                          <IoPricetagOutline className='text-primary' />
                          <p>
                            ₦{FormatAmount(totalPriceAndMinHours.totalPrice)}
                          </p>
                        </span>

                        <span className='flex justify-start items-center gap-2'>
                          <ExclamationCircleOutlined className='text-primary' />
                          <p>
                            Your selected services will take a minimum of{' '}
                            {totalMinHours} hour{totalMinHours > 1 ? 's' : ''}
                          </p>
                        </span>
                      </div>
                    </div>
                  )}

                  <>
                    {workspaceData?.type?.type === 'Daily' && (
                      <SimpleCalender
                        mode='multiple'
                        selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}
                        disabled={disabledDates}
                        minSelectable={currentDate}
                      />
                    )}
                    {workspaceData?.type?.type === 'Monthly' && (
                      <SimpleCalender
                        mode='single'
                        selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}
                        disabled={disabledDates}
                        minSelectable={currentDate}
                      />
                    )}
                    {workspaceData?.type?.type === 'Yearly' && (
                      <SimpleCalender
                        mode='single'
                        selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}
                        disabled={disabledDates}
                        minSelectable={currentDate}
                      />
                    )}
                    {workspaceData?.type?.type === 'Hourly' && (
                      <SimpleCalender
                        mode='datetime'
                        selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}
                        times={times}
                        maxSelectableTimes={maxSelectableTimes}
                        selectedTimes={selectedTimes}
                        setSelectedTimes={setSelectedTimes}
                        disabled={disabledDates}
                        disabledTimes={disabledTimes}
                        minSelectable={currentDate}
                      />
                    )}

                    {canProceed() && (
                      <div className='grid grid-cols-2 content-center place-items-center gap-4 w-full'>
                        <button
                          type='button'
                          onClick={() => handleClear()}
                          className='h-12 w-full rounded-md border border-primary px-5 '
                        >
                          Clear
                        </button>
                        <button
                          onClick={(e) => handleNavigate(e)}
                          className='h-12 w-full rounded-md bg-primary text-white px-5 hover:bg-black '
                        >
                          Book Service
                        </button>
                      </div>
                    )}
                  </>
                </div>
              )} */}

              <hr className='border-b border-gray w-full' />

              <div className='flex flex-col gap-3'>
                <h2 className='font-semibold'>Availability</h2>

                <button
                  type='button'
                  onMouseDown={() => setToggleAvailability(!toggleAvailability)}
                  className='flex justify-between items-center '
                >
                  <div className='w-full flex justify-start items-center gap-2 font-semibold text-primary'>
                    <span>{dayNames[currentDay]}: </span>
                    <span>
                      {currentDayData?.is_selected
                        ? formatHours(currentDayData?.opening_hours)
                        : 'Closed'}
                    </span>
                  </div>
                  {!toggleAvailability ? (
                    <BiChevronDown className='text-xl' />
                  ) : (
                    <BiChevronUp className='text-xl' />
                  )}
                </button>

                {toggleAvailability && (
                  <div className='flex flex-col justify-start items-start gap-2 w-full'>
                    {workspaceData?.opening_hours?.map((day) => (
                      <div
                        key={day.id}
                        className={`text-black rounded-md w-full flex justify-between items-center ${
                          currentDay === day.day
                            ? 'font-semibold'
                            : 'font-light'
                        } ${
                          !day.is_selected ? 'opacity-50 text-lightgrey' : ''
                        }`}
                      >
                        <div>{dayNames[day.day]}: </div>
                        <div>
                          {day.is_selected ? (
                            formatHours(day.opening_hours)
                          ) : (
                            <span className='flex items-center gap-2'>
                              Closed
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </section>
      </main>

      {reportModal && (
        <article className='fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-[#0808088f] '>
          <div className='flex flex-col justify-start items-start gap-8 bg-white shadow-2fl rounded-md p-5 xxl:w-[40%] xl:w-[40%] lg:w-[40%] md:w-[80%] sm:w-[90%] '>
            <header className='flex justify-between items-center w-full'>
              <h1 className='text-lg font-semibold'>Report Content </h1>
              <button
                type='button'
                onClick={() => setReportModal(false)}
                className='cursor-pointer text-lg'
              >
                <MdClose />{' '}
              </button>
            </header>
            <RadioInputWifOtherOpt
              options={reportOptions}
              onSelectionChange={handleSelectionChange}
            />

            <p className='text-lightgrey text-sm '>
              Flagged listings and users will be reviewed by our moderation team
              every day of this week. This review process is in place to assess
              whether these flagged listings breach our Standards. Accounts
              found to violate these standards may face penalties, and for
              severe or recurrent violations, there could be consequences up to
              and including account suspension.
            </p>

            {errors.length > 0 && (
              <ul className='flex flex-col justify-start items-start gap-2 w-full px-5'>
                {errors.map((error, index) => (
                  <li key={index} className='list-disc text-[red] '>
                    {error}
                  </li>
                ))}
              </ul>
            )}

            <button
              type='button'
              onClick={() => handleReportContent()}
              className='border rounded-md h-12 w-full px-5 bg-lightgrey text-white hover:bg-primary '
            >
              Submit
            </button>
          </div>
        </article>
      )}

      {qrCodeModal && (
        <QrCodeModal
          qrCodeModal={qrCodeModal}
          setQrCodeModal={setQrCodeModal}
          qrCode={workspaceData.qr_code}
        />
      )}

      {viewAll && (
        <GallaryCaraosel
          imageArray={fullPhotos}
          handleToggle={handleViewAll}
          workspaceName={workspaceData?.name}
          startFrom={startFrom}
        />
      )}
    </>
  )
}
