export function requestResponse(res, func) {
  if (func) {
    func()
  }

  // Extract all error messages
  const errorArray = Object.values(res.errors || {}).flat()

  // If there is only one error, pass it as a single string, else join them into a single message.
  const errorMsg =
    errorArray.length > 1
      ? errorArray
      : errorArray.length === 1
      ? errorArray[0]
      : 'An error occurred, please try again.'

  return { error: errorMsg, status: res.status, data: res.data }
}
