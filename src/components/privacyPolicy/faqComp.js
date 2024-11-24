'use client'

import React, { useEffect, useRef } from 'react'
import { createClient } from 'contentful'
import { useDispatch, useSelector } from 'react-redux'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import clsx from 'clsx'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import {
  getActiveQuestion,
  getFaqContent,
  setActiveQuestion,
  setFaqContent,
} from '../../redux/indexData'
import gsap from 'gsap'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function FaqComp({ bgColor }) {
  const mainRef = useRef()
  const dispatch = useDispatch()
  const activeQuestion = useSelector(getActiveQuestion)
  const faqContent = useSelector(getFaqContent)

  const handleQuestionClick = (index) => {
    if (activeQuestion === index) {
      dispatch(setActiveQuestion(null))
    } else {
      dispatch(setActiveQuestion(index))
    }
  }

  useEffect(() => {
    const getFaq = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'faq',
        })
        dispatch(setFaqContent(res.items))
      } catch (error) {}
    }

    getFaq()
  }, [])

  /* The above code is using the `useEffect` hook in React to run some animations when the component
mounts. It is using the GSAP library to animate elements with class names `.heroForm` and
`.heroSlide`. */
  useGSAP(
    () => {
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
    { scope: mainRef }
  )

  return (
    <main
      ref={mainRef}
      className={clsx(
        'faqContent xl:w-[70%] xl:py-10 lg:w-[80%] md:w-[80%] sm:w-[90%] sm:p-5 rounded-2xl flex flex-col justify-start items-start gap-5 p-10  ',
        bgColor ? bgColor : 'bg-transparent'
      )}
    >
      {faqContent?.[0]?.fields?.faqs?.map((questions, index) => (
        <div
          key={questions?.sys?.id}
          className={`faq-item w-full relative cursor-pointer after:border-lightgrey after:absolute after:border-b after:last:border-none after:-bottom-3 after:left-0 after:w-full after:h-10 after:z-10 ${
            activeQuestion === index ? 'active' : ''
          }`}
          onClick={() => handleQuestionClick(index)}
        >
          <div className='flex justify-between items-center gap-5 py-3 '>
            <h3 className='text-lg md:text-lg sm:text-sm font-semibold 3xl:text-2xl'>
              {questions?.fields?.title}
            </h3>
            <span className='text-3xl font-normal text-[#262425] cursor-pointer 3xl:text-5xl'>
              {activeQuestion === index ? '-' : '+'}
            </span>
          </div>

          {activeQuestion === index && (
            <div className='flex flex-col justify-start items-start gap-5 px-5 py-3 3xl:text-3xl'>
              {documentToReactComponents(questions?.fields?.description)}
            </div>
          )}
        </div>
      ))}
    </main>
  )
}
