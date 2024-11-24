'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { BiCalendar, BiPlus } from 'react-icons/bi'
import { CgClose } from 'react-icons/cg'
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBin7Line, RiExternalLinkLine } from 'react-icons/ri'
import { RxDotsVertical } from 'react-icons/rx'

import { useCookieHandler } from '../../../hooks'
import Loader from '../../Loader/Loader'
import ServicesPaginationComp from './ServicesPaginationComp'

import { DELETE_BUSINESS, GET_BUSINESSES } from '../../../api/businessRoutes'
import { handleResponse } from '../../../api/router'
import { usePermissions } from '../../../hooks/usePermission'
import { useUserPlanAccess } from '../../../hooks/userPlanAccesss'
import {
  getLastPage,
  getTotalSpaces,
  getWorkspaceData,
  setLastPage,
  setPerPage,
  setTotalSpaces,
  setWorkspace,
} from '../../../redux/workspaceSlice'

export default function BusinessServicesComp() {
  const router = useRouter()
  const dispatch = useDispatch()
  const contextRef = useRef(null)
  const { token } = useCookieHandler('user_token')
  // const { success, loadingfinished, errorAuth } = useLimitedRoute('Owner')

  const { hasPermission } = usePermissions()
  const { checkPermission } = useUserPlanAccess()

  const [loading, setLoading] = useState(true)
  const [failure, setFailure] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [contextMenu, setContextMenu] = useState(false)
  const [currentPagination, setCurrentPagination] = useState(0)
  const [deleteServiceModal, setDeleteServiceModal] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState(false)

  const lastPage = useSelector(getLastPage)
  const totalServices = useSelector(getTotalSpaces)
  const workspaceData = useSelector(getWorkspaceData)

  /**
   * The function `fetchBusinesses` is an asynchronous function that fetches business data, handles the
   * response, and updates the state accordingly while managing loading and error states.
   * @param [page=1] - The `page` parameter in the `fetchBusinesses` function is used to specify the page
   * number of the businesses data to fetch. By default, if no page number is provided, it will default
   * to page 1. This parameter allows you to paginate through the list of businesses, fetching a specific
   * @returns The `fetchBusinesses` function is returning a Promise.
   */
  const fetchBusinesses = async (page = 1) => {
    if (!token) return
    setLoading(true)
    try {
      const res = await GET_BUSINESSES(token, page)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)

      if (status) {
        dispatch(setWorkspace(data.data))
        dispatch(setTotalSpaces(data.total))
        dispatch(setPerPage(data.per_page))
        dispatch(setLastPage(data.last_page))

        setLoading(false)
        setFailure(false)
      } else {
        throw new Error(error)
      }
    } catch (error) {
      toast.error('Something went wrong, please try again')
    } finally {
      setFailure(false)
      setLoading(false)
    }
  }

  /**
   * The function `handleDeleteBusiness` is an asynchronous function that handles the deletion of a
   * business by making a DELETE request with a token, displaying success message if successful, and
   * handling errors.
   * @param id - The `id` parameter in the `handleDeleteBusiness` function is the unique identifier of
   * the business that you want to delete. This identifier is used to specify which business should be
   * deleted from the system.
   * @returns The `handleDeleteBusiness` function is an asynchronous function that takes an `id`
   * parameter. It first checks if a `token` is available, and if not, it returns early. It then sets the
   * `deleteStatus` state to `true`, indicating that a delete operation is in progress.
   */
  const handleDeleteBusiness = async (id) => {
    if (!token) return
    setDeleteStatus(true)
    try {
      const res = await DELETE_BUSINESS(token, id)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)

      if (status) {
        toast.success('You have successfuly delete this business')
        fetchBusinesses()
        setDeleteStatus(false)
      } else {
        toast.error(error)
      }
    } catch (error) {
      setDeleteStatus(false)
    } finally {
      setDeleteStatus(false)
    }
  }

  /**
   * The function `handlePageChange` updates the current pagination, triggers loading state, fetches
   * businesses for the selected page, and handles loading and failure states accordingly.
   */
  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPagination(selectedPage + 1)
    setLoading(true)
    fetchBusinesses(selectedPage + 1)
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setFailure(true)
      })
  }

  useEffect(() => {
    if (!token) return
    fetchBusinesses(currentPagination)
  }, [currentPagination, token, dispatch])

  /**
   * The function `handleClickOutside` checks if a click event occurs outside a specified element and
   * updates the context menu state accordingly.
   * @param event - The `event` parameter in the `handleClickOutside` function represents the mouse event
   * that triggers the function. It contains information about the event such as the target element that
   * was clicked, the type of event, and other relevant details.
   */
  const handleClickOutside = (event) => {
    if (contextRef.current && !contextRef.current.contains(event.target)) {
      setContextMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <Loader failure={failure} isLoading={loading} />
      <main className='flex flex-col justify-start items-start gap-3 w-full 3xl:p-10 xl:p-10 md:p-10 sm:p-5'>
        <h1 className='text-xl'>Businesses</h1>

        <section className='flex flex-col justify-start items-start gap-10 w-full h-[80vh] bg-white rounded-lg p-5 overflow-auto scrollbar-hide'>
          <header className='flex justify-between items-center w-full lg:flex-row lg:items-center md:flex-row md:items-center sm:flex-col sm:gap-3 sm:items-start'>
            <div className='flex w-full lg:w-[40%] md:w-[60%] sm:w-full '>
              <input
                type='text'
                name='search'
                id='search'
                placeholder='Search for a service'
                onChange={(e) => setSearchQuery(e.target.value)}
                className='!rounded-md h-12 indent-3 border border-lightgrey w-full outline-none placeholder:text-sm'
              />
            </div>

            {checkPermission('create_business', totalServices) && (
              <Link
                href='/dashboard/create-service'
                className='bg-primary ring-2 ring-gray rounded-full h-12 px-5 text-white flex justify-center items-center gap-2 hover:text-white lg:w-auto 
                  md:w-auto sm:w-full'
              >
                <BiPlus />
                Add New
              </Link>
            )}
          </header>

          {totalServices >= 1 ? (
            <div className='flex flex-col justify-start items-start w-full'>
              <div className='grid grid-cols-2 place-items-center place-content-between gap-5 w-full border-b border-gray py-2'>
                <span className='font-semibold text-sm mr-auto text-left '>
                  {' '}
                  Services{' '}
                </span>
                <span className='font-semibold text-sm  text-left  '>
                  {' '}
                  Actions{' '}
                </span>
              </div>

              {workspaceData
                ?.filter((item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => {
                  return (
                    <div
                      key={item.id}
                      className='border-b border-gray last:border-none w-full grid grid-cols-2 place-items-center place-content-between gap-5 py-2 '
                    >
                      <h4 className='text=left mr-auto'>{item.name}</h4>

                      <div className='relative '>
                        <div className='border border-gray h-12 rounded-md flex justify-center items-center gap-3 w-24 '>
                          <Link
                            href={`dashboard/explore/${item?.slug}?sid=${item?.id}`}
                            type='button'
                            className='text-xl hover:text-primary'
                          >
                            <RiExternalLinkLine />
                          </Link>
                          <div className='h-full w-[1px] bg-gray'></div>
                          <button
                            type='button'
                            disabled={
                              !hasPermission('businesses:update') &&
                              !hasPermission('businesses:delete')
                            }
                            onClick={() => setContextMenu(item.id)}
                            className='text-xl'
                          >
                            <RxDotsVertical />
                          </button>
                        </div>

                        {contextMenu === item.id && (
                          <div
                            ref={contextRef}
                            className='flex flex-col justify-start items-start gap-1 w-[150px] bg-white ring-1 ring-gray rounded-md p-2 
                        absolute top-10 left-0 z-10'
                          >
                            {hasPermission('businesses:update') && (
                              <Link
                                href={`/dashboard/create-service?action=edit&slug=${item.slug}`}
                                className='flex justify-start items-center gap-2 w-full hover:bg-dashgrey rounded-md h-full p-2'
                              >
                                <CiEdit /> Edit
                              </Link>
                            )}

                            <button
                              disabled={!hasPermission('businesses:delete')}
                              onClick={() => {
                                setDeleteServiceModal(item.id)
                              }}
                              className='flex justify-start items-center gap-2 w-full hover:bg-dashgrey rounded-md h-full p-2'
                            >
                              {' '}
                              <RiDeleteBin7Line /> Delete{' '}
                            </button>
                          </div>
                        )}
                      </div>

                      {deleteServiceModal === item.id && (
                        <div className='fixed z-20 top-0 left-0 bg-lightblack w-full h-screen flex flex-col justify-center items-center'>
                          <div className='bg-white px-5 py-10 rounded-md shadow-2fl flex flex-col justify-start items-start gap-3'>
                            <div className='w-full flex flex-col gap-2'>
                              <div className='flex justify-between items-center w-full'>
                                <h3 className='font-semibold'>
                                  Disable Service
                                </h3>

                                <button
                                  type='button'
                                  onClick={() => setDeleteServiceModal(false)}
                                  className='text-xl'
                                >
                                  <CgClose />
                                </button>
                              </div>

                              <hr className='border-gray w-full' />
                            </div>

                            <p className='font-light w-[80%]'>
                              Your client will not be able to book appointment
                              for this service.
                            </p>

                            <div className='flex justify-end items-center gap-5 ml-auto'>
                              <button
                                type='button'
                                onClick={() => setDeleteServiceModal(false)}
                                className='rounded-full px-5 h-12 border border-lightgrey '
                              >
                                Cancel
                              </button>
                              <button
                                type='button'
                                onClick={() => handleDeleteBusiness(item.id)}
                                className='rounded-full px-5 h-12 bg-danger text-white '
                              >
                                {deleteStatus ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center gap-3 m-auto text-lightgrey'>
              <BiCalendar className='text-[6rem]' />
              <p>No booking yet!</p>
            </div>
          )}

          {totalServices >= 1 && (
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
