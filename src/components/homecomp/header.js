'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'

import { useTranslation } from 'next-i18next'
import { BiDownload } from 'react-icons/bi'
import clsx from 'clsx'

import useCookieHandler from '../../hooks/useCookieHandler'
import { setAccountType, setLoading, setUsers } from '../../redux/admin_user'
import { CgClose } from 'react-icons/cg'

// const NavLinks = [
//   { id: 1, name: 'for business', path: '/business' },
//   { id: 2, name: 'for customer', path: '/#howitworks' },
//   { id: 3, name: 'pricing', path: '/pricing' },
// ]

export default function HomepageHeaderComp() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const pathname = usePathname()
  const [hamBurgerOpen] = React.useState(true)
  const { token } = useCookieHandler('user_token')
  const [modalOpen, setModalStatus] = React.useState(false)

  const exchangeTokenForId = async () => {
    if (!token) {
      return
    }
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
        alert('something went wrong. Seems you are not authenticated')
        return
      }

      dispatch(setUsers(data))
      dispatch(setAccountType(data?.data?.account_type[0]?.user_type.type))
      dispatch(setLoading(false))
    } catch (error) {}
  }

  useEffect(() => {
    exchangeTokenForId()
  }, [token, dispatch])

  const ModalDialog = () => {
    setModalStatus(false)
  }
  const HamBurger = () => {
    setModalStatus(true)
  }

  // Regex to match any route that has /booking/ and ends with /booking-status
  const hideHeader = /\/booking\/.*\/booking-status$/.test(pathname)

  return (
    <header
      className={clsx(
        'h-20 w-full shadow-1fl fixed top-0 left-0 z-20 3xl:h-[9rem] ',
        {
          'bg-lightpurple': pathname === '/pricing',
          'bg-white': pathname !== '/pricing',
          hidden: hideHeader,
        }
      )}
    >
      <div className='mx-auto flex justify-between items-center h-full 3xl:w-[65%] xxl:pr-[10rem] xxl:pl-[9rem] xl:pl-[9rem] xl:pr-[10rem] lg:pl-14 lg:pr-16 md:pl-8 md:pr-10 sm:pr-5 sm:pl-4'>
        <Link href='/'>
          <div className='flex justify-start items-center gap-3 '>
            <Image
              src='/Beautyspace.svg'
              width={80}
              height={80}
              alt='BeautySpace'
              className='object-cover '
            />
            <h1 className='text-xl font-medium capitalize 3xl:text-3xl'>
              {t('BeautySpace')}
            </h1>
          </div>
        </Link>

        {hamBurgerOpen && (
          <button
            type='button'
            onClick={HamBurger}
            className='xl:hidden lg:hidden md:flex sm:flex justify-end items-end ml-auto cursor-pointer'
          >
            <Image
              src='https://d3upyygarw3mun.cloudfront.net/Icons/Align+Left.svg'
              width={40}
              height={40}
              quality={100}
              alt='close-modal'
            />
          </button>
        )}

        <div className='lg:flex justify-start items-center gap-5 md:hidden sm:hidden'>
          <Link
            href='/#download'
            className='rounded-full px-5 h-12 cursor-pointer text-black bg-white shadow-2fl flex justify-center items-center gap-3 3xl:h-14'
          >
            <BiDownload />
            Get App
          </Link>

          {token && (
            <Link
              href={'/dashboard'}
              className='rounded-full px-5 h-12 cursor-pointer hover:text-white bg-purple text-white flex justify-center items-center 3xl:h-14'
            >
              Account
            </Link>
          )}

          {!token && (
            <Link
              href='/login'
              className='bg-purple rounded-full px-5 h-12 text-white flex justify-center items-center hover:text-white 3xl:h-14'
            >
              Log In
            </Link>
          )}
        </div>

        {modalOpen === true && (
          <section className='bg-black w-[70%] h-screen fixed top-0 left-0 z-50 p-5 flex flex-col justify-start items-start gap-20 '>
            <div className='flex justify-between items-center w-full'>
              <div className='flex justify-start items-center space-x-1'>
                <Image
                  src='/Beautyspace.svg'
                  alt='Beautyspace'
                  width={70}
                  height={70}
                  quality={100}
                />
                <h1 className='text-xl font-semibold text-white'>
                  BeautySpace
                </h1>
              </div>
              <button
                type='button'
                onClick={ModalDialog}
                className='flex justify-end items-end ml-auto text-2xl '
              >
                <CgClose />
              </button>
            </div>

            <div className='flex flex-col justify-start items-start gap-8 text-white text-xl '>
              <div className='flex flex-col justify-start items-start gap-4 w-full'>
                {NavLinks.map((link) => {
                  return (
                    <Link
                      href={link.path}
                      key={link.id}
                      className={clsx(
                        'capitalize font-medium',
                        pathname === link.path
                          ? 'text-black'
                          : 'text-lightblack'
                      )}
                    >
                      {link.name}
                    </Link>
                  )
                })}
                <Link href='/#download' scroll={true}>
                  Download
                </Link>
              </div>

              <div className='flex flex-col justify-start items-start gap-4 w-full'>
                {token && <Link href='/dashboard'>{t('Account')}</Link>}

                {!token && <Link href='/login'>{t('Login')}</Link>}
              </div>
            </div>
          </section>
        )}
      </div>
    </header>
  )
}
