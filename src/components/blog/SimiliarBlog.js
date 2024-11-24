'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'
import moment from 'moment'
import { useSelector } from 'react-redux'
import Link from 'next/link'

import { getBlogContent } from '../../redux/indexData'

export default function SimiliarBlogPost() {
  const { t } = useTranslation()
  const blogContent = useSelector(getBlogContent)

  return (
    <main className='flex flex-col justify-start items-start gap-5 py-16 3xl:w-[65%] 3xl:px-10 3xl:gap-10 3xl:mx-auto xl:px-[10rem] lg:px-16 md:px-10 sm:px-5 '>
      <h4 className='font-semibold text-xl 3xl:text-4xl'>
        {t('Similar Posts to Read')}
      </h4>
      <article className='grid gap-5 xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1'>
        {blogContent.map((blog) => {
          return (
            <Link
              key={blog.sys.id}
              href={`/blog/${blog.fields.slug}`}
              className='hover:text-black no-underline flex flex-col lg:gap-2'
            >
              <span className='text-lightgrey text-sm'>
                {moment(blog.sys?.updatedAt).format('MMMM D, YYYY')}{' '}
              </span>
              <h1 className='3xl:text-4xl lg:text-2xl md:text-lg sm:text-base font-semibold '>
                {blog.fields?.title}{' '}
              </h1>
            </Link>
          )
        })}
      </article>
    </main>
  )
}
