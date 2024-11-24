import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'

import { BiBell, BiChevronDown, BiHeart } from 'react-icons/bi'
import { FaCalendarWeek } from 'react-icons/fa'
import { FaBarsStaggered } from 'react-icons/fa6'
import { MdClose } from 'react-icons/md'

import { AdminSidebar } from './NavLinks/AdminSidebar'
import { OwnerSidebar } from './NavLinks/OwnerSidebar'
import { UserSidebar } from './NavLinks/UserSidebar'

import FixedNofitication from '../../components/Notifications/FixedNofitication'
import useCookieHandler from '../../hooks/useCookieHandler'

import { CgClose } from 'react-icons/cg'
import { GET_BUSINESSES } from '../../api/businessRoutes'
import { SWITCH_BUSINESS } from '../../api/revenueRoutes'
import { handleResponse } from '../../api/router'
import {
  getCurrentUserPlan,
  getUserInfo,
  setAccountType,
  setCurrentUserPlan,
  setIsFailure,
  setLoading,
  setReferralCode,
  setUserInfo,
  setUsers,
  setUserType,
  setWorkspaceFavourites,
} from '../../redux/admin_user'
import {
  setEmptyNotification,
  setFailure,
  setLoadingNotification,
  setNextUrl,
  setNotifications,
} from '../../redux/dashboard_related'
import {
  getCurrentBusiness,
  getWorkspaceData,
  setCurrentBusiness,
  setWorkspace,
} from '../../redux/workspaceSlice'

import { pricingModels } from '../../constants'

const DashboardHeader = () => {
  const ref = useRef()
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const pathname = usePathname()
  const cookies = new Cookies()
  const { token } = useCookieHandler('user_token')

  const [toggleMenu, setToggleMenu] = useState(false)
  const [isUnreadPresent, setIsUnreadPresent] = useState(0)
  const [toggleHeaderIcon, setToggleHeaderIcon] = useState(false)
  const [openNotification, setOpenNotification] = useState(false)

  const [switchModal, setSwitchModal] = useState(false)

  const accountType = useSelector((state) => state.adminPeople.accountType)
  const businesses = useSelector(getWorkspaceData)
  const currentBusiness = useSelector(getCurrentBusiness)
  const userDetails = useSelector(getUserInfo)
  const currentSubscriptionPlan = useSelector(getCurrentUserPlan)

  const exchangeTokenForId = async () => {
    if (!token) return
    dispatch(setLoading(true))
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/retrieve-token`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            token,
          }),
        }
      )
      const data = await res.json()

      if (data?.status !== true) {
        toast.error('something went wrong. Seems you are not authenticated')
        return
      }

      dispatch(setUserInfo(data?.data))
      dispatch(setUsers(data))
      dispatch(setLoading(false))
      dispatch(setIsFailure(false))
      dispatch(setWorkspaceFavourites(data?.data?.workspace_favourites))
      dispatch(setCurrentBusiness(data.data.business))

      dispatch(setAccountType(data?.data?.account_type[0]?.user_type.type))
      dispatch(setUserType(data?.data?.account_type[0]))
      dispatch(setReferralCode(data?.data?.referral?.referral_code))
    } catch (error) {}
  }

  const fetchNotifications = async () => {
    if (!token) {
      return
    }
    dispatch(setLoadingNotification(true))

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/notifications`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.status === 401) {
        router.push('/')
        return
      }

      const data = await res?.json()
      if (data?.status !== true) {
        dispatch(setLoadingNotification(false))
        dispatch(setFailure(true))
        toast.error('Error fetching notifications')
        return
      }

      setNotifications(data?.data?.data)
      const isUnread = data?.data?.data?.filter((x) => x?.seen === false)
      setIsUnreadPresent(isUnread?.length)

      dispatch(setLoadingNotification(false))
      dispatch(setFailure(false))
      dispatch(setNotifications(data?.data.data))
      dispatch(setNextUrl(data?.data?.next_page_url))
      if (!data?.data?.data?.length) {
        dispatch(setEmptyNotification(true))
      }
    } catch (error) {
      dispatch(setLoadingNotification(false))
      dispatch(setFailure(true))
    } finally {
    }
  }

  const fetchBusinesses = async (page = 1) => {
    if (!token) return

    try {
      const res = await GET_BUSINESSES(token, page)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)

      if (status) {
        dispatch(setWorkspace(data.data))
      } else {
        throw new Error(error)
      }
    } catch (error) {
      toast.error('Something went wrong, please try again')
    } finally {
    }
  }

  /**
   * The function `handleBusinessSwitch` is an asynchronous function that handles switching the user's
   * business with error handling and toast notifications.
   * @param business_id - The `business_id` parameter in the `handleBusinessSwitch` function is the
   * unique identifier of the business that the user wants to switch to. This identifier is used to make
   * a request to switch the user's current business context to the specified business.
   * @returns The `handleBusinessSwitch` function returns either a success message indicating that the
   * business switch was successful or an error message indicating that something went wrong during the
   * process.
   */
  const handleBusinessSwitch = async (business_id) => {
    if (!token) return

    try {
      const res = await SWITCH_BUSINESS(token, business_id)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)

      if (status && data?.token) {
        // Remove the existing token
        cookies.remove('user_token', { path: '/' })

        // Set the new token
        cookies.set('user_token', data?.token, {
          path: '/',
          maxAge: 2600000,
          sameSite: 'none',
          secure: true,
        })

        toast.success('Your business switch was successfully')
        window.location.reload()
      } else {
        throw new Error(error || 'Failed to switch business')
      }
    } catch (error) {
      toast.error('Something went wrong, please try again')
    }
  }

  useEffect(() => {
    exchangeTokenForId()
    fetchNotifications()
    fetchBusinesses()
  }, [token, dispatch])

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (toggleHeaderIcon && ref.current && !ref.current.contains(e.target)) {
        setToggleHeaderIcon(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [toggleHeaderIcon])

  useEffect(() => {
    if (userDetails && userDetails?.subscriptions.length > 0) {
      const _sub =
        userDetails.subscriptions[userDetails.subscriptions.length - 1]

      if (_sub && _sub.status.toLowerCase() === 'active') {
        var _interval =
          _sub.subscription_plan.interval === 'annually' ? 'yearly' : 'monthly'
        //  setInterval(_interval)
        //  setCurrentPlanInterval(_interval)
        const meta = pricingModels.find(
          (sub) => sub.identifier === _sub.subscription_plan.plan.split(' ')[0]
        )

        dispatch(setCurrentUserPlan(_sub))
      } else {
        var basic = userDetails.subscriptions[0]
        const meta = pricingModels.find(
          (sub) => sub.identifier === basic.subscription_plan.plan.split(' ')[0]
        )

        dispatch(setCurrentUserPlan(userDetails.subscriptions[0]))
      }
    }
  }, [userDetails])

  const headerIconBtn = [
    {
      alt: 'Bookings',
      path: '/dashboard/bookings',
      imgLink: <FaCalendarWeek className='text-xl' />,
    },
  ]

  const headerIconUserBtn = [
    {
      alt: 'Favorite space',
      path: '/dashboard/favourite-services',
      imgLink: <BiHeart className='text-xl' />,
    },
    {
      alt: 'Bookings',
      path: '/dashboard/user/bookings',
      imgLink: <FaCalendarWeek className='text-xl' />,
    },
  ]

  /**
   * The function `handleSwitchToggle` toggles the value of `switchModal`.
   */
  const handleSwitchToggle = () => {
    setSwitchModal(!switchModal)
  }

  /* The above code is using React's `useMemo` hook to create a memoized sorted list of businesses. It
first checks if the `businesses` array exists, and if not, it returns an empty array. If the
`businesses` array exists, it creates a new array using the spread operator `[...businesses]` and
sorts it based on a custom sorting function. */
  const sortedBusinesses = React.useMemo(() => {
    if (!businesses) return []
    return [...businesses]?.sort((a, b) => {
      if (a.id === currentBusiness?.id) return -1
      if (b.id === currentBusiness?.id) return 1
      return 0
    })
  }, [businesses, currentBusiness])

  return (
    <main
      className={clsx(
        '3xl:px-10 3xl:py-5 w-full lg:px-10 md:px-10 sm:px-5 py-3 bg-transparent flex justify-between items-center cursor-pointer border-b border-lightgrey  ',
        pathname === '/dashboard/create-service' ? 'hidden' : ''
      )}
    >
      <button
        type='button'
        onClick={() => setToggleMenu(true)}
        className='block text-xl lg:hidden '
      >
        <FaBarsStaggered />
      </button>

      <section className='flex justify-end items-center gap-5 ml-auto'>
        {accountType === 'Owner' &&
          headerIconBtn?.map((x, key) => {
            return (
              <Link
                href={x.path}
                key={key}
                className='rounded-full bg-white shadow-2fl lg:flex md:flex sm:hidden items-center justify-center 
            w-[40px] h-[40px] '
              >
                {x.imgLink}
              </Link>
            )
          })}

        {accountType === 'User' &&
          headerIconUserBtn?.map((x, key) => {
            return (
              <Link
                href={x.path}
                key={key}
                className='w-12 h-12 bg-white rounded-full shadow-4 flex justify-center items-center '
              >
                {x.imgLink}
              </Link>
            )
          })}

        <button
          onClick={() => setOpenNotification(!openNotification)}
          className='w-10 h-10 flex justify-center items-center relative bg-white rounded-full shadow-4 '
        >
          <BiBell className='text-2xl' />
          {isUnreadPresent > 0 && (
            <div className='text-white absolute top-0 left-7 bg-danger rounded-full h-[15px] w-[15px] flex justify-center items-center text-[10px]'>
              {isUnreadPresent > 99 ? '99+' : isUnreadPresent}
            </div>
          )}
        </button>

        {accountType !== 'Staff' && (
          <button
            type='button'
            onMouseDown={handleSwitchToggle}
            className='text-2xl'
          >
            <BiChevronDown />
          </button>
        )}

        {openNotification && (
          <FixedNofitication setOpenNotification={setOpenNotification} />
        )}
      </section>

      {switchModal && (
        <section className='absolute top-[5rem] right-5 z-20 bg-white h-[200px] w-[250px] rounded-md p-4 ring-1 ring-gray flex flex-col justify-start items-start gap-5 '>
          <div className='flex flex-col gap-2 w-full'>
            <header className='flex justify-between items-center w-full'>
              <h1 className='font-semibold text-sm'>Switch Business:</h1>
              <button type='button' onMouseDown={handleSwitchToggle}>
                <CgClose />
              </button>
            </header>

            <hr className='w-full border-gray' />
          </div>

          {sortedBusinesses.length >= 1 ? (
            <div className='flex flex-col justify-start items-start w-full overflow-y-auto scrollbar-hide'>
              {sortedBusinesses?.map((item, index) => {
                const isCurrent = item.id === currentBusiness?.id
                const isLast = index === businesses?.length - 1

                return (
                  <div
                    key={item.id}
                    className={clsx(
                      'flex justify-between items-start gap-5 w-full text-sm py-2',
                      !isLast ? 'border-b border-gray' : ''
                    )}
                  >
                    <span>{item.name}</span>
                    <button
                      type='button'
                      className={clsx(
                        ``,
                        isCurrent
                          ? 'cursor-not-allowed text-lightgrey'
                          : 'text-primary'
                      )}
                      disabled={isCurrent}
                      onClick={() => handleBusinessSwitch(item.id)}
                    >
                      {isCurrent ? 'Current' : 'Switch'}
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className='text-lightgrey flex justify-center items-center m-auto'>
              No business available yet!
            </p>
          )}
        </section>
      )}

      {accountType === 'Owner' && toggleMenu === true && (
        <div className='fixed bg-lightblack w-full h-screen top-0 left-0 z-10'>
          <div className='bg-white w-[80%] xl:hidden lg:hidden md:flex sm:flex flex-col justify-start items-start gap-10 absolute top-0 left-0 z-50 h-screen px-8 py-5'>
            <div className='flex justify-between items-center gap-4 w-full'>
              <Link href='/' className='flex justify-center items-center'>
                {' '}
                <Image
                  src='/Beautyspace.svg'
                  alt='logo'
                  width={50}
                  height={50}
                />{' '}
                <h1 className='text-xl'> {t('BeautySpace')} </h1>
              </Link>

              <button
                type='button'
                onClick={() => setToggleMenu(false)}
                className='text-xl '
              >
                <MdClose />
              </button>
            </div>

            <div className='w-full'>
              {OwnerSidebar.map((item) => {
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    id={item.id}
                    className={clsx(
                      'w-full h-14 flex gap-3 justify-start items-center px-2 hover:bg-white',
                      pathname === item.path
                        ? 'text-primary bg-[#d1cdcd8b] rounded-xl'
                        : 'hover:bg-[#d1cdcd8b] text-black'
                    )}
                  >
                    <span>{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {accountType === 'User' && toggleMenu === true && (
        <div className='bg-primary w-full xl:hidden lg:hidden md:flex sm:flex flex-col justify-start items-start gap-10 absolute top-0 left-0 z-50 h-screen md:px-10 sm:px-5 py-8'>
          <div className='flex justify-between items-center gap-4 w-full'>
            <Link href='/' className='flex justify-center items-center'>
              {' '}
              <Image
                src='/Beautyspace.svg'
                alt='logo'
                width={50}
                height={50}
              />{' '}
              <h1 className='text-xl'> {t('BeautySpace')} </h1>
            </Link>

            <button
              type='button'
              onClick={() => setToggleMenu(false)}
              className='text-xl '
            >
              <MdClose />
            </button>
          </div>

          <div className='w-full'>
            {UserSidebar.map((item) => {
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  id={item.id}
                  className={clsx(
                    'w-full h-14 flex gap-3 justify-start items-center px-2 hover:bg-white',
                    pathname === item.path
                      ? 'text-primary bg-[#d1cdcd8b] rounded-xl'
                      : 'hover:bg-[#d1cdcd8b] text-black'
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {accountType === 'Admin' && toggleMenu === true && (
        <div className='bg-white w-[60%] xl:hidden lg:hidden md:flex sm:flex flex-col justify-start items-start gap-10 absolute top-0 left-0 z-50 h-screen md:px-10 sm:px-5 py-8'>
          <div className='flex justify-between items-center gap-4 w-full'>
            <Link href='/' className='flex justify-center items-center'>
              {' '}
              <Image
                src='/Beautyspace.svg'
                alt='logo'
                width={50}
                height={50}
              />{' '}
              <h1 className='text-xl'> {t('BeautySpace')} </h1>
            </Link>

            <button
              type='button'
              onClick={() => setToggleMenu(false)}
              className='text-xl '
            >
              <MdClose />
            </button>
          </div>

          <div className='w-full'>
            {AdminSidebar.map((item) => {
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  id={item.id}
                  className={clsx(
                    'w-full h-14 flex gap-3 justify-start items-center px-2 hover:bg-white',
                    pathname === item.path
                      ? 'text-primary bg-[#d1cdcd8b] rounded-xl'
                      : 'hover:bg-[#d1cdcd8b] text-black'
                  )}
                >
                  <span className='text-xl'>{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}

export default DashboardHeader
