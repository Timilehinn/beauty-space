import React from 'react'

export default function CreateService({ children }) {
  return (
    <main className='flex flex-col justify-start items-start gap-5 w-full h-screen bg-white '>
      {children}
    </main>
  )
}
