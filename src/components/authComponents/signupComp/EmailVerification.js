'use client'

import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import { MdOutlineReplay } from 'react-icons/md'

import BgImage from '../../../assets/beauty-portrait1.jpg'
import HomepageHeaderComp from '../../homecomp/header'
import CodeInput from '../../Inputs/CodeInput'
import { getSignupEmail } from '../../../redux/authRelated'
import { toast } from 'react-toastify'

export default function EmailVerification({ next }) {
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const email = useSelector(getSignupEmail)

  const HandleVerifyEmailCode = async (otp) => {
    setIsSubmitting(true)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/email/verify-otp`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      }
    )
    const data = await response.json()

    if (data.status === true) {
      setIsSubmitting(false)
      next(otp)
      return { status: true, message: '' }
    } else {
      setIsSubmitting(false)
      return
    }
  }

  const HandleResendOtp = async () => {
    setLoading(true)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/email/verify`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    )
    const data = await response.json()

    setLoading(false)

    if (data.status === true) {
      // dispatch(setSignupEmail(email))
      return { status: true, message: '' }
    }

    let message = data?.errors?.email[0]
    toast.error(message || 'There was an issue with your')
    return { status: false, message: '' }
  }

  return (
    <>
      <HomepageHeaderComp />
      <main className='flex gap-5 h-screen overflow-hidden w-full pt-[5rem] xxl:px-[10rem] xl:px-[10rem] lg:px-16 md:px-10 sm:px-5'>
        <div className='xl:w-[50%] lg:h-[90%] lg:w-[50%] md:w-full sm:w-full m-auto hidden lg:block'>
          <Image
            src={BgImage}
            width={500}
            height={500}
            alt='Beauty Image'
            className='rounded-xl object-cover object-top w-full h-full shadow-2fl'
          />
        </div>

        <div className='flex flex-col justify-center items-start gap-8 xl:w-[50%] lg:w-[50%] md:w-full sm:w-full m-auto '>
          <div className='flex flex-col gap-2 w-full xxl:w-[35%] lg:w-[45%]'>
            <h1 className='text-2xl font-semibold'>Verify your email</h1>
            <span className='text-lightgrey text-base lg:text-base'>
              A code was sent to your email. Check your email!{' '}
            </span>
          </div>

          <CodeInput length={6} onComplete={HandleVerifyEmailCode} />

          <div className='flex gap-5'>
            <button
              type='button'
              onClick={() => HandleResendOtp()}
              className='h-12 w-auto px-5 rounded-full flex justify-center items-center gap-2 bg-purple text-white'
            >
              <MdOutlineReplay />
              {loading ? 'Resending code...' : 'Resend'}
            </button>
            <button
              type='button'
              className='h-12 w-auto px-5 rounded-full bg-lightgrey text-white focus:bg-purple hover:bg-purple'
            >
              {isSubmitting ? 'Verifying...' : 'Continue'}
            </button>
          </div>

          <p className='text-lightgrey w-[70%]'>
            By continuing, you agree to the{' '}
            <Link href='/privacypolicy' className='underline'>
              Terms of use
            </Link>{' '}
            and{' '}
            <Link href='/privacypolicy' className='underline'>
              Privacy Policy
            </Link>{' '}
            of <span className='underline'>BeautySpace</span>
          </p>
        </div>
      </main>
    </>
  )
}
