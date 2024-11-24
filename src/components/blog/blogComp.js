'use client'

import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createClient } from 'contentful'
import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'

import BlogPost from './blogPost'
import { getBlogContent, setBlogContent } from '../../redux/indexData'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

export default function BlogComponent() {
  const dispatch = useDispatch()
  const blogContent = useSelector(getBlogContent)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'blogPost',
        })
        dispatch(setBlogContent(res.items))
      } catch (error) {}
    }

    fetchBlogs()
  }, [])

  const imageUrl =
    blogContent[0]?.fields?.blogheader?.fields?.file.url ||
    'https://cdn.pixabay.com/photo/2019/09/17/18/48/computer-4484282_1280.jpg'

  const profilePic =
    blogContent[0]?.fields?.author?.fields?.profilePicture?.fields?.file?.url ||
    'https://cdn.pixabay.com/photo/2019/09/17/18/48/computer-4484282_1280.jpg'

  return (
    <main className='mt-[5rem] flex flex-col justify-start items-start gap-10 3xl:w-[65%] 3xl:mx-auto 3xl:py-[10rem] 3xl:gap-26 3xl:px-10 xl:px-[10rem] lg:px-16 md:px-10 sm:px-5 '>
      <section className='flex lg:flex-row lg:justify-start lg:items-start md:flex-row md:justify-start md:items-start sm:flex-col sm:justify-center sm:items-center gap-5'>
        <Image
          src={imageUrl}
          alt='header cover'
          width={500}
          height={500}
          className='xl:w-[500px] lg:w-[500px] h-auto md:w-[400px] sm:w-full rounded-md object-cover object-center '
        />
        <Link href={`/blog/${blogContent[0]?.fields.slug}`}>
          <section className='flex flex-col lg:gap-4 md:gap-4 sm:gap-3'>
            <span className='text-lightgrey text-base 3xl:text-xl'>
              {moment(blogContent[0]?.sys?.updatedAt).format('MMMM D, YYYY')}
            </span>
            <h1 className='3xl:text-7xl lg:text-4xl lg:w-[80%] md:w-full md:text-3xl sm:w-full sm:text-2xl font-semibold '>
              {blogContent[0]?.fields.title}
            </h1>
            <div className='flex flex-col gap-2 font-semibold 3xl:text-xl'>
              <span> Author:</span>
              <span className='flex flex-row justify-start items-center gap-2 font-medium'>
                <Image
                  src={profilePic}
                  alt='profile picture'
                  width={30}
                  height={30}
                  className='rounded-full  '
                />
                {blogContent[0]?.fields?.author?.fields?.firstName ||
                  'No author'}
              </span>
            </div>
          </section>
        </Link>
      </section>
      <hr className='border-lightgrey w-full' />

      <BlogPost />
    </main>
  )
}
