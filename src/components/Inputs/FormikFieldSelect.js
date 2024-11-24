import React, { useState } from 'react'
import classNames from 'classnames'
import { ErrorMessage, Field, useFormikContext } from 'formik'

export default function FormikFieldSelect({
  name,
  labelName,
  defaultOption,
  options,
  wrapperStyle,
  inputStyle,
}) {
  const { setFieldValue } = useFormikContext()
  const [selectedValue, setSelectedValue] = useState('')
  const [otherValue, setOtherValue] = useState('')

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value
    setSelectedValue(selectedOption)
    setFieldValue(name, selectedOption)
  }

  const handleOtherChange = (e) => {
    const otherOption = e.target.value
    setOtherValue(otherOption)
    setFieldValue(name, otherOption)
  }

  return (
    <div
      className={classNames(
        'flex flex-col justify-start items-start gap-2 w-full',
        wrapperStyle
      )}
    >
      <label
        htmlFor={name}
        className='font-semibold xl:text-base lg:text-base md:text-lg sm:text-base'
      >
        {labelName}
      </label>
      <Field
        as='select'
        id={name}
        name={name}
        value={selectedValue}
        onChange={handleSelectChange}
        className={classNames(
          'h-[4rem] w-full border px-4 rounded-lg xl:text-base lg:text-base md:text-lg sm:text-base hover:bg-[#b5b3b678] hover:text-white focus:outline-[#0559FD] focus:bg-transparent focus:text-black ',
          inputStyle
        )}
      >
        <option value='' disabled>
          {defaultOption}
        </option>
        {options.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}
          </option>
        ))}
      </Field>

      {selectedValue === 'Other' && (
        <Field
          type='text'
          id={name}
          name={name}
          value={otherValue}
          onChange={handleOtherChange}
          placeholder={`Enter your other business type`}
          className={classNames(
            'h-[4rem] w-full border px-4 rounded-lg hover:bg-[#b5b3b678] hover:text-white focus:outline-[#0559FD] focus:bg-transparent focus:text-black ',
            inputStyle
          )}
        />
      )}

      <ErrorMessage
        component='span'
        name={name}
        className='text-[#ED254E] text-sm'
      />
    </div>
  )
}
