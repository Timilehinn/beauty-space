import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import clsx from 'clsx'

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'
import {
  getCoordinatesLatLng,
  setCoordinatesLatLng,
  setFilterViaCoordinates,
} from '../../redux/filterOptions'

const AutoCompletePlaces = ({ placeholder, noAbsolute, customStyles }) => {
  const dispatch = useDispatch()
  const [address, setAddress] = useState('')
  const [coordinatesState, setCoordinates] = useState({
    lat: null,
    lng: null,
  })

  const handleSelect = async (value) => {
    const result = await geocodeByAddress(value)
    const ll = await getLatLng(result[0])
    setAddress(value)
    setCoordinates(ll)
    dispatch(setFilterViaCoordinates(true))
    dispatch(setCoordinatesLatLng(ll))
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
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
        return (
          <div className='z-20'>
            <input
              className={clsx(
                'text-base outline-none placeholder:text-sm lg:h-[30px] md:h-[40px] sm:h-[40px] ',
                noAbsolute ? 'relative' : 'absolute',
                customStyles?.input // Apply custom input styles
              )}
              {...getInputProps({ placeholder })}
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

                  return (
                    <div
                      key={index}
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        // style,
                      })}
                    >
                      <div className={clsx('w-full z-20 ')}>
                        {suggestion.description}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      }}
    </PlacesAutocomplete>
  )
}

export default AutoCompletePlaces
