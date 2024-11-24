import React from 'react'

const Button = ({ type, name, label, onClick, disabled, icons, className }) => {
  return (
    <button
      type={type}
      name={name}
      onClick={onClick}
      disabled={disabled}
      className={`h-[55px] ${className} text-white px-3 bg-[#0559FD] rounded-md border-none cursor-pointer disabled:opacity-50 
        disabled:cursor-not-allowed hover:bg-[#0447CA]`}
    >
      <span className='text-[20px]'>{icons}</span>
      {label}
    </button>
  )
}

export default Button
