import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { FaArrowRight } from 'react-icons/fa'

import { setSignUpWorkspace } from '../../../redux/authRelated'
import { getLoginContent } from '../../../redux/indexData'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

export default function AccountType({ next }) {
  const dispatch = useDispatch()
  const [selected, setSelected] = useState('User')
  const loginContent = useSelector(getLoginContent)

  useEffect(() => {
    const savedAccountType = localStorage.getItem('accountType')
    if (savedAccountType) {
      setSelected(savedAccountType)
      dispatch(setSignUpWorkspace(savedAccountType))
    }
  }, [dispatch])

  const selectedTab = (index) => {
    setSelected(index)
    localStorage.setItem('accountType', index)
    dispatch(setSignUpWorkspace(index))
  }

  const handleProceed = (e) => {
    e.preventDefault()
    next(selected)
  }

  return (
    <main className='bg-dashgrey w-full h-screen flex flex-col justify-center items-center px-5 '>
      <div className='bg-white p-5 rounded-xl shadow-2fl flex flex-col justify-start items-start gap-5 w-full h-auto m-auto xl:w-[40%] special:w-[50%] lg:w-[50%] '>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-xl'>BeautySpace</h1>

          <button
            type='button'
            onClick={handleProceed}
            className='h-10 w-16 px-5 text-white bg-purple rounded-3xl flex justify-center items-center '
          >
            <FaArrowRight />
          </button>
        </div>

        <hr className='w-full border-b border-lightgrey' />
        <div className='flex flex-col gap-5 w-full'>
          <h1 className='text-xl'>How will you use BeautySpace?</h1>

          <div className='flex justify-between items-center gap-5 w-full'>
            {loginContent?.accountTypeArray.map((item) => (
              <button
                key={item.sys.id}
                type='button'
                className={clsx(
                  'border border-lightgrey h-14 px-5 text-black rounded-md w-full hover:text-white',
                  item.fields.accountTypeTitle === selected
                    ? 'bg-lightblack text-white'
                    : 'bg-white hover:bg-lightblack'
                )}
                onClick={() => selectedTab(item.fields.accountTypeTitle)}
              >
                {item.fields.title}
              </button>
            ))}
          </div>

          {loginContent?.accountTypeArray.map(
            (item) =>
              item.fields.accountTypeTitle === selected && (
                <div
                  key={item.sys.id}
                  className='bg-white shadow-2fl rounded-md px-8 py-5 flex flex-col justify-start items-start gap-3'
                >
                  <p className='font-semibold'>{item.fields.subTitle}</p>
                  {documentToReactComponents(item.fields.description)}
                </div>
              )
          )}
        </div>
      </div>
    </main>
  )
}
