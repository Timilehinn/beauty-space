'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import { getCancelationContent } from '../../redux/indexData'

const CancelationPolicy = () => {
  const content = useSelector(getCancelationContent)

  return (
    <article>
      <h1 className='text-3xl font-bold 3xl:text-4xl'>
        {content?.[2]?.fields?.title}{' '}
      </h1>
      <hr className='w-full border-lightgrey' />

      <article className='py-5 flex flex-col justify-start items-start gap-2 text-base 3xl:text-3xl '>
        {documentToReactComponents(content?.[2]?.fields?.policyContent)}
      </article>
    </article>
  )
}

export default CancelationPolicy