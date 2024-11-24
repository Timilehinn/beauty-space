import React from 'react'
import { PiCalendarBlankFill } from 'react-icons/pi'
import { TbLayoutGridAdd } from 'react-icons/tb'

export const StaffMenu = [
  {
    id: 1,
    title: 'Bookings',
    path: '/dashboard',
    icon: <TbLayoutGridAdd className='text-2xl 3xl:text-6xl' />,
  },
  {
    id: 'bookings',
    title: 'Bookings',
    path: '/dashboard/bookings',
    icon: <PiCalendarBlankFill className='text-2xl 3xl:text-4xl ' />,
  },
]
