"use client";

import dynamic from 'next/dynamic'

const Dynamic = dynamic(() => import('../../../components/bookings/bookingsComp'), { ssr: false, })
// import BookingsComponent from '../../../components/bookings/bookingsComp'

// export const metadata = {
//   title:
//     'BeautySpace NG | Connecting Customers to Beauty Professionals Across Nigeria',
//   description:
//     'BeautySpace NG connects customers with top beauty professionals across Nigeria. Discover and book services like spas, salons, makeup artists, and massage therapists near you.',
//   keywords: [
//     'BeautySpace NG',
//     'beauty services Nigeria',
//     'connect with beauty professionals',
//     'find beauty services',
//     'book spa appointments',
//     'book salon services',
//     'book makeup artists',
//     'book massage therapists',
//     'beauty professionals Nigeria',
//     'local beauty services',
//     'Nigeria beauty industry',
//     'beauty and wellness',
//     'spa services Nigeria',
//     'salon services Nigeria',
//     'makeup services Nigeria',
//     'massage services Nigeria',
//   ],
// }

export default function Page() {
  return <Dynamic />
}
