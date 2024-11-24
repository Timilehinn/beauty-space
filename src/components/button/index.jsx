import React from 'react'
import clsx from 'clsx'

const Button = ({
  label,
  handleClick = (e) => null,
  type = 'button',
  icon,
  isActive = false,
  variant,
  extraClass,
}) => (
  <button
    onClick={handleClick}
    type={type}
    className={clsx({
      [`flex justify-center items-center gap-2 h-12 px-5 rounded-lg border border-lightgrey  hover:bg-primary hover:border-none hover:text-white ${extraClass}`]: true,
      'bg-primary text-white': isActive,
      ['btn__primary']: isActive,
      ['primary']: variant === 'bg-primary text-white',
      ['tertiary']: variant === 'bg-black  text-white',
    })}
  >
    {icon !== null && icon}
    {label}
  </button>
)

export default Button
