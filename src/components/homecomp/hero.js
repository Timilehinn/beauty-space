'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/navigation'
import { createClient } from 'contentful'
import Image from 'next/image'
import Typed from 'typed.js'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import AutoCompletePlaces from './auto_complete_places'
import {
  getCoordinatesLatLng,
  getSearchServices,
  setFilterViaCoordinates,
  setSearchServices,
} from '../../redux/filterOptions'
import { getIndexPageData, setIndexPageData } from '../../redux/indexData'
import Carousel from '../ImageGallery/carousel'

import './hero.scss'

gsap.registerPlugin(useGSAP)

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

const Hero = () => {
  const textRef = useRef(null)
  const heroContainer = useRef()
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useDispatch()

  const coordinates = useSelector(getCoordinatesLatLng)
  const selectedServices = useSelector(getSearchServices)

  const content = useSelector(getIndexPageData)

  const [categories, setCategories] = useState([])
  const [servicesResult, setServicesResult] = useState([])

  const [showSuggestions, setShowSuggestions] = useState(false)

  /* The above code is using the `useEffect` hook in React to run some animations when the component
mounts. It is using the GSAP library to animate elements with class names `.heroForm` and
`.heroSlide`. */
  useGSAP(
    () => {
      gsap.fromTo(
        '.heroCont',
        {
          x: -100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.inOut',
          duration: 1.5,
        }
      )
    },
    { scope: heroContainer }
  )

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'home',
        })
        dispatch(setIndexPageData(res.items))
      } catch (error) {}
    }

    fetchHome()
  }, [])

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/categories`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        const data = await response.json()

        setCategories(data?.data)
      } catch (error) {}
    }

    getCategories()
  }, [])

  useEffect(() => {
    const filteredCategories = categories?.filter(
      (category) =>
        category?.name !== 'Apartment' && category?.name !== 'Private Space'
    )

    // Check if filteredCategories is defined and not empty
    if (filteredCategories && filteredCategories.length > 0) {
      const categoryNames = filteredCategories.map((category) => category?.name)

      const options = {
        strings: categoryNames,
        typeSpeed: 100,
        backSpeed: 40,
        loop: true,
        showCursor: false,
      }

      const typed = new Typed(textRef?.current, options)

      return () => {
        typed.destroy()
      }
    }
  }, [categories])

  /**
   * The function `handleInputChange` takes an event object as input, extracts the value from the target
   * element, and dispatches an action with the extracted value to set search services.
   * @param e - The `e` parameter in the `handleInputChange` function typically represents the event
   * object triggered by the input change event. This object contains information about the event, such
   * as the target element (in this case, the input field that triggered the event) and the value of the
   * input field.
   */
  const handleInputChange = (e) => {
    const input = e.target.value
    dispatch(setSearchServices(input))
  }

  /**
   * The function `filterCategories` filters an array of categories based on a case-insensitive match
   * with the input string.
   * @param input - The `input` parameter in the `filterCategories` function is a string that represents
   * the search term or keyword that is used to filter the categories.
   * @returns The `filterCategories` function is returning an array of categories that match the input
   * provided. It filters the `categories` array based on whether the `name` of each category includes
   * the `input` string (case-insensitive).
   */
  const filterCategories = (input) => {
    // Ensure input is a string
    const searchString = String(input)

    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchString.toLowerCase())
    )
  }

  /**
   * The `handleSuggestions` function filters categories based on input and sets the filtered results as
   * services result.
   * @param input - The `input` parameter in the `handleSuggestions` function likely represents user
   * input or a search query that is used to filter categories and generate suggestions.
   */
  const handleSuggestions = (input) => {
    const filteredResults = filterCategories(input)
    setServicesResult(filteredResults)
  }

  /**
   * The function `handleSelectedSuggestion` sets the selected suggestion in the state, clears the
   * suggestions, and logs the selected suggestion.
   * @param suggestion - The `handleSelectedSuggestion` function takes a `suggestion` parameter, which
   * is the selected suggestion that the user clicked on. This function then dispatches an action to set
   * the selected suggestion in the state, clears the suggestions list, and logs the selected suggestion
   * to the console.
   */
  // const handleSelectedSuggestion = (suggestion) => {
  //   dispatch(setSearchServices(suggestion)) // adding the selected suggestion to the state
  //   setServicesResult([]) // Clear suggestions when a suggestion is clicked

  // }

  const handleSelectedSuggestion = (suggestion) => {
    // Check if the suggestion is already selected, if so, remove it, otherwise add it
    if (selectedServices.includes(suggestion)) {
      dispatch(
        setSearchServices(
          selectedServices.filter((service) => service !== suggestion)
        )
      )
    } else {
      dispatch(setSearchServices([...selectedServices, suggestion]))
    }
  }

  /**
   * The handleSubmit function constructs a URL with query parameters based on selected services and
   * coordinates, then navigates to that URL.
   * @param e - The `e` parameter in the `handleSubmit` function is an event object that is typically
   * passed to event handler functions in JavaScript. In this case, it is being used to prevent the
   * default behavior of a form submission using `e.preventDefault()`. This is a common practice to
   * prevent the page from reloading
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(setFilterViaCoordinates(true))

    // Initialize the base URL
    let url = '/booking?'

    // Construct the query parameters based on presence
    if (selectedServices.length > 0) {
      url += `category=${selectedServices.join(',')}`
    }

    if (coordinates?.lat && coordinates?.lng) {
      if (selectedServices) {
        url += `&`
      }
      url += `lat=${coordinates.lat}&lng=${coordinates.lng}`
    }

    router.push(url)
  }

  return (
    <main
      ref={heroContainer}
      className='flex flex-col justify-start items-start gap-10 relative z-10 pt-[10rem] overflow-hidden 3xl:w-[65%] mx-auto w-full xxl:px-[10rem] xl:w-full xl:px-[10rem] lg:w-full lg:px-16 md:px-10 sm:px-5 '
    >
      <div className='heroCont xxl:w-[80%] special:w-[80%] xl:w-[80%] lg:w-[75%] md:w-full sm:w-full flex flex-col justify-start items-start gap-10 3xl:gap-16'>
        <div className='flex flex-col justify-start items-start gap-5 w-full 3xl:gap-10'>
          <h1 className='3xl:text-[8rem] xxl:text-8xl xl:text-7xl lg:text-6xl md:text-6xl sm:text-5xl font-medium '>
            {content?.[0]?.fields?.title}
          </h1>
          <div
            ref={textRef}
            className='h-10 w-[300px] 3xl:w-[450px] 3xl:text-6xl xxl:text-5xl lg:text-4xl md:text-3xl sm:text-3xl font-medium text-purple'
          ></div>{' '}
        </div>

        <form
          onSubmit={handleSubmit}
          className='flex xl:flex-row xl:justify-start xl:items-center xl:gap-5 lg:flex-row lg:justify-start lg:items-center md:flex-col
          md:justify-center md:items-center md:gap-5 sm:flex-col sm:justify-center sm:items-center sm:gap-5 w-full '
          style={{ zIndex: 3000 }}
        >
          <section
            className='xxl:w-[85%] xl:w-[85%] xl:rounded-full lg:rounded-full lg:w-[85%] lg:flex lg:flex-row lg:justify-between lg:gap-4 lg:divide-x md:flex md:flex-col md:justify-start
            md:items-start md:gap-5 md:rounded-md sm:flex sm:flex-col sm:justify-start sm:gap-4 sm:w-full divide-lightgrey border border-lightblack rounded-md px-3 py-2'
          >
            <div className='flex flex-col gap-1 relative xxl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-full sm:w-full px-2 '>
              <label
                htmlFor='servives'
                className='font-semibold text-sm 3xl:text-xl'
              >
                {t('Services')}
              </label>

              <input
                type='text'
                value={selectedServices}
                onChange={handleInputChange}
                onFocus={() => {
                  setShowSuggestions(true)
                  handleSuggestions(selectedServices)
                }}
                onBlur={() => setShowSuggestions(false)}
                placeholder='Search Services'
                className='w-full outline-none 3xl:h-14 xl:h-[30px] lg:h-[30px] md:h-[40px] sm:h-[40px] '
              />

              {showSuggestions && servicesResult.length > 0 && (
                <div className='xl:top-[6rem] md:top-[5rem] sm:top-[5rem] bg-white p-4 rounded-xl shadow-2fl absolute left-0 z-10 w-full flex flex-col justify-start items-start gap-2'>
                  {servicesResult
                    .filter(
                      (category) =>
                        category.name !== 'Apartment' &&
                        category.name !== 'Private Space'
                    )
                    .map((category) => (
                      <button
                        key={category.name}
                        type='button'
                        onMouseDown={(e) => {
                          // Prevent the input from losing focus when clicking on the suggestion button
                          e.preventDefault()
                          handleSelectedSuggestion(category.name)
                        }}
                        className='hover:bg-dashgrey hover:text-white bg-dashgrey text-black p-2 rounded-md cursor-pointer w-full flex justify-start items-start 3xl:text-2xl'
                      >
                        {category.name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className='flex flex-col gap-1 relative xxl:w-[50%] xl:w-[50%] lg:w-[50%] md:w-full sm:w-full px-2  '>
              <label
                htmlFor='location'
                className='font-semibold text-sm 3xl:text-xl'
              >
                {t('Location')}
              </label>

              <AutoCompletePlaces
                placeholder={'Search location'}
                noAbsolute={'relative'}
                customStyles={{
                  input: 'w-full 3xl:h-14 ',
                }}
              />
            </div>
          </section>

          <button
            type='submit'
            className='bg-black text-white px-8 h-16 rounded-full lg:w-auto md:w-full sm:w-full '
          >
            {t('Search')}
          </button>
        </form>
      </div>

      <div className='heroCont -z-10'>
        <Carousel autoSlide={true} autoSlideInterval={5000} showNavBtn={false}>
          {content?.[0]?.fields?.slides.map((slide, index) => {
            return (
              <div key={index} className='max-w-full relative'>
                <Image
                  src={slide?.fields?.file?.url}
                  alt={slide?.fields?.title}
                  width={500}
                  height={500}
                  className=' xl:min-w-full xl:max-w-fit rounded-xl object-cover object-center 3xl:h-[55rem] xxl:h-[40rem] xl:h-[45rem] lg:h-[40rem] md:h-[20rem] md:w-full sm:h-[20rem] sm:w-full '
                />

                <h4 className='z-10 p-5 text-white absolute bottom-10 left-0 3xl:text-3xl xl:text-lg lg:text-lg md:text-xl sm:text-base'>
                  {slide?.fields?.description}
                </h4>
              </div>
            )
          })}
        </Carousel>
      </div>
    </main>
  )
}

export default Hero
