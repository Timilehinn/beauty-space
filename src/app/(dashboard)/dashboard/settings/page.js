"use client";

// import SettingsComp from '../../../../components/DashboardComp/Settings/SettingsComp'
import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../../components/DashboardComp/Settings/SettingsComp'), { ssr: false, })
//  const metadata = {
//   title: 'BeautySpace NG | Settings',
//   description: 'We connect customers to beauty professionals accross Nigeria',
// }

export default function Page() {
  return <Dynamic />
}
