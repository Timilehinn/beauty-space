'use client'

import axios from 'axios'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BiChevronLeft } from 'react-icons/bi'
import { RiDeleteBin7Line, RiExternalLinkLine } from 'react-icons/ri'

import CreateServiceSteps from './CreateServiceSteps'
import AppointmentDetailsComp from './viewsComp/AppointmentDetailsComp'

import { toast } from 'react-toastify'
import { useCookieHandler } from '../../hooks'
import AmenitiesComp from './viewsComp/AmenitiesComp'
import AvailabilityComp from './viewsComp/AvailabilityComp'
import LimitsComp from './viewsComp/LimitsComp'
import ServiceAgreement from './viewsComp/ServiceAgreement'
import ServicePreview from './viewsComp/ServicePreview'

import {
  getDescription,
  getServiceData,
  setServiceData,
} from '../../redux/createWorkspaceSlice'
import Loader from '../Loader/Loader'

export default function CreateServiceComp() {
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParam = useSearchParams()

  const action = searchParam.get('action')
  const slug = searchParam.get('slug')

  const { token } = useCookieHandler('user_token')

  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const [loadingBusiness, setLoadingBusiness] = useState(false)

  const [currentStep, setCurrentStep] = useState(0)
  const serviceData = useSelector(getServiceData)
  const description = useSelector(getDescription)

  const getSpaceDetails = async () => {
    setLoadingBusiness(true)
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${slug}`,
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = res.data

      if (data?.status === true) {
        dispatch(setServiceData(data.data))

        // Restructured the amenities because it keeps duplicating the amenities_item.name into two everytime
        const seatingOptions = []
        const basicOptions = []
        const facilitiesOptions = []
        const equipmentOptions = []
        const otherOptions = []

        data?.data?.amenities?.forEach((amenity) => {
          const { name, amenitygroups } = amenity?.amenities_item

          if (
            amenitygroups?.name === 'Seating' &&
            !seatingOptions.includes(name)
          ) {
            seatingOptions.push(name)
          } else if (
            amenitygroups?.name === 'Basic' &&
            !basicOptions.includes(name)
          ) {
            basicOptions.push(name)
          } else if (
            amenitygroups?.name === 'Facilities' &&
            !facilitiesOptions.includes(name)
          ) {
            facilitiesOptions.push(name)
          } else if (
            amenitygroups?.name === 'Equipment' &&
            !equipmentOptions.includes(name)
          ) {
            equipmentOptions.push(name)
          } else if (
            amenitygroups?.name === 'Others' &&
            !otherOptions.includes(name)
          ) {
            otherOptions.push(name)
          }
        })

        setLoadingBusiness(false)

        // setSeatingOptions(seatingOptions)
        // setBasicOptions(basicOptions)
        // setFacilitiesOptions(facilitiesOptions)
        // setEquipmentOptions(equipmentOptions)
        // setOtherOptions(otherOptions)
      } else {
        setLoadingBusiness(false)
        return
      }
    } catch (error) {
      setLoadingBusiness(false)
    } finally {
      setLoadingBusiness(false)
    }
  }

  useEffect(() => {
    if (action === 'edit') {
      getSpaceDetails()
    }
  }, [action, token, dispatch])

  const nextStep = (newData, adv) => {
    dispatch(setServiceData(newData))
    if (adv === 'skipNext') {
      setCurrentStep((prev) => prev + 2)
      return
    }

    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = (newData, adv) => {
    dispatch(setServiceData(newData))
    if (adv === 'skipPrev') {
      setCurrentStep((prev) => prev - 2)
      return
    }

    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmitServices = async () => {
    if (!token) return
    setLoading(true)

    let obj = { ...serviceData }
    var _services = []
    if (serviceData?.services?.length > 0) {
      serviceData.services.forEach((group) => {
        group.services.forEach((service) => {
          _services.push({
            service_name: service.name,
            price: service.price,
            min_hour: service.min_hour,
            type: service.type || 'walk-in',
            home_service_price: service.home_service_price,
            service_group_id: group.id,
            images: service.images, // Direct assignment of images array
          })
        })
      })
    }

    if (_services.length > 0) {
      // Initialize photos array if it doesn't exist
      obj.photos = []

      // Push all images from the first service into photos array
      _services[0].images.forEach((imageString) => {
        obj.photos.push(imageString)
      })

      // Create a new array using spread operator
      obj.price = _services[0].price || 0
      obj.services = _services
      obj.type = 'Hourly'
    }

    // Restructure open_hours array
    if (obj.open_hours) {
      obj.open_hours = obj.open_hours.map((hour) => {
        const { opening_hours, ...rest } = hour // Destructure to remove opening_hours
        return {
          ...rest,
          opening_hour: opening_hours, // Add opening_hour
        }
      })
    }

    // obj.available_space = obj.users

    // Restructure amenities array to include only items' IDs
    if (obj.amenities) {
      obj.amenities = obj.amenities.flatMap((amenity) =>
        amenity.items.map((item) => item.id)
      ) // Include only the item IDs
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...obj }),
        }
      )
      const data = await res.json()

      if (data?.status === true) {
        setLoading(false)
        setTimeout(() => {
          toast.success('Business created successfully')
          localStorage.removeItem('appointment-details')
          localStorage.removeItem('uploadedFiles')
          localStorage.removeItem('limits')
          localStorage.removeItem('agreement')
          localStorage.removeItem('openHours')
          localStorage.removeItem('selectedAmenities')
          localStorage.removeItem('address')

          router.push('/dashboard')
        }, 1000)
      } else {
        setLoading(false)
        toast.error('Something went wrong, please try again')
        const errorArray = Object.values(res.errors).flat()
        setResults(errorArray)
        return
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const preprocessServices = (services) => {
    return services.map((service) => {
      const isGroupStructure = service.groups && service.groups.length > 0 // Checks if it's a group structure
      const sourceArray = isGroupStructure ? service.groups : service.services

      const updatedGroups = sourceArray.map((item) => ({
        ...item,
        price: service.price !== undefined ? service.price : item.price,
        min_hour:
          service.min_hour !== undefined ? service.min_hour : item.min_hour,
        home_service_price:
          service.home_service_price !== undefined
            ? service.home_service_price
            : item.home_service_price,
        type: service.type !== undefined ? service.type : item.type,
        groupId: isGroupStructure ? service.id : item.groupId, // Assign groupId based on structure
        service_name: isGroupStructure ? service.name : item.name,
      }))

      return {
        ...service,
        services: updatedGroups,
      }
    })
  }

  const handleSpaceUpdating = async () => {
    setLoading(true)

    let obj = { ...serviceData, category: 1 }

    if (description !== null) {
      obj = { ...obj, description }
    }

    const preprocessedServices = preprocessServices(serviceData.services || [])
    const _services = []

    preprocessedServices.forEach((serviceGroup) => {
      const isGroupStructure =
        serviceGroup.groups && serviceGroup.groups.length > 0

      serviceGroup.services.forEach((service) => {
        // Determine the groupId: if service.id is a string (UUID), use service.id, otherwise use item.groupId
        const serviceGroupId = isGroupStructure
          ? serviceGroup.id
          : service.groupId || serviceGroup.id

        _services.push({
          service_name: service.service_name,
          price: service.price !== undefined ? service.price : 0,
          min_hour: service.min_hour !== undefined ? service.min_hour : 0,
          type: service.type || 'walk-in',
          home_service_price:
            service.home_service_price !== undefined
              ? service.home_service_price
              : 0,
          service_group_id: serviceGroupId, // Assign the correct group ID
          ...(typeof service.id === 'number' && { service_id: service.id }), // Only add service_id if groupId is a number
          images: service.images || [],
        })
      })
    })

    obj.services = _services
    obj.type = obj.type?.type || obj.type
    obj.mentorship_available = 0

    // Transform the photos array to only include the URLs
    if (obj.photos) {
      obj.photos = obj.photos.map((photo) => photo.url)
    }

    // Restructure amenities array to include only items' IDs
    if (obj.amenities) {
      obj.amenities = obj?.amenities?.map((amenity) => amenity.id)
    }

    if (!Array.isArray(obj.open_hours) && Array.isArray(obj.opening_hours)) {
      obj.open_hours = obj.opening_hours.map((hour) => {
        const { is_selected, ...rest } = hour // Destructure to remove is_selected
        const times = hour.opening_hours.flatMap((time) => [time])
        return {
          ...rest,
          isSelected: is_selected,
          opening_hours: times,
          opening_hour: times,
        }
      })

      delete obj.opening_hours
    }

    // console.log('...obj', obj)
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${serviceData.id}/update`,
        { ...obj },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = res.data

      if (data?.status === true) {
        setLoading(false)
        toast.success('Business updated successfully')

        // Clearing local storage
        const keysToClear = [
          'appointment-details',
          'uploadedFiles',
          'limits',
          'agreement',
          'openHours',
          'selectedAmenities',
          'address',
        ]
        keysToClear.forEach((key) => localStorage.removeItem(key))

        setTimeout(() => {
          router.push('/dashboard')
        }, 5000)
      } else {
        setResults(data.errors)
        setLoading(false)
        toast.error('An error occurred while updating your service, try again')
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const deleteWorkspace = async (id) => {
    if (!token) {
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/workspaces/${serviceData.id}/delete`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      if (data?.status === true) {
        toast.error('The business has been successfully deleted')
        router.push('/dashboard')
      } else {
        toast.error(data?.errors.message)

        return
      }
    } catch (error) {}
  }

  const steps = [
    <AppointmentDetailsComp next={nextStep} prev={prevStep} action={action} />,
    <AvailabilityComp next={nextStep} prev={prevStep} action={action} />,
    <LimitsComp next={nextStep} prev={prevStep} action={action} />,
    <AmenitiesComp next={nextStep} prev={prevStep} action={action} />,
    // <PhotosComp next={nextStep} prev={prevStep} action={action} />,
    <ServiceAgreement next={nextStep} prev={prevStep} action={action} />,
    <ServicePreview prev={prevStep} action={action} errorMsg={results} />,
  ]

  return (
    <React.Fragment>
      <Loader isLoading={loadingBusiness} />
      <main className='flex flex-col justify-start items-start gap-5 w-full '>
        <nav className='flex justify-between items-center w-full border-b border-gray h-20 lg:px-10 md:px-10 sm:px-5'>
          <Link
            href='/dashboard'
            className='text-xl font-semibold flex items-center gap-1 '
          >
            <BiChevronLeft size={35} />
            {action !== 'edit' ? 'Create Service' : 'Update Service'}
          </Link>

          <div className='flex items-center gap-5'>
            {action === 'edit' && (
              <div className='border border-gray h-12 rounded-md hidden justify-center items-center gap-3 w-24 lg:flex '>
                <Link
                  href={`/booking/${serviceData.slug}?sid=${serviceData.id}`}
                  className='text-xl hover:text-primary'
                >
                  <RiExternalLinkLine />
                </Link>
                <div className='h-full w-[1px] bg-gray'></div>
                <button
                  type='button'
                  onClick={() => deleteWorkspace()}
                  className='text-xl'
                >
                  <RiDeleteBin7Line />
                </button>
              </div>
            )}

            {action !== 'edit' ? (
              <button
                type='button'
                onClick={() => handleSubmitServices()}
                className='bg-primary ring-2 ring-gray rounded-full h-12 px-5 text-white'
              >
                {!loading ? 'Create' : 'Creating...'}
              </button>
            ) : (
              <button
                type='button'
                onClick={() => handleSpaceUpdating()}
                className='bg-primary ring-2 ring-gray rounded-full h-12 px-5 text-white'
              >
                {!loading ? 'Update' : 'Updating...'}
              </button>
            )}
          </div>
        </nav>

        <section className='flex items-start gap-5 w-full py-5 lg:px-10 lg:flex-row md:px-10 md:flex-col sm:px-5 sm:flex-col'>
          <CreateServiceSteps
            data={serviceData}
            action={action}
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
          />

          <div className='w-full overflow-y-scroll scrollbar-hide xxl:w-[60%] xl:w-[70%] lg:w-[80%] md:w-full sm:w-full'>
            {steps[currentStep]}
          </div>
        </section>
      </main>
    </React.Fragment>
  )
}
