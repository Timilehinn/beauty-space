import React from 'react'

const Sample = () => {
  return (
    <div className='w-[100%] px-5 sm:px-[10px] mb-[25px]'>
      <div className='h-[300px] w-[100%] bg-[#F0F0F0] rounded-[15px] mb-[10px]' />
      <div className='w-[100%]'>
        <div className='flex flex-row justify-between'>
          <div className='h-[30px] w-[50%] bg-[#F0F0F0] rounded-[25px] mb-[10px]' />
          <div className='h-[30px] w-[30px] bg-[#F0F0F0] rounded-[25px] mb-[10px]' />
        </div>
        <div className='h-[30px] w-[70%] bg-[#F0F0F0] rounded-[25px] mb-[10px]' />
        <div className='h-[30px] w-[30%] bg-[#F0F0F0] rounded-[25px]' />
      </div>
    </div>
  )
}

export default function SearchSkeleton() {
  return (
    <>
      <Sample />
      <Sample />
      <Sample />
      <Sample />
      <Sample />
      <Sample />
    </>
  )
}
