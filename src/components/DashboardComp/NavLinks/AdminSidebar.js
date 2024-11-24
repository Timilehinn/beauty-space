import React from 'react'

import { BiUser } from 'react-icons/bi'
import { MdChat, MdSettings } from 'react-icons/md'

export const AdminSidebar = [
  {
    id: 'allUser',
    title: 'All Users',
    path: '/dashboard',
    icon: <BiUser className='text-2xl 3xl:text-4xl' />,
  },
  {
    id: 'spaces',
    title: 'Businesses',
    path: '/dashboard/admin/businesses',
    icon: <MdChat className='text-2xl 3xl:text-4xl' />,
  },
  {
    id: 'settings',
    title: 'Settings',
    path: '/dashboard/settings',
    icon: <MdSettings className='text-2xl 3xl:text-4xl' />,
  },
]
