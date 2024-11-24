'use client'

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Joyride from 'react-joyride'
import { useSelector } from 'react-redux'
import Cookies from 'universal-cookie'

import { BiHeadphone, BiLogOut } from 'react-icons/bi'
import { HiMiniUsers } from 'react-icons/hi2'
import { MdBarChart, MdChat, MdPointOfSale, MdSettings } from 'react-icons/md'
import { PiCalendarBlankFill } from 'react-icons/pi'
import { TbLayoutGridAdd } from 'react-icons/tb'

import { BsPeople } from 'react-icons/bs'
import { usePermissions } from '../../hooks/usePermission'
import { useClient } from '../../providers/clientContext'
import { getUserInfo } from '../../redux/admin_user'

const NavLinks = [
  {
    id: 'businesses',
    title: 'Businesses',
    path: '/dashboard',
    icon: <TbLayoutGridAdd className='text-2xl 3xl:text-4xl ' />,
  },
  {
    id: 'bookings',
    title: 'Bookings',
    path: '/dashboard/bookings',
    icon: <PiCalendarBlankFill className='text-2xl 3xl:text-4xl ' />,
  },
  {
    id: 'revenue',
    title: 'Insight',
    path: '/dashboard/revenue',
    icon: <MdBarChart className='text-2xl 3xl:text-4xl ' />,
  },
  {
    id: 'people',
    title: 'People',
    path: '/dashboard/people',
    icon: <BsPeople className='text-2xl 3xl:text-4xl ' />,
  },
  {
    id: 'referral',
    title: 'Referral Program',
    path: '/dashboard/referral-program',
    icon: <HiMiniUsers className='text-2xl 3xl:text-4xl ' />,
  },
  {
    id: 'inbox',
    title: 'Inbox',
    path: '/dashboard/inbox',
    icon: <MdChat className='text-2xl 3xl:text-4xl ' />,
  },
  {
    id: 'portal',
    title: 'POS Portal',
    path: '/dashboard/portal',
    icon: <MdPointOfSale className='text-2xl 3xl:text-4xl ' />,
  },
]

export default function OwnerDashSidebar() {
  const modalRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()
  const cookies = new Cookies()
  const [canViewTour, setCanViewTour] = useState(null)
  const [toggleProfileModal, setToggleProfileModal] = useState(false)
  const { client } = useClient()
  const user = useSelector(getUserInfo)
  const { hasPermission } = usePermissions()

  const saveTourView = () => {
    localStorage.setItem('tour_view', true)
  }

  // check if user has viewed before
  useEffect(() => {
    const hasViewed = localStorage.getItem('tour_view')
    if (!hasViewed) {
      setCanViewTour(true)
      setTimeout(() => {
        saveTourView()
      }, 500)
    }
  }, [])

  const steps = [
    {
      target: '#dashboard',
      disableBeacon: true,
      content:
        'Overview dashboard shows your latest bookings, activities, insights and inbox showing so that you can track almost everything directly from your dashboard',
    },
    {
      target: '#workspaces',
      content:
        'Click here to check your all your workspace, booked, and unbooked spaces. You can also edit and delete space here.',
    },
    {
      target: '#bookings',
      content:
        'click here to view your bookings, pending bookings, approved bookings, and cancel bookings on your space.',
    },

    {
      target: '#people',
      content:
        'click here to view the people who has booked your spaces, check their details to get to know them more.',
    },
    {
      target: '#revenue',
      content:
        'Click here to view your insight, transactions, and reviews on your space.',
    },

    {
      target: '#settings',
      content:
        'Click here to make changes to your settings. You can edit your profile information, change your account type, add address, security, payment, privacy settings, notification, and support settings.',
    },
  ]

  const getInitials = (email) => {
    if (!email) return ''
    return email.charAt(0).toUpperCase()
  }

  const initial = getInitials(user?.first_name)

  const logout = async () => {
    try {
      cookies.remove('user_token', { path: '/' })
      setTimeout(() => {
        router.push('/')
      }, 500)
      if (client) {
        client.disconnect()
      }
    } catch (error) {}
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setToggleProfileModal(false)
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modalRef])

  return (
    <main
      className='bg-white h-screen xxl:w-[5%] special:w-[7%] lg:w-[7%] lg:flex lg:flex-col lg:justify-between lg:items-center lg:gap-2 hidden fixed text-lg py-10 
      cursor-pointer text-black shadow-2fl rounded-tr-3xl rounded-br-3xl'
    >
      <div className='flex flex-col justify-center items-center w-full gap-5 divide-y divide-solid divide-lightgrey'>
        <Link href='/'>
          <div className='flex justify-center items-center w-full'>
            <Image
              src='/Beautyspace.svg'
              alt='logo'
              width={80}
              height={80}
              className='3xl:w-[150px] special:w-[80px] xl:w-[80px] xxl:w-[80px] lg:w-[60px] '
            />
          </div>
        </Link>

        <div className='w-full py-8 3xl:py-24 3xl:gap-5 special:px-2 xxl:px-5 xl:px-2 lg:px-2 flex flex-col justify-center items-center gap-5 '>
          {NavLinks.map((item, index) => {
            if (item.id === 'portal' && !hasPermission('portal:view')) {
              return null
            }
            return (
              <Link
                key={item.id}
                href={item.path}
                id={index}
                className={clsx(
                  '3xl:text-4xl 3xl:gap-5 3xl:h-20 xxl:p-5 xl:p-3 special:p-3 lg:p-2 lg:h-12 w-auto flex justify-center items-center gap-2 h-14 hover:bg-[#f7f7f9] hover:text-primary rounded-xl ',
                  pathname === item.path
                    ? 'bg-dashgrey text-primary '
                    : 'text-lightgrey'
                )}
              >
                <span>{item.icon}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className='relative'>
        <button
          type='button'
          onClick={() => setToggleProfileModal(!toggleProfileModal)}
        >
          {user?.profile_url ? (
            <Image
              src={user?.profile_url}
              alt='Profile Picture'
              width={80}
              height={80}
              className='w-14 h-14 text-sm rounded-full bg-primary text-black object-cover object-top flex justify-center items-center 3xl:w-24 3xl:h-24'
            />
          ) : (
            <h1 className='w-14 h-14 text-sm rounded-full bg-primary text-black flex justify-center items-center 3xl:w-24 3xl:h-24'>
              {initial}
            </h1>
          )}
        </button>

        {toggleProfileModal && (
          <div
            ref={modalRef}
            className='bg-white rounded-lg shadow-2fl p-2 flex flex-col justify-start items-start gap-3 absolute -top-[14rem] left-16 z-10 w-[20rem]'
          >
            <div className='flex gap-3'>
              <div>
                {user?.profile_url ? (
                  <Image
                    src={user?.profile_url}
                    alt='Profile Picture'
                    width={80}
                    height={80}
                    className='w-14 h-14 text-sm rounded-full bg-primary text-black object-cover object-top flex justify-center items-center 3xl:w-24 3xl:h-24'
                  />
                ) : (
                  <h1 className='w-14 h-14 text-sm rounded-full bg-primary text-black flex justify-center items-center 3xl:w-24 3xl:h-24'>
                    {initial}
                  </h1>
                )}
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <h3 className='text-base font-semibold'>
                  {user?.first_name} {user?.last_name}
                </h3>
                <Link href='/dashboard/settings'>
                  <span className='text-sm hover:text-purple hover:underline'>
                    View Profile
                  </span>
                </Link>
              </div>
            </div>
            <hr className='border border-dashgrey w-full' />

            <div className='flex flex-col justify-start items-start gap-1 w-full'>
              <Link
                href='/dashboard/settings'
                onClick={() => setToggleProfileModal(false)}
                className='w-full'
              >
                <div className='flex items-center gap-2 h-full p-2 hover:bg-dashgrey hover:rounded-md '>
                  <MdSettings />
                  <span className='text-base'>Settings</span>
                </div>
              </Link>
              <Link
                href='/dashboard/settings'
                onClick={() => setToggleProfileModal(false)}
                className='w-full'
              >
                <div className='flex items-center gap-2 h-full p-2 hover:bg-dashgrey hover:rounded-md '>
                  <BiHeadphone />
                  <span className='text-base'>Support </span>
                </div>
              </Link>

              <button
                type='button'
                onClick={logout}
                className='flex items-center gap-2 text-base p-2 hover:bg-dashgrey hover:rounded-md w-full '
              >
                <BiLogOut /> Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {canViewTour && (
        <Joyride steps={steps} continuous={true} showSkipButton={true} />
      )}
    </main>
  )
}