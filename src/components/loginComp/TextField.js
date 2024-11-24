import React from 'react'
import { ErrorMessage, useField } from 'formik'

export const TextField = ({ label, ...props }) => {
  const [field, meta] = useField(props)

  return (
    <div className='flex flex-col justify-start items-start gap-3 w-full'>
      <label htmlFor={field.name} className='font-medium'>
        {label}
      </label>
      <input
        placeholder={field.placeholder}
        className={`placeholder:italic border border-lightgrey rounded w-full indent-3 h-12 outline-none focus:border-primary
          ${meta.touched && meta.error && 'is-invalid'}`}
        {...field}
        {...props}
        autoComplete='off'
      />
      <ErrorMessage
        component='span'
        name={field.name}
        className='text-purple '
      />
    </div>
  )
}
