"use client";

import React from 'react'
// import UserBookingsComp from '../../../../../components/DashboardComp/UserBookings/UserBookingsComp'
import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../../../components/DashboardComp/UserBookings/UserBookingsComp'), { ssr: false, })
// export const metadata = {
//   title: 'BeautySpace NG | Bookings',
//   description: 'We connect customers to beauty professionals accross Nigeria',
// }

export default function Bookings() {
  return <Dynamic />
}
