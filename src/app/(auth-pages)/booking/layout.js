import React from 'react'
// import HomepageHeaderComp from '../../../components/homecomp/header'
import dynamic from 'next/dynamic'
const Dynamic = dynamic(() => import('../../../components/homecomp/header'), { ssr: false, })

export default function BookingsLayout({ children }) {
  return (
    <main>
      <Dynamic />
      <div>{children}</div>
    </main>
  )
}
