import React from 'react'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser'
import Image from 'next/image'
import clsx from 'clsx'

import { BiCheckCircle } from 'react-icons/bi'

import { FormatAmount } from '../../../utils/formatAmount'
import { getServiceData } from '../../../redux/createWorkspaceSlice'
import WorkSpaceRating from '../../rating'

const dayNames = [
  'Sundays',
  'Mondays',
  'Tuesdays',
  'Wednesdays',
  'Thursdays',
  'Fridays',
  'Saturdays',
]

export default function ServicePreview({ errorMsg, action }) {
  const data = useSelector(getServiceData)

  const currentDay = new Date().getDay()

  const formatHours = (hoursArray) => {
    if (hoursArray.length === 0) return ['Unavailable']

    // Assuming hoursArray contains pairs of start and end times.
    const formattedHours = []
    for (let i = 0; i < hoursArray.length; i += 2) {
      const start = hoursArray[i]
      const end = hoursArray[i + 1]
      formattedHours.push(`${start} - ${end}`)
    }

    return formattedHours
  }

  const truncateDescription = (description) => {
    if (!description) return ''
    return description.length > 250
      ? description.slice(0, 250) + '...'
      : description
  }

  const preprocessServices = (services) => {
    return services.map((service) => {
      const updatedGroups = (service.groups || service.services).map(
        (group) => ({
          ...group,
          name: service.name,
          price: service.price,
          min_hour: service.min_hour,
          home_service_price: service.home_service_price,
          photos: service.photos,
          type: service.type,
        })
      )

      return {
        ...service,
        groups: updatedGroups,
      }
    })
  }

  const preprocessedServices = preprocessServices(data?.services)

  return (
    <main className='flex flex-col justify-start items-start gap-5 w-full'>
      <div className='flex flex-col gap-3 w-full'>
        <h2 className='text-2xl font-semibold'>{data?.name}</h2>
        <span className='text-sm'>{data?.address}</span>
      </div>

      <div className=' overflow-x-auto scrollbar-hide bg-transparent flex gap-5 xl:h-[500px] md:h-[300px] sm:h-[200px]'>
        {data?.photos?.slice(0, 3).map((item, index) => (
          <Image
            src={item.url}
            key={index}
            width={300}
            height={300}
            alt='Business image'
            className='xl:h-full xl:w-[300px] lg:w-[300px] md:h-[300px] md:w-[200px] sm:w-[200px] sm:h-[200px] object-cover object-center rounded-md rounded-l-xl'
          />
        ))}
      </div>

      {errorMsg.length >= 1 && (
        <ul className='list-disc'>
          {errorMsg.map((err, index) => {
            return (
              <li key={index} className='text-danger text-sm'>
                - {err}
              </li>
            )
          })}
        </ul>
      )}

      <section className='w-full flex justify-start items-start gap-5 lg:flex-row md:flex-row sm:flex-col'>
        <div className='w-full flex flex-col justify-start items-start gap-5 lg:w-[70%]'>
          <div className='flex flex-col justify-start items-start gap-2 w-full '>
            <h2 className='text-lg font-medium'>Available Services</h2>
            <div
              className={clsx(
                'w-full flex flex-col justify-start items-start overflow-auto scrollbar-hide border border-gray rounded-md p-2 '
              )}
            >
              {preprocessedServices.map((groupItem) => {
                return (
                  <div
                    key={groupItem.id}
                    className='flex flex-col justify-start items-start gap-3 w-full py-3 border-b border-gray last:border-none  '
                  >
                    {(groupItem.services || groupItem.groups).map((serv) => {
                      return (
                        <div
                          key={serv.id}
                          className='flex flex-col gap-1 w-full '
                        >
                          <h4 className=''>{serv.name}</h4>
                          <p className=''>
                            ₦{FormatAmount(serv.price)}/{serv.min_hour}hr
                            {serv.min_hour > 1 ? 's' : ''}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>

          {action !== 'edit' && (
            <div className='flex flex-col justify-start items-start gap-2 w-full'>
              <h2 className='text-lg font-medium'>Amenities</h2>
              <div className='border border-gray rounded-md p-3 w-full'>
                {data?.amenities?.map((amenty, index) => {
                  return (
                    <div
                      key={index}
                      className='flex justify-between items-center w-full border-b border-gray last:border-none py-3 lg:flex-row lg:justify-between 
                  lg:items-center md:justify-start md:items-start md:gap-5 md:flex-col sm:flex-col sm:justify-start sm:items-start sm:gap-4'
                    >
                      <h3 className=''>{amenty.name}</h3>

                      <div className='flex items-center gap-3'>
                        {amenty?.items?.map((groupItem, index) => {
                          return (
                            <div
                              key={index}
                              className='flex items-center gap-2'
                            >
                              <BiCheckCircle className='text-primary' />
                              <p className=''>{groupItem.name}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className='border border-gray rounded-md p-5 flex flex-col gap-3 w-full lg:w-[30%]'>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-xl'>{data?.name}</h1>
              <p className='text-sm font-light'>
                {' '}
                {parse(truncateDescription(data?.description))}
              </p>
            </div>

            {action === 'edit' && (
              <WorkSpaceRating rating={data?.reviews} counter={false} />
            )}

            <hr className='border-gray w-full' />

            <h2 className='font-semibold'>Availability</h2>

            <div className='flex flex-col justify-start items-start gap-2 w-full'>
              {(Array.isArray(data?.open_hours)
                ? data.open_hours
                : data?.opening_hours
              )?.map((day, index) => (
                <div
                  key={index}
                  className={`text-black rounded-md w-full flex justify-between items-center text-sm ${
                    currentDay === day.day ? 'font-semibold' : 'font-light'
                  } ${
                    !(day.isSelected || day.is_selected)
                      ? 'opacity-50 text-lightgrey'
                      : ''
                  }`}
                >
                  <p>{dayNames[day.day]}: </p>

                  <div className='flex flex-col'>
                    {day.isSelected || day.is_selected ? (
                      formatHours(day.opening_hours).map((hours, i) => {
                        return (
                          <span key={i} className='flex flex-col'>
                            {hours}
                          </span>
                        )
                      })
                    ) : (
                      <span className='flex items-center gap-2'>Closed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
