import React, { useEffect, useRef, useState } from 'react'
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'
import Slider from 'react-slick'
import Link from 'next/link'

import useRandomColor from '../../hooks/randomColor'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-lazy-load-image-component/src/effects/blur.css'

export default function ExploreSpaces({ content }) {
  const colors = useRandomColor()
  const [spaces, setSpaces] = useState([])

  const revealRefs = useRef([])
  revealRefs.current = []

  useEffect(() => {
    const getBookings = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
            },
          }
        )

        const data = await res.json()

        if (data?.status === false) return
        setSpaces(data?.data?.data)
      } catch (error) {}
    }

    getBookings()
  }, [])

  // Function to shuffle an array
  function shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Shuffle the spaces array and select the first 10 items
  const shuffledSpaces = shuffleArray(spaces).slice(0, 10)

  // Create a mapping of category names to colors checking and assigning the same color to the same category
  const categoryColors = {}
  shuffledSpaces.forEach((item, index) => {
    if (!categoryColors[item.category.name]) {
      // Assign a color to the category name if not already assigned
      categoryColors[item.category.name] = colors[index]
    }
  })

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    // slidesToShow: 4,
    // slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true, // enables auto scrolling
    autoplaySpeed: 5000, // time in ms for each scroll (2 seconds)
    arrows: true, // enables navigation arrows
    nextArrow: <SlArrowRight className='text-2xl text-black bg-red-500' />,
    prevArrow: <SlArrowLeft className='text-2xl text-black bg-red-500' />,
    swipeToSlide: true,
    adaptiveHeight: true,
    rtl: true,

    responsive: [
      {
        breakpoint: 2560,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1520,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1264,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <main className='grid grid-cols-1 gap-10 lg:p-10 md:p-10 sm:p-5'>
      <div className='flex flex-col justify-start items-start gap-1'>
        <h1 className='font-medium text-3xl py-2 text-purple '>
          {content?.[0]?.fields?.topCityHeader}
        </h1>
        <p className='text-lg text-lgrey'>
          {content?.[0]?.fields?.topCityHeaderText}
        </p>
      </div>

      <Slider {...settings}>
        {shuffledSpaces.map((item) => (
          <Link
            key={item.id}
            href={`/booking/${item?.slug}?sid=${item?.id}`}
            className='border border-lightgrey shadow-2fl p-2 rounded-xl w-[320px] flex-shrink-0 h-auto flex flex-col items-start justify-start gap-2 ml-auto hover:border-primary '
          >
            <img
              src={item.photos[0].url}
              alt='img'
              className='rounded-xl min-w-full h-[250px]'
            />
            <div className='flex flex-col justify-start items-start gap-3 py-4 w-full'>
              <h1 className='text-xl font-semibold'>{item.name}</h1>
              <span
                className='text-white py-1 px-5 rounded-lg'
                style={{
                  backgroundColor: categoryColors[item.category.name],
                }}
              >
                {item.category.name}
              </span>

              <hr className='w-full border-lightgrey' />
              <div className='flex justify-between items-center w-full '>
                <span className='text-lg font-normal hover:text-black'>
                  ₦ {item.price}
                </span>
                <button
                  type='button'
                  className='capitialize bg-primary text-white py-3 px-5 rounded-lg '
                >
                  Book a service
                </button>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </main>
  )
}
