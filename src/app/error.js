'use client' // Ensure this component is treated as a client component

import { useEffect } from 'react'
import PropTypes from 'prop-types'

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <main className='flex flex-col justify-center items-center gap-3 h-screen overflow-hidden'>
      <h2 className='text-3xl font-medium'>Something went wrong!</h2>
      <button
        onClick={reset}
        className='bg-purple h-14 px-5 rounded-md text-white'
      >
        Try again
      </button>
    </main>
  )
}

Error.propTypes = {
  error: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
}
