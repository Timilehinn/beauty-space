'use client'

import { createClient } from 'contentful'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { BiCheck } from 'react-icons/bi'
import { getPricingContent, setPricingContent } from '../../redux/indexData'
import { useDispatch, useSelector } from 'react-redux'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Loader from '../Loader/Loader'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

export default function Pricing() {
  const dispatch = useDispatch()
  const pricingContent = useSelector(getPricingContent)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'pricing',
        })
        dispatch(setPricingContent(res?.items[0]?.fields))
      } catch (error) {}
    }

    fetchPricing()
  }, [])

  if (!pricingContent) return <Loader />

  return (
    <main>
      <section className=' bg-lightpurple w-full pt-[50px] lg:pt-[120px] pb-[50px] 3xl:h-[45rem] '>
        <div className='flex flex-col justify-center items-center gap-4 m-auto h-full text-center 3xl:gap-8 xl:w-[30%] lg:w-[40%] md:w-[50%] sm:w-[90%] '>
          <h1 className='3xl:text-8xl xl:text-5xl lg:text-5xl md:text-4xl sm:text-3xl capitalize font-semibold'>
            {pricingContent?.title}
          </h1>
          <p className='3xl:text-3xl'>{pricingContent?.description}</p>
        </div>
      </section>

      <div
        className='grid gap-10 content-center place-items-start py-16 mx-auto 3xl:w-[65%] 3xl:px-10 xl:w-[60%] lg:w-[80%] 
      lg:grid-cols-2 lg:divide-y-0 md:grid-cols-1 md:divide-y md:w-[80%] sm:divide-y sm:grid-cols-1 sm:w-[80%] '
      >
        {pricingContent?.pricingType?.map((item, i) => {
          return (
            <div
              key={i}
              className={`flex flex-col justify-start items-start gap-8 xl:px-5 lg:px-5 md:py-5 sm:py-5 h-full w-full border-[#F2F2F2] ${i === 0? 'border-l-0' : 'border-l-2' }`}
            >
              <h4 className='3xl:text-3xl xl:text-xl lg:text-xl md:text-4xl sm:text-2xl special:text-3xl capitalize font-semibold'>
                {item?.fields?.title}
              </h4>
              <p className='text-base 3xl:text-2xl special:text-base lg:text-base md:text-xl sm:text-base'>
                {item?.fields?.subTitle}
              </p>

              <div className='flex flex-col justify-start items-start gap-2'>
                <h1 className='3xl:text-6xl xl:text-4xl lg:text-4xl md:text-5xl sm:text-4xl special:text-5xl font-semibold'>
                  {' '}
                  {item?.fields?.accountTypeTitle}{' '}
                </h1>
                <span className='text-lightblack 3xl:text-2xl'>
                  {item?.fields?.heroTitle}
                </span>
              </div>

              <Link
                href='/signup'
                className='bg-black h-14 px-5 rounded-full text-white hover:text-white flex justify-center items-center 3xl:text-2xl 3xl:w-[200px] 3xl:h-16 xl:w-40 lg:w-40 md:w-60 sm:w-full'
              >
                Get Started
              </Link>

              <div className='flex flex-col justify-start items-start gap-4'>
                <h4 className='text-lg special:text-2xl font-semibold capitalize 3xl:text-3xl'>
                  Highlight
                </h4>
                <div className='px-5 3xl:text-3xl'>
                  {documentToReactComponents(item?.fields?.description)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
