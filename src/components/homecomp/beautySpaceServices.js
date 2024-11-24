'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function BeautyServices({ bgColor, btnColor }) {
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
      className={clsx(
        'flex flex-col justify-center items-center gap-5 w-full px-5 xl:h-[20rem] lg:h-[20rem] md:h-[15rem] sm:h-[15rem] ',
        bgColor ? bgColor : 'bg-lightpurple'
      )}
    >
      <h1 className='bookingCard text-xl font-medium text-center text-black 3xl:text-3xl xl:w-[50%] lg:w-[50%] md:w-[70%] sm:w-full '>
        Manage your beauty studio, salon, and spa with BeautySpace today.
      </h1>

      <Link
        href='/signup'
        className={clsx(
          'bookingCard rounded-full text-lg text-white px-5 h-12 flex justify-center items-center hover:text-white 3xl:h-14  ',
          btnColor ? btnColor : 'bg-purple'
        )}
      >
        Join now
      </Link>
    </main>
  )
}
