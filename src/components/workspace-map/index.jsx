import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  ScaleControl,
} from 'react-map-gl'

import useGeoLocation from '../../hooks/useGeolocation'
import Switch from '../switch'
import {
  setCoordinatesLatLng,
  setFilterViaCoordinates,
} from '../../redux/filterOptions'
import clsx from 'clsx'

const TOKEN =
  'pk.eyJ1IjoiaWFmb2xheWFuIiwiYSI6ImNsMTBwcGVxajIwc3UzYmtibWppMnRxZTAifQ.7YH7BoXUrg3R8T-NcRX3SA'

const WorkspaceMap = ({
  staticView,
  latValue,
  lngValue,
  space_data,
  givenHeight,
  givenZoom,
  heightProp,
}) => {
  const dispatch = useDispatch()
  const [popupInfo, setPopupInfo] = useState(null)
  const location = useGeoLocation()
  const [latitude, setLatitude] = useState()
  const [longitude, setLongitude] = useState()
  const [workspaces, setWorkspaces] = useState([])

  let { lat, lng } = location.cord
  if (latValue) {
    lat = latValue
  }
  if (lngValue) {
    lng = lngValue
  }

  useEffect(() => {
    setTimeout(() => {
      latitude && TriggerSearch()
    }, 1000)
  }, [latitude])

  useEffect(() => {
    setTimeout(() => {
      longitude && TriggerSearch()
    }, 1000)
  }, [longitude])

  const TriggerSearch = () => {
    let newCordinate = {
      lat: latitude ?? lat,
      lng: longitude ?? lng,
    }
    dispatch(setCoordinatesLatLng(newCordinate))
    dispatch(setFilterViaCoordinates(true))
  }

  /**
   * The function `getWorkspaces` fetches workspace data from an API, processes it, and updates the
   * state with the formatted workspace objects.
   * @returns The `getWorkspaces` function is making an API call to fetch workspace data from a
   * specified URL. It then processes the data received, maps over it to extract specific fields, and
   * creates a new object with selected properties. This new object is then added to the `workspaces`
   * state using the `setWorkspaces` function. If the fetched data has a `status` property set to `
   */
  const getWorkspaces = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
          },
        }
      )
      const data = await res.json()
      if (data?.status === false) {
        return
      }
      const myData = data?.data?.data

      myData.map((item) => {
        const { city, price, state, lat, lng, photos, id } = item
        const newObject = {
          id,
          city,
          price,
          state,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          image: photos[0]?.url ?? null,
        }
        setWorkspaces((prev) => [...prev, newObject])
      })
    } catch (error) {}
  }

  useEffect(() => {
    getWorkspaces()
  }, [])

  const pins = workspaces.map((space, index) => (
    <Marker
      key={`marker-${index}`}
      longitude={space.longitude}
      latitude={space.latitude}
      anchor='top'
    >
      <button onClick={() => setPopupInfo(space)}>
        <Image
          src='/beauty-space-icon.png'
          width={30}
          height={30}
          alt='BeautySpace icon'
        />
      </button>
    </Marker>
  ))

  const geolocateControlRef = useCallback((ref) => {
    if (ref) {
      ref.trigger()
    }
  }, [])

  const MapOnMove = (e) => {
    setLongitude(e.longitude.toFixed(4))
    setLatitude(e.latitude.toFixed(4))
  }

  return (
    <div
      className={clsx(
        'relative overflow-hidden w-full ',
        heightProp ? 'h-[350px]' : ''
      )}
    >
      {location.loaded && (
        <>
          <div className='bg-white w-2/3 md:w-[285px] z-10 mx-auto h-10 rounded-lg absolute top-2 right-0 left-0 flex justify-center items-center'>
            <Switch />
          </div>

          <Map
            initialViewState={{
              latitude: parseFloat(lat).toFixed(4),
              longitude: parseFloat(lng).toFixed(4),
              zoom: givenZoom ?? 15,
              bearing: 0,
              pitch: 0,
            }}
            // {...viewPort}
            mapStyle='mapbox://styles/mapbox/streets-v9'
            onMove={(evt) => MapOnMove(evt.viewState)}
            style={{ width: '100%', height: givenHeight ?? '50vh' }}
            mapboxAccessToken={TOKEN}
            attributionControl={false}
            dragPan={staticView && false}
          >
            <GeolocateControl
              showAccuracyCircle={true}
              trackUserLocation={true}
              showUserLocation={true}
              ref={geolocateControlRef}
              trigger
            />
            <FullscreenControl position='top-left' />
            <NavigationControl position='bottom-right' />
            <ScaleControl />

            {!staticView ? (
              pins
            ) : (
              <Marker
                // key={`marker-$`}
                longitude={parseFloat(lng).toFixed(4)}
                latitude={parseFloat(lat).toFixed(4)}
                anchor='top'
              >
                <button onClick={() => setPopupInfo(space_data)}>
                  <Image
                    src='/beauty-space-icon.png'
                    width={30}
                    height={30}
                    alt='BeautySpace icon'
                  />
                </button>
              </Marker>
            )}

            {popupInfo && (
              <Popup
                anchor='top'
                longitude={!staticView ? popupInfo.longitude : popupInfo?.lng}
                latitude={!staticView ? popupInfo.latitude : popupInfo?.lat}
                closeOnClick={false}
                onClose={() => setPopupInfo(null)}
                className='mt-7'
              >
                <div className='text-slate-800 py-1'>
                  {popupInfo.city}, {popupInfo.state} |{' '}
                  <Link
                    target='_new'
                    // href={`https://camc-backend.herokuapp.com/booking/${popupInfo.id}`}
                    // href={`localhost:8080/booking/workspace?search=${popupInfo.city}, ${popupInfo.state}`}
                  >
                    BeautySpace
                  </Link>
                </div>
                <Image
                  width={200}
                  height={100}
                  alt='image'
                  src={
                    !staticView ? popupInfo.image : popupInfo?.photos[0]?.url
                  }
                />
              </Popup>
            )}
          </Map>
        </>
      )}
      {location.loaded === false && <p>Loading map</p>}
    </div>
  )
}

export default WorkspaceMap
