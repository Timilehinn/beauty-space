'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  Popup,
  ScaleControl,
} from 'react-map-gl'

import Image from 'next/image'
import Link from 'next/link'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import Modal from 'react-modal'
import Sheet from 'react-modal-sheet'

import LoaderWithoutAuth from '../Loader/LoaderWithoutAuth'
import SearchSkeleton from '../Loader/SearchSkeleton'
import { FilterIcon, MapIcon } from '../../assets/icons'
import AppModal, { ModalHeader } from '../Modals'
import RangeSlider from '../page-range/new_range_slider'
import LocationSearch from '../search/LocationSearch'
import ServiceItem from '../workspace-card/ServiceItem'

import './space.css'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    zIndex: 1000,
    transform: 'translate(-50%, -50%)',
  },
}

const TOKEN =
  'pk.eyJ1IjoiaWFmb2xheWFuIiwiYSI6ImNsMTBwcGVxajIwc3UzYmtibWppMnRxZTAifQ.7YH7BoXUrg3R8T-NcRX3SA'

const categories = [
  {
    label: 'Spas',
    value: 'spa',
  },
  {
    label: 'Beauty studio',
    value: 'beauty studio',
  },
  {
    label: 'Saloon',
    value: 'saloon',
  },
  {
    label: 'Hair stylist',
    value: 'saloon',
  },
  {
    label: 'Barber shop',
    value: 'saloon',
  },
  {
    label: 'Massage',
    value: 'spa',
  },
]

let MAP_ZOOM = 12

export default function BookingsComponent() {
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [services, setServices] = useState([])
  const [maxPrice, setMaxPrice] = useState([50, 99999])
  const [modal, showModal] = useState(false)
  const [category, setCategory] = useState({ label: '', value: '' })
  const [address, setAddress] = useState('')
  const [viewState, setViewState] = React.useState({
    longitude: 0,
    latitude: 0,
    zoom: MAP_ZOOM,
  })
  const [popupInfo, setPopupInfo] = useState(null)
  const [openBottomSheet, setOpenBottomSheet] = useState(true)
  const [rangeBottomSheet, showRangeBottomSheet] = useState(false)
  const [windowHeight, setWindowHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  )

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setViewState({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          })
        },
        (error) => {}
      )
    } else {
    }
  }, [])

  const onMapMove = (location) => {
    setViewState(location)
  }

  const geolocateControlRef = useCallback((ref) => {
    if (ref) {
      ref.trigger()
    }
  }, [])

  const fetchServices = async (query) => {
    try {
      setLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces${query}`,
        {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        }
      )
      const data = await res.json()
      if (data.status !== true) {
        setFailure(true)
      } else {
        setServices(data.data.data)
        if (data.data.data.length > 0) {
          setOpenBottomSheet(true)
        }
        setFailure(false)
      }
    } catch (error) {
      setLoading(false)
      setFailure(false)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  useEffect(() => {
    let debounceTimer
    if (viewState.latitude !== 0) {
      clearTimeout(debounceTimer)
      let query = `?lat=${viewState.latitude}&lng=${viewState.longitude}${
        category.value && `&category=${category.value}`
      }&price_from=${maxPrice[0]}&price_to=${maxPrice[1]}`
      debounceTimer = setTimeout(() => {
        fetchServices(query)
      }, 500)
    }
    return () => clearTimeout(debounceTimer)
  }, [viewState, category, maxPrice])

  const selectCategory = (data) => {
    if (data.value === category.value) {
      return setCategory({ label: '', value: '' })
    }
    setCategory(data)
  }

  const renderPins = useCallback(() => {
    return (
      <>
        {services.map((service, i) => {
          return (
            <Marker
              key={i}
              longitude={service.lng}
              latitude={service.lat}
              anchor='top'
            >
              <button onClick={() => setPopupInfo(service)}>
                <Image
                  src='/beauty-space-icon.png'
                  width={40}
                  height={40}
                  alt='BeautySpace icon'
                />
              </button>
            </Marker>
          )
        })}
      </>
    )
  }, [services])

  const renderPopup = useCallback(() => {
    if (!popupInfo) return <></>
    return (
      <Popup
        anchor='top'
        longitude={popupInfo.lng}
        latitude={popupInfo.lat}
        closeOnClick={false}
        onClose={() => setPopupInfo(null)}
        className='mt-7'
      >
        <div className='text-slate-800 py-1'>
          {popupInfo.city}, {popupInfo.state} | <a target='_new'>Workspace</a>
        </div>
        <Link
          href={`/booking/${popupInfo?.slug}?sid=${popupInfo?.id}`}
          state={popupInfo}
          key={popupInfo?.id}
        >
          <Image
            src={popupInfo?.photos[0]?.url}
            width={100}
            height={100}
            alt='random icon'
            className='w-full'
          />
        </Link>
      </Popup>
    )
  }, [popupInfo])

  const renderServices = useCallback(() => {
    if (loading) {
      return <SearchSkeleton />
    }

    if (services.length === 0) {
      return (
        <div className='h-full w-full flex flex-col justify-center items-center gap-3'>
          <FaMagnifyingGlass size='70' color='grey' />
          <h2 className='text-3xl bold'>No results found</h2>
          <p>Try a different search parameter</p>
        </div>
      )
    }
    return (
      <>
        {services.map((service, i) => (
          <ServiceItem key={i} service={service} />
        ))}
      </>
    )
  }, [services, loading])

  const clearFilters = () => {
    setMaxPrice([50, 99999])
    showModal(false)
  }

  const isPriceFilterActive = maxPrice[0] !== 50 || maxPrice[1] !== 99999

  return (
    <>
      <LoaderWithoutAuth isLoading={loading} failure={failure} />
      <main className='h-screen overflow-hidden w-full flex items-start '>
        <section className='overflow-y-scroll w-full h-screen scrollbar-hide mt-[3.5rem] flex-col py-10 bg-white border-r border-lightgrey hidden lg:block lg:w-[25%]'>
          <div className='w-[90%] border border-lightgrey self-center bg-white rounded-full flex items-center px-5 lg:hidden'>
            <FaMagnifyingGlass />
            <LocationSearch
              address={address}
              setAddress={setAddress}
              onSelect={(point) => {
                setViewState({
                  latitude: point.lat,
                  longitude: point.lng,
                  zoom: MAP_ZOOM,
                })
              }}
            />
          </div>

          {renderServices()}
        </section>

        <section className='relative w-full lg:w-[75%] bg-lightgray flex flex-col h-screen'>
          <div className='absolute top-[100px] z-50 flex flex-col items-center gap-4 w-full'>
            <div className='w-[50%] sm:w-[90%] lg:w-[50%] bg-white rounded-full flex items-center px-5'>
              <FaMagnifyingGlass />
              <LocationSearch
                address={address}
                setAddress={setAddress}
                onSelect={(point) => {
                  setViewState({
                    latitude: point.lat,
                    longitude: point.lng,
                    zoom: MAP_ZOOM,
                  })
                }}
              />
              <button
                className='lg:hidden block'
                onClick={() => setOpenBottomSheet(!openBottomSheet)}
              >
                <MapIcon />
              </button>
            </div>

            <div
              className='w-full flex items-center gap-5 sm:justify-start md:justify-center justify-center mt-[10px] overflow-x-scroll scrollbar-hide'
              //   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <button
                onClick={() => {
                  setOpenBottomSheet(false)
                  showModal(true)
                }}
                className={`p-2 bg-[white] rounded-[20px] relative transition duration-300`}
              >
                {isPriceFilterActive && (
                  <div className='absolute left-[25px] top-[0px] h-[10px] w-[10px] bg-primary rounded-[10px]' />
                )}
                <FilterIcon size={20} />
              </button>

              <div className='flex justify-start items-center gap-5'>
                {categories.map((c, i) => (
                  <button
                    onClick={() => selectCategory(c)}
                    className={`p-3 min-w-[120px] sm:w-[150px] ${
                      c.label === category.label
                        ? 'bg-primary text-white'
                        : 'bg-white text-black'
                    }  rounded-full transition duration-300`}
                    key={i}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Map
            {...viewState}
            // initialViewState={viewState}
            mapStyle='mapbox://styles/mapbox/streets-v9'
            onMove={(evt) => onMapMove(evt.viewState)}
            style={{ width: '100%', height: '100vh' }}
            mapboxAccessToken={TOKEN}
            attributionControl={true}
            dragPan={true}
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
            <Marker
              longitude={viewState.longitude}
              latitude={viewState.latitude}
              anchor='top'
            ></Marker>
            {renderPins()}
            {renderPopup()}
          </Map>
        </section>
      </main>

      <Sheet
        isOpen={openBottomSheet}
        onClose={() => setOpenBottomSheet(false)}
        className='lg:hidden block'
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <Sheet.Scroller>{renderServices()}</Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>

      <Modal
        isOpen={rangeBottomSheet}
        onAfterOpen={showRangeBottomSheet}
        onRequestClose={() => showRangeBottomSheet(false)}
        style={customStyles}
        contentLabel='Filter'
      >
        <div className='w-[300px] rounded-xl p-0 '>
          <p className='bold text-[20px]'>Filter by price</p>
          <div className='h-5' />
          <RangeSlider
            min={50}
            max={99999}
            step={1}
            title=''
            setValues={setMaxPrice}
            values={maxPrice}
          />
        </div>
      </Modal>

      <AppModal modal={modal} showModal={showModal}>
        <div className='w-[450px] sm:w-[90%] md:w-[450px] h-[300px] flex flex-col justify-between gap-5 bg-white rounded-xl p-6'>
          <ModalHeader title='Filters' onClose={() => showModal(false)} />
          <div className='flex flex-col justify-start items-start gap-2'>
            <p className='bold text-[20px]'>Price range</p>
            <RangeSlider
              min={50}
              max={99999}
              step={1}
              title=''
              setValues={setMaxPrice}
              values={maxPrice}
              usePriceFormatter
            />
          </div>

          <div className='flex flex-row justify-between gap-5'>
            <button
              onClick={clearFilters}
              className='border border-lightgrey rounded flex-1 p-3 '
            >
              CLEAR ALL
            </button>
            <button
              onClick={() => showModal(false)}
              className='rounded flex-1 text-white bg-primary p-3 '
            >
              APPLY
            </button>
          </div>
        </div>
      </AppModal>
    </>
  )
}
