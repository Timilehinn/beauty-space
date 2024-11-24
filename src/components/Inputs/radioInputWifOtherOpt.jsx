import React, { useState } from 'react'

export default function RadioInputWifOtherOpt({ options, onSelectionChange }) {
  const [selectedOption, setSelectedOption] = useState('')
  const [otherInput, setOtherInput] = useState('')

  const handleOptionChange = (event) => {
    const value = event.target.value

    setSelectedOption(value)
    onSelectionChange(value === 'Other' ? otherInput : value)
  }

  const handleOtherInputChange = (event) => {
    const value = event.target.value

    setOtherInput(value)
    onSelectionChange(value)
  }

  return (
    <section className='flex flex-col justify-start items-start gap-3 w-full '>
      {' '}
      {options?.map((option) => (
        <div
          key={option.value}
          className='flex justify-start items-center gap-2 w-full'
        >
          <input
            type='radio'
            id={option.value}
            name={option.value}
            value={option.value}
            checked={selectedOption === option.value}
            onChange={handleOptionChange}
          />
          <label htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
      <div className='flex flex-col justify-start items-start gap-3 w-full'>
        <div className='flex justify-start items-center gap-2 w-full'>
          <input
            type='radio'
            id='Other'
            name='Other'
            value='Other'
            checked={selectedOption === 'Other'}
            onChange={handleOptionChange}
          />
          <label htmlFor='Other'>Other</label>
        </div>
        {selectedOption === 'Other' && (
          <textarea
            placeholder='Enter your details...'
            value={otherInput}
            onChange={handleOtherInputChange}
            className='border w-full h-[150px] rounded-md p-2 outline-none'
          />
        )}
      </div>
    </section>
  )
}
