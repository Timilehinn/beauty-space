import React from 'react'
import Check from '../../assets/icons/Check-Fill.svg'

const OptionsComp = ({
  label,
  options
}) => {
  return (
    <div className="options">
      <h4>{label}</h4>
      <ul>
        {options.map(opt => (
          <li key={opt} className="option_list">{opt}</li>
        ))}
      </ul>
    </div>
  )
}

export default OptionsComp