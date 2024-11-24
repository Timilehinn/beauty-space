import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import booking_screen from '../../assets/mobile_screen.png'

export default function BusinessDownloadSection() {
  return (
    <main
      id='download'
      className='flex justify-center items-center gap-10 3xl:py-[15rem] xl:flex-row xl:p-[10rem] xl:py-10 lg:py-10 lg:px-16 lg:flex-row md:flex-row md:py-14 md:px-10 sm:px-5 sm:flex-col sm:py-14 '
    >
      <div
        className='relative overflow-hidden rounded-xl p-2 flex gap-5 shadow-2xl 3xl:w-[55%] 3xl:h-[45rem] xxl:w-[60%] xl:justify-between xl:items-center xl:bg-white xl:w-[70%] xl:h-[30rem] 
       special:w-[70%] lg:h-[25rem] lg:w-[70%] lg:bg-white lg:items-center lg:justify-between md:h-[25rem] md:items-center md:w-full md:bg-transparent 
       sm:h-[35rem] sm:w-full sm:p-5 sm:items-start sm:bg-transparent '
      >
        <div
          className='absolute z-10 border-[10px] shadow-2fl border-black rounded-3xl xl:bottom-[10rem] xl:left-[3rem] lg:-left-[2rem] lg:bottom-[8rem] 
         md:flex md:-left-[4rem] md:bottom-[10rem] sm:-left-[4rem] sm:bottom-[8rem] '
          style={{
            transform: 'translate(50%, 50%)',
          }}
        >
          <Image
            src={booking_screen}
            alt='mobile app screenshot'
            width={500}
            height={500}
            className='3xl:w-[40rem] 3xl:h-[55rem] xl:w-[15rem] xl:h-[28rem] lg:w-[13rem] lg:h-full md:w-[15rem] md:h-[25rem] sm:w-[15rem] sm:h-[20rem] rounded-md object-cover object-top '
          />
        </div>

        <div className='flex flex-col xl:justify-end xl:items-end gap-10 xl:ml-auto xl:mx-0 lg:ml-auto lg:mx-0 lg:justify-end lg:items-end md:justify-end md:items-end md:mx-0 md:ml-auto sm:items-center sm:justify-center sm:mx-auto'>
          <div className='flex flex-col xl:justify-start xl:items-start gap-3 lg:justify-start lg:items-start md:justify-center md:items-start sm:items-center sm:justify-center'>
            <h1 className='text-3xl text-black font-semibold text-left 3xl:text-6xl sm:text-center '>
              Download app on your
            </h1>
            <h1 className='text-lightgrey font-medium text-xl 3xl:text-3xl '>
              iPhone or Andriod
            </h1>
          </div>

          <div className='grid grid-cols-2 gap-4 content-start xl:place-items-start xl:mr-auto xl:mx-0 lg:mr-auto lg:mx-0 lg:place-items-start md:mx-0 md:mr-auto md:place-items-start sm:place-items-center sm:mx-auto'>
            <Link href={'https://apps.apple.com/app/id6459887028'}>
              <Image
                src='/apple-store.svg'
                alt='app store logo'
                width={150}
                height={100}
              />
            </Link>
            <Link
              href={
                'https://play.google.com/store/apps/details?id=com.tryspacely.tryspacely'
              }
            >
              <Image
                src='https://d3upyygarw3mun.cloudfront.net/google-play.svg'
                alt='app store logo'
                width={150}
                height={100}
              />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
