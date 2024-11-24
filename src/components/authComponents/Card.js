import React from 'react'
import { Icon } from '@iconify/react'

const Card = () => {
  return (
    <div
      className='bg-white mx-1 p-[10px] h-[140px] w-[300px] drop-shadow-2xl mt-[20px] rounded flex flex-col gap-[20px]'
      style={{ boxShadow: '2px 2px 5px #9c9c9c' }}
    >
      <div className='flex justify-between items-center'>
        <Icon icon='logos:visa' width='45' height='45' />
        <svg
          className='cursor-pointer'
          clip-rule='evenodd'
          fill-rule='evenodd'
          stroke-linejoin='round'
          stroke-miterlimit='2'
          viewBox='0 0 24 24'
          height='15'
          width='15'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='m12 16.495c1.242 0 2.25 1.008 2.25 2.25s-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25 1.008-2.25 2.25-2.25zm0-6.75c1.242 0 2.25 1.008 2.25 2.25s-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25 1.008-2.25 2.25-2.25zm0-6.75c1.242 0 2.25 1.008 2.25 2.25s-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25 1.008-2.25 2.25-2.25z' />
        </svg>
      </div>
      <div className='flex items-center gap-5 sm:text-[13px]'>
        <span>****</span>
        <span>****</span>
        <span>****</span>
        <span>0000</span>
      </div>
      <div className='sm:text-[10px]'>01/10/2023</div>
    </div>
  )
}

export default Card
