import React from 'react'
import Select from 'react-select'

const servicesOptions = [
  { value: 'spa', label: 'Spa' },
  { value: 'barbering', label: 'Barbering' },
  { value: 'markupStudio', label: 'Markup Studio' },
  { value: 'hair', label: 'Hair' },
  { value: 'tattooAndPiercing', label: 'Tattoo and Piercing' },
]

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minWidth: '100%',
    minHeight: '48px',
    borderRadius: '0.375rem',
    borderColor: state.isFocused ? '#B4B4B8' : '#e6e6e8',
    // boxShadow: state.isFocused ? '0 0 0 1px #B4B4B8' : null,
    '&:hover': {
      borderColor: state.isFocused ? '#B4B4B8' : '#e6e6e8',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#e6e6e8',
    borderRadius: '0.375rem',
    padding: '0 0.25rem',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#111827',
    fontWeight: '500',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#9ca3af',
    '&:hover': {
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
    },
  }),
}

const MultiSelectDropdown = ({ selectedServices, setSelectedServices }) => {
  const handleChange = (selectedOptions) => {
    setSelectedServices(selectedOptions)
  }

  return (
    <Select
      isMulti
      name='services'
      options={servicesOptions}
      className='basic-multi-select'
      classNamePrefix='select'
      placeholder='Select services'
      value={selectedServices}
      onChange={handleChange}
      styles={customStyles}
    />
  )
}

export default MultiSelectDropdown
