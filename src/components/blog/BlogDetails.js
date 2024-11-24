'use client'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createClient } from 'contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import moment from 'moment'

import {
  getBlogDetailsContent,
  setBlogDetailsContent,
} from '../../redux/indexData'
import Image from 'next/image'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

export default function BlogDetailsComponent({ slug }) {
  const dispatch = useDispatch()
  const blogDetails = useSelector(getBlogDetailsContent)
  const options = {
    preserveWhitespace: true,
  };

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'blogPost',
          'fields.slug': slug,
        })
        dispatch(setBlogDetailsContent(res?.items[0]?.fields))
      } catch (error) {}
    }

    fetchBlogDetails()
  }, [])

  if (!blogDetails) return <div>Loading...</div>

  return (
    <main className='3xl:w-[65%] 3xl:px-10 3xl:mx-auto xl:px-[10rem] lg:px-16 md:px-10 sm:px-5 mt-[3rem] '>
      <section className='flex flex-col justify-start items-start gap-5'>
        <span className='text-lightgrey text-base'>
          {moment(blogDetails[0]?.sys?.createdAt).format('MMMM D, YYYY')}
        </span>

        <h1 className='3xl:text-7xl lg:text-4xl md:text-3xl sm:text-2xl font-semibold '>
          {blogDetails?.title}{' '}
        </h1>
        <p className='flex flex-col justify-start items-start gap-2 font-semibold'>
          <span className=''> Author:</span>
          <span className='hover:text-black flex flex-row justify-start items-center gap-2 font-normal'>
            <Image
              src={
                blogDetails?.author?.fields?.profilePicture?.fields?.file
                  ?.url ||
                'https://cdn.pixabay.com/photo/2019/09/17/18/48/computer-4484282_1280.jpg'
              }
              alt='profile picture'
              width={30}
              height={30}
              className='rounded-full'
            />
            {blogDetails?.author?.fields?.firstName || 'No author'}{' '}
          </span>
        </p>
        <Image
          src={
            blogDetails?.blogheader?.fields?.file.url ||
            'https://cdn.pixabay.com/photo/2019/09/17/18/48/computer-4484282_1280.jpg'
          }
          alt='blog cover'
          width={500}
          height={500}
          className='w-full lg:h-[600px] md:h-[500px] sm:h-auto object-cover object-center rounded-md  '
        />
        <article className='flex flex-col justify-start items-start gap-5 mx-auto 3xl:text-3xl 3xl:gap-10 xxl:w-[70%] xl:w-[70%] lg:w-[80%] md:w-[90%] sm:w-full '>
          {documentToReactComponents(blogDetails?.description, options)}
        </article>
      </section>
    </main>
  )
}
