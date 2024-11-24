'use client';

import React from 'react'
// import ReviewsComp from '../../../../../components/DashboardComp/revenue/ReviewsComp'
import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../../../components/DashboardComp/revenue/ReviewsComp'), { ssr: false, })
// export const metadata = {
//   title: 'BeautySpace NG | Reviews',
//   description: 'We connect customers to beauty professionals accross Nigeria',
// }

export default function Reviews() {
  return <Dynamic />
}
