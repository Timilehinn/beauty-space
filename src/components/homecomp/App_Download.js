'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import booking_screen from '../../assets/homeappview.jpg'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Download() {
  const main = useRef()

  useGSAP(
    () => {
      const boxes = gsap.utils.toArray('.bookingCard')

      boxes.forEach((el, index) => {
        gsap.fromTo(
          el,
          {
            autoAlpha: 0,
            y: -100,
          },
          {
            duration: 1,
            autoAlpha: 1,
            ease: 'power2.inOut',
            y: 0,
            stagger: 0.5,
            delay: 0.5,
            scrollTrigger: {
              id: `section-${index + 1}`,
              trigger: el,
              start: 'top center+=100',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    },
    { scope: main }
  )

  return (
    <main
      ref={main}
      id='download'
      className='flex justify-center items-center gap-10 pt-[5rem] xl:flex-row lg:px-16 lg:flex-row md:flex-row md:px-10 sm:px-5 sm:flex-col '
    >
      <div
        className='bookingCard overflow-hidden rounded-xl flex gap-5 shadow-2xl 3xl:w-[55%] 3xl:h-[50rem] xxl:w-[60%] xxl:h-[35rem] xl:justify-between xl:items-center 
        xl:bg-white xl:w-[70%] xl:h-[30rem] special:w-[70%] lg:h-[30rem] lg:w-[70%] lg:bg-white lg:items-center lg:justify-between md:h-[25rem] md:items-center 
        md:w-full md:bg-transparent sm:h-[35rem] sm:w-full sm:items-start sm:bg-transparent '
      >
        <div
          className='absolute z-10 border-[10px] shadow-2fl border-black rounded-3xl 3xl:bottom-[15rem] 3xl:left-[0] xxl:bottom-[15rem] xl:bottom-[13rem] xl:left-[3rem] lg:-left-[2rem] lg:bottom-[8rem] 
         md:flex md:-left-[7rem] md:bottom-[10rem] sm:-left-[5rem] sm:bottom-[8rem] '
          style={{
            transform: 'translate(50%, 50%)',
          }}
        >
          <Image
            src={booking_screen}
            alt='mobile app screenshot'
            width={500}
            height={500}
            className='3xl:w-[40rem] 3xl:h-[55rem] xxl:h-[35rem] xxl:w-[20rem] xl:w-[20rem] xl:h-[28rem] lg:w-[18rem] lg:h-full md:w-[15rem] md:h-[25rem] sm:w-[15rem] sm:h-[20rem] rounded-xl object-cover object-top '
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
