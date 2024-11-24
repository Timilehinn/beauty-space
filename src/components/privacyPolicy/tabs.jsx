'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedTabs, setSelectedTabs } from '../../redux/indexData'

const helpcenterTabs = ['User Guidelines', 'Cancelation', 'Legal', 'Assistance']

export default function Tabs() {
  const dispatch = useDispatch()
  const selectedTab = useSelector(getSelectedTabs)

  return (
    <section className='flex flex-col justify-start items-start gap-3 lg:w-[20%] md:w-[20%] sm:w-full cursor-pointer '>
      <span className=''>Getting Started</span>
      <div className='pl-3 flex flex-col justify-start items-start gap-3  '>
        {helpcenterTabs.map((tab) => (
          <span
            key={tab}
            className={
              selectedTab === tab
                ? 'active text-blue-500 font-semibold relative px-2 after:absolute after:border-l-4 after:h-[20px] after:w-full after:border-blue-500 after:left-0 after:top-0'
                : 'text-black'
            }
            onClick={() => dispatch(setSelectedTabs(tab))}
          >
            {tab}
          </span>
        ))}
      </div>
    </section>
  )
}
