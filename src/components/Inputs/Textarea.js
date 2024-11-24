import React from 'react'
import { Field, ErrorMessage } from 'formik'

const Textarea = (props) => {
  const { name, ...rest } = props

  return (
    <main className='form_control'>
      <Field as='textarea' id={name} name={name} {...rest} />
      <ErrorMessage
        component='span'
        name={name}
        className='error my-2 text-[#DA3D2A] '
      />
    </main>
  )
}

export default Textarea
