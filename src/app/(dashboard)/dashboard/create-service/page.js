"use client";

import React from 'react'
// import CreateServiceComp from '../../../../components/Create_Services/CreateServiceComp'
import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../../components/Create_Services/CreateServiceComp'), { ssr: false, })
// export const metadata = {
//   title: 'BeautySpace NG | Create Service',
//   description:
//     'Manage your BeautySpace NG account and bookings conveniently from your personalized dashboard. Connect with top beauty professionals across Nigeria and explore a wide range of beauty services.',
// }

export default function Dashboard() {
  return <Dynamic />
}
