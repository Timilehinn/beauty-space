import clsx from 'clsx'
import moment from 'moment'
import { twMerge } from 'tailwind-merge'
import Cookies from 'universal-cookie'
import { v4 as uuidv4 } from 'uuid'

export const generateId = () => {
  return uuidv4()
}

export const getAppToken = () => {
  const cookies = new Cookies()
  const token = cookies.get('user_token')
  return token
}

export function isBookingExpired(targetDate) {
  const specificDate = moment(targetDate).add(2, 'hours')
  const currentDate = moment().add(1, 'hours')
  const diffInHours = currentDate.diff(specificDate, 'hours')
  if (diffInHours > 0) {
    return true
  }
  return false
}

export function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export function calculateTotalPriceAndMinHours(services, packages) {
  let totalPrice = 0
  let totalMinHours = 0

  for (let i = 0; i < services.length; i++) {
    if (services[i]?.type === 'home-service') {
      totalPrice += services[i].home_service_price
    } else {
      totalPrice += services[i].price
    }
    totalMinHours += services[i].min_hour
  }

  if (packages && packages.length > 0) {
    for (let i = 0; i < packages.length; i++) {
      const pkg = packages[i]
      totalPrice += pkg.packagePrice
      if (pkg.services && pkg.services.length > 0) {
        for (let j = 0; j < pkg.services.length; j++) {
          totalMinHours += pkg.services[j].min_hour
        }
      }
    }
  }

  return { totalPrice, totalMinHours }
}

export function compareTimeRangesForSort(range1, range2) {
  // Extract the start times from the ranges
  const time1 = range1.split(' - ')[0]
  const time2 = range2.split(' - ')[0]

  // Convert times to 24-hour format for comparison
  const convertTo24Hour = (time) => {
    const [hours, minutes] = time.split(' ')[0].split(':')
    return (
      ((hours % 12) + (time.includes('PM') ? 12 : 0))
        .toString()
        .padStart(2, '0') +
      ':' +
      minutes
    )
  }

  const convertedTime1 = convertTo24Hour(time1)
  const convertedTime2 = convertTo24Hour(time2)

  // Compare the times
  if (convertedTime1 < convertedTime2) return -1
  if (convertedTime1 > convertedTime2) return 1
  return 0
}

export function getAvailability(data) {
  const arr = []
  var len = data.length
  var index = 0
  while (index < len) {
    arr.push({
      day: data[index].day,
      isSelected: data[index].is_selected,
      opening_hours: data[index].opening_hours
        ? data[index].opening_hours
        : ['08:00', '18:00'],
      opening_hour: data[index].opening_hours
        ? data[index].opening_hours
        : ['08:00', '18:00'],
    })
    index++
  }
  return arr
}

export const getRandomColor = () => {
  // const letters = '0123456789ABCDEF';
  // let color = '#';
  // for (let i = 0; i < 6; i++) {
  //   color += letters[Math.floor(Math.random() * 16)];
  // }
  // return color
  // Array of sharp colors in HEX format
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#1A535C',
    '#FFD166',
    '#EF476F',
    '#06D6A0',
  ]
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

// Utility function to merge classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
