import React from 'react'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'
import clsx from 'clsx'

const LocationSearch = ({
  address,
  setAddress,
  onSelect,
  extraInputStyling,
}) => {
  const handleSelect = async (value) => {
    setAddress(value)
    geocodeByAddress(value)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        onSelect({ lat, lng })
      })
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
      {({ getInputProps, suggestions, getSuggestionItemProps }) => {
        return (
          <main className='relative w-full'>
            <input
              className={clsx('text-sm outline-none ', 'relative')}
              {...getInputProps({
                placeholder: 'Search by location',
                className: `w-[90%] h-12 top-0 outline-none indent-2 rounded-md ${extraInputStyling}`,
              })}
            />

            {suggestions.length > 0 && (
              <div
                className={clsx(
                  'shadow-2fl text-sm outline-none left-0 rounded-lg p-[5px] bg-[white] mt-[20px] w-[90%] z-10 ',
                  'absolute top-[2rem] '
                )}
              >
                {suggestions.map((suggestion, index) => {
                  const className = suggestion.active
                    ? ' p-3 border-b border-[#F0F0F0] last:border-none w-full bg-[#F0F0F0] cursor-pointer '
                    : 'p-3 border-b border-[#F0F0F0] last:border-none w-full bg-white cursor-pointer '

                  return (
                    <div
                      key={index}
                      {...getSuggestionItemProps(suggestion, {
                        className,
                      })}
                    >
                      <p className='w-[100%]'>{suggestion.description}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        )
      }}
    </PlacesAutocomplete>
  )
}

export default LocationSearch
