import React from 'react'

const Render = ({ html }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className='flex flex-col gap-5'
    />
  )
}

export default Render
