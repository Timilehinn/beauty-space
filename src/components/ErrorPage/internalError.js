import React from 'react'
import { Link } from 'react-router-dom'

const InternalError = (props) => {
  return (
    <main className='flex flex-col justify-center items-center gap-4 h-screen m-auto '>
      <img className='w-[300px]' src='warning(3).png' alt='404' />
      <p className='text-[1.5rem] font-medium'>This page is unathourized.</p>
      <Link
        to='/'
        className='h-[40px] w-[120px] bg-red-500 text-white font-medium flex justify-center items-center hover:text-white'
      >
        Go home
      </Link>
    </main>
  )
}

export default InternalError
