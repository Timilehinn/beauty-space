import React from 'react'

export default function GenerateYears({
  isOpen,
  selectedYears,
  setSelectedYears,
}) {
  const currentYear = new Date().getFullYear()

  /* This line of code is creating an array of years starting from 2023 up to the current year. */
  const years = Array.from({ length: currentYear - 2022 }, (_, i) => 2023 + i)

  /**
   * The function `handleYearChange` updates the selected years array based on user input and fetches
   * yearly reports for a specific business ID.
   */
  const handleYearChange = (year) => {
    const updatedYears = selectedYears.includes(year)
      ? selectedYears.filter((y) => y !== year)
      : [...selectedYears, year]
    setSelectedYears(updatedYears)
  }

  return (
    isOpen && (
      <section className='overflow-y-auto h-36 flex flex-col justify-start items-start gap-2 w-full'>
        <span className='text-sm font-semibold'>Select years:</span>

        <div className='flex flex-col justify-start items-start gap-2 w-full'>
          {years.map((year) => (
            <div key={year} className='flex justify-start items-center gap-2'>
              <input
                type='checkbox'
                id={`year-${year}`}
                value={year}
                checked={selectedYears.includes(year)}
                onChange={() => handleYearChange(year)}
              />
              <label htmlFor={`year-${year}`} className='text-sm'>
                {year}
              </label>
            </div>
          ))}
        </div>
      </section>
    )
  )
}
