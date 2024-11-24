'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createClient } from 'contentful'

import { getLoginContent, setLoginContent } from '../../redux/indexData'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

export const AuthContentComponent = () => {
  const dispatch = useDispatch()
  const authContent = useSelector(getLoginContent)

  useEffect(() => {
    const fetchLoginContent = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'loginAndSignup',
        })
        dispatch(setLoginContent(res.items))
      } catch (error) {}
    }

    fetchLoginContent()
  }, [])

  return (
    <aside className='bg-gradient-to-b from-purple to-primary w-[50%] h-screen flex-col justify-center items-center gap-3 xl:flex special:flex md:hidden sm:hidden '>
      <div className='flex flex-col justify-start items-start gap-5 m-auto text-white special:w-[90%] xxl:w-[70%] xl:w-[70%] lg:w-[70%] '>
        <h1 className='xxl:text-5xl xl:text-4xl special:text-5xl lg:text-3xl font-semibold text-white w-[80%] '>
          {authContent[0]?.fields?.item?.fields?.subTitle}
        </h1>
        <p className='text-lg w-[50%] special:w-[70%] xl:w-[50%] lg:w-[70%]'>
          {
            authContent[0]?.fields?.item?.fields?.description?.content[0]
              ?.content[0]?.value
          }
        </p>
      </div>
    </aside>
  )
}
