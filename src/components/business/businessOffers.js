'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector } from 'react-redux'

import { getForBusinessData } from '../../redux/indexData'

// images
import booking_calendar from '../../assets/booking_calendar.png'
import mobile_screen from '../../assets/mobile_screen.png'

export default function BusinessOffers() {
  const businessDetails = useSelector(getForBusinessData)

  return (
    <section className='flex flex-col justify-start items-start gap-10 3xl:mx-auto 3xl:w-[65%] 3xl:px-10 3xl:gap-16 xl:px-[10rem] xl:py-10 lg:py-10 lg:px-16 md:px-10 md:py-14 sm:py-14 sm:px-5'>
      <h1 className='3xl:text-6xl xl:text-3xl lg:text-3xl md:text-2xl sm:text-2xl font-semibold'>
        {businessDetails?.[0]?.fields?.header}
      </h1>
      <section className='grid gap-10 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 '>
        {businessDetails?.[0]?.fields?.benefits?.map((benefit) => {
          const MAX_PREVIEW_LENGTH = 200 // Maximum number of characters to show in the preview
          let previewText =
            benefit?.fields?.description?.content[0]?.content[0]?.value || '' // Extract the body content

          // Truncate the text if it exceeds the maximum preview length
          if (previewText.length > MAX_PREVIEW_LENGTH) {
            previewText = previewText.substring(0, MAX_PREVIEW_LENGTH) + '...'
          }

          return (
            <Link
              key={benefit.sys.id}
              href={`/business/${benefit.fields.slug}`}
            >
              <div
                key={benefit.sys.id}
                className='flex flex-col justify-start items-start text-left gap-5'
              >
                <Image
                  src={benefit?.fields?.icon?.fields?.file?.url}
                  alt='icon'
                  width={30}
                  height={30}
                  className='3xl:w-[4rem]'
                />
                <h3 className='text-base font-semibold capitalize 3xl:text-4xl'>
                  {benefit.fields.header}
                </h3>

                <p className='3xl:text-3xl'>{previewText}</p>
              </div>
            </Link>
          )
        })}
      </section>

      <div className='relative overflow-hidden border border-lightgrey rounded-xl shadow-2fl mx-auto p-5 3xl:h-[55rem] xxl:h-[45rem] special:h-[45rem] xl:h-[45rem] lg:h-[40rem] '>
        <Image
          src={booking_calendar}
          alt='booking calendar view'
          width={500}
          height={500}
          className='w-full'
        />
        <Image
          src={mobile_screen}
          alt='booking mobile view'
          width={500}
          height={500}
          className='absolute -bottom-[10rem] right-[5rem] border border-lightgrey rounded-2xl shadow-2fl 3xl:w-[450px] 3xl:-bottom-[16rem] xl:w-auto lg:w-auto md:w-[250px] 
              md:right-[5rem] md:-bottom-[9rem] sm:w-[150px] sm:-bottom-[9rem] sm:right-[1rem]
               '
        />
      </div>
    </section>
  )
}
