import React from 'react'
import { FaNairaSign } from 'react-icons/fa6'
import { BiPolygon } from 'react-icons/bi'

import { FormatAmount } from '../../utils/formatAmount'

const Price = ({ amount, onClick }) => {
  return (
    <div
      className='w-[93px] h-[48px] flex items-center flex-col z-50'
      onClick={onClick}
    >
      <div className='flex items-center text-base bg-primary justify-center h-[32px] py-1 px-3 rounded-lg text-white font-bold'>
        <FaNairaSign />
        {FormatAmount(amount)}
      </div>
      <BiPolygon className='-mt-1' />
    </div>
  )
}

export default Price
