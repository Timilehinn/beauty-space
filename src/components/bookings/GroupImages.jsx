'use client'

import React, { useState } from 'react'
import Image from 'next/image'

import GallaryCaraosel from '../../helper/Gallary'

export default function GroupImages({ urls, spaceName }) {
  const [showGroupImages, setShowGroupImages] = useState(false)
  const [startFrom, setStartFrom] = useState(0)

  const handleServiceGroupImages = () => {
    setShowGroupImages(!showGroupImages)
    setStartFrom(0)
  }

  const images = urls.map((url) => url.url)
  return (
    <>
      <div className='flex justify-start items-center gap-5 flex-wrap'>
        {urls.map((asset_url, i) => (
          <Image
            key={i}
            onClick={() => handleServiceGroupImages()}
            src={asset_url.url}
            alt='img'
            width={60}
            height={60}
            className='h-16 w-16 rounded-md '
          />
        ))}
      </div>

      {showGroupImages && (
        <GallaryCaraosel
          imageArray={images}
          handleToggle={handleServiceGroupImages}
          workspaceName={spaceName}
          startFrom={startFrom}
        />
      )}
    </>
  )
}
