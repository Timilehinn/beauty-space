import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { BsEyeFill, BsStarFill } from 'react-icons/bs'
import { BiEdit } from 'react-icons/bi'
import { MdDelete } from 'react-icons/md'
import { HiDotsHorizontal, HiDotsVertical } from 'react-icons/hi'

import tw from 'tailwind-styled-components'

import Rating from './rating'
import { useApproveSpace } from '../../../hooks'
import { truncate, scrollToTop, extractCityCountry } from '../../../lib/factory'

import { RemoteIcon } from '../../../assets/shared/RemoteIcon'

import {
  setServiceGroups,
  setSpaceModal,
  setUstructuredServices,
  setWorkspaceDetails,
} from '../../../redux/workspaceSlice'
import { groupServicesByGroup } from '../../../utils/formatter'

export default function ServiceComp({ layout, data, setDelete }) {
  const ref = useRef()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { status, approveSpace } = useApproveSpace()

  const [contextMenu, setContextMenu] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const accountType = useSelector((state) => state.adminPeople.accountType)

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (contextMenu && ref.current && !ref.current.contains(e.target)) {
        setContextMenu(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [contextMenu])

  return (
    <>
      {layout ? (
        <main className='flex justify-between items-center gap-5 relative shadow-2fl p-2 rounded-lg '>
          <div className='xl:w-[25%] lg:w-[25%] md:w-[25%] sm:w-[50%] flex justify-start items-center gap-3'>
            <Image
              key={data.photos[0]?.id}
              src={
                data.photos !== null
                  ? data.photos[0]?.url
                  : 'https://cdn.pixabay.com/photo/2018/03/19/18/20/tea-time-3240766_960_720.jpg'
              }
              alt='img'
              width={500}
              height={500}
              className='rounded-lg object-cover object-center h-[4rem] xl:w-[6rem] lg:w-[5rem] md:w-[4rem] sm:w-[4rem] '
            />
            <div>
              <h1 className='text-xs font-medium text-left capitalize'>
                {truncate(data.name, 30)}
              </h1>
              <p className='text-[10px] py-1 text-left'>
                {' '}
                {truncate(data.address, 30)}
              </p>
            </div>
          </div>

          <p className='xl:w-[10%] lg:w-[10%] md:w-[15%] sm:w-[30%] text-xs'>
            {format(new Date(data.created_at), 'dd MMM, yyyy')}
          </p>
          <p className='xl:w-[7%] lg:w-[7%] md:w-[7%] sm:w-[30%] lg:flex md:hidden sm:hidden text-xs'>
            {format(new Date(data.created_at), 'h:mm a')}
          </p>

          <div className=' xl:w-[10%] lg:w-[10%] md:w-[15%] lg:flex md:flex sm:hidden '>
            {data?.status?.toLowerCase() === 'approved' ? (
              <StatusButton
                $status={data?.status?.toLowerCase()}
                className='rounded-md flex justify-center items-center gap-2 text-xs text-purple'
              >
                <RemoteIcon name={'Approved'} />
                {data.status}
              </StatusButton>
            ) : (
              <div className='flex w-full '>
                {accountType === 'Sales' && (
                  <ApproveButton
                    $status={status}
                    disabled={status === 'Approving'}
                    onClick={() => approveSpace(data.slug)}
                  >
                    {status}
                  </ApproveButton>
                )}
              </div>
            )}
          </div>

          <div className='xl:w-[10%] lg:w-[10%] md:w-[10%] lg:flex md:flex sm:hidden text-xs gap-2 items-center'>
            ₦ {truncate(data.price.toLocaleString(), 15)}
          </div>

          <div className='xl:w-[3%] lg:w-[3%] md:w-[3%] sm:w-[5%] sm:mr-3 text-xs relative'>
            <button onClick={() => setContextMenu(data.id)} className=''>
              <HiDotsHorizontal className='text-xl' />
            </button>

            {contextMenu === data.id && (
              <div
                ref={ref}
                className='absolute w-[140px] h-[100px] z-10 flex flex-col justify-center items-center mx-auto px-1 bg-white rounded-md shadow-2fl
                xl:top-5 xl:right-[3rem] lg:top-5 lg:right-[3rem] md:right-[2rem] sm:top-5 sm:right-[2rem] text-xs'
              >
                <button
                  onClick={() => {
                    dispatch(setSpaceModal(data.id))
                    dispatch(setWorkspaceDetails(data))
                    dispatch(setUstructuredServices(data.services))
                    const newGroup = groupServicesByGroup(data.services)
                    dispatch(setServiceGroups(newGroup))
                    setContextMenu(false)
                    scrollToTop()
                  }}
                  className='hover:bg-dashgrey w-full h-[40px] flex justify-start items-center gap-2 px-2 rounded-md text-xs'
                >
                  <BiEdit className='text-xl' />
                  Edit
                </button>

                {accountType === 'Sales' ? (
                  <Link
                    href={`/dashboard/space-details/${data.slug}?sid=${data?.id}`}
                    className='hover: hover:bg-dashgrey w-full h-[40px] flex justify-start items-center gap-2 px-2 rounded-md'
                    key={data.id}
                  >
                    <BsEyeFill className='text-xl' />
                    View details
                  </Link>
                ) : (
                  <button
                    onClick={() => setDeleteModal(data.id)}
                    className='hover:bg-dashgrey w-full h-[40px] flex justify-start items-center gap-2 px-2 rounded-md text-xs'
                  >
                    <MdDelete className='text-xl' />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      ) : (
        <section className='bg-white shadow-2fl rounded-xl grid grid-cols-1'>
          <div className='relative'>
            {data?.status?.toLowerCase() === 'approved' ? null : (
              <StatusButton className='absolute top-3 left-1 px-[8px] py-2 '>
                <RemoteIcon name={'Pending'} />
                Pending
              </StatusButton>
            )}
            <Image
              key={data.photos[0]?.id}
              src={
                data.photos !== 0
                  ? data.photos[0]?.url
                  : 'https://cdn.pixabay.com/photo/2018/03/19/18/20/tea-time-3240766_960_720.jpg'
              }
              alt='img'
              width={500}
              height={200}
              className='w-full lg:h-[194px] md:h-[194px] sm:h-[170px] rounded-xl object-center object-cover '
            />

            <button
              onClick={() => setContextMenu(data.id)}
              className='absolute top-3 right-3 z-10 text-white '
            >
              <HiDotsVertical className='text-xl' />
            </button>

            {contextMenu === data.id && (
              <div
                ref={ref}
                className='absolute w-[140px] h-[100px] flex flex-col justify-center items-center mx-auto px-1 bg-white 
                rounded-md shadow-2fl z-20 top-5 right-8'
              >
                <button
                  onClick={() => {
                    dispatch(setSpaceModal(data.id))
                    dispatch(setWorkspaceDetails(data))
                    dispatch(setUstructuredServices(data.services))
                    const newGroup = groupServicesByGroup(data.services)
                    dispatch(setServiceGroups(newGroup))
                    setContextMenu(false)
                    scrollToTop()
                  }}
                  className='hover:bg-dashgrey w-full h-[40px] flex justify-start items-center gap-2 px-2 rounded-md text-sm'
                >
                  <BiEdit className='text-xl' />
                  Edit
                </button>

                {accountType === 'Sales' ? (
                  <Link
                    href={`/dashboard/space-details/${data.slug}`}
                    className='hover: hover:bg-dashgrey w-full h-[40px] flex justify-start items-center gap-2 px-2 rounded-md text-sm'
                    key={data.id}
                  >
                    <BsEyeFill className='text-xl' />
                    View details
                  </Link>
                ) : (
                  <button
                    onClick={() => setDeleteModal(data.id)}
                    className='hover:bg-dashgrey w-full h-[40px] flex justify-start items-center gap-2 px-2 rounded-md text-sm'
                  >
                    <MdDelete className='text-xl' />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          <div className='flex flex-col p-2 w-full border-b border-lightgrey'>
            <div className='flex justify-between w-full '>
              <div className='flex flex-col'>
                <span className='flex flex-row items-center gap-2'>
                  <h1 className=' font-medium capitalize'>
                    {truncate(data.name, 100)}
                  </h1>

                  <span className='text-lightblack font-medium text-xs flex gap-1'>
                    <BsStarFill className='text-gold' />
                    <Rating rating={data.reviews} />{' '}
                  </span>
                </span>
                <span className='text-lightblack text-xs'>
                  {' '}
                  Workspace name{' '}
                </span>
              </div>

              {data?.status?.toLowerCase() === 'approved' ? (
                <StatusButton $status={data?.status?.toLowerCase()}>
                  <RemoteIcon name={'Approved'} />
                  {data.status}
                </StatusButton>
              ) : (
                // Only show the "Approve" button when accountType is 'Sales'
                accountType === 'Sales' && (
                  <div className='flex w-max'>
                    <ApproveButton
                      $status={status}
                      disabled={status === 'Approving'}
                      onClick={() => approveSpace(data.slug)}
                      // className="px-[4px] py-[2px]"
                    >
                      {status}
                    </ApproveButton>
                  </div>
                )
              )}
            </div>
          </div>

          <div className='flex justify-between w-full p-2 '>
            <div className='flex flex-col justify-start items-start'>
              <span className='text-xs'>
                {' '}
                {format(new Date(data.created_at), 'dd MMM, yyyy')}
              </span>
              <span className='text-lightblack text-xs'> Date </span>
            </div>

            <div className='w-[50%]  flex flex-col justify-start items-start'>
              <span className='flex flex-row items-start gap-1 text-xs text-[#5B585B'>
                <Image
                  src='/location2.png'
                  alt='location'
                  width={10}
                  height={10}
                />
                {format(new Date(data.created_at), 'h:mm a')}
              </span>
              <span className='text-lightblack text-xs'> Time </span>
            </div>
          </div>

          <div className='flex justify-between w-full p-2 '>
            <div className='flex flex-col'>
              <span className='text-xs text-[#434144]'>
                ₦{truncate(data.price.toLocaleString(), 15)}
              </span>

              <span className='text-lightblack text-xs'> Price </span>
            </div>

            <div className='w-[50%]  flex flex-col justify-start items-start'>
              <span className='flex flex-row items-start gap-1 text-xs text-[#5B585B'>
                <Image
                  src='/location2.png'
                  alt='location'
                  width={10}
                  height={10}
                />
                {extractCityCountry(data.address)}
              </span>
              <span className='text-lightblack text-xs'> Address </span>
            </div>
          </div>
        </section>
      )}

      {deleteModal === data.id && (
        <div className='fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-lightblack  z-10'>
          <div
            ref={ref}
            className='xxl:w-[30%] special:w-[50%] xl:w-[30%] lg:w-[40%] md:w-[50%] sm:w-[90%] bg-white shadow-2fl rounded-md flex flex-col justify-center gap-5 p-5  '
          >
            <div className='flex flex-col justify-start items-start gap-3'>
              <MdDelete className='text-4xl' />
              <p className='font-semibold'>{t('Delete this business?')}</p>
              <span> {t('There is no trash bin. You cannot restore it')} </span>
            </div>

            <div className='flex gap-5 ml-auto justify-end flex-end '>
              <button
                type='button'
                onClick={() => setDeleteModal(false)}
                className='px-5 h-12 bg-transparent border border-lightgrey rounded-md'
              >
                Cancel
              </button>

              <button
                type='button'
                onClick={() => setDelete(data.id)}
                className='bg-danger px-5 h-12 text-white rounded-md '
              >
                {' '}
                Delete{' '}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// STYLED COMPONENTS
const ApproveButton = tw.button`
px-2 py-2 text-xs bg-primary text-black rounded-md w-full flex justify-center items-center
${({ $status }) => ($status === 'Approving' ? 'opacity-75' : 'opacity-100')}
${({ $status }) => $status === 'Approving' && 'read-only:bg-dashgrey'}
${({ $status }) => $status === 'Approved' && 'read-only:bg-dashgrey'}
`

const StatusButton = tw.div`
rounded-md flex justify-center items-center gap-2 text-xs px-3 py-2 w-auto
${({ $status }) => ($status === 'approved' ? 'bg-dashgrey' : 'bg-dashgrey')}
${({ $status }) => ($status === 'approved' ? 'text-black' : 'text-black')}
`
