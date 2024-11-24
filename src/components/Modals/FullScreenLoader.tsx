import React from 'react'
import LoadingIndicator from '../LoadingIndicator'

type FullScreenLoaderProps = {
  modal: boolean
  showModal: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FullScreenLoader(props: FullScreenLoaderProps) {
  const { modal, showModal } = props

  return (
    <div
      style={{ display: modal ? 'flex' : 'none' }}
      className='fixed w-full h-screen top-0 left-0 bg-lightblack z-20 flex lg:justify-center lg:items-center md:justify-center md:items-center sm:justify-start sm:items-start '
    >
      <LoadingIndicator />
    </div>
  )
}
