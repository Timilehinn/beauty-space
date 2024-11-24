import React, { useEffect, useState } from 'react'

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    cord: {
      lat: "",
      lng: ""
    }
  })

  const onSuccess = (location) => {
    setLocation({
      loaded: true,
      cord: {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      }
    })
  }

  const onError = (error) => {
    setLocation({
      loaded: false,
      error,
    })
  }

  useEffect(() => {
   if (!navigator.geolocation) {
     onError({
        code: 0,
        message: "Geolocation is not supported"
     })
    } 
    
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  }, [])
  return location
}

export default useGeoLocation
