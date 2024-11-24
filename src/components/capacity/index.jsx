import React from 'react'
import User from '../../assets/icons/User-small.svg'
import Minus from '../../assets/icons/Minus.svg'
import Add from '../../assets/icons/Add.svg'

const Capacity = ({ increment, decrement, selectedCapacity}) => {
  return (
    <>
      <span className="block text-md mt-8 mb-4 font-light">Capacity</span>
      <div className="flex justify-between mb-6 w-[194px] h-10 rounded-lg border border-[#434144]">
        <div className="flex items-center justify-center w-1/4 cursor-pointer" onClick={() => decrement()}>
          <Minus />
        </div>
        <div className="flex items-center justify-center border-x border-[#434144] w-2/4">
          <User />
          <span className="ml-2 text-slate-500">{selectedCapacity}</span>
        </div>
        <div className="flex items-center justify-center w-1/4 cursor-pointer" onClick={() => increment()}>
          <Add />
        </div>
      </div>
    </>
  )
}

export default Capacity
