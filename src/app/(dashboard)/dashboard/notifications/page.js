'use client'

// import NotificationsComp from '../../../../components/Notifications/Notifications'
import dynamic from 'next/dynamic'

const Dynamic = dynamic(
  () => import('../../../../components/Notifications/Notifications'),
  { ssr: false }
)
// export const metadata = {
//   title: 'BeautySpace NG | Notifications',
//   description: 'We connect customers to beauty professionals accross Nigeria',
// }

export default function Page() {
  return <Dynamic />
}
