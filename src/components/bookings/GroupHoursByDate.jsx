export function groupHoursByDate(arr, count) {
  const grouped = {}

  arr.forEach((obj) => {
    const _date = new Date(obj.booking_date)
    const date = new Date(_date)
    // date.setUTCHours(date.getUTCHours() + 12);

    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours() - 2
    const ampm = hour >= 12 ? 'pm' : 'am'
    const formattedStartHour = hour % 12 === 0 ? 12 : hour % 12
    const formattedEndHour =
      formattedStartHour === 12 ? 1 : formattedStartHour + 1
    const startRange = `${formattedStartHour} ${ampm}`
    const endRange = `${formattedEndHour} ${ampm}`
    const range = `${startRange} - ${endRange}`
    const key = `${year}-${month}-${day}`
    if (!grouped[key]) {
      grouped[key] = []
    }
    const existingObj = grouped[key].find((obj) => obj.range === range)
    if (existingObj) {
      existingObj.count++
    } else {
      grouped[key].push({ range, count: 1, isFilled: false })
    }
  })
  Object.values(grouped).forEach((dateArr) => {
    dateArr.forEach((obj) => {
      obj.isFilled = obj.count >= count
    })
  })
  return grouped
}
