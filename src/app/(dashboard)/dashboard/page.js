'use client';

import React from 'react'
// import DashboardOverview from '../../../components/DashboardComp/DashboardOverview'
import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../components/DashboardComp/DashboardOverview'), { ssr: false, })
// export const metadata = {
//   title: 'BeautySpace NG | Dashboard',
//   description:
//     'Manage your BeautySpace NG account and bookings conveniently from your personalized dashboard. Connect with top beauty professionals across Nigeria and explore a wide range of beauty services.',
//   keywords: [
//     'BeautySpace NG dashboard',
//     'manage account BeautySpace',
//     'bookings dashboard BeautySpace',
//     'beauty professionals Nigeria',
//     'beauty services dashboard',
//     'personalized dashboard',
//     'BeautySpace account management',
//     'dashboard for beauty bookings',
//     'manage bookings BeautySpace',
//     'connect with beauty professionals',
//     'beauty services Nigeria',
//     'book appointments BeautySpace',
//     'dashboard convenience',
//     'BeautySpace user dashboard',
//     'Nigeria beauty industry',
//   ],
// }

export default function Dashboard() {
  return <Dynamic />
}
