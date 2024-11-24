import React from 'react'
import { BiCheckCircle } from 'react-icons/bi'

const AmentyComp = ({ label, options }) => {
  return (
    <section className='flex justify-between items-start flex-wrap gap-10'>
      <h4>{label}</h4>
      <ul className='flex justify-start items-center flex-wrap gap-4'>
        {options.map((amty, index) => (
          <li key={index} className='flex justify-start items-center gap-2'>
            <BiCheckCircle className='text-primary text-sm' />
            {amty}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AmentyComp
