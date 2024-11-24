'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'

import { GoArrowUpRight } from 'react-icons/go'
import { BiSolidRightArrow } from 'react-icons/bi'
import { IoPieChartSharp } from 'react-icons/io5'

import Loader from '../../Loader/Loader'
import WorkSpaceRating from '../../rating'
import useCookieHandler from '../../../hooks/useCookieHandler'
import { getMostVisited, setMostVisited } from '../../../redux/insightSlice'
import ServicesPaginationComp from '../Businesses/ServicesPaginationComp'
import { GET_MOST_VISITED_BUSINESSES } from '../../../api/businessRoutes'
import { handleResponse } from '../../../api/router'

export default function MostVisitedServicesComp() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { token } = useCookieHandler('user_token')

  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [spaceModal, setSpaceModal] = useState(null)
  const [lastPage, setLastPage] = useState(false)
  const [currentPagination, setCurrentPagination] = useState(1)
  const [selectedBookings, setSelectedBookings] = useState(null)
  const [totalVisitedPlaces, setTotalVisitedPlaces] = useState(null)
  const [categories_avaliable, set_categories_avaliable] = useState([])

  const visitedPlaces = useSelector(getMostVisited)

  const getMostVisitedPlaces = async (page = 1) => {
    if (!token) return

    setLoading(true)

    try {
      const res = await GET_MOST_VISITED_BUSINESSES(token, page)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)

      if (status) {
        dispatch(setMostVisited(data))
        setTotalVisitedPlaces(data?.total)
        setLastPage(data?.last_page)

        setLoading(false)
        setFailure(false)
      } else {
        throw new Error(error)
      }
    } catch (err) {
      setLoading(false)
      setFailure(true)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  useEffect(() => {
    if (!token) return
    getMostVisitedPlaces(currentPagination)
  }, [token, dispatch, currentPagination])

  const fetchCategories = async () => {
    try {
      const config = {
        url: `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/categories`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      }

      const response = await axios(config)

      // Check if the response status is 401
      if (response.status === 401) {
        router.push('/')
        return
      }

      const { data } = response

      if (data?.status) {
        set_categories_avaliable(data?.data)
      }
    } catch (error) {
      // Check if the error is due to a 401 status
      if (error.response && error.response.status === 401) {
        router.push('/')
        return
      }
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  let _categories = []

  if (visitedPlaces) {
    _categories = [
      { id: 6, name: 'Saloon' },
      { id: 7, name: 'Beauty Studio' },
      { id: 8, name: 'Spa' },
    ]
  } else {
    _categories = categories_avaliable
  }

  const handleButtonClick = (id, item) => {
    if (spaceModal === id) {
      setSpaceModal(null)
      setSelectedBookings(null)
    } else {
      setSpaceModal(id)
      setSelectedBookings(item)
    }
  }

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPagination(selectedPage + 1)
    setLoading(true)
    getMostVisitedPlaces(selectedPage + 1)
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setFailure(true)
      })
  }

  return (
    <>
      <Loader
        failure={failure} //if your api or state fails and page should not show
        isLoading={loading} //if your api or state is still fetching
        redirectTo={'/dashboard/expenses'}
      />
      <section className='bg-white shadow-2fl rounded-md flex flex-col justify-between items-start gap-5 w-full overflow-auto scrollbar-hide xxl:h-[75vh] xl:h-[75vh] lg:h-[75vh] md:h-[80vh] p-5'>
        <div className='flex flex-col justify-start items-start gap-5 w-full'>
          <div className='flex justify-between items-center w-full'>
            <h1 className='text-base'>Most Visited Places</h1>

            {/* <div className='flex items-center gap-3'>
              <div className='border border-gray lg:flex lg:flex-row md:flex-row sm:flex-col  rounded-md px-3 py-2 hidden justify-end items-center gap-3'>
                <input
                  type='date'
                  name='start_date'
                  id='start_date'
                  className='outline-none'
                  // value={formatToYMD(startDate)}
                  // onChange={handleStartDateChange}
                />
                <span className='hidden lg:block'>-</span>
                <input
                  type='date'
                  name='end_date'
                  id='end_date'
                  className='outline-none'
                  // value={formatToYMD(endDate)}
                  // onChange={handleEndDateChange}
                />
              </div>
              <button className='flex justify-center items-center gap-2 border border-gray rounded-md px-3 py-3'>
                <MdFilterList />
                Filter
              </button>
            </div> */}
          </div>

          {totalVisitedPlaces >= 1 ? (
            <div className='overflow-auto scrollbar-hide w-full'>
              <section className='min-w-[640px] text-left'>
                <div className='border-b border-gray flex justify-between items-center gap-5 text-left'>
                  <span className='py-2 px-2 w-[20rem] font-semibold'>
                    Business Name
                  </span>
                  <span className='py-2 px-2 w-[20rem] font-semibold'>
                    Category
                  </span>
                  <span className='py-2 px-2 w-[20rem] font-semibold'>
                    Visits
                  </span>
                  <span className='py-2 px-2 w-[20rem] font-semibold'></span>
                </div>
                <div className='w-full'>
                  {visitedPlaces?.data?.map((item) => {
                    const category = categories_avaliable.find(
                      (cat) => cat?.id === item?.category_id
                    )

                    return (
                      <React.Fragment key={item?.id}>
                        <div className='border-b border-gray last:border-b-0 flex justify-between items-center gap-5 w-auto'>
                          <div className='flex flex-col justify-start items-start gap-2 px-2 py-2 w-[20rem]'>
                            <h4>{item?.name}</h4>
                            <span className='text-lightgrey text-sm'>
                              {item?.address}
                            </span>
                          </div>
                          <p className='px-2 py-2 w-[20rem]'>
                            {category?.name}
                          </p>
                          <p className='px-2 py-2 w-[20rem]'>{item?.visits}</p>
                          <button
                            onClick={() => handleButtonClick(item?.id, item)}
                            className='flex justify-start items-center gap-2 px-2 py-2 w-[20rem]'
                          >
                            <span className='text-primary'>Details</span>
                            <BiSolidRightArrow className='text-primary' />
                          </button>
                        </div>

                        {spaceModal === item.id && (
                          <div className='flex justify-start items-start gap-5 w-full py-2 h-auto lg:flex-row md:flex-row sm:flex-col'>
                            <Image
                              src={item?.photos[0].url}
                              alt='service image'
                              width={300}
                              height={400}
                              className='object-cover object-center h-[300px] '
                            />

                            <div className='flex flex-col justify-start items-start gap-3'>
                              <div className='flex flex-col gap-2'>
                                <h4 className='uppercase text-[10px]'>
                                  ratings
                                </h4>
                                <WorkSpaceRating
                                  rating={item?.reviews}
                                  counter={false}
                                />
                              </div>

                              <Link
                                href={`/booking/${item?.slug}?sid=${item?.id}`}
                              >
                                <div className='flex items-center gap-2 text-primary underline'>
                                  View listing <GoArrowUpRight />
                                </div>
                              </Link>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>
              </section>
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center gap-2 m-auto xl:h-[550px] xxl:h-[550px] lg:h-[450px] md:h-[300px] sm:h-[250px] '>
              <IoPieChartSharp className='text-[9rem] text-lightgrey' />
              <span className='text-lightgrey'>No data available yet</span>
            </div>
          )}
        </div>

        <ServicesPaginationComp
          pageCount={lastPage}
          handlePageClick={handlePageChange}
        />
      </section>
    </>
  )
}
