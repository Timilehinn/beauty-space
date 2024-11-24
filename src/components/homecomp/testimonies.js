'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useSelector } from 'react-redux'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Carousel from '../ImageGallery/carousel'
import { getIndexPageData } from '../../redux/indexData'
import Image from 'next/image'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const Testys = () => {
  const main = useRef()
  const index = useSelector(getIndexPageData)

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
            ease: 'back.inOut',
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
      className='bookingCard max-w-full xxl:w-[65%] xxl:px-10 mx-auto xl:px-[10rem] lg:px-16 md:px-10 sm:px-5 '
    >
      <Carousel
        autoSlide={true}
        autoSlideInterval={10000}
        extraWrapper={
          '3xl:h-[500px] xxl:h-[380px] xl:h-[350px] lg:h-[380px] md:h-[350px] sm:h-[400px] bookingCard'
        }
      >
        {index?.[0]?.fields?.testimony?.map((testy) => {
          return (
            <section
              key={testy?.sys?.id}
              className='bookingCard flex flex-col justify-center items-center gap-5 w-[80%] mx-auto 3xl:gap-7 md:w-[80%] sm:w-full  '
            >
              <Image
                className='rounded-full object-cover object-top mx-auto w-[90px] h-[90px] 3xl:w-[200px] 3xl:h-[200px] xl:w-[120px] xl:h-[120px] lg:w-[120px] lg:h-[120px]'
                src={testy?.fields?.userImage?.fields?.file?.url}
                alt={testy?.fields?.userImage?.fields?.title}
                width={100}
                height={90}
              />
              <p className='text-center w-full mx-auto 3xl:text-4xl xxl:w-[85%] special:text-base xl:text-base xl:w-[70%] lg:text-base md:text-lg sm:text-base'>
                {testy?.fields?.comment}
              </p>
              <div className='flex justify-center items-center gap-2 flex-wrap text-center w-full 3xl:text-3xl'>
                <h1 className='font-semibold text-black'>
                  {testy?.fields?.name}
                  {','}
                </h1>
                <span className='font-light text-lightgrey'>
                  {testy?.fields?.jobTitle}
                </span>
              </div>
            </section>
          )
        })}
      </Carousel>
    </main>
  )
}

export default Testys
