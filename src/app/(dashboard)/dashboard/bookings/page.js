'use client'

import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'

const Dynamic = dynamic(
  () => import('../../../../components/DashboardComp/Bookings'),
  { ssr: false }
)

export default function Bookings() {
  return (
    <>
      <Head>
        <title>BeautySpace NG | Reviews</title>
        <meta
          name='description'
          content='We connect customers to beauty professionals across Nigeria'
        />
      </Head>
      <Dynamic />
    </>
  )
}
