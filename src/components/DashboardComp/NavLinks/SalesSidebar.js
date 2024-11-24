import React from 'react'
import { MdBusiness, MdSettings } from 'react-icons/md'

export const SalesSidebar = [
  {
    id: 'businesses',
    title: 'Businesses',
    path: '/dashboard',
    icon: <MdBusiness className='text-2xl 3xl:text-4xl' />,
  },
  {
    id: 'settings',
    title: 'Settings',
    path: '/dashboard/settings',
    icon: <MdSettings className='text-2xl 3xl:text-4xl' />,
  },
]
