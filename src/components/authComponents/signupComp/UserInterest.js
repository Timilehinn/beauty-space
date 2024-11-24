'use client'

import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { setInterest } from '../../../redux/authRelated'

const beautyOptions = [
  { id: 1, name: 'Barbing' },
  { id: 2, name: 'Spas' },
  { id: 3, name: 'Beauty Studios' },
  { id: 4, name: 'Hair Salons' },
  { id: 5, name: 'Nail Studios' },
]

export default function UserInterest({ next, prev }) {
  const dispatch = useDispatch()
  const [selectedOptions, setSelectedOptions] = useState([])

  useEffect(() => {
    const savedInterests = JSON.parse(localStorage.getItem('interest')) || []
    if (savedInterests.length > 0) {
      setSelectedOptions(savedInterests)
      dispatch(setInterest(savedInterests))
    }
  }, [dispatch])

  /**
   * The handleOptionChange function toggles the selection of an option by adding or removing it from the
   * selected options list.
   * @param name - The `name` parameter in the `handleOptionChange` function likely represents the name
   * of an option that is being toggled or selected. The function toggles the selection state of the
   * option by either adding it to the `selectedOptions` array if it's not already selected, or removing
   * it from
   */
  const handleOptionChange = (name) => {
    setSelectedOptions((prevSelected) => {
      let updatedSelected
      if (prevSelected.includes(name)) {
        updatedSelected = prevSelected.filter(
          (optionName) => optionName !== name
        )
      } else {
        updatedSelected = [...prevSelected, name]
      }
      localStorage.setItem('interest', JSON.stringify(updatedSelected))
      return updatedSelected
    })
  }

  /**
   * The `handleSubmit` function checks if at least one interest is selected, displays an error message
   * if not, and then sets and dispatches the selected interests.
   * @returns The function `handleSubmit` is returning either nothing (undefined) if the condition
   * `selectedOptions.length === 0` is true, or it is returning the result of calling `next` with the
   * object `{ interest: selectedOptions }`.
   */
  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      toast.error('Please select at least one interest')
      return
    }
    dispatch(setInterest(selectedOptions))
    next({ interest: selectedOptions })
  }

  return (
    <main className='h-screen w-full bg-dashgrey flex flex-col justify-center items-center'>
      <div className='bg-white px-5 py-10 rounded-md flex flex-col justify-start items-start gap-10 h-full lg:justify-center lg:m-auto lg:h-auto lg:w-[40%]'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-xl'>BeautySpace</h1>
          <div className='flex gap-5'>
            <button
              type='button'
              onClick={() => prev()}
              className='h-10 w-16 px-5 text-white bg-lightgrey rounded-3xl flex justify-center items-center'
            >
              <FaArrowLeft />
            </button>
            <button
              type='button'
              onClick={handleSubmit}
              className='h-10 w-16 px-5 text-white bg-purple rounded-3xl flex justify-center items-center'
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-5 w-full'>
          <h1 className='font-semibold'>Select Your Interests:</h1>
          <section className='flex justify-start items-start gap-5 flex-wrap w-full'>
            {beautyOptions.map((option) => (
              <button
                key={option.id}
                onMouseDown={() => handleOptionChange(option.name)}
                className={clsx(
                  'h-12 px-5 py-2 rounded-full',
                  selectedOptions.includes(option.name)
                    ? 'bg-purple text-white border-none'
                    : 'border border-lightgrey text-black hover:bg-purple hover:text-white hover:border-none'
                )}
              >
                {option.name}
              </button>
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}
