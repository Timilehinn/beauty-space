import Cookies from 'universal-cookie'

const checkForAuthentication = async () => {
  const cookies = new Cookies()
  let error
  let success
  let proccessing_auth = true
  const processAuth = async () => {
    const gottenToken = cookies.get('user_token')
    if (!gottenToken) {
      error = true
      success = false
      proccessing_auth = false
      return
    }
    try {
      const gottenToken = cookies.get('user_token')
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/retrieve-token`,
        {
          method: 'POST',
          body: JSON.stringify({
            token: gottenToken,
          }),
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${gottenToken}`,
          },
        }
      )
      const data = await res.json()
      if (data?.status !== true) {
        error = true
        success = false
        proccessing_auth = false
        return
      }
      error = false
      success = true
      proccessing_auth = false
    } catch (error) {
      error = true
      success = false
      proccessing_auth = false
    }
  }
  await processAuth()
  return { error, success, proccessing_auth }
}

export default checkForAuthentication
