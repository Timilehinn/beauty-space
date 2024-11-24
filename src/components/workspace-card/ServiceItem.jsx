'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'

import { BiHeart } from 'react-icons/bi'
import { BsHeartFill } from 'react-icons/bs'

import WorkSpaceRating from '../rating'

import { FormatAmount } from '../../utils/formatAmount'

const ServiceItem = ({ service }) => {
  const [isFavourite, setIsFavourite] = useState(false)

  /* The line `const userDetails = useSelector((state) => state.adminPeople.users.data)` is using the
`useSelector` hook from the `react-redux` library to select and retrieve data from the Redux store. */
  const userDetails = useSelector((state) => state.adminPeople.users.data)

  /**
   * The function checks if a workspace is favorited by a user.
   * @returns a boolean value. If the workspace is favorited, it will return true. If the workspace is
   * not favorited, it will return false.
   */
  const isWorkspaceFavourited = () => {
    const findLovedWorkspace = userDetails?.workspace_favourites?.find(
      (space) => space?.id == service.id
    )
    if (!findLovedWorkspace) {
      setIsFavourite(false)
      return
    }
    setIsFavourite(true)
    return true
  }
  /* The `useEffect` hook is used to perform side effects in a React component. In this case, the
`useEffect` hook is used to check if a workspace is favorited by a user. */
  useEffect(() => {
    userDetails?.workspace_favourites?.length && isWorkspaceFavourited()
  }, [userDetails])

  return (
    <Link
      href={`/booking/${service?.slug}?sid=${service?.id}`}
      state={service}
      key={service?.id}
    >
      <main
        className={clsx({
          ['relative hover:bg-[#f2e7e76b] p-5 sm:p-[10px] transition-[.3s] group-hover:cursor-pointer']: true,
        })}
      >
        <div
          className={clsx({
            ['relative w-full mb-[10px]']: true,
          })}
        >
          <Image
            src={
              service?.photos?.length > 0
                ? service?.photos[0]?.url
                : 'https://cdn.pixabay.com/photo/2018/03/19/18/20/tea-time-3240766_960_720.jpg'
            }
            alt={service?.name}
            width={500}
            height={250}
            className={clsx({
              ['w-full h-[250px] object-cover object-center rounded-t-lg shadow-2fl']: true,
            })}
          />

          {service?.is_featured && (
            <span className='absolute text-white bg-danger w-1/3 sm:w-[120px] md:w-[88px] h-6 text-center services-center rounded-r-xl top-2 left-0'>
              Featured
            </span>
          )}
        </div>

        <div
          className={clsx({
            ['flex flex-row w-full gap-5 ']: true,
          })}
        >
          <div
            className={clsx({
              ['flex w-[100%] ']: true,
            })}
          >
            <div className='w-full flex flex-col justify-start items-start gap-2'>
              <div className='flex justify-between services-start w-full'>
                <p className='text-lg w-full capitalize font-bold'>
                  {service?.name}
                </p>
                <span className='text-xl pointer-events-none mt-[3px]'>
                  {isFavourite ? (
                    <BsHeartFill className='text-danger' />
                  ) : (
                    <BiHeart />
                  )}
                </span>
              </div>

              <WorkSpaceRating rating={service?.reviews} />

              <p className='text-xs text-[grey] font-light w-full'>
                {service?.address}
              </p>
            </div>
          </div>
        </div>

        <div className='w-full h-[1px] bg-[#F0F0F0] my-[15px]' />

        {service.services.slice(0, 3).map((s, i) => (
          <div key={i} className='mb-[20px]'>
            <div className='flex flex-row justify-between items-start'>
              <p className='text-[15px] text-[#5B585B] font-semibold capitalize'>
                {s.name}
              </p>
              <p>
                {s.min_hour} hour{s.min_hour > 1 ? 's' : ''}
              </p>
            </div>
            <div className='flex flex-row justify-between items-start'>
              <p className='capitalize'>Walk-in:</p>
              <p className='font-medium text-[#5B585B]'>
                ₦{FormatAmount(s.price)}
              </p>
            </div>
            {s.home_service_price > 0 && (
              <div className='flex mt-[5px] flex-row justify-between items-start'>
                <p className='capitalize'>Home service:</p>
                <p className='font-medium text-[#5B585B]'>
                  ₦{FormatAmount(s.home_service_price)}
                </p>
              </div>
            )}
          </div>
        ))}
      </main>
    </Link>
  )
}

export default ServiceItem
