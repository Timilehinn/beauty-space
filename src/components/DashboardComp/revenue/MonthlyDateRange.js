export default function MonthlyDateRange({
  handleEndDateChange,
  handleStartDateChange,
  startDate,
  endDate,
}) {
  return (
    <main className='grid grid-cols-1 gap-5 content-center w-full'>
      <label className='flex flex-col justify-start items-start gap-1 text-sm w-full font-semibold'>
        Start Date:
        <input
          type='date'
          value={startDate}
          onChange={handleStartDateChange}
          className='border border-lightgrey outline-none rounded-md h-10 w-full px-2 font-normal'
        />
      </label>

      <label className='flex flex-col justify-start items-start gap-1 text-sm w-full font-semibold'>
        End Date:
        <input
          type='date'
          value={endDate}
          onChange={handleEndDateChange}
          className='border border-lightgrey outline-none rounded-md h-10 w-full px-2 font-normal'
        />
      </label>
    </main>
  )
}
