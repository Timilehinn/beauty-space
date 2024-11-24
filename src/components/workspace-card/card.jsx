'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { RiHeartFill, RiHeartLine } from 'react-icons/ri'

import WorkSpaceRating from '../rating'

function Card({
  isListView,
  isGridView,
  currentPagelist,
  extraStyle,
  useExploreRoute = false,
}) {
  const [isFavourity, setIsFavourity] = useState(false)

  /* The line `const userDetails = useSelector((state) => state.adminPeople.users.data)` is using the
`useSelector` hook from the `react-redux` library to select and retrieve data from the Redux store. */
  const userDetails = useSelector((state) => state.adminPeople.users.data)

  /**
   * The function checks if a workspace is favorited by a user.
   * @returns a boolean value. If the workspace is favorited, it will return true. If the workspace is
   * not favorited, it will return false.
   */

  const isWorkspaceFavourited = () => {
    if (!userDetails || !currentPagelist) return

    const isFavourite = currentPagelist.some((item) => {
      return userDetails?.workspace_favourites?.some(
        (space) => space?.id === item?.id && item?.pivot?.favourite
      )
    })

    setIsFavourity(isFavourite)
  }

  useEffect(() => {
    isWorkspaceFavourited()
  }, [userDetails, currentPagelist])

  return (
    <>
      {currentPagelist?.map((item) => {
        return (
          <Link
            href={`/${useExploreRoute ? 'dashboard/explore' : 'booking'}/${
              item?.slug
            }?sid=${item?.id}`}
            key={item?.id}
          >
            <main
              className={clsx({
                ['relative rounded-lg border border-[#e6e6e8] hover:border-purple group-hover:cursor-pointer ']: true,
                ['h-full ']: isListView,
                ['h-full']: isGridView,
                [extraStyle]: true,
              })}
            >
              <div
                className={clsx({
                  ['flex w-full gap-3 ']: true,
                  ['xl:flex-row lg:flex-row md:flex-row sm:flex-col']:
                    isListView,
                  ['flex-col']: isGridView,
                })}
              >
                <div
                  className={clsx({
                    ['relative']: true,
                    ['xxl:w-[30%] xl:w-[30%] lg:w-[25%] md:w-[40%] sm:w-full ']:
                      isListView,
                    ['w-full']: isGridView,
                  })}
                >
                  <Image
                    src={
                      item?.photos[0]?.url ||
                      'https://cdn.pixabay.com/photo/2018/03/19/18/20/tea-time-3240766_960_720.jpg'
                    }
                    alt='image'
                    width={500}
                    height={250}
                    className={clsx({
                      ['h-[250px] object-cover object-top rounded-t-lg']: true,
                      ['w-full ']: isListView,
                      ['w-full']: isGridView,
                    })}
                  />
                  <div className='flex justify-between items-center w-full absolute top-4 px-4'>
                    {item?.category && (
                      <span className='3xl:text-2xl capitalize text-purple bg-white w-auto text-base px-5 h-10 rounded-md flex justify-center items-center'>
                        {item?.category.name}
                      </span>
                    )}

                    {isFavourity ? (
                      <RiHeartFill className='text-purple text-2xl' />
                    ) : (
                      <RiHeartLine className='text-white text-2xl' />
                    )}
                  </div>
                </div>
                <div
                  className={clsx({
                    ['flex gap-2 p-2 ']: true,
                    ['xxl:w-[70%] xl:w-[70%] lg:w-[80%] md:w-[60%] sm:w-full ']:
                      isListView,
                    ['w-full ']: isGridView,
                  })}
                >
                  <div className='flex justify-between items-start text-[#5B585B] w-full'>
                    <div className='w-[50%] '>
                      <p className='text-lg w-full font-bold 3xl:text-3xl'>
                        {item?.name}
                      </p>
                      <p className='text-xs font-normal  w-full 3xl:text-xl'>
                        {item?.address}
                      </p>
                    </div>
                    <WorkSpaceRating rating={item?.reviews} counter={false} />
                  </div>
                </div>
              </div>
            </main>
          </Link>
        )
      })}
    </>
  )
}

export default Card
