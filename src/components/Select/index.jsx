import React, { useState } from 'react'

const SelectElement = ({
  t,
  options = [],
  selectedValue,
  label = 'label',
  defaultValue = 'none',
}) => {
  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState(defaultValue)

  const handleShow = () => setShow(!show)
  const handleSelected = (e, label, value) => {
    e.preventDefault()
    selectedValue(value)
    setSelected(label)
    handleShow()
  }

  return (
    <div className='relative w-full'>
      <button
        type='button'
        onClick={handleShow}
        className='cursor-default rounded-lg border border-lightgrey h-[3rem] bg-white p-2 w-full '
      >
        <div className='flex items-center'>
          <span>{label}</span>
          <span className='ml-2 capitalize block truncate text-[14px]'>
            {selected}
          </span>
        </div>
        <div className='pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2'>
          <svg
            className='h-5 w-5 text-gray-400'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      </button>

      {show && (
        <ul className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
          {options?.map(({ label, value }, idx) => (
            <li
              key={idx}
              className='hover:bg-lightblack w-full text-gray-900  cursor-default select-none  '
            >
              <button
                value={t(value)}
                onClick={(e) => handleSelected(e, label, value)}
                className='h-full w-full pl-2 text-left font-normal py-2  block truncate text-xs capitalize border-none'
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SelectElement
