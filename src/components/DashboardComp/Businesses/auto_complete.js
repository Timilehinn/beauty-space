import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'

import {
  getCoordinatesLatLng,
  setCoordinatesLatLng,
  setFilterViaCoordinates,
  setAddressDetails,
} from '../../../redux/filterOptions'
import classNames from 'classnames'
import { getServiceData } from '../../../redux/createWorkspaceSlice'

const ServicesAutocompletePlaces = ({
  placeholder,
  noAbsoulte,
  setAddressPicked,
  noBorder,
}) => {
  const dispatch = useDispatch()

  const coordinates = useSelector(getCoordinatesLatLng)
  const [address, setAddress] = useState('')
  const [coordinatesState, setCoordinates] = useState({
    lat: null,
    lng: null,
  })
  const workspaceText = useSelector(getServiceData)

  const handleSelect = async (value, id, fullPlaceDetails) => {
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
    setAddressPicked(e)
  }

  const searchOptions = {
    componentRestrictions: { country: ['ng'] },
  }

  useEffect(() => {
    if (!workspaceText) return
    setAddress(workspaceText?.address)
  }, [workspaceText])

  return (
    <PlacesAutocomplete
      value={address}
      onChange={(e) => handleChange(e)}
      onSelect={handleSelect}
      searchOptions={searchOptions}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
        return (
          <div>
            <input
              className={classNames(
                'text-sm outline-none focus:border-primary',
                noAbsoulte ? 'relative' : 'absolute'
              )}
              {...getInputProps({
                placeholder: placeholder,
                className: `w-full h-12 top-0 outline-none ${
                  noBorder ? '' : 'border border-gray focus:border-lightgrey'
                } indent-2 rounded-md`,
              })}
            />

            {suggestions.length > 0 && (
              <div
                className={classNames(
                  'shadow-2fl text-sm outline-none left-0 w-full z-10 ',
                  noAbsoulte ? 'absolute top-[4rem] ' : 'absolute top-[2rem] '
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
                      })}
                    >
                      <p className='lg:w-[100%] lg:z-20 md:w-[500px] md:-z-20 sm:z-20 sm:w-[300px] '>
                        {suggestion.description}
                      </p>
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

export default ServicesAutocompletePlaces
