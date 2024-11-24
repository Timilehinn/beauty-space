import React from 'react'
import classNames from 'classnames'
import { ErrorMessage, Field } from 'formik'

export default function FormikField({
  name,
  type,
  placeholder,
  wrapperStyle,
  inputStyle,
  labelName,
}) {
  return (
    <div
      className={classNames(
        'flex flex-col justify-start items-start gap-3 w-full',
        wrapperStyle
      )}
    >
      <label
        htmlFor={name}
        className='font-medium xl:text-base lg:text-base md:text-lg sm:text-base'
      >
        {labelName}
      </label>
      <Field
        type={type || 'text'}
        name={name}
        placeholder={placeholder}
        className={classNames(
          'h-[4rem] w-full border px-4 rounded-lg xl:text-base lg:text-base md:text-base sm:text-base hover:bg-[#b5b3b678] hover:text-white focus:outline-[#0559FD] focus:bg-transparent focus:text-black ',
          inputStyle
        )}
      />
      <ErrorMessage
        component='span'
        name={name}
        className='text-[#ED254E] text-sm'
      />
    </div>
  )
}
