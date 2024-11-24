export default function generateDatesArray(start, end, format = 'full') {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const dates = []
  let currentDate = startDate

  while (currentDate <= endDate) {
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0') // Zero-padding
    const day = currentDate.getDate().toString().padStart(2, '0') // Zero-padding for day

    if (format === 'full') {
      dates.push(`${year}-${month}-${day}`)
    } else if (format === 'short') {
      dates.push(`${year}-${month}`)
    }
    currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
  }

  return dates
}
