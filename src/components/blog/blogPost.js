import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Link from 'next/link'
import Image from 'next/image'

import { getBlogContent } from '../../redux/indexData'

export default function BlogPost() {
  const { t } = useTranslation()
  const blogContent = useSelector(getBlogContent)

  const [displayedBlogsCount, setDisplayedBlogsCount] = useState(3)

  const handleLoadMore = () => {
    setDisplayedBlogsCount(displayedBlogsCount + 3)
  }

  return (
    <main className='flex flex-col justify-start items-start gap-8 w-full'>
      <section className='flex gap-10 lg:flex-row md:flex-col sm:flex-col'>
        <aside className='bg-white shadow-2fl p-5 flex flex-col justify-start items-start gap-5 h-auto xl:w-[25%] lg:w-[25%] md:w-full sm:w-full rounded-xl'>
          <h1 className='text-lg font-semibold 3xl:text-2xl'>
            {t('Top posts')}
          </h1>
          <ol
            style={{ listStyleType: 'decimal' }}
            className='flex flex-col justify-start items-start gap-5'
          >
            {blogContent?.slice(0, 4).map((article) => {
              const slug = article?.fields?.slug
              return (
                <Link key={article.sys.id} href={`/blog/${slug}`}>
                  <li
                    key={article.sys.id}
                    className='flex flex-col gap-1 text-base list-disc 3xl:text-2xl'
                  >
                    {article?.fields.title}
                    <span className='text-lightgrey text-sm'>
                      {moment(article?.sys?.updatedAt).format('MMMM D, YYYY')}
                    </span>
                  </li>
                </Link>
              )
            })}
          </ol>
        </aside>

        <section className='flex flex-col justify-start items-start gap-5 xl:w-[75%] lg:py-0 lg:px-10 lg:w-[75%] '>
          <h1 className='text-2xl 3xl:text-2xl'>{t('Recent Post')}</h1>

          <article className='grid gap-10 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1   '>
            {blogContent?.slice(0, 3).map((article) => {
              const slug = article?.fields?.slug
              return (
                <Link
                  key={article.sys.id}
                  href={`/blog/${slug}`}
                  className='hover:text-black flex flex-col justify-start items-start gap-2 h-full'
                >
                  <Image
                    src={
                      article?.fields?.blogheader?.fields?.file.url ||
                      'https://cdn.pixabay.com/photo/2019/09/17/18/48/computer-4484282_1280.jpg'
                    }
                    alt='blog image'
                    width={100}
                    height={100}
                    className='w-full lg:h-[230px] md:h-[230px] sm:h-[200px] rounded-md '
                  />
                  <span className='text-lightgrey text-sm'>
                    {moment(article?.sys?.updatedAt).format('MMMM D, YYYY')}{' '}
                  </span>
                  <h1 className='text-lg font-semibold 3xl:text-3xl'>
                    {article?.fields?.title}{' '}
                  </h1>
                  <p className='text-base 3xl:text-2xl'>
                    {
                      article?.fields?.description?.content?.[0]?.content?.[0]
                        ?.value
                    }
                  </p>
                </Link>
              )
            })}
          </article>
        </section>
      </section>

      <hr className='border-lightgrey w-full' />

      <section className='flex flex-col justify-start items-start gap-5 3xl:gap-8 '>
        <h4 className='text-2xl 3xl:text-5xl'>{t('All posts')}</h4>

        <article className='grid gap-10 xxl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1   '>
          {blogContent?.slice(0, displayedBlogsCount).map((article) => {
            const slug = article?.fields?.slug
            return (
              <Link
                key={article.sys.id}
                href={`/blog/${slug}`}
                className='hover:text-black flex flex-col justify-start items-start gap-2 h-full'
              >
                <Image
                  src={
                    article?.fields?.blogheader?.fields?.file.url ||
                    'https://cdn.pixabay.com/photo/2019/09/17/18/48/computer-4484282_1280.jpg'
                  }
                  alt={article?.fields?.blogheader?.fields?.description}
                  width={100}
                  height={100}
                  className='w-full lg:h-[230px] md:h-[230px] sm:h-[200px] rounded-md '
                />
                <span className='text-lightgrey text-sm'>
                  {moment(article?.sys?.updatedAt).format('MMMM D, YYYY')}{' '}
                </span>
                <h1 className='text-lg font-semibold 3xl:text-3xl'>
                  {article?.fields?.title}{' '}
                </h1>
                <p className='text-base 3xl:text-2xl'>
                  {
                    article?.fields?.description?.content?.[0]?.content?.[0]
                      ?.value
                  }
                </p>
              </Link>
            )
          })}
        </article>

        {displayedBlogsCount < blogContent.length && (
          <button
            className='border border-lightgrey rounded-lg h-14 w-[130px] mx-auto px-4 3xl:text-2xl 3xl:h-16 '
            onClick={handleLoadMore}
          >
            Load More
          </button>
        )}
      </section>
    </main>
  )
}
