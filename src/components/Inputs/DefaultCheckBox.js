import React from 'react'
import { CheckMarkIcon } from '../../assets/icons'

export default function DefaultCheckBox({ onChecked, isChecked, size }) {
  return (
    <div onClick={()=>onChecked()} style={{ backgroundColor: isChecked? '#0559FD' : 'transparent', borderRadius: 3, height: `${size}px`, width: `${size}px`, border: `1px solid ${isChecked? '#0559FD' : 'black'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {isChecked && (
      <CheckMarkIcon />
    )}
  </div>
  )
}
