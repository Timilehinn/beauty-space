import React, { useState } from 'react'
import ImageGallery from 'react-image-gallery'
import { MdClose } from 'react-icons/md'

import 'react-image-gallery/styles/css/image-gallery.css'
import './addOnsStyle.scss'
import Image from 'next/image'

const Gallery = ({ imageArray, handleToggle }) => {
  const [currentSlide, setCurrentSlide] = useState(1)

  const images = imageArray.map((image) => {
    return { original: image, thumbnail: image }
  })

  return (
    <main className='w-full h-screen z-20 bg-black fixed left-0 top-0 flex flex-col justify-start items-center gap-5 xl:p-10 lg:p-10 md:p-10 sm:p-5'>
      <header className='flex justify-between items-center text-white w-full lg:w-[50%]'>
        <span className=''>
          {currentSlide}/{imageArray?.length}
        </span>

        <button
          type='button'
          onClick={handleToggle}
          className='text-2xl cursor-pointer'
        >
          <MdClose />
        </button>
      </header>

      <div className='flex justify-between items-center gap-4 w-full xxl:h-[50rem] lg:w-[50%] xl:h-[45rem] lg:h-[40rem] md:h-[45rem] sm:h-[30rem]'>
        <ImageGallery
          items={images}
          renderItem={(item) => (
            <Image
              src={item.original}
              alt='img'
              width={400}
              height={400}
              className='rounded-md object-cover w-auto m-auto  max-h-full '
            />
          )}
        />
      </div>
    </main>
  )
}

export default Gallery
