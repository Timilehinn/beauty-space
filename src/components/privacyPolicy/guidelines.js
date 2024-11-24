'use client'

import React, { useEffect } from 'react'
import { createClient } from 'contentful'
import { useDispatch, useSelector } from 'react-redux'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import {
  getPrivacyPolicyContent,
  getSelectedTabs,
  setPrivacyPolicyContent,
  setCancelationContent,
} from '../../redux/indexData'
import CancelationPolicy from './cancelation'
import LegalComp from './Legal'
import Assitance from './Assitance'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

export default function Guidelines() {
  const dispatch = useDispatch()
  const content = useSelector(getPrivacyPolicyContent)
  const selectedTab = useSelector(getSelectedTabs)

  /**
   * The function `fetchPrivacyPolicy` asynchronously fetches privacy policy content from a client and
   * dispatches it to setPrivacyPolicyContent.
   */
  const fetchPrivacyPolicy = async () => {
    try {
      const res = await client.getEntries({
        content_type: 'privacyAndPolicy',
      })
      dispatch(setPrivacyPolicyContent(res.items))
    } catch (error) {}
  }

  /**
   * The function `fetchCancelationPolicy` fetches cancelation policy content from a client and sets it
   * using `dispatch`.
   */
  const fetchCancelationPolicy = async () => {
    try {
      const res = await client.getEntries({
        content_type: 'cancelationPolicy',
      })
      dispatch(setCancelationContent(res.items))
    } catch (error) {}
  }

  useEffect(() => {
    fetchCancelationPolicy()
    fetchPrivacyPolicy()
  }, [])

  /**
   * The `formatDate` function takes a date object as input and returns a formatted date string in the
   * format "Month Day, Year".
   * @param date - The `formatDate` function takes a `date` parameter, which is expected to be a
   * JavaScript Date object representing a specific date and time.
   * @returns The `formatDate` function is returning a formatted date string based on the input `date`.
   * The date is formatted in the format "Month Day, Year" (e.g., "January 1, 2022") using the
   * `toLocaleDateString` method with the specified options for year, month, and day.
   */
  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleDateString('en-US', options)
  }

  // if (!content) return <span className=''>Loading...</span>

  return (
    <main className='flex flex-col justify-start items-start gap-5'>
      {selectedTab === 'User Guidelines' && (
        <article>
          <div className='flex flex-col justify-start items-start gap-2'>
            <h1 className='text-3xl font-bold 3xl:text-4xl'>
              {content?.[0]?.fields?.title}{' '}
            </h1>
            <span className='text-base'>
              Effective date: {formatDate(new Date())}{' '}
            </span>
          </div>
          <hr className='w-full border-lightgrey' />

          <div className='py-5 flex flex-col justify-start items-start gap-2 text-base 3xl:text-3xl '>
            {documentToReactComponents(content?.[0]?.fields?.policyContent)}
          </div>
        </article>
      )}

      {selectedTab === 'Cancelation' && <CancelationPolicy />}
      {selectedTab === 'Legal' && <LegalComp />}
      {selectedTab === 'Assistance' && <Assitance />}
    </main>
  )
}
