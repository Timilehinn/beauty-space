'use client'

import React, { useState } from 'react'

import Pagination from '../../pagination'
import { CaretDownFilled } from '@ant-design/icons'

export default function ServicesPaginationComp({ pageCount, handlePageClick }) {
  const [pageDropdown, setPageDropdown] = useState(false)

  return (
    <div className='flex justify-end items-center gap-5 ml-auto xl:px-6 md:px-6 sm:px-5 '>
      <div className='flex justify-start items-center gap-2'>
        <span className='text-lightgrey'>Rows per page</span>

        <button
          onClick={() => setPageDropdown(!pageDropdown)}
          className='bg-transparent flex justify-start items-center gap-2'
        >
          <span className='text-black'> {pageCount} </span>
          <CaretDownFilled />
        </button>
      </div>

      <Pagination
        pageCount={pageCount}
        handlePageClick={handlePageClick}
        pageRangeDisplay={5}
      />
    </div>
  )
}
