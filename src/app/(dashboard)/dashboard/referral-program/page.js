"use client";

import React from 'react'
// import ReferralProgramComp from '../../../../components/DashboardComp/referralProgram'
import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../../components/DashboardComp/referralProgram'), { ssr: false, })
// export const metadata = {
//   title: 'BeautySpace NG | Referral Program',
//   description: 'We connect customers to beauty professionals accross Nigeria',
// }

export default function Dashboard() {
  return <Dynamic />
}
