'use client'

import React from 'react'
import Image from 'next/image'
import Marquee from 'react-fast-marquee'
import { useSelector } from 'react-redux'

import { getIndexPageData } from '../../redux/indexData'

export default function BeautySpaceServicesOffer() {
  const index = useSelector(getIndexPageData)

  return (
    <section className='flex flex-col justify-start items-start gap-10 py-14'>
      <div className='flex flex-col justify-start items-start gap-1 w-[40%] 3xl:w-[65%] 3xl:mx-auto 3xl:px-10 3xl:px-10 xl:px-[10rem] lg:px-16 md:px-10 md:w-full sm:px-5 sm:w-full '>
        <h1 className='3xl:text-6xl xl:text-4xl lg:text-4xl md:text-3xl sm:text-2xl font-semibold'>
          Diverse beauty servces{' '}
        </h1>
        <p className='text-lightgrey text-lg 3xl:text-2xl'>
          Create a free account for your business type
        </p>
      </div>
      <Marquee>
        {index?.[0]?.fields.services.map((slide) => {
          return (
            <div className='flex flex-col justify-center items-center gap-5 mx-3 3xl:gap-10 3xl:mx-5'>
              <Image
                src={slide?.fields?.icon.fields.file?.url}
                alt={slide?.fields.title}
                key={slide?.sys.id}
                height={50}
                width={200}
                className='h-24 rounded-full object-cover object-center 3xl:h-[10rem] 3xl:w-[350px]'
              />
              <p className='capitalize 3xl:text-2xl'>{slide?.fields.title}</p>
            </div>
          )
        })}
      </Marquee>
    </section>
  )
}
