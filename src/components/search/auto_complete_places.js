import React, { useState } from 'react'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'

import {
  setAddressDetails,
  setCoordinatesLatLng,
  setFilterViaCoordinates,
} from '../../redux/filterOptions'

const BookingAutoComplete = ({
  styles,
  noBorder,
  noAbsolute,
  placeholder,
  contentBoxStyle,
  setAddressPicked,
  extraInputStyling,
}) => {
  const dispatch = useDispatch()

  const [address, setAddress] = useState('')
  const [coordinatesState, setCoordinates] = useState({
    lat: null,
    lng: null,
  })

  const handleSelect = async (value) => {
    const result = await geocodeByAddress(value)
    const ll = await getLatLng(result[0])

    setAddressPicked(value)
    setAddress(value)
    setCoordinates(ll)
    dispatch(setFilterViaCoordinates(true))
    dispatch(setCoordinatesLatLng(ll))
    dispatch(setAddressDetails(value))
  }

  const handleChange = (e) => {
    setAddress(e)
  }

  const searchOptions = {
    componentRestrictions: { country: ['ng'] },
  }

  return (
    <PlacesAutocomplete
      value={address}
      onChange={(e) => handleChange(e)}
      onSelect={handleSelect}
      searchOptions={searchOptions}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => (
        <main className='relative w-full'>
          <input
            className={clsx(
              'text-sm outline-none',
              noAbsolute ? 'relative' : 'absolute'
            )}
            style={{
              ...styles,
            }}
            {...getInputProps({
              placeholder: placeholder,
              className: `w-full h-12 top-0 outline-none border border-lightgrey indent-4 outline-none focus:border-primary ${
                extraInputStyling ? 'rounded-full' : 'rounded-md'
              } `,
            })}
          />

          {suggestions.length > 0 && (
            <div
              className={clsx(
                'shadow-2fl text-sm outline-none left-0 w-full z-10 ',
                noAbsolute ? 'absolute top-[4rem] ' : 'absolute top-[2rem] '
              )}
            >
              {suggestions.map((suggestion, index) => {
                const className = suggestion.active
                  ? ' p-3 border-b border-lightgrey last:border-none w-full bg-lightgrey cursor-pointer '
                  : 'p-3 border-b border-lightgrey last:border-none w-full bg-white cursor-pointer '

                const suggestionProps = getSuggestionItemProps(suggestion, {
                  className,
                  ...contentBoxStyle,
                })

                return (
                  <div
                    key={index}
                    className={suggestionProps.className}
                    onMouseEnter={suggestionProps.onMouseEnter}
                    onMouseLeave={suggestionProps.onMouseLeave}
                    onMouseDown={suggestionProps.onMouseDown}
                    onMouseUp={suggestionProps.onMouseUp}
                    onTouchStart={suggestionProps.onTouchStart}
                    onTouchEnd={suggestionProps.onTouchEnd}
                    onClick={suggestionProps.onClick}
                    role={suggestionProps.role}
                    id={suggestionProps.id}
                    aria-selected={suggestionProps['aria-selected']}
                  >
                    <p className='lg:w-[100%] z-20 md:w-[500px] sm:w-[300px] '>
                      {suggestion.description}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      )}
    </PlacesAutocomplete>
  )
}

export default BookingAutoComplete
