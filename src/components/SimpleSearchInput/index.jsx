import React from 'react'
import { RemoteIcon } from '../../assets/shared/RemoteIcon'
import BookingAutoComplete from '../search/auto_complete_places'

const SimpleSearchInput = ({
  type,
  value,
  noIcon,
  onChange,
  maxLength,
  placeholder,
  isAutoComplete,
  other,
}) => (
  <div
    className={`xl:min-w-[280px] lg:w-full md:w-full sm:w-full flex items-center justify-between px-2 rounded-lg border border-lightgrey ${
      isAutoComplete ? 'h-[3rem] ' : 'h-[3rem]'
    } relative `}
  >
    {!noIcon && (
      <RemoteIcon
        name={'Search-icon'}
        localStyles={'h-7 w-7 border border-[#fff]'}
      />
    )}
    {isAutoComplete ? (
      <div className='h-full flex-grow -mt-[30px] '>
        <BookingAutoComplete
          styles={{
            margin: 0,
            width: '100%',
            textIndent: 0,
            border: 'none',
            borderRadius: '0px',
          }}
          noAbsoulte
          placeholder={placeholder || ' search auto complete'}
        />
      </div>
    ) : (
      <input
        value={value}
        onChange={onChange}
        type={type || 'text'}
        maxLength={maxLength || '44'}
        placeholder={placeholder || 'search...'}
        className='h-full flex-grow placeholder:text-xs outline-none placeholder:text-lightgrey indent-1'
        {...other}
      />
    )}
  </div>
)

export default SimpleSearchInput
