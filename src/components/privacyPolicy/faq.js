'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import FaqComp from './faqComp'
import { getFaqContent } from '../../redux/indexData'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function FrequentlyAskedQuestions() {
  const heroContainer = useRef()
  const faqContent = useSelector(getFaqContent)

  /* The above code is using the `useEffect` hook in React to run some animations when the component
mounts. It is using the GSAP library to animate elements with class names `.heroForm` and
`.heroSlide`. */
  useGSAP(
    () => {
      gsap.fromTo(
        '.heroCont',
        {
          x: -100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.inOut',
          delay: 2,
          duration: 1.5,
        }
      )

      const boxes = gsap.utils.toArray('.faqContent')

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
    { scope: heroContainer }
  )

  return (
    <main
      ref={heroContainer}
      className='flex flex-col justify-center items-center gap-10 3xl:w-[65%] 3xl:mx-auto 3xl:px-10 3xl:py-[15rem] 3xl:h-screen 3xl:gap-20 '
    >
      <section className='flex flex-col justify-center items-center gap-4 mt-[5rem] mx-auto text-center xl:w-[50%] lg:w-[50%] md:w-[70%] sm:w-[90%]  '>
        <h1 className='heroCont 3xl:text-[6rem] xl:text-7xl lg:text-5xl md:text-5xl sm:text-4xl font-semibold'>
          Frequently asked questions{' '}
        </h1>
        <p className='heroCont text-lightblack text-base text-center mx-auto w-[30%] 3xl:text-2xl md:w-[70%] sm:w-full '>
          Have questions about your bookings? We have answers! Here are some
          common responses that may be helpful.
        </p>
      </section>

      <FaqComp bgColor='bg-lightprimary' />

      <div className='flex flex-col justify-center items-center gap-4 mx-auto text-center py-14 3xl:gap-10 xl:w-[40%] lg:w-[40%] md:w-[60%] sm:w-[90%] sm:py-10'>
        <h1 className='faqContent 3xl:text-7xl xl:text-5xl lg:text-4xl md:text-4xl sm:text-3xl font-semibold'>
          {faqContent?.[0]?.fields?.bottomTitle}
        </h1>
        <p className='faqContent text-base text-lightblack 3xl:text-2xl'>
          {faqContent?.[0]?.fields?.bottomParagraph}
        </p>

        <Link
          href='mailto:support@tryspacely.com'
          target='_blank'
          className='faqContent rounded-xl h-12 px-8 bg-lightprimary flex justify-center items-center 3xl:h-16 3xl:text-3xl '
        >
          support@tryspacely.com
        </Link>
      </div>
    </main>
  )
}
