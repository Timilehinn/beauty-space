import React from 'react'

import { BsChatDotsFill } from 'react-icons/bs'
import { MdCalendarToday, MdOutlineBarChart } from 'react-icons/md'
import { PiMagnifyingGlassMinusFill } from 'react-icons/pi'

export const UserSidebar = [
  {
    id: 1,
    title: 'Bookings',
    path: '/dashboard',
    icon: <MdCalendarToday className='text-2xl 3xl:text-6xl' />,
  },
  {
    id: 2,
    title: 'Explore',
    path: '/dashboard/explore',
    icon: <PiMagnifyingGlassMinusFill className='text-2xl 3xl:text-6xl' />,
  },
  {
    id: 3,
    title: 'Expenses',
    path: '/dashboard/expenses',
    icon: <MdOutlineBarChart className='text-2xl 3xl:text-6xl' />,
  },
  {
    id: 4,
    title: 'Inbox',
    path: '/dashboard/inbox',
    icon: <BsChatDotsFill className='text-2xl 3xl:text-6xl' />,
  },
]
