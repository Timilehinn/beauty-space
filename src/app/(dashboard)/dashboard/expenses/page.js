"use client";

import React from 'react'
// import ExpensesComp from '../../../../components/DashboardComp/Expenses/ExpensesComp'
import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../../components/DashboardComp/Expenses/ExpensesComp'), { ssr: false, })
// export const metadata = {
//   title: 'BeautySpace NG | Expenses',
//   description: 'We connect customers to beauty professionals accross Nigeria',
// }

export default function Expenses() {
  return <Dynamic />
}
