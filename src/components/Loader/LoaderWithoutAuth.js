import React from 'react'
import Cookies from 'universal-cookie'
import { useRouter } from 'next/navigation'

import { CircularSpinner } from '../LoadingIndicator'

export default function LoaderWithoutAuth({
  failure,
  isLoading,
  redirectTo,
  customMessage,
  redirectBack,
}) {
  const router = useRouter()
  const cookies = new Cookies()

  const navigateFunction = () => {
    if (redirectBack) {
      cookies.set('redirect_back_val', redirectBack, {
        path: '/',
        maxAge: 700,
      })
    }
    router.push(`/${redirectTo}`)
  }

  if (isLoading) {
    return (
      <div className='flex flex-col justify-center items-center h-screen w-full overflow-x-hidden fixed top-0 left-0 bg-white z-10'>
        <CircularSpinner />
      </div>
    )
  }

  if (failure) {
    return (
      <div className='flex flex-col justify-center items-center gap-5 h-screen w-screen fixed top-0 left-0 bg-white z-10'>
        <h1 className='text-danger font-bold text-xl '>
          {customMessage ? customMessage : 'Sorry, something went wrong'}
        </h1>
        <button
          onClick={navigateFunction}
          className='bg-primary active:opacity-0 cursor-pointer rounded-md text-white h-12 px-5'
        >
          Go to {`${redirectTo}`}
        </button>
      </div>
    )
  }

  return <div></div>
}
