'use client'

import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
import dynamic from 'next/dynamic'

import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { convertToRaw } from 'draft-js'

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)

import axios from 'axios'
import { Checkbox } from 'antd'
import { MdBusiness, MdClose } from 'react-icons/md'

import useCookieHandler from '../../../hooks/useCookieHandler'
import { useFetchApiData, useSalesUpdateSpace } from '../../../hooks'

import { TextField } from '../../loginComp/TextField'
import RangeSlider from '../../page-range/new_range_slider'
import ListServicesComp from '../Businesses/ListServices'
import ServicesAutocompletePlaces from '../Businesses/auto_complete'
import ServicesPaginationComp from '../Businesses/ServicesPaginationComp'

import {
  setWorkspace,
  setSpaceModal,
  setTotalSpaces,
  setWorkspaceDetails,
  setPerPage,
  setLastPage,
  getWorkspaceData,
  getSpaceModal,
  getWorkspaceDetails,
  getPerPage,
  getLastPage,
} from '../../../redux/workspaceSlice'
import {
  getAmenities,
  getCanFilter,
  getCapacity,
  getCategory,
  getClearFilter,
  getDistanceRangeFilter,
  getDuration,
  getFilterViaCoordinates,
  getMentorship,
  getPriceRangeFilter,
  setAmenities,
  setCanFilter,
  setCapacity,
  setCategory,
  setClearFilter,
  setDateFilterPicked,
  setDatePicked,
  setDistanceRangeFilter,
  setDuration,
  setFilterViaCoordinates,
  setMentorship,
  setPriceRangeFilter,
  setRating,
} from '../../../redux/filterOptions'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { getAccountType } from '../../../redux/admin_user'
import Image from 'next/image'
import { ServiceItemComp } from '../Businesses/ServiceItems'
import { BiEdit } from 'react-icons/bi'
import EditServiceComp from '../Businesses/EditService'
import Loader from '../../Loader/Loader'

const SalesComp = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { token } = useCookieHandler('user_token')

  const [loading, setLoading] = useState(true)
  const [failure, setFailure] = useState(false)

  const [currentPagination, setCurrentPagination] = useState(1)
  const [filterToggleBtn, setFilterToggleBtn] = useState(false)

  const [editorState, setEditorState] = useState()
  // const [address, setAddress] = useState(spaceDetails?.address)
  // const [description, setDescription] = useState(spaceDetails?.description)

  const [photos, setPhotos] = useState([])
  const [bookingDate, setBookingDate] = useState()
  const [updateError, setUpdateError] = useState([])
  const [updateBtn, setUpdateBtn] = useState('Update')
  const [categories_avaliable, set_categories_avaliable] = useState([])
  const [editServiceAction, setEditServiceAction] = useState('create')
  const [serviceToEdit, setServiceToEdit] = useState(null)
  const [services, setServices] = useState([])
  const [serviceGroups, setServiceGroups] = useState([])

  const [addingService, showAddingService] = useState(false)
  const [showServiceEdit, setShowServiceEdit] = useState(false)
  const [unStructuredServices, setUstructuredServices] = useState([])

  // const workspaceText = useSelector(
  //   (state) => state.workspaces.workspacesDetails
  // )
  // const SpacesItems = useSelector((state) => state.workspaces.workspace)
  // const perPage = useSelector((state) => state.workspaces.perPage)
  // const lastPage = useSelector((state) => state.workspaces.lastPage)

  /* The above code is using the `useFetchApiData` hook to make a GET request to the 'categories'
 endpoint. It is then destructuring the response object into different variables for easier access

 and handling. */
  const {
    data: categoriesData,
    error: categoriesError,
    failure: isCategoriesFailure,
    isSuccess: isCategoriesAvailable,
    isPending: isCategoriesPending,
  } = useFetchApiData('GET', 'categories')

  const [activeDuration, setActiveDuration] = useState([])

  const [categoriesInit, setCategoriesInit] = useState([])
  const [selectedCapacity, setSelectedCapacity] = useState(0)
  const [categoriesSelected, setCategoriesSelected] = useState([])
  const [searchCategoriesQuery, setSearchCategoriesQuery] = useState('')
  const [amenitiesInit, setAmenitiesInit] = useState([])
  const [amenitiesSelected, setAmenitiesSelected] = useState([])
  const [triggerPriceFilter, setTriggerPriceFilter] = useState(null)
  const [triggerDistanceFilter, setTriggerDistanceFilter] = useState(null)
  const [isChecked, setIsChecked] = useState(false)
  const [priceRange, setPriceRange] = useState([200, 50000])
  const [distanceRange, setDistanceRange] = useState([1, 20])
  const [rate, setRate] = useState([0])

  const [currentUserLocation, setCurrentUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  })
  const [filterTrack, setFilterTrack] = useState({
    category: false,
    amenities: false,
    capacity: false,
    priceRange: false,
    distance: false,
    rating: false,
    duration: false,
  })

  // edit workspace states
  const [spaceValues, setSpaceValues] = useState({
    name: '',
    city: '',
    state: '',
    country: '',
    address: '',
    // description,
    price: null,
    category: 0,
  })

  const spacesData = useSelector(getWorkspaceData)
  const accountType = useSelector(getAccountType)
  const spaceModal = useSelector(getSpaceModal)
  const spaceDetails = useSelector(getWorkspaceDetails)
  const perPage = useSelector(getPerPage)
  const lastPage = useSelector(getLastPage)

  const canFilter = useSelector(getCanFilter)
  const filterViaCoordinates = useSelector(getFilterViaCoordinates)
  const capacityFilter = useSelector(getCapacity)
  const categoryFilter = useSelector(getCategory)
  const priceRangeFilter = useSelector(getPriceRangeFilter)
  const distanceRangeFilter = useSelector(getDistanceRangeFilter)
  const clearFilter = useSelector(getClearFilter)
  const amenitiesFilter = useSelector(getAmenities)
  const durationFilter = useSelector(getDuration)

  const [description, setDescription] = useState(spaceDetails.description)
  const [address, setAddress] = useState(spaceDetails.address)

  useEffect(() => {
    if (!spaceDetails) return
    setDescription(spaceDetails?.description)
  }, [spaceDetails])

  useEffect(() => {
    if (!spaceDetails) return
    setAddress(spaceDetails?.address)
  }, [spaceDetails])

  // const salesUpdateSpaceData = {
  //   name,
  //   city,
  //   price,
  //   state,
  //   photos,
  //   status,
  //   address,
  //   country,
  //   bookings,
  //   agreement,
  //   description,
  //   available_space,
  //   mentorship_available,
  //   category: category.id,
  // }

  const bookings = bookingDate?.split(',')

  const servicesCategory = () => {
    return (
      spacesData?.category?.id === 6 ||
      spacesData?.category?.id === 7 ||
      spacesData?.category?.id === 8
    )
  }

  var _categories = []

  if (servicesCategory()) {
    _categories = [
      { id: 6, name: 'Saloon' },
      { id: 7, name: 'Beauty Studio' },
      { id: 8, name: 'Spa' },
    ]
  } else {
    _categories = categories_avaliable
  }

  const displayOptions = _categories.map((x, key, i) => {
    return (
      <option
        key={key}
        selected={x?.id === spaceDetails?.category?.id}
        value={x?.id}
      >
        {x?.name}
      </option>
    )
  })

  const getSpaceServiceGroups = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${spaceDetails?.slug}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        }
      )

      const data = await res.json()

      if (data?.status === true) {
        const newGroup = groupServicesByGroup(data.data.services)
        setUstructuredServices(data.data.services)
        setServiceGroups(newGroup)
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (spaceDetails?.slug) {
      getSpaceServiceGroups()
    }
  }, [spaceDetails?.slug])

  /**
   * The function `workspaceApiCall` makes an API call to fetch workspace data and updates the state
   * based on the response.
   * @returns The function does not have a return statement.
   */
  const workspaceApiCall = async (page = 1) => {
    if (!token) {
      return
    }
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces?page=${page}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      if (data?.status === true) {
        dispatch(setTotalSpaces(data?.data.total))
        dispatch(setWorkspace(data?.data.data))
        dispatch(setPerPage(data?.data?.per_page))
        dispatch(setLastPage(data?.data?.last_page))

        setLoading(false)
        setFailure(false)
      }
    } catch (error) {
      setFailure(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isCategoriesAvailable) {
      set_categories_avaliable(categoriesData)
      return
    }
  }, [isCategoriesAvailable])

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPagination(selectedPage + 1)
    setLoading(true)
    workspaceApiCall(selectedPage + 1)
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setFailure(true)
      })
  }

  useEffect(() => {
    workspaceApiCall(currentPagination)
  }, [currentPagination, token, dispatch])

  /**
   * The `onImageChange` function takes in an event object and reads the selected photos, converting them
   * to base64 strings and adding them to the `photos` state array.
   */
  const onImageChange = (e) => {
    const photos = e.target.files
    Object.keys(photos).forEach((key) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result.toString()])
      }
      reader.readAsDataURL(photos[key])
    })
  }

  /**
   * The `onEditorStateChange` function updates the editor state and converts the current content to
   * HTML format, then sets the description with the converted text.
   */
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
    const editorText = draftToHtml(
      convertToRaw(editorState?.getCurrentContent())
    )
    setDescription(editorText)
  }

  /**
   * The function `handleEdit` updates the state and dispatches an action based on the incoming type.
   * @returns The function does not explicitly return anything.
   */
  const handleEdit = (e, incomingType) => {
    if (incomingType === 'name') {
      setSpaceValues({ ...spaceValues, name: e.target.value })
      const newData = { ...spaceDetails, name: e.target.value }
      dispatch(setWorkspaceDetails(newData))
      return
    }

    if (incomingType === 'address') {
      setSpaceValues({ ...spaceValues, address: e.target.value })
      const newData = { ...spaceDetails, address: e.target.value }
      dispatch(setWorkspaceDetails(newData))
      return
    }

    if (incomingType === 'city') {
      setSpaceValues({ ...spaceValues, city: e.target.value })
      const newData = { ...spaceDetails, city: e.target.value }
      dispatch(setWorkspaceDetails(newData))
      return
    }

    if (incomingType === 'price') {
      setSpaceValues({ ...spaceValues, price: e.target.value })
      const newData = { ...spaceDetails, price: e.target.value }
      dispatch(setWorkspaceDetails(newData))
      return
    }

    if (incomingType === 'mentorship_available') {
      setSpaceValues({ ...spaceValues, mentorship_available: e.target.value })
      const newData = {
        ...spaceDetails,
        mentorship_available: e.target.value,
      }
      dispatch(setWorkspaceDetails(newData))
      return
    }

    if (incomingType === 'category') {
      setSpaceValues({ ...spaceValues, category: e.target.value })
      const newData = {
        ...spaceDetails,
        category: e.target.value,
      }
      dispatch(setWorkspaceDetails(newData))
      return
    }
  }

  /* The above code is creating a list of options for a dropdown select element in a React component. It
   is using the `map` function to iterate over an array called `categories_avaliable`. For each
   element in the array, it creates an `<option>` element with a key, a selected attribute based on a
   comparison between the current element's `id` and the `id` of another variable called `category`,
   and a value attribute set to the current element's `id`. The text content of each option is set to
   the current element's `name`. */
  // const displayOptions = categories_avaliable?.map((x) => {
  //   return (
  //     <option key={x?.id} selected={x?.id === spaceDetails?.id} value={x?.id}>
  //       {x?.name}
  //     </option>
  //   )
  // })

  /**
   * The `filterWorkspace` function filters workspaces based on various criteria and updates the
   * workspace data accordingly.
   * @returns The `filterWorkspace` function is being returned. This function contains logic to filter
   * workspaces based on various criteria such as capacity, category, amenities, rating, distance, price,
   * and duration. It makes use of input values to construct a URL with query parameters for fetching
   * workspace data from an API. The function also handles loading states, error handling, and updating
   * state values accordingly. Additionally, there are
   */
  const filterWorkspace = async () => {
    if (!canFilter && !filterViaCoordinates) {
      return
    }
    let myArray = [
      {
        name: 'capacity',
        value: capacityFilter,
      },
      {
        name: 'category',
        value: categoryFilter,
      },
      {
        name: 'amenities',
        value: amenitiesFilter,
      },
      // {
      //   name: 'rating',
      //   value: rating,
      // },
      {
        name: 'distance_from',
        value: distanceRangeFilter,
      },
      {
        name: 'distance_to',
        value: distanceRangeFilter,
      },
      {
        name: 'price_from',
        value: priceRangeFilter,
      },
      {
        name: 'price_to',
        value: priceRangeFilter,
      },
      {
        name: 'duration',
        value: durationFilter,
      },
    ]

    const validInputs = myArray.filter((item) => {
      if (item.name === 'distance_from' || item.name === 'distance_to') {
        if (item.value.min > 0) {
          return item
        }
      }
      if (item.name === 'price_from' || item.name === 'price_to') {
        if (item.value.min > 0) {
          return item
        }
      } else if (item.value !== null) {
        return item
      }
    })

    setLoading(true)

    if (validInputs?.length === 0) return

    let baseUrl = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces`

    try {
      let addedParams = false
      validInputs.map((item) => {
        if (
          item.name === 'distance_from' &&
          item.value.min > 0 &&
          triggerDistanceFilter
        ) {
          baseUrl =
            baseUrl +
            `${!addedParams ? '?' : '&'}${item.name}=${item.value.min}`
          addedParams = true
          setTriggerDistanceFilter(false)
          return
        }
        if (
          item.name === 'distance_to' &&
          item.value.min > 0 &&
          triggerDistanceFilter
        ) {
          baseUrl =
            baseUrl +
            `${!addedParams ? '?' : '&'}${item.name}=${item.value.max}&lat=${
              currentUserLocation?.latitude
            }&lng=${currentUserLocation?.longitude}`
          addedParams = true
          setTriggerDistanceFilter(false)
          return
        }
        if (
          item.name === 'price_from' &&
          item.value.min > 0 &&
          triggerPriceFilter
        ) {
          baseUrl =
            baseUrl +
            `${!addedParams ? '?' : '&'}${item.name}=${item.value.min}`
          addedParams = true
          setTriggerPriceFilter(false)
          return
        }
        if (
          item.name === 'price_to' &&
          item.value.min > 0 &&
          triggerPriceFilter
        ) {
          baseUrl =
            baseUrl +
            `${!addedParams ? '?' : '&'}${item.name}=${item.value.max}`
          addedParams = true
          setTriggerPriceFilter(false)
          return
        }
        if (item.name === 'amenities' && item.value?.length) {
          baseUrl =
            baseUrl + `${!addedParams ? '?' : '&'}${item.name}=${item.value}`
          addedParams = true
          return
        }
        if (item.name === 'category' && item.value?.length) {
          baseUrl =
            baseUrl + `${!addedParams ? '?' : '&'}${item.name}=${item.value}`
          addedParams = true
          return
        }
        if (item.name === 'capacity' && parseInt(item.value) > 0) {
          baseUrl =
            baseUrl + `${!addedParams ? '?' : '&'}${item.name}=${item.value}`
          addedParams = true
          return
        }
        if (item.name === 'rating' && parseInt(item.value) > 0) {
          baseUrl =
            baseUrl + `${!addedParams ? '?' : '&'}${item.name}=${item.value}`
          addedParams = true
          return
        }
        if (item.name === 'duration' && item.value?.length) {
          baseUrl =
            baseUrl + `${!addedParams ? '?' : '&'}${item.name}=${item.value}`
          addedParams = true
          return
        }
      })
      dispatch(setCanFilter(false))
    } catch (error) {
      setFailure(true)
      setLoading(false)
    }

    const res = await fetch(`${baseUrl}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    })

    const data = await res.json()

    dispatch(setTotalSpaces(data?.data.total))
    dispatch(setWorkspace(data?.data.data))
    dispatch(setPerPage(data?.data?.per_page))
    dispatch(setLastPage(data?.data?.last_page))

    setLoading(false)

    setFailure(false)
  }

  const toggleFilter = () => {
    setFilterToggleBtn(!filterToggleBtn)
  }

  useEffect(() => {
    try {
      dispatch(setDuration(activeDuration))
    } catch (error) {}
  }, [activeDuration])

  const onChange = (e, item) => {
    setIsChecked(e.target.checked)
  }

  const displayCategory = categoriesInit
    .filter((amentySearch) =>
      amentySearch.toLowerCase().includes(searchCategoriesQuery.toLowerCase())
    )
    .filter((category) => category !== 'Apartment') // Exclude the "Apartment" category
    .map((category, index) => (
      <Checkbox
        style={{ marginLeft: 10 }}
        onClick={() => handleCategoriesChecked(category)}
        name='categories'
        key={index}
        onChange={onChange}
      >
        {category}
      </Checkbox>
    ))

  /**
   * The function fetches categories from an API and updates the state with the category names.
   */
  const fetchCategories = async () => {
    const config = {
      url: `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/categories`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }

    const { data } = await axios(config)
    data?.data?.map((x) => {
      setCategoriesInit((prev) => [...prev, x?.name])
    })
  }

  /**
   * The function `getAvailableAmenities` makes an asynchronous request to fetch a list of amenities from
   * a specified URL and updates the state with the fetched data.
   * @returns The function does not have an explicit return statement.
   */
  const getAvailableAmenities = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/amenities`,
        {
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
      data?.data?.map((x) => {
        x?.items?.map((y) => {
          if (!amenitiesInit.includes(y?.name)) {
            setAmenitiesInit((prev) => [...prev, y?.name])
          }
        })
      })
    } catch (error) {}
  }

  useLayoutEffect(() => {
    getAvailableAmenities()
    fetchCategories()
  }, [])

  /**
   * The function `clearFilterFn` clears all the filters and then calls the `getAvaliableWorkspace`
   * function after a delay of 100 milliseconds.
   */
  const clearFilterFn = () => {
    dispatch(setCapacity('1'))
    dispatch(setRating(0))
    dispatch(setAmenities([]))
    dispatch(setMentorship(''))
    dispatch(setPriceRangeFilter({}))
    dispatch(setDistanceRangeFilter({}))
    dispatch(setCanFilter(false))
    dispatch(setFilterViaCoordinates(false))
    dispatch(setCoordinatesLatLng(null))
    dispatch(setDatePicked(null))
    dispatch(setClearFilter(null))
    dispatch(setDateFilterPicked(null))
    dispatch(setDuration([]))
    setTimeout(() => {
      getAvaliableWorkspace()
    }, 100)
  }

  useEffect(() => {
    clearFilter && clearFilterFn()
  }, [clearFilter])

  /**
   * The function `handleCategoriesChecked` checks if a category is already selected, and if so, removes
   * it from the selected categories list; otherwise, it adds the category to the selected categories
   * list.
   * @returns nothing (undefined).
   */
  const handleCategoriesChecked = (x) => {
    const isExisting = categoriesSelected.find((item) => item === x)
    if (isExisting) {
      const newArr = categoriesSelected.filter((a) => a !== x)
      setCategoriesSelected(newArr)
      return
    }
    setCategoriesSelected([...categoriesSelected, x])
  }

  /* The above code is using the useEffect hook in a React component. It is setting up a side effect that
  will be triggered whenever the value of the categoriesSelected variable changes. Inside the
  useEffect callback function, it is dispatching an action called setCategory with the value of
  categoriesSelected as the payload. This code is likely part of a Redux setup, where the setCategory
  action will update the state with the selected categories. */
  useEffect(() => {
    try {
      dispatch(setCategory(categoriesSelected))
    } catch (error) {}
  }, [categoriesSelected])

  useEffect(() => {
    try {
      dispatch(setCapacity(selectedCapacity))
    } catch (error) {}
  }, [selectedCapacity])

  const handleApplyFilter = () => {
    dispatch(setCanFilter(true))
  }

  useEffect(() => {
    !filterViaCoordinates && filterWorkspace()
  }, [
    canFilter,
    capacityFilter,
    categoryFilter,
    amenitiesFilter,
    priceRangeFilter,
    distanceRangeFilter,
  ])

  useEffect(() => {
    try {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCurrentUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
      })
    } catch (error) {}
  }, [])

  useEffect(() => {
    if (filterTrack.duration === false && !durationFilter?.length) return
    if (filterTrack.duration === false && durationFilter?.length) {
      setFilterTrack((prev) => ({ ...prev, duration: true }))
      handleApplyFilter()
      return
    }
    if (filterTrack.duration === false && !durationFilter?.length) return
    if (filterTrack.duration === true && !durationFilter?.length) {
      handleApplyFilter()
      return
    }
    if (filterTrack.duration === true && durationFilter?.length) {
      handleApplyFilter()
      return
    }
  }, [durationFilter])

  useEffect(() => {
    if (filterTrack.category === false && !categoryFilter?.length) return
    if (filterTrack.category === false && categoryFilter?.length) {
      setFilterTrack((prev) => ({ ...prev, category: true }))
      handleApplyFilter()
      return
    }
    if (filterTrack.category === false && !categoryFilter?.length) return
    if (filterTrack.category === true && !categoryFilter?.length) {
      handleApplyFilter()
      return
    }
    if (filterTrack.category === true && categoryFilter?.length) {
      handleApplyFilter()
      return
    }
  }, [categoryFilter])

  useEffect(() => {
    if (filterTrack.amenities === false && !amenitiesFilter?.length) return
    if (filterTrack.amenities === false && amenitiesFilter?.length) {
      setFilterTrack((prev) => ({ ...prev, amenities: true }))
      handleApplyFilter()
      return
    }
    if (filterTrack.amenities === false && !amenitiesFilter?.length) return
    if (filterTrack.amenities === true && !amenitiesFilter?.length) {
      handleApplyFilter()
      return
    }
    if (filterTrack.amenities === true && amenitiesFilter?.length) {
      handleApplyFilter()
      return
    }
  }, [amenitiesFilter])

  //   useEffect(() => {
  //     if (filterTrack.rating === false && !rating) return
  //     if (filterTrack.rating === false && rating) {
  //       setFilterTrack((prev) => ({ ...prev, rating: true }))
  //       handleApplyFilter()
  //       return
  //     }
  //     if (filterTrack.rating === false && !rating) return
  //     if (filterTrack.rating === true && !rating) {
  //       handleApplyFilter()
  //       return
  //     }
  //     if (filterTrack.rating === true && rating) {
  //       handleApplyFilter()
  //       return
  //     }
  //   }, [rating])

  useEffect(() => {
    if (filterTrack.capacity === false && !capacityFilter) return
    if (filterTrack.capacity === false && capacityFilter) {
      setFilterTrack((prev) => ({ ...prev, capacity: true }))
      handleApplyFilter()
      return
    }
    if (filterTrack.capacity === false && !capacityFilter) return
    if (filterTrack.capacity === true && !capacityFilter) {
      handleApplyFilter()
      return
    }
    if (filterTrack.capacity === true && capacityFilter) {
      handleApplyFilter()
      return
    }
  }, [capacityFilter])

  useEffect(() => {
    if (triggerPriceFilter) {
      handleApplyFilter()
    }
  }, [triggerPriceFilter])

  useEffect(() => {
    if (triggerDistanceFilter) {
      handleApplyFilter()
    }
  }, [triggerDistanceFilter])

  useEffect(() => {
    try {
      dispatch(setPriceRangeFilter({ min: priceRange[0], max: priceRange[1] }))
      // dispatch(setPriceRangeFilter(priceRange));
    } catch (error) {}
  }, [priceRange])

  useEffect(() => {
    try {
      dispatch(
        setDistanceRangeFilter({
          min: distanceRange[0],
          max: distanceRange[1],
        })
      )
      // dispatch(setDistanceRangeFilter(distanceRange));
    } catch (error) {}
  }, [distanceRange])

  useEffect(() => {
    try {
      dispatch(setRating(rate[0]))
    } catch (error) {}
  }, [rate])

  function addService() {
    setEditServiceAction('create')
    setShowServiceEdit(true)
  }

  function onEditService(action, group) {
    setEditServiceAction(action)
    setServiceToEdit(group)
    setShowServiceEdit(true)
  }

  function saveAddedService(service) {
    // groupServices(service);
    const updatedGroups = serviceGroups.map((item) => {
      if (item.id === service.id) {
        return { ...service }
      }
      return item
    })
    if (!updatedGroups.some((item) => item.id === service.id)) {
      updatedGroups.push(service)
    }
    setServiceGroups(updatedGroups)
    setServiceToEdit(null)
    setShowServiceEdit(false)
  }

  //Update workspace to the server
  const updateSpace = async (id) => {
    // Determine the photos to send in the update request
    const photosToSend = photos.length > 0 ? photos : spaceDetails.photos

    // Ensure each photo in photosToSend is a string
    const formattedPhotos = photosToSend.map((photo) =>
      typeof photo === 'string' ? photo : photo.url
    )

    // Create a copy of spaceDetails and remove amenities
    const { amenities, ...spaceDetailsWithoutAmenities } = spaceDetails

    // Initialize the updateData object with all necessary fields except amenities
    const updateData = {
      ...spaceDetailsWithoutAmenities,
      address,
      description,
      photos: formattedPhotos,
      category: spaceDetails.category.id,
    }

    const serviceIdExists = (id) => {
      var _ = spaceDetails?.services.find((service) => service.id === id)
      if (_) return true
      return false
    }

    const _services = []

    if (spaceDetails?.services?.length > 0) {
      spaceDetails?.services.map((group) => {
        _services.push({
          service_name: group.name,
          price: group.price,
          type: 'walk-in',
          min_hour: group.min_hour,
          service_id: serviceIdExists(group.id) ? group.id : null,
          home_service_price: group.home_service_price,
          service_group_id: group.id || group.service_group_id,
          images: group.images,
        })
      })
      updateData.services = _services
    }

    // Add the services array to updateData if it's not empty
    if (_services.length > 0) {
      updateData.services = _services
    }

    setUpdateBtn('Updating....')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${id}/tp-update`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      )

      const data = await res.json()
      if (data?.status === true) {
        setUpdateBtn('Successful!')
        toast.success('Workspace updated successfully')
        dispatch(setSpaceModal(false))
        setTimeout(() => {
          router.refresh()
        }, 5000)
        return
      }
      if (data?.status === false) {
        setUpdateError(data.errors)
        setUpdateBtn('Error, try again')
        return
      }
    } catch (error) {}
  }

  return (
    <>
      <Loader failure={failure} isLoading={loading} redirectBack={'/'} />
      <main className='flex flex-col relative'>
        <div className='flex flex-col relative h-screen'>
          <ListServicesComp spaces={spacesData} toggle={toggleFilter} />
          {spacesData.length > 1 && (
            <ServicesPaginationComp
              pageCount={lastPage}
              handlePageClick={handlePageChange}
            />
          )}
        </div>

        {spaceModal === spaceDetails.id && (
          <div className='fixed w-full h-screen top-0 left-0 bg-lightblack'>
            <section
              className='h-screen lg:w-[700px] md:w-full sm:w-full p-5 shadow-2fl bg-white fixed top-0 right-0 z-10 ml-auto overflow-y-auto scrollbar-hide
                  flex flex-col justify-start items-start gap-5'
            >
              <div className='flex justify-between items-center w-full'>
                <h1 className='text-xl font-medium'> Edit Service </h1>
                <button
                  onClick={() => dispatch(setSpaceModal(false))}
                  className='text-[19px]'
                >
                  <MdClose />
                </button>
              </div>
              <hr className='w-full border border-lightgrey' />

              <Formik>
                <Form className='flex flex-col justify-start items-start gap-5 w-full'>
                  <TextField
                    label='Name'
                    name='name'
                    value={spaceDetails.name}
                    onChange={(e) => handleEdit(e, 'name')}
                  />

                  <div className='relative w-full flex flex-col gap-3'>
                    <label htmlFor='address'>{t('Address')}</label>
                    <ServicesAutocompletePlaces
                      location={address}
                      setAddressPicked={setAddress}
                      noAbsoulte={'absolute'}
                      placeholder={'Enter your address'}
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-5 w-full'>
                    <TextField
                      label='City/State'
                      name='city'
                      value={spaceDetails.city}
                      onChange={(e) => {
                        handleEdit(e, 'city')
                      }}
                    />

                    <div className='flex flex-col justify-start items-start gap-3 w-full'>
                      <label htmlFor='country'> {t('Country')} </label>
                      <Field
                        as='select'
                        name='country'
                        value={spaceDetails.country}
                        onChange={(e) => handleEdit(e, 'country')}
                        className=' border border-lightgrey rounded w-full indent-3 h-[56px] p-0 outline-none
                        shadow-none focus:border-primary '
                      >
                        <option value='Nigeria'> {t('Nigeria')} </option>
                      </Field>
                    </div>

                    <div className='flex flex-col justify-start items-start gap-3 w-full'>
                      <label htmlFor='category'>{t('Category')}</label>

                      <select
                        // value={category.name}
                        onChange={(e) => {
                          handleEdit(e, 'category')
                        }}
                        className='border border-lightgrey rounded w-full indent-3 h-[56px] p-0 outline-none shadow-none focus:border-primary '
                      >
                        {displayOptions}
                      </select>
                    </div>

                    {spaceDetails.category.id === 2 && (
                      <div className='flex flex-col py-2'>
                        <label className='font-medium'>
                          {' '}
                          {t('Mentorship')}{' '}
                        </label>
                        <Field
                          as='select'
                          name='mentorship_available'
                          value={spaceDetails.mentorship_available}
                          onChange={(e) =>
                            handleEdit(e, 'mentorship_available')
                          }
                          className=' border border-lightgrey rounded w-full indent-3 h-[56px] p-0 outline-none
                            shadow-none focus:border-primary '
                        >
                          <option value='1'> Yes </option>
                          <option value='0'> No </option>
                        </Field>
                      </div>
                    )}

                    <div className='flex flex-col gap-3'>
                      {spaceDetails.type?.type === 'Hourly' && (
                        <label htmlFor='price'> Hourly Price </label>
                      )}

                      {spaceDetails.type?.type === 'Daily' && (
                        <label htmlFor='price'> Daily Price </label>
                      )}

                      {spaceDetails.type?.type === 'Monthly' && (
                        <label htmlFor='price'> Monthly Price </label>
                      )}

                      {spaceDetails.type === null && (
                        <label htmlFor='price'> Daily Price </label>
                      )}

                      <div className='relative w-full'>
                        <span className='absolute z-10 top-4 font-medium left-2'>
                          NGN
                        </span>
                        <input
                          disabled={servicesCategory()}
                          type='number'
                          name='price'
                          id='price'
                          value={spaceDetails.price}
                          onChange={(e) => handleEdit(e, 'price')}
                          className='border border-lightgrey rounded w-full indent-12 h-[56px] p-0 outline-none
                                shadow-none focus:border-primary cursor-pointer'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col justify-start items-start gap-3 w-full relative'>
                    <label htmlFor='description'> {t('Description')} </label>

                    <div className='w-full'>
                      <Editor
                        toolbarClassName='toolbarClassName'
                        wrapperClassName='wrapperClassName'
                        editorClassName='editorClassName'
                        wrapperStyle={{
                          width: '100%',
                        }}
                        toolbarStyle={{
                          borderColor: '#B4B4B8',
                          border: '1px solid #B4B4B8',
                          borderRadius: '5px',
                        }}
                        editorStyle={{
                          maxWidth: '100%',
                          border: '1px solid #B4B4B8',
                          padding: '0 10px',
                          height: '200px',
                          borderRadius: '5px',
                        }}
                        editorState={
                          !editorState
                            ? EditorState.createWithContent(
                                ContentState.createFromBlockArray(
                                  convertFromHTML(spaceDetails?.description)
                                )
                              )
                            : editorState
                        }
                        onEditorStateChange={onEditorStateChange}
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-3 w-full'>
                    <div className='flex flex-col justify-start items-start gap-3 w-full'>
                      <h2> {t('Features')} </h2>
                      <div className='grid lg:grid-cols-4 lg:gap-4 md:grid-cols-3 md:gap-4 sm:grid-cols-2 sm:gap-4'>
                        {spaceDetails.photos?.map((img) => (
                          <Image
                            key={img.id}
                            src={img.url}
                            alt='image'
                            width={150}
                            height={100}
                            className='rounded-lg w-[140px] h-[120px] object-cover object-center '
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      {showServiceEdit ? (
                        <EditServiceComp
                          token={token}
                          action={editServiceAction}
                          // groups={availableGroups}
                          serviceToEdit={serviceToEdit}
                          addService={(details) => saveAddedService(details)}
                          onCancel={() => {
                            setEditServiceAction('create')
                            setServiceToEdit(null)
                            setShowServiceEdit(false)
                          }}
                        />
                      ) : (
                        <>
                          {servicesCategory() && (
                            <div className='relative flex flex-col gap-3 w-full'>
                              <h4 className='font-semibold py-2'>Services</h4>
                              {serviceGroups.map((group) => {
                                return (
                                  <div
                                    key={group.id}
                                    className='flex flex-col gap-2'
                                  >
                                    <div className='w-full flex justify-between items-center'>
                                      <h3 className='font-semibold underline'>
                                        {group.name}
                                      </h3>
                                      <button
                                        onClick={() =>
                                          onEditService('edit', group)
                                        }
                                        className='cursor-pointer'
                                      >
                                        <BiEdit className='text-xl' />
                                      </button>
                                    </div>

                                    {group.services.map((service, i) => (
                                      <ServiceItemComp
                                        service={{
                                          item: service,
                                          serviceGroup: group,
                                        }}
                                        key={service.groupId}
                                      />
                                    ))}
                                  </div>
                                )
                              })}

                              {services?.length === 0 && (
                                <p>Your services will appear here</p>
                              )}

                              {!addingService && (
                                <button
                                  onClick={() => addService()}
                                  className='flex justify-center items-center underline cursor-pointer'
                                >
                                  Add service
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className='relative w-full flex flex-col justify-start items-start gap-3'>
                      <p> {t('Gallery')} </p>
                      <div className='w-full border border-lightgrey h-[50px] rounded-md'>
                        <input
                          type='file'
                          multiple
                          accept='image/*'
                          id='file'
                          onChange={(e) => onImageChange(e)}
                          className='w-full h-full '
                        />
                        <label
                          htmlFor='file'
                          className='border border-lightgrey py-2 px-5 rounded-md cursor-pointer absolute top-10 right-1 '
                        >
                          {' '}
                          Browse{' '}
                        </label>
                      </div>
                    </div>

                    <div className='lg:grid lg:grid-cols-3 lg:gap-3 lg:h-auto py-4 md:h-auto md:grid md:grid-cols-2 sm:h-auto sm:grid sm:grid-cols-1 overflow-auto '>
                      {photos.length > 0 &&
                        photos.map((img, key) => (
                          <Image
                            src={img}
                            key={key}
                            width={120}
                            height={100}
                            alt='Images'
                            className='h-[130px] w-full rounded-md object-cover object-center '
                          />
                        ))}
                    </div>
                  </div>

                  {Object.entries(updateError).map((err, key) => {
                    return (
                      <ul className='px-5 pb-2'>
                        <li className='text-red-500 font-medium'>
                          {' '}
                          {err[0]}: {err[1]}{' '}
                        </li>
                      </ul>
                    )
                  })}

                  <button
                    type='button'
                    onClick={() => {
                      updateSpace(spaceDetails.id)
                    }}
                    className='h-14 px-5 bg-primary text-white rounded-md'
                  >
                    {updateBtn}
                  </button>
                </Form>
              </Formik>
            </section>
          </div>
        )}

        {filterToggleBtn && (
          <>
            <div className='overlay'></div>
            <section className='h-screen lg:w-[40%] md:w-full sm:w-full p-5 shadow-2fl bg-white fixed top-0 right-0 z-10 ml-auto overflow-y-auto scrollbar-hide'>
              <div className='flex justify-between items-center'>
                <h1 className='text-xl font-medium'> Filter </h1>
                <button onClick={toggleFilter} className='text-[19px]'>
                  <MdClose />
                </button>
              </div>
              <hr className='w-full border-lightgrey border' />

              <div className='py-10 flex flex-col justify-start items-start gap-2 w-full'>
                <div className='amenty_group h-[300px] overflow-auto my-4 w-full '>
                  <span className='block text-md py-2'>Categories</span>
                  <input
                    type='text'
                    name='search'
                    id='search'
                    placeholder='Search categories...'
                    onChange={(e) => setSearchCategoriesQuery(e.target.value)}
                    className='lg:w-[290px] md:w-auto h-[50px] indent-2 rounded-md border border-lightgrey outline-none '
                  />
                  <div className='flex flex-col justify-start gap-4 items-start py-2'>
                    {displayCategory}
                  </div>
                </div>

                {/* <div className='w-full'>
                  <RangeSlider
                    min={0}
                    max={5}
                    step={0.5}
                    title='Rating'
                    isRating={true}
                    setValues={setRate}
                    values={rate}
                  />
                </div> */}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  )
}

export default SalesComp
