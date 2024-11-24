import React from 'react'
import useImageGallery from './useImageGallery'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import { MdClose } from 'react-icons/md'
import classNames from 'classnames'

export default function ImageGallery({ images, handleToggle, workspaceName }) {
  const { currentImage, nextImage, prevImage, selectImage, totalImages } =
    useImageGallery(images)

  return (
    <main className='fixed top-0 left-0 z-20 bg-black w-full h-screen flex flex-col justify-center items-center gap-5'>
      <header className='flex justify-between items-center xl:w-[60%] lg:w-[70%] md:w-full sm:w-full '>
        {/* <h1 className='text-white text-base'>{workspaceName} images</h1> */}
        <span className='text-white text-base'>
          {currentImage + 1}/{totalImages}
        </span>
        <button
          type='button'
          onClick={handleToggle}
          className='text-2xl text-white'
        >
          <MdClose />
        </button>
      </header>

      <div className='flex justify-between items-center gap-4 xxl:h-[45rem] xl:w-[60%] xl:h-[40rem] lg:h-[35rem] '>
        <button
          onClick={prevImage}
          className='text-4xl bg-white w-14 h-14 rounded-full p-1 text-black cursor-pointer flex justify-center items-center'
        >
          <BiChevronLeft />
        </button>
        <img
          src={images[currentImage]}
          alt={`Image ${currentImage + 1}`}
          className='rounded-md object-cover max-h-full '
        />
        <button
          onClick={nextImage}
          className='text-4xl bg-white w-14 h-14 rounded-full p-1 text-black cursor-pointer flex justify-center items-center'
        >
          <BiChevronRight />
        </button>
      </div>

      <div className='flex justify-start items-center gap-5 flex-wrap'>
        {/* {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => selectImage(index)}
            className={classNames(
              'w-16 h-16 rounded-md object-cover object-center cursor-pointer ',
              index === currentImage ? 'border-2 border-white rounded-md' : ''
            )}
          />
        ))} */}

        {images.map((image, index) => {
          return (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => selectImage(index)}
              className={`w-16 h-16 rounded-md object-cover object-center cursor-pointer ${
                currentImage + 1 === index + 1 ? 'p-1 bg-white ' : ''
              }`}
            />
          )
        })}
      </div>
    </main>
  )
}
