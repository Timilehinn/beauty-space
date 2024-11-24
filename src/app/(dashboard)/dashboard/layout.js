'use client'

import DashboardHeader from '../../../components/DashboardComp/Header'
import SidebarLayout from '../../../components/DashboardComp/SidebarLayout'

export default function Layout({ children }) {
  return (
    <main className='3xl:w-[50%] 3xl:mx-auto w-full bg-[#F7F9FE] min-h-screen flex justify-start items-start'>
      <SidebarLayout />
      <section className='w-full 3xl:w-[90%] special:w-[93%] xxl:w-[95%] xl:w-[93%] lg:w-[93%] ml-auto flex flex-col'>
        <DashboardHeader />
        {children}
      </section>
    </main>
  )
}
