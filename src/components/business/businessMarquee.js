'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Marquee from 'react-fast-marquee'
import { createClient } from 'contentful'

import {
  getIndexPageData,
  setForBusinessData,
  setIndexPageData,
} from '../../redux/indexData'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

export default function BusinessMarquee() {
  const dispatch = useDispatch()
  const index = useSelector(getIndexPageData)

  useEffect(() => {
    const fetchBusinessContent = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'forBusiness',
        })
        dispatch(setForBusinessData(res.items))
      } catch (error) {}
    }

    fetchBusinessContent()
  }, [])

  useEffect(() => {
    const getHomeContent = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'home',
        })
        dispatch(setIndexPageData(res.items))
      } catch (error) {}
    }

    getHomeContent()
  }, [])

  return (
    <Marquee>
      {index?.[0]?.fields?.services?.map((slide) => {
        return (
          <img
            src={slide?.fields?.icon.fields.file?.url}
            alt={slide?.fields.title}
            key={slide?.sys.id}
            className='xl:w-[20rem] xl:h-[30rem] lg:w-[20rem] lg:h-[30rem] md:w-[15rem] md:h-[20rem] sm:w-[15rem] sm:h-[20rem] object-cover object-center rounded-lg mx-2'
          />
        )
      })}
    </Marquee>
  )
}
