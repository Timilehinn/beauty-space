'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'next-i18next'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { FaMagnifyingGlass, FaThumbsUp } from 'react-icons/fa6'
import { BiCalendarCheck } from 'react-icons/bi'

import Card from '../workspace-card/card'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const howitworks = [
  {
    id: 1,
    icon: <FaMagnifyingGlass />,
    title: 'discover space',
    description:
      'Discover top-rated beauty services tailered to your preferences and location, ensuring you find the perfect match for your needs.',
  },
  {
    id: 2,
    icon: <BiCalendarCheck />,
    title: 'book appointment',
    description:
      'Effortlessly schedule appointments at your convenience with integrated payment options for a seamless booking experience.',
  },
  {
    id: 3,
    icon: <FaThumbsUp />,
    title: 'satisfaction guaranteed',
    description:
      'From booking to review, our platform ensures a smooth journey. Meet your beauty needs, and share your experience.',
  },
]

export default function Bookings() {
  const main = useRef()
  const { t } = useTranslation()

  const [bookings, setBookings] = useState([])

  const getBookingsWithHighReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces?high-reviews`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
        }
      )

      const data = await res.json()
      if (data?.status === true) {
        setBookings(data?.data)
      }
    } catch (error) {}
  }

  useEffect(() => {
    getBookingsWithHighReviews()
  }, [])

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
      className='flex flex-col justify-center items-center gap-8 3xl:w-[65%] xxl:px-[10rem] mx-auto w-full xxl:mt-0 xl:py-10 xl:px-[10rem] xl:mt-[10rem] lg:px-16 lg:py-10 md:py-10 md:px-10 md:mt-[5rem] sm:px-5 sm:py-5 sm:mt-[3rem] '
    >
      <div className='bookingCard flex flex-col justify-start items-start self-start gap-3'>
        <h1 className='3xl:text-6xl xl:text-4xl lg:text-3xl md:text-3xl sm:text-2xl font-semibold '>
          Recommended places
        </h1>
        <p className='text-lightgrey font-medium text-base 3xl:text-3xl'>
          Access top-rated businesses close to you{' '}
        </p>
      </div>

      <div className='bookingCard snap-x mx-auto snap-mandatory h-auto w-full flex gap-10 overflow-scroll scrollbar-hide'>
        <Card
          isListView={false}
          isGridView={true}
          currentPagelist={bookings?.data?.slice(0, 6)}
          extraStyle={
            ' snap-start 3xl:w-[450px] xl:w-[350px] lg:w-[350px] md:w-[350px] sm:w-[350px] flex-shrink-0 flex items-start justify-start'
          }
        />
      </div>

      <div
        id='howitworks'
        className='bookingCard flex flex-col justify-start items-start gap-10 py-10 mr-auto 3xl:w-full xxl:w-[70%] lg:w-full md:w-full sm:w-full'
      >
        <h3 className=' text-3xl font-semibold 3xl:text-6xl'>
          {t('How It Works')}
        </h3>
        <div className=' grid gap-10 xl:w lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
          {howitworks.map((item) => {
            return (
              <div
                key={item.id}
                className='flex flex-col justify-start items-start gap-3 3xl:gap-5'
              >
                <span className='text-2xl 3xl:text-7xl '>{item.icon}</span>
                <h4 className='text-xl font-semibold capitalize 3xl:text-4xl'>
                  {item.title}
                </h4>
                <p className='3xl:text-3xl text-base'>{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
