'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { FaMagnifyingGlass } from 'react-icons/fa6'
import { IoFilterOutline } from 'react-icons/io5'

import Loader from '../../Loader/Loader'
import AppModal, { ModalHeader } from '../../Modals'
import RangeSlider from '../../page-range/new_range_slider'
import LocationSearch from '../../search/LocationSearch'
import Card from '../../workspace-card/card'
import ServicesPaginationComp from '../Businesses/ServicesPaginationComp'

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
  {
    label: 'Tattoo Artist',
    value: 'beauty studio',
  },
]

export default function ExploreComp() {
  const router = useRouter()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)

  const [modal, showModal] = useState(false)
  const [lastPage, setLastPage] = useState(null)
  const [maxPrice, setMaxPrice] = useState([50, 99999])
  const [address, setAddress] = useState('')
  const [currentPagination, setCurrentPagination] = useState(0)
  const [category, setCategory] = useState({ label: '', value: '' })
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
  })

  const selectCategory = (data) => {
    if (data.value === category.value) {
      return setCategory({ label: '', value: '' })
    }
    setCategory(data)
  }

  useEffect(() => {
    // if ('geolocation' in navigator) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       setViewState({
    //         longitude: position.coords.longitude,
    //         latitude: position.coords.latitude,
    //       })
    //     },
    //     (error) => {}
    //   )
    // }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(
          `Longitude: ${position.coords.longitude}, 
       Latitude: ${position.coords.latitude}`
        )
        setViewState({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
      }
    )
  }, [])

  const fetchServices = async (query, retry = true) => {
    try {
      setLoading(true)
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces${query}`,
      //   {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json;charset=UTF-8',
      //   }
      // )

      const query = buildQueryString(
        currentPagination,
        viewState,
        category,
        maxPrice
      )

      // Remove the leading '?' from buildQueryString to avoid double '?'
      const fullUrl = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces${query}`

      const res = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      })

      if (res.status === 401) {
        router.push('/')
        return
      }

      const data = await res.json()

      if (data.status !== true) {
        setFailure(true)
      } else {
        if (data.data.data.length === 0 && retry) {
          fetchServices(`?page=${currentPagination}`, false)
        } else {
          setServices(data.data.data)
          setLastPage(data.data.last_page)
          setFailure(false)
        }
      }
    } catch (error) {
      setLoading(false)
      setFailure(false)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  /**
   * The function `buildQueryString` constructs a query string based on provided parameters such as page
   * number, view state, category, and maximum price.
   * @param page - The `buildQueryString` function takes four parameters: `page`, `viewState`,
   * `category`, and `maxPrice`. The `page` parameter is used to specify the page number for the query
   * string.
   * @param viewState - `viewState` is an object containing latitude and longitude values. If both
   * latitude and longitude are not equal to 0, the function will include them in the query string.
   * @param category - The `category` parameter seems to be an object with a `value` property. The
   * `buildQueryString` function checks if this `value` property exists and appends it to the query
   * string if it does.
   * @param maxPrice - MaxPrice is an array containing two elements: the minimum price (maxPrice[0]) and
   * the maximum price (maxPrice[1]) for filtering products or items based on their price range.
   * @returns The function `buildQueryString` returns a query string based on the provided parameters
   * `page`, `viewState`, `category`, and `maxPrice`. The query string includes the page number,
   * latitude, longitude, category value, and price range specified in the parameters.
   */
  // const buildQueryString = (page, viewState, category, maxPrice) => {
  //   let query = `?page=${page}`
  //   if (viewState.latitude !== 0 && viewState.longitude !== 0) {
  //     query += `&lat=${viewState.latitude}&lng=${viewState.longitude}`
  //   }
  //   if (category.value) {
  //     query += `&category=${category.value}`
  //   }
  //   if (maxPrice[0] || maxPrice[1]) {
  //     query += `&price_from=${maxPrice[0]}&price_to=${maxPrice[1]}`
  //   }
  //   return query
  // }

  const buildQueryString = (page, viewState, category, maxPrice) => {
    const params = new URLSearchParams()

    params.append('page', page)

    if (viewState.latitude !== 0 && viewState.longitude !== 0) {
      params.append('lat', viewState.latitude)
      params.append('lng', viewState.longitude)
    }

    if (category.value) {
      params.append('category', category.value)
    }

    if (maxPrice[0] || maxPrice[1]) {
      params.append('price_from', maxPrice[0])
      params.append('price_to', maxPrice[1])
    }

    return `?${params.toString()}`
  }

  /* This `useEffect` hook is responsible for fetching services based on the specified query parameters
after a debounce time of 500 milliseconds. Here's a breakdown of what it does: */
  useEffect(() => {
    let debounceTimer
    const query = buildQueryString(
      currentPagination,
      viewState,
      category,
      maxPrice
    )
    debounceTimer = setTimeout(() => {
      fetchServices(query)
    }, 500)
    return () => clearTimeout(debounceTimer)
  }, [viewState, category, maxPrice, currentPagination])

  /**
   * The function `handlePageChange` increments the current pagination by one when a page change event
   * occurs.
   */
  const handlePageChange = ({ selected: selectedPage }) => {
    const newPage = selectedPage + 1
    setCurrentPagination(newPage)
  }

  const clearFilters = () => {
    setMaxPrice([50, 99999])
    showModal(false)
  }

  const isPriceFilterActive = maxPrice[0] !== 50 || maxPrice[1] !== 99999

  return (
    <>
      <Loader
        failure={failure} //if your api or state fails and page should not show
        isLoading={loading} // if your api or state is still fetching
        redirectTo={'/dashboard'}
      />
      <main className='flex flex-col justify-start items-start gap-5 px-10 py-5  '>
        <h1 className='text-xl font-semibold'>Explore</h1>

        <section className='w-full h-[80%] flex flex-col justify-between gap-5 '>
          <div className='flex flex-col justify-start items-start gap-5 w-full'>
            <header className='flex justify-between items-center gap-5 flex-wrap w-full  '>
              <div className='relative w-full lg:w-[45%] '>
                <FaMagnifyingGlass className='absolute top-4 left-2 text-sm text-lightgrey z-10' />
                <LocationSearch
                  address={address}
                  setAddress={setAddress}
                  onSelect={(point) => {
                    setViewState({
                      latitude: point.lat,
                      longitude: point.lng,
                    })
                  }}
                  extraInputStyling='border border-dashgrey indent-7 w-full'
                />
              </div>

              <button
                type='button'
                onClick={() => {
                  showModal(true)
                }}
                className='h-12 bg-white rounded-md px-5 flex justify-center items-center gap-2 border border-dashgrey 3xl:h-16 3xl:text-4xl'
              >
                <IoFilterOutline /> <span>Filter</span>
              </button>
            </header>

            <div className='w-full flex justify-start items-center gap-5  mt-[10px] overflow-x-scroll scrollbar-hide'>
              <div className='flex justify-start items-start gap-5'>
                {categories.map((c, i) => (
                  <button
                    onClick={() => selectCategory(c)}
                    className={`p-3 min-w-[120px] border border-dashgrey hover:bg-primary hover:text-white sm:w-[150px] ${
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

            <div className='grid gap-5 xxl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1'>
              <Card
                isListView={false}
                isGridView={true}
                currentPagelist={services}
                useExploreRoute={true}
              />
            </div>
          </div>

          <ServicesPaginationComp
            pageCount={lastPage}
            handlePageClick={handlePageChange}
          />
        </section>
      </main>

      <AppModal modal={modal} showModal={showModal}>
        <div className='w-[450px] sm:w-[90%] md:w-[450px] h-[300px] flex flex-col justify-between gap-5 bg-white rounded-xl p-6'>
          <ModalHeader title='Filter' onClose={() => showModal(false)} />
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
