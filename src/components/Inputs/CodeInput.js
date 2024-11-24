import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

const CodeInput = ({ length, onComplete }) => {
  const [values, setValues] = useState(Array(length).fill(''))
  const inputs = useRef([])

  const handleChange = (value, index) => {
    const newValues = [...values]
    newValues[index] = value

    setValues(newValues)

    if (value.length === 1 && index < length - 1) {
      inputs.current[index + 1].focus()
    }

    if (newValues.every((val) => val !== '')) {
      onComplete(newValues.join(''))
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputs.current[index - 1].focus()
    }
  }

  return (
    <div className='flex items-center gap-5'>
      {values.map((value, index) => (
        <input
          key={index}
          type='number'
          maxLength='1'
          value={value}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputs.current[index] = el)}
          className='border border-lightgrey rounded-md text-center focus:outline-none focus:border-primary xl:h-14 xl:w-14 lg:w-14 lg:h-14 md:w-14 md:h-14 sm:w-10 sm:h-10'
        />
      ))}
    </div>
  )
}

CodeInput.propTypes = {
  length: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
}

export default CodeInput
