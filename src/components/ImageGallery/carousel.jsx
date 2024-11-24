import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

export default function Carousel({
  children, // Accept any content (sections, divs, etc.) as children
  autoSlide = false,
  autoSlideInterval = 3000,
  showNavBtn = true,
  extraStyle,
  extraWrapper,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  /**
   * These functions handle navigation between items in a carousel component by updating the current
   * index based on the previous index.
   */
  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? children?.length - 1 : prevIndex - 1
    )
  }

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === children?.length - 1 ? 0 : prevIndex + 1
    )
  }

  /* The `useEffect` hook in the provided code snippet is responsible for managing the automatic sliding
functionality of the carousel component. Here's a breakdown of what it does: */
  useEffect(() => {
    if (!autoSlide) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
  }, [])

  /**
   * The handleDotClick function sets the current index to the provided index value.
   */
  const handleDotClick = (index) => {
    setCurrentIndex(index)
  }

  return (
    <main
      className={clsx(
        `overflow-hidden relative flex flex-col justify-center items-center gap-5 3xl:gap-10 ${extraWrapper} `
      )}
    >
      <div
        className={clsx(
          `flex transition-transform ease-out duration-500 ${extraStyle}`
        )}
        style={{
          transform: `translateX(-${(currentIndex % children?.length) * 100}%)`,
        }}
      >
        {children?.map((child, index) => (
          <div key={index} className='w-full flex-shrink-0'>
            {child}
          </div>
        ))}
      </div>

      <div
        className={clsx(
          'absolute inset-0  p-4',
          showNavBtn
            ? 'flex items-center justify-between lg:flex md:flex sm:hidden'
            : 'hidden'
        )}
      >
        <button
          onClick={prev}
          className='p-1 rounded-full shadow-1fl bg-dashgrey text-lightblack hover:bg-white flex justify-center items-center 3xl:w-20 3xl:h-20'
        >
          <BiChevronLeft className='3xl:text-4xl text-2xl' />
        </button>
        <button
          onClick={next}
          className='p-1 rounded-full shadow-1fl bg-dashgrey text-lightblack hover:bg-white flex justify-center items-center  3xl:w-20 3xl:h-20'
        >
          <BiChevronRight className='3xl:text-4xl text-2xl' />
        </button>
      </div>

      {/* Dot Navigation */}
      <div
        className={clsx(
          'absolute bottom-4 left-0 right-0 flex justify-center gap-2 '
        )}
      >
        {children?.map((_, i) => (
          <div
            key={i}
            className={clsx(
              'w-3 h-3 rounded-full cursor-pointer',
              currentIndex % children?.length === i
                ? 'bg-purple'
                : 'bg-lightgrey'
            )}
            onClick={() => handleDotClick(i)}
          />
        ))}
      </div>
    </main>
  )
}
