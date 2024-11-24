"use client";

import React from 'react'
// import ExploreComp from '../../../../components/DashboardComp/Explore/ExploreComp'
import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../../components/DashboardComp/Explore/ExploreComp'), { ssr: false, })
// export const metadata = {
//   title: 'BeautySpace NG | Explore Bookings',
//   description: 'We connect customers to beauty professionals accross Nigeria',
// }

export default function Bookings() {
  return <Dynamic />
}
