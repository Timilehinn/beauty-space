'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { BsGridFill } from 'react-icons/bs'
import { FaListAlt } from 'react-icons/fa'
import { PaginatedPeopleResponse } from '../../../global/types'
import Image from 'next/image'
import Link from 'next/link'
import { BiUser } from 'react-icons/bi'
import { HiOutlineDotsVertical, HiUser } from 'react-icons/hi'
import { GET_PEOPLE } from '../../../api/peopleRoutes'
import { handleResponse } from '../../../api/router'
import { cn, getAppToken } from '../../../utils'
import Loader from '../../Loader/Loader'
import ServicesPaginationComp from '../Businesses/ServicesPaginationComp'

export default function PeopleComp() {
  const token = getAppToken()

  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)

  const [peopleList, setPeopleList] = useState<PaginatedPeopleResponse | null>(
    null
  )
  const [currentPagination, setCurrentPagination] = useState(0)
  const [lastPage, setLastPage] = useState(0)

  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState('none')

  const [contextMenu, setContextMenu] = useState<number | null>(null) // or boolean, depending on your needs
  const [layout, setLayout] = useState('grid')

  const getPeople = async (page = 1) => {
    setLoading(true)
    try {
      const res = await GET_PEOPLE(token, page)

      const { data, status, error } =
        handleResponse<PaginatedPeopleResponse>(res)

      if (status) {
        setPeopleList(data)
        setLastPage(data.last_page)
        setLoading(false)
        setFailure(false)
      } else {
        throw new Error('An error occurred, kindly try again')
      }
    } catch (error) {
      setFailure(true)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPagination(selectedPage + 1)
    setLoading(true)
    getPeople(selectedPage + 1)
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setFailure(true)
      })
  }

  useEffect(() => {
    getPeople(currentPagination)
  }, [token, currentPagination])

  useEffect(() => {
    const checkIfClickedOutside = (e: MouseEvent) => {
      // Check if clicked target is actually a Node
      const target = e.target as Node

      if (contextMenu && ref.current && !ref.current.contains(target)) {
        setContextMenu(null) // or false, depending on your state type
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [contextMenu])

  return (
    <>
      {' '}
      <Loader failure={failure} isLoading={loading} />
      <main className='flex flex-col justify-start items-start gap-3 w-full h-screen 3xl:p-10 xl:p-10 md:p-10 sm:p-5'>
        <h1 className='text-xl'>{peopleList?.total} Peoples</h1>

        <section className='bg-white p-5 w-full h-full rounded-md flex flex-col justify-start items-start gap-5 overflow-auto scrollbar-hide'>
          <header className='flex justify-between items-center w-full flex-col lg:flex-row'>
            <input
              id='search'
              type='text'
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search Workspace'
              maxLength={44}
              className='border border-gray outline-none rounded-md h-12 w-full px-4 lg:w-[50%] '
            />

            <div className='flex justify-start items-center gap-3 '>
              <button
                type='button'
                onClick={() => setLayout('list')}
                className={cn(
                  'text-2xl',
                  layout === 'list'
                    ? 'text-primary border border-primary p-1 rounded-md'
                    : 'text-lightgrey hover:text-primary'
                )}
              >
                <FaListAlt />
              </button>

              <button
                type='button'
                onClick={() => setLayout('grid')}
                className={cn(
                  'text-2xl',
                  layout === 'grid'
                    ? 'text-primary border border-primary p-1 rounded-md'
                    : 'text-lightgrey hover:text-primary'
                )}
              >
                <BsGridFill />
              </button>
            </div>
          </header>

          {layout === 'list' ? (
            <div className='w-full overflow-x-auto'>
              <table className='w-full min-w-full'>
                <thead className=''>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[25%]'>
                      {t('Basic Info')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%] lg:table-cell md:hidden sm:hidden'>
                      {t('Phone Number')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%] lg:table-cell md:table-cell sm:hidden'>
                      {t('Email Address')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%] lg:table-cell md:hidden sm:hidden'>
                      {t('Location')}
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[5%]'>
                      {/* Actions column */}
                    </th>
                  </tr>
                </thead>
                <tbody className=''>
                  {peopleList?.data
                    .filter((person) =>
                      person.first_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((person) => (
                      <tr key={person.id} className='odd:bg-gray border-none'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center gap-3'>
                            <Image
                              src={
                                person.profile_url !== null
                                  ? person.profile_url
                                  : person.gender === 'Male'
                                  ? 'https://d3upyygarw3mun.cloudfront.net/men_dark.png'
                                  : 'https://d3upyygarw3mun.cloudfront.net/girl_light.png'
                              }
                              alt='profile picture'
                              width={40}
                              height={40}
                              className='w-12 h-12 rounded-full'
                            />
                            <div className='flex flex-col'>
                              <span className='font-medium'>
                                {person.first_name} {person.last_name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap lg:table-cell md:hidden sm:hidden'>
                          {person.phone_number}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap lg:table-cell md:table-cell sm:hidden'>
                          {person.email}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap lg:table-cell md:hidden sm:hidden'>
                          {person.city}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap relative'>
                          <Link
                            href={`/dashboard/people/${person.id}`}
                            className='flex  items-center gap-2 text-white h-12 px-5 w-full bg-primary rounded-md hover:ring-1 ring-gray'
                          >
                            <BiUser />
                            <span> {t('Detail')}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className='xxl:grid-cols-5 xl:grid-cols-4 xl:gap-5 lg:grid-cols-3 lg:gap-4 lg:py-5 md:grid md:grid-cols-2 md:gap-3 sm:grid sm:grid-cols-1 grid w-full'>
              {peopleList?.data
                ?.filter((person) =>
                  person.first_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((person, index) => (
                  <div
                    key={index}
                    className='bg-white rounded-lg shadow-2fl relative flex flex-col justify-center items-center gap-5 p-3 sm:my-4'
                  >
                    <button
                      onClick={() => setContextMenu(person.id)}
                      className='flex justify-end items-end ml-auto '
                    >
                      <HiOutlineDotsVertical className='text-xl' />
                    </button>

                    {contextMenu === person.id && (
                      <section
                        ref={ref}
                        className='w-[130px] h-12 p-1 absolute top-5 right-3 bg-white shadow-2fl rounded-lg flex flex-col justify-center items-center '
                      >
                        <Link
                          href={`/dashboard/people/${person.id}`}
                          className='flex justify-center items-center gap-2 w-full rounded-md hover:bg-gray h-12 px-4 '
                        >
                          <HiUser />
                          {t('Detail')}
                        </Link>
                      </section>
                    )}

                    <div className='flex flex-col justify-center items-center gap-3'>
                      <Image
                        src={
                          person.profile_url !== null
                            ? person.profile_url
                            : person.gender === 'Male'
                            ? 'https://d3upyygarw3mun.cloudfront.net/men_dark.png'
                            : 'https://d3upyygarw3mun.cloudfront.net/girl_light.png'
                        }
                        alt='profile picture'
                        width={70}
                        height={70}
                        className='w-[70px] h-[70px] rounded-full bg-cover bg-top'
                      />

                      <span className='font-semibold'>
                        {' '}
                        {person.first_name} {person.last_name}{' '}
                      </span>
                    </div>

                    <div className='grid grid-cols-1 content-start gap-3 w-full p-4 '>
                      <div className='flex flex-col text-black'>
                        <span className='text-primary text-[13px] '>
                          {' '}
                          {t('Email')}{' '}
                        </span>
                        {person.email}
                      </div>

                      <div className='flex flex-col text-black'>
                        <span className='text-primary text-[13px] '>
                          {' '}
                          {t('Phone Number')}{' '}
                        </span>
                        {person.phone_number !== null
                          ? person.phone_number
                          : 'Not filled'}
                      </div>

                      <div className='flex flex-col text-black'>
                        <span className='text-primary text-[13px] '>
                          {' '}
                          {t('City')}{' '}
                        </span>
                        {person.city !== null ? person.city : 'Not filled'}
                      </div>
                    </div>
                  </div>
                ))}
            </section>
          )}

          {peopleList?.total >= 1 && (
            <ServicesPaginationComp
              pageCount={lastPage}
              handlePageClick={handlePageChange}
            />
          )}
        </section>
      </main>
    </>
  )
}
