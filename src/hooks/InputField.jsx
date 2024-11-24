import React from 'react'
import { Field, ErrorMessage } from 'formik'

const InputField = ({ type, name, id, placeholder, className, style }) => {
  return (
    <div>
      <Field
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        className={`${className} bg-transparent outline-none h-[55px] indent-3 border-b-[1px] border-[#E3E3E3] w-full hover:border-[#727073] focus:border-[#0559FD]`}
        style={style}
      />
      <ErrorMessage
        name={name}
        component='div'
        className='text-red-500 text-sm font-medium' // Add the desired text color class here
      />
    </div>
  )
}

export default InputField
