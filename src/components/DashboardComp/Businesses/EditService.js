import clsx from 'clsx'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

import { BiPlus } from 'react-icons/bi'
import { CiEdit } from 'react-icons/ci'
import { FaNairaSign } from 'react-icons/fa6'
import { LuImagePlus } from 'react-icons/lu'
import { RiDeleteBin7Line } from 'react-icons/ri'

import { FormatAmount } from '../../../utils/formatAmount'

import { CgClose } from 'react-icons/cg'
import { toast } from 'react-toastify'
import { PlusIcon, TimesIcon } from '../../../assets/icons'

function RenderGroupImages({ asset_urls }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 20,
      }}
    >
      {asset_urls.map((asset_url, i) => (
        <img
          src={asset_url.url}
          style={{
            height: '75px',
            width: '75px',
            borderRadius: '8px',
            marginRight: '8px',
          }}
        />
      ))}
    </div>
  )
}

export default function EditServiceComp({
  token,
  action,
  onCancel,
  serviceToEdit,
  addService,
}) {
  const [suggestions, setSuggestions] = useState([])
  const [items, setItems] = useState([])
  const [showLoading, setShowLoading] = useState(false)
  const [categoryName, setCategoryName] = useState('')

  const [images, setImages] = useState([])
  const [serviceName, setServiceName] = useState('')
  const [servicePrice, setServicePrice] = useState(0)
  const [serviceDuration, setServiceDuration] = useState(1)
  const [homeServicePrice, setHomeServicePrice] = useState(0)
  const [hasHomeService, setHasHomeService] = useState(false)
  const [idToEdit, setIdToEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errMessage, setErrMessage] = useState([])
  const [display, setDisplay] = useState('service')
  const [existingGroups, setExistingGroups] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isPackageModal, setIsPackageModal] = useState(false)

  const [formData, setFormData] = useState({
    is_package: false,
    price: null,
  })

  const [errors, setErrors] = useState({
    price: '',
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {}

    if (formData.is_package && (!formData.price || formData.price <= 0)) {
      newErrors.price = 'Please enter a valid price greater than 0'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const transformErrorsToArray = (errors) => {
    if (!errors) return []

    return Object.entries(errors).reduce((acc, [field, messages]) => {
      // If messages is an array, spread all messages
      if (Array.isArray(messages)) {
        return [...acc, ...messages]
      }
      // If messages is an object, it might have nested errors
      if (typeof messages === 'object') {
        return [...acc, ...transformErrorsToArray(messages)]
      }
      // If messages is a string, add it directly
      return [...acc, messages]
    }, [])
  }

  const getAvailableGroupsData = async (token) => {
    if (!token) {
      toast.error('No token provided, kindly logout and login again')
      return { status: false, error: 'No token provided' }
    }

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/service-groups`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const res = await result.json()

      if (res?.status === true) {
        return { groups: res.data, status: true }
      } else {
        return {
          status: false,
          error: res.message || 'API returned false status',
        }
      }
    } catch (error) {
      return { status: false, error: error.message }
    }
  }

  /**
   * The function `handleCreateServiceGroups` is an asynchronous function that handles the creation of
   * service groups with error handling and response processing.
   * @param token - A token is a piece of data that is used to access secure resources or services. It is
   * typically a string of characters that serves as a credential for authentication and authorization
   * purposes. In the context of the `handleCreateServiceGroups` function, the token parameter is likely
   * used to authenticate the user before creating
   * @param category - The `category` parameter in the `handleCreateServiceGroups` function is used to
   * specify the category of the service group being created. It helps in organizing and grouping
   * services based on a specific category or type.
   * @param asset_urls - The `asset_urls` parameter in the `handleCreateServiceGroups` function is used
   * to pass an array of URLs that represent assets related to the service group being created. These
   * URLs could point to images, videos, or any other type of media that is associated with the service
   * group.
   * @param formData - The `formData` parameter in the `handleCreateServiceGroups` function likely
   * contains data related to the service group being created. This data could include information such
   * as the name of the service group, description, pricing details, and any other relevant details
   * needed to create the service group.
   * @returns If the `token` is not provided, the function will return early. If the API call is
   * successful and the response is handled correctly, it will return an object with `status: true`. If
   * there is an error during the API call or response handling, it will throw an error message.
   */
  async function handleCreateServiceGroups(
    token,
    category,
    // asset_urls,
    formData
  ) {
    if (!token) {
      return { status: false, error: 'No token provided' }
    }

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/service-groups`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token,
            name: category,
            // asset_urls,
            ...formData, // Spread formData here instead of sending it as is
          }),
        }
      )

      const res = await result.json()

      if (res?.status === true) {
        return { status: true, data: res.data }
      } else {
        const errorMessages = transformErrorsToArray(res.errors)
        return {
          status: false,
          errorMessages,
        }
      }
    } catch (error) {
      return { status: false, error: 'An error occurred, kindly try again' }
    }
  }

  useEffect(() => {
    const fetchGroups = async () => {
      const result = await getAvailableGroupsData(token)
      if (result?.status === true) {
        setExistingGroups(result.groups)
      } else {
        toast.error('Failed to fetch groups:', result?.error)
      }
    }

    if (token) {
      fetchGroups()
    }
  }, [token]) // Add token as dependency

  useEffect(() => {
    let result = []
    if (categoryName.trim() !== '') {
      var filter = existingGroups.filter((arr) => {
        return (
          arr?.name?.toLowerCase()?.indexOf(categoryName.toLowerCase()) !== -1
        )
      })
      setSuggestions(filter.slice(0, 10))
    } else {
      setSuggestions([])
    }
  }, [categoryName, existingGroups])

  const handleCategorySelect = (name) => {
    setCategoryName(name)
    setIsModalOpen(false)
  }

  const _getHomeServicePrice = () => {
    if (serviceToEdit?.homeServicePrice && serviceToEdit.homeServicePrice > 0) {
      return {
        state: true,
        amount: serviceToEdit.homeServicePrice,
        string: serviceToEdit.homeServicePrice.toString(),
      }
    } else if (
      serviceToEdit?.home_service_price &&
      serviceToEdit.home_service_price > 0
    ) {
      return {
        state: true,
        amount: serviceToEdit.home_service_price,
        string: serviceToEdit.home_service_price.toString(),
      }
    } else {
      return { state: false, amount: 100, string: '100' }
    }
  }

  const _homeServicePrice = _getHomeServicePrice()

  /* The above code is a React useEffect hook that runs when the `serviceToEdit` variable changes. It
  checks if `serviceToEdit` exists and if the `action` is 'edit'. If so, it dispatches an action to
  set the category name, then maps over the services in `serviceToEdit`, extracting image URLs and
  restructuring the data before setting the items state. If the `action` is not 'edit', it simply
  sets the category name and items state based on the `serviceToEdit` data. */
  React.useEffect(() => {
    if (serviceToEdit) {
      if (action === 'edit') {
        setCategoryName(serviceToEdit.name)
        var items = []
        serviceToEdit.services.map((service) => {
          var images = []
          if (service.images) {
            service.images.map((image) => {
              images.push(image)
            })
          }

          items.push({
            ...service,
            homeServicePrice: service.home_service_price,
            images,
          })
        })
        setItems(items)
      } else {
        setCategoryName(serviceToEdit?.name)
        setItems(serviceToEdit?.items)
      }
    }
  }, [serviceToEdit])

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onload = () => {
      const base64String = reader.result.split(',')[1]
      setImages((prev) => {
        return [...prev, 'data:image/jpeg;base64,' + base64String]
      })
    }

    reader.readAsDataURL(file)
  }

  const canSaveItem = () => {
    // Base validation that always applies
    const baseValidation =
      serviceName?.length > 3 &&
      (!hasHomeService || homeServicePrice >= 100) &&
      images.length >= 2

    // If it's a package, don't check servicePrice
    if (formData.is_package) {
      return baseValidation
    }

    // If it's not a package, include servicePrice validation
    return baseValidation && servicePrice >= 100
  }

  // use this to return the currrent ID in the case of editing a space
  const getServiceId = () => {
    if (serviceToEdit) {
      return serviceToEdit.id
    }
    // return generateId()
    return
  }

  const findServiceGroup = (cat) => {
    const result = existingGroups.find(
      (group) => group.name.toLowerCase() === cat.toLowerCase()
    )
    return { exists: result ? true : false, result }
  }

  function reset() {
    setServiceDuration(1)
    setServiceName('')
    setServicePrice(0)
    setHomeServicePrice(0)
    setHasHomeService(false)
    // setItems([])
    setImages([])
    setDisplay('service')
  }

  async function saveItem() {
    if (loading) return null

    setItems((prev) => {
      const updatedItems = prev.map((item) => {
        if (item.id === idToEdit) {
          return {
            ...item,
            name: serviceName,
            price: servicePrice,
            home_service_price: homeServicePrice > 0 ? servicePrice : 0,
            hasHomeService,
            min_hour: serviceDuration,
            images,
            // ...formData,
          }
        }
        return item
      })

      // Check if the item is new and not in the same group
      if (!updatedItems.some((item) => item.id === idToEdit)) {
        const newService = {
          name: serviceName,
          price: formData.is_package ? 0 : servicePrice,
          home_service_price: hasHomeService ? servicePrice : 0,
          hasHomeService,
          min_hour: serviceDuration,
          images,
        }

        if (getServiceId()) {
          newService.groupId = getServiceId()
        }

        updatedItems.push(newService)
      }

      return updatedItems
    })

    reset()
  }

  function editItem(item) {
    if (loading) return null
    setIdToEdit(item.id)
    setServiceName(item.name)
    setServicePrice(item.price)
    setHomeServicePrice(item.homeServicePrice)
    setHasHomeService(item.hasHomeService)
    setImages(item.images)
    setDisplay('subservice')
    setServiceDuration(item.min_hour)
  }

  async function removeItem(index) {
    if (loading) return null
    const filtered = items.filter((item) => items.indexOf(item) !== index)
    setItems(filtered)
  }

  function removeImage(index) {
    const updated = images.filter((image) => image !== images[index])
    setImages(updated)
  }

  async function createGroup() {
    if (loading) return null

    setShowLoading(true)

    try {
      // Check if service group exists
      const serviceGroup = findServiceGroup(categoryName)

      if (serviceGroup.exists) {
        // Handle existing service group
        addService({
          id: serviceGroup.result.id,
          items,
          services: items,
          name: categoryName,
          ...formData,
        })
      } else {
        // Create new service group
        const res = await handleCreateServiceGroups(
          token,
          categoryName,
          items[0].images,
          formData
        )

        if (!res.status) {
          setErrMessage(res.errorMessages)
          return
        }

        // Fetch updated groups
        const groupsResult = await getAvailableGroupsData(token)

        if (!groupsResult.status) {
          throw new Error(
            groupsResult.error || 'Failed to fetch updated groups'
          )
        }

        const newServiceGroup = groupsResult.groups.find(
          (group) => group.name.toLowerCase() === categoryName.toLowerCase()
        )

        if (!newServiceGroup) {
          throw new Error('New service group not found after creation')
        }

        // Add the service
        addService({
          id: newServiceGroup.id,
          items,
          services: items,
          name: categoryName,
          ...formData,
        })

        // Reset form
        reset()
        setCategoryName('')
      }
    } catch (error) {
      throw new Error('An error occurred, kindly try again')
    } finally {
      setShowLoading(false)
    }
  }

  const canSave = () => {
    if (categoryName && items.length > 0) return true
    return false
  }

  const handleServiceTypeChange = (event) => {
    const selectedValue = event.target.value
    if (selectedValue === 'home service') {
      setHasHomeService(true)
    } else {
      setHasHomeService(false)
    }
  }

  const handleChange = (e) => {
    const inputValue = parseInt(e.target.value, 10)

    if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= 60) {
      setServiceDuration(inputValue)
    } else {
      return
      // setServiceDuration(1)
    }
  }

  return (
    <div className='fixed bg-lightblack h-screen w-full top-0 left-0 z-20 flex flex-col justify-center items-center'>
      <main className='flex flex-col justify-start items-start gap-5 bg-white px-5 py-10 rounded-md shadow-2fl xxl:w-[40%] xl:w-[50%] lg:w-[50%] md:w-[80%] sm:w-[95%] '>
        <header className='flex justify-between items-center w-full'>
          <h2 className='font-semibold'>Add Sub-Service</h2>
          <button type='button' onClick={() => onCancel()} className='text-xl'>
            <TimesIcon />
          </button>
        </header>

        {display === 'service' ? (
          <section className='flex flex-col justify-start items-start gap-5 w-full'>
            <header className='flex items-end justify-between gap-5 w-full xl:flex-row lg:flex-row md:flex-row sm:flex-col'>
              <div className='flex flex-col justify-start items-start gap-2 w-full'>
                <label htmlFor='service' className='font-medium'>
                  Service
                </label>
                <input
                  value={categoryName}
                  disabled={action === 'edit'}
                  onChange={(e) => {
                    setCategoryName(e.target.value)
                    setIsModalOpen(true) // Open the modal when input changes
                  }}
                  className='border border-lightgrey rounded-md w-full indent-5 h-14 outline-none  '
                />
              </div>

              {loading ? (
                <button
                  disabled={loading ? true : items.length === 0}
                  className={`h-14 px-5 bg-lightgrey rounded-md`}
                >
                  Loading...
                </button>
              ) : (
                <button
                  onClick={() => createGroup()}
                  disabled={loading ? true : !canSave()}
                  className={`h-14 px-5 lg:w-auto md:w-auto sm:w-full ${
                    items.length > 0 ? 'bg-primary' : 'bg-lightgrey'
                  } text-[white] rounded-md`}
                >
                  Save
                </button>
              )}
            </header>

            {errMessage.length >= 1 && (
              <ul className=''>
                {errMessage.map((item, index) => {
                  return (
                    <li key={index} className='text-danger text-sm'>
                      {item}
                    </li>
                  )
                })}
              </ul>
            )}

            {isModalOpen && suggestions.length > 0 && (
              <div className='w-full h-[250px] overflow-y-scroll scrollbar-hide bg-white ring-1 ring-gray shadow-2fl rounded-md p-3 '>
                {suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className='flex flex-col justify-start items-start gap-1 border-b border-gray last:border-none'
                  >
                    <button
                      type='button'
                      onClick={() => handleCategorySelect(suggestion.name)}
                      className='p-2 cursor-pointer w-full hover:bg-gray rounded-md flex justify-start items-start'
                    >
                      {suggestion.name}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length === 0 && (
              <section className='flex flex-col items-center justify-center gap-3 w-full'>
                <Image
                  src='/empty_banks.png'
                  width={100}
                  height={100}
                  alt='empty icon'
                />

                <div className='flex flex-col justify-center items-center gap-1'>
                  <span className='text-lightgrey'>
                    No available sub-services yet
                  </span>
                  <span className='text-lightgrey'>Create a sub-service</span>
                </div>

                <button
                  type='button'
                  onClick={() => {
                    setIsPackageModal(true)
                  }}
                  className='flex items-center gap-1 text-primary'
                >
                  <BiPlus className='text-xl' /> Add
                </button>
              </section>
            )}

            {items.length >= 1 && (
              <div className='border border-gray rounded-md p-2 w-full'>
                {items.map((item, i) => {
                  return (
                    <div className='flex justify-between items-center w-full border-b border-gray last:border-none py-2 '>
                      <div className='flex flex-col justify-start items-start gap-2 w-[60%]'>
                        <h3 className='font-semibold capitalize '>
                          {item.name}
                        </h3>

                        <span className='font-light'>
                          ₦{FormatAmount(item.price)}/{item.min_hour}hr
                          {item.min_hour > 1 ? 's' : ''}
                        </span>

                        {item.hasHomeService && (
                          <span className='font-light'>
                            ₦{FormatAmount(item.price)}/{item.min_hour}
                            hr
                            {item.min_hour > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <div className='flex justify-center items-center border border-gray w-28 rounded-md h-12'>
                        <button
                          type='button'
                          onClick={() => editItem(item)}
                          className='cursor-pointer flex justify-center items-center text-xl w-full hover:text-primary'
                        >
                          <CiEdit />
                        </button>
                        <div className='h-full w-[1px] bg-gray' />
                        <button
                          type='button'
                          onClick={() => removeItem(i)}
                          className='cursor-pointer flex justify-center items-center text-xl w-full hover:text-primary'
                        >
                          <RiDeleteBin7Line />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {items.length > 0 && (
              <button
                type='button'
                className='cursor-pointer mx-auto flex justify-center items-center gap-2 text-primary'
                onClick={() => setDisplay('subservice')}
                // onClick={() => setIsPackageModal(true)}
              >
                Add item
                <PlusIcon color='#0559FD' />
              </button>
            )}

            {isPackageModal && (
              <section className='fixed top-0 left-0 flex justify-center items-center w-full h-screen bg-lightblack'>
                <form className='flex flex-col justify-start items-start gap-5 bg-white w-full rounded-md p-5 ring-1 ring-gray lg:w-[30%]'>
                  <header className='flex justify-between items-center w-full'>
                    <h1 className='font-semibold'>Create Package:</h1>
                    <button
                      type='button'
                      onClick={() => setIsPackageModal(false)}
                      className='text-xl hover:text-gray-600'
                    >
                      <CgClose />
                    </button>
                  </header>

                  <div className='flex flex-col justify-start items-start gap-3 w-full'>
                    <span className='text-sm'>
                      Kindly check this box if you want to create a package,
                      else proceed
                    </span>
                    <label
                      htmlFor='is_package'
                      className='flex justify-start items-center gap-2 text-sm cursor-pointer'
                    >
                      <input
                        type='checkbox'
                        name='is_package'
                        id='is_package'
                        checked={formData.is_package}
                        onChange={handleInputChange}
                      />
                      Package
                    </label>
                  </div>

                  <div className='flex flex-col justify-start items-start gap-3 w-full'>
                    <label htmlFor='price'>Package Price:</label>
                    <input
                      type='number'
                      name='price'
                      id='price'
                      value={formData.price}
                      onChange={handleInputChange}
                      disabled={!formData.is_package}
                      className='h-12 outline-none rounded-md border border-gray w-full indent-3 disabled:bg-gray-100'
                      min='0'
                      step='0.01'
                    />

                    {errors.price && (
                      <span className='text-red-500 text-sm'>
                        {errors.price}
                      </span>
                    )}
                  </div>

                  <button
                    type='button'
                    onClick={() => {
                      setDisplay('subservce')
                      setIsPackageModal(false)
                    }}
                    className='bg-primary h-12 px-5 text-white rounded-md flex justify-center items-center ml-auto hover:bg-primary/90 transition-colors'
                  >
                    Proceed
                  </button>
                </form>
              </section>
            )}
          </section>
        ) : (
          <section className='flex flex-col justify-start items-start gap-5 w-full h-[70vh] overflow-auto scrollbar-hide '>
            <div className='flex flex-col justify-start items-start gap-2 w-full'>
              <label className='font-medium '>Name</label>
              <input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className='border rounded-md w-full indent-5 h-14 outline-none '
              />
            </div>

            <div className='flex flex-col justify-start items-start gap-2 w-full'>
              <label className='font-medium '>Type</label>
              <select
                name='type'
                id='type'
                onChange={handleServiceTypeChange}
                className='border rounded-md w-full indent-2 h-14 outline-none '
              >
                <option value='walk-in'>Walk-in</option>
                <option value='home service'>Home service</option>
              </select>
            </div>

            <div className='flex flex-col justify-start items-start gap-2 w-full relative'>
              <label className='font-medium left-2'>Price </label>
              <input
                name='price'
                type='number'
                id='price'
                disabled={formData.is_package}
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                className='border rounded-md w-full indent-8 h-14 outline-none '
              />
              <FaNairaSign className='absolute top-[51px] left-2' />
            </div>

            <div className='flex flex-col justify-start items-start gap-3 w-full relative'>
              <span className='font-medium left-2'>Duration</span>

              <div className='flex items-center border rounded-md h-14 w-full'>
                <input
                  type='number'
                  value={serviceDuration}
                  onChange={handleChange}
                  min={1}
                  max={60}
                  className='w-full h-full indent-2 bg-transparent outline-none'
                />
              </div>
            </div>

            <section className='flex flex-col justify-start gap-2'>
              <label htmlFor='photos'>Service Image:</label>

              <div className='grid grid-cols-3 content-center gap-5 w-full'>
                {images.map((image, i) => {
                  return (
                    <div className='relative'>
                      <button
                        type='button'
                        onClick={() => removeImage(i)}
                        className='cursor-pointer text-xl absolute -top-2 -right-2 z-10'
                      >
                        <CgClose />
                      </button>
                      <Image
                        key={i}
                        src={image}
                        width={80}
                        height={80}
                        alt='Service photos'
                        className='w-[80px] h-[80px] rounded-md object-cover object-center '
                      />
                    </div>
                  )
                })}

                {images.length < 2 && (
                  <span className='flex justify-start items-start'>
                    <label
                      htmlFor='photos'
                      className='cursor-pointer text-lightgrey text-[5rem] '
                    >
                      <LuImagePlus />
                    </label>
                    <input
                      type='file'
                      accept='image/*'
                      id='photos'
                      style={{ display: 'none' }}
                      className=''
                      onChange={(e) => handleImageUpload(e)}
                    />
                  </span>
                )}
              </div>
            </section>

            <div className='flex justify-end items-center gap-4 ml-auto'>
              <button
                type='button'
                onClick={() => setDisplay('service')}
                className='border border-lightgrey rounded-full h-14 px-5 w-28'
              >
                Cancel
              </button>
              <button
                type='button'
                disabled={!canSaveItem()}
                onClick={() => saveItem()}
                className={clsx(
                  `h-14 text-white ring-1 ring-gray rounded-full flex justify-center items-center px-5 w-28 `,
                  canSaveItem() ? 'bg-primary' : 'bg-gray'
                )}
              >
                Save{' '}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
