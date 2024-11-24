import React from 'react'
import { FaHome, FaUsers } from 'react-icons/fa'
import {
  MdBarChart,
  MdBusiness,
  MdCalendarToday,
  MdChat,
  MdSettings,
  MdPointOfSale,
} from 'react-icons/md'
import { PiCalendarBlankFill } from 'react-icons/pi'
import { TbLayoutGridAdd } from 'react-icons/tb'

export const OwnerSidebar = [
  {
    id: 'businesses',
    title: 'Businesses',
    path: '/dashboard',
    icon: <TbLayoutGridAdd className='text-2xl 3xl:text-4xl ' />,
  },
  {
    id: 'bookings',
    title: 'Bookings',
    path: '/dashboard/bookings',
    icon: <PiCalendarBlankFill className='text-2xl 3xl:text-4xl ' />,
  },
  {
    id: 'revenue',
    title: 'Insight',
    path: '/dashboard/revenue',
    icon: <MdBarChart className='text-2xl 3xl:text-4xl ' />,
  },
  {
    id: 'inbox',
    title: 'Inbox',
    path: '/dashboard/inbox',
    icon: <MdChat className='text-2xl 3xl:text-4xl ' />,
  },
  {
    id: 'portal',
    title: 'POS Portal',
    path: '/dashboard/portal',
    icon: <MdPointOfSale className='text-2xl 3xl:text-4xl ' />,
  },
]
