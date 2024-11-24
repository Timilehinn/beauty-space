'use client'

import clsx from 'clsx'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { AiOutlineDelete } from 'react-icons/ai'
import { CgClose } from 'react-icons/cg'
import { CiEdit } from 'react-icons/ci'
import { FaGift } from 'react-icons/fa'
import { HiOutlineDotsVertical } from 'react-icons/hi'

import { getAppToken } from '../../../utils'
import {
  CREATE_DISCOUNTS,
  DELETE_DISCOUNTS,
  GET_DISCOUNTS,
  UPDATE_DISCOUNTS,
} from '../../../api/marketingRoutes'
import { requestResponse } from '../../../hooks/requestResponse'
import discountTagIcon from '../../../assets/icons/discount-tag.png'
import { useUserPlanAccess } from '../../../hooks/userPlanAccesss'
import {
  getCreateDiscountModal,
  getCreating,
  getCurrentPlan,
  getDeleteModal,
  getDiscountContextMenu,
  getDiscountDetails,
  getDiscounts,
  getErrorMsg,
  getExpire,
  getLoading,
  getPercentage,
  getSelectedWorkspace,
  getStart,
  setCreateDiscountModal,
  setCreating,
  setDeleteModal,
  setDiscountContextMenu,
  setDiscounts,
  setDiscountsDetails,
  setErrorMsg,
  setExpire,
  setFailure,
  setLoading,
  setPercentage,
  setStart,
} from '../../../redux/settingsMarketing'
import { getCurrentBusiness } from '../../../redux/workspaceSlice'

export default function MarketingComp() {
  const router = useRouter()
  const dispatch = useDispatch()
  const contextRef = useRef(null)
  const token = getAppToken()

  const [deleting, setDeleting] = useState(false)

  const { checkPermission } = useUserPlanAccess()

  const loading = useSelector(getLoading)
  const startDate = useSelector(getStart)
  const creating = useSelector(getCreating)
  const errorMsg = useSelector(getErrorMsg)
  const expireDate = useSelector(getExpire)
  const discounts = useSelector(getDiscounts)
  const percentage = useSelector(getPercentage)
  const createModal = useSelector(getCreateDiscountModal)
  const contextMenu = useSelector(getDiscountContextMenu)
  const selectedWorkspace = useSelector(getSelectedWorkspace)
  const deleteModal = useSelector(getDeleteModal)
  const discountDetails = useSelector(getDiscountDetails)
  const currentPlan = useSelector(getCurrentPlan)
  const currentBusiness = useSelector(getCurrentBusiness)

  const [localDetails, setLocalDetails] = useState({
    percentage: '',
    started_at: '',
    expired_at: '',
  })

  const getOwnersDiscounts = async () => {
    dispatch(setLoading(false))
    try {
      const res = await GET_DISCOUNTS(token)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = requestResponse(res)

      console.log('data', data)

      if (status) {
        dispatch(setDiscounts(data.data))
      } else {
        throw new Error(
          'An error occurred while trying to get discount, kindly try again!',
          error
        )
      }
    } catch (err) {
      // throw new Error('Something went wrong, please try again')
    } finally {
      dispatch(setLoading(false))
      dispatch(setFailure(false))
    }
  }

  useEffect(() => {
    getOwnersDiscounts()
  }, [token, dispatch])

  /**
   * The function `formatDateToYMDHIS` converts a given date string into a formatted string in the
   * format "YYYY-MM-DD HH:MM:SS".
   * @param dateString - The `dateString` parameter in the `formatDateToYMDHIS` function is a string
   * representing a date and time in a format that can be recognized by the `Date` constructor in
   * JavaScript. This string can be in various formats such as "YYYY-MM-DDTHH:mm:ss"
   * @returns The function `formatDateToYMDHIS` takes a date string as input, converts it to a Date
   * object, and then formats it into a string in the format "YYYY-MM-DD HH:MM:SS". The function
   * returns this formatted date string.
   */
  function formatDateToYMDHIS(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  /**
   * The function generates a random discount code of a specified length using alphanumeric characters.
   * @param length - The `length` parameter in the `generateDiscountCode` function is used to specify
   * the length of the discount code that will be generated. If no length is provided, the default
   * length is set to 6 characters.
   * @returns The function `generateDiscountCode` returns a randomly generated discount code of the
   * specified length (default length is 6 characters) using a combination of uppercase letters and
   * numbers.
   */
  function generateDiscountCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const codeLength = length || 6
    let discountCode = ''
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      discountCode += characters.charAt(randomIndex)
    }
    return discountCode
  }

  /**
   * The function `handleCreateDiscounts` is responsible for creating a discount code by sending a POST
   * request with the necessary data and handling the response accordingly.
   */
  const handleCreateDiscounts = async () => {
    if (!token) {
      return
    }
    const generatedCode = generateDiscountCode(6)

    const formData = {
      workspaces_id: currentBusiness.id,
      code: generatedCode,
      percentage: percentage,
      started_at: formatDateToYMDHIS(startDate),
      expired_at: formatDateToYMDHIS(expireDate),
    }

    dispatch(setCreating(true))

    try {
      const response = await CREATE_DISCOUNTS(token, formData)

      const { status, data, error } = requestResponse(response)

      if (status) {
        dispatch(setCreating(false))
        toast.success(`Your discount code has been created successfully`)
        dispatch(setCreateDiscountModal(false))
        router.refresh()
      } else {
        toast.error(
          `An error occurred while creating discount for this business`
        )
        dispatch(setCreating(false))

        dispatch(setErrorMsg(error))
      }
    } catch {
      dispatch(setCreating(false))
    }
  }

  /**
   * The function `handleDeleteDiscount` is an asynchronous function that handles the deletion of a
   * discount code, displaying success message if successful and error message if not.
   * @param discountId - The `discountId` parameter in the `handleDeleteDiscount` function is the unique
   * identifier of the discount code that you want to delete. This identifier is used to specify which
   * discount code should be removed when making the API call to delete discounts.
   * @returns The `handleDeleteDiscount` function is returning a Promise since it is an async function.
   * The function will either resolve with the result of the deletion process or reject with an error if
   * there was an issue during the deletion process.
   */
  const handleDeleteDiscount = async (discountId) => {
    if (!token) return
    setDeleting(true)
    try {
      const res = await DELETE_DISCOUNTS(token, discountId)

      const { status, data, error } = requestResponse(res)

      if (status) {
        toast.success('You successfully remove a discount code')
        dispatch(setDeleteModal(false))
        setDeleting(false)
      } else {
        throw new Error(
          error ||
            'An error while trying to delete this discount code, kindly try again!'
        )
      }
    } catch (error) {
      setDeleting(false)
    } finally {
      setDeleting(false)
    }
  }

  /**
   * The function `handleUpdateDiscounts` updates discount details with error handling and toast
   * notifications.
   * @returns The `handleUpdateDiscounts` function is returning either nothing (undefined) if there is no
   * `token`, or it will execute the update process for discount details and handle the response
   * accordingly.
   */
  const handleUpdateDiscounts = async () => {
    if (!token) {
      return
    }

    const discountData = {
      ...localDetails,
      started_at: formatDateToYMDHIS(localDetails.started_at),
      expired_at: formatDateToYMDHIS(localDetails.expired_at),
    }

    try {
      const res = await UPDATE_DISCOUNTS(
        token,
        discountDetails.id,
        discountData
      )

      const { status, error, data } = requestResponse(res)

      if (status) {
        toast.success('You successfully update your discount details')
        dispatch(setDiscountsDetails(false))
        // getOwnersDiscounts()
      } else {
        toast.error('An error occurred, try again!')
      }
    } catch (error) {}
  }

  /* The above code is checking if the variables `selectedWorkspace`, `percentage`, `startDate`, and
`expireDate` are all falsy. If any of these variables is falsy, the `isSubmitDisabled` variable will
be set to `true`, indicating that the submit button should be disabled. */
  const isSubmitDisabled =
    !selectedWorkspace || !percentage || !startDate || !expireDate

  const handleClickOutside = (event) => {
    if (contextRef.current && !contextRef.current.contains(event.target)) {
      dispatch(setDiscountContextMenu(false))
    }
  }

  useEffect(() => {
    if (discountDetails) {
      setLocalDetails({
        percentage: discountDetails.percentage,
        started_at: formatDateToYMDHIS(discountDetails.started_at),
        expired_at: formatDateToYMDHIS(discountDetails.expired_at),
      })
    }
  }, [discountDetails])

  const handleInputChange = (event) => {
    const { name, value } = event.target

    // Check if the input is for the expiration date
    if (name === 'expired_at') {
      const selectedDate = new Date(value)
      const currentDate = new Date(localDetails.expired_at)

      // If the selected date is in the past, do not update the state
      if (selectedDate <= currentDate) {
        toast.error('Please select a future date.')
        return
      }
    }

    // Update the state with the new value
    setLocalDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }))
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // if (loading) return <span className='text-lg'>Loading...</span>

  return (
    <main className='flex flex-col justify-start items-start gap-10 xxl:w-[60%] xl:w-[60%] lg:w-full md:w-full sm:w-full'>
      <header className='flex justify-between items-center w-full'>
        <p className='font-medium'>Discounts</p>
        <button
          type='button'
          disabled={!checkPermission('create_discounts')}
          onClick={() => dispatch(setCreateDiscountModal(true))}
          className={clsx(
            'ring-2 ring-white rounded-full h-12 px-5 text-white',
            !checkPermission('create_discounts') ? 'bg-lightgrey' : 'bg-black'
          )}
        >
          Create Discount
        </button>
      </header>

      {discounts?.length >= 1 && !loading ? (
        <section className='grid gap-5 xxl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 w-full'>
          {discounts?.map((items) => {
            const workspaceName = items?.workspace?.name || 'No workspace name'
            const expiredAt = items?.expired_at
              ? moment(items.expired_at).format('LLL')
              : 'No expiration date'

            return (
              <div key={items.id} className='rounded-md shadow-2fl'>
                <div className='relative flex flex-col justify-start items-start gap-3 p-5 rounded-t-lg bg-purple text-white '>
                  <div className='flex justify-between items-center gap-5 w-full'>
                    <h2 className='uppercase font-light text-base'>
                      discounts
                    </h2>

                    <button
                      type='button'
                      onClick={() => dispatch(setDiscountContextMenu(items.id))}
                      className={clsx('text-white text-xl')}
                    >
                      <HiOutlineDotsVertical />
                    </button>
                  </div>

                  <FaGift className='opacity-50 text-white text-7xl absolute top-8 right-14' />

                  {contextMenu === items.id && (
                    <div
                      ref={contextRef}
                      className='bg-white w-[120px] h-[90px] absolute top-4 right-3 z-20 shadow-2fl rounded-md p-1 flex flex-col justify-start items-start '
                    >
                      <button
                        // disabled={!hasPermission('discounts:update')}
                        onClick={() => dispatch(setDiscountsDetails(items))}
                        className={clsx(
                          'hover:bg-gray h-12 rounded-md w-full flex justify-start items-center gap-2 p-1'
                          // hasPermission('discounts:update')
                          //   ? 'text-black'
                          //   : 'text-lightgrey'
                        )}
                      >
                        <CiEdit className='text-lg' /> Edit
                      </button>
                      <button
                        // disabled={!hasPermission('discounts:delete')}
                        onClick={() => dispatch(setDeleteModal(items.id))}
                        className={clsx(
                          'hover:bg-gray h-12 text-black rounded-md w-full flex justify-start items-center gap-2 p-1'
                          // hasPermission('discounts:delete')
                          //   ? 'text-black'
                          //   : 'text-lightgrey'
                        )}
                      >
                        <AiOutlineDelete className='text-lg' /> Delete
                      </button>
                    </div>
                  )}

                  <h1 className='font-bold text-5xl uppercase'>
                    {items.percentage || 0}% off
                  </h1>
                </div>

                <div className='bg-white p-2 flex flex-col gap-1 rounded-b-lg '>
                  <span className='font-semibold'>{items.code}</span>
                  <span className='font-light text-sm text-lightgrey'>
                    Expire at: {expiredAt}
                  </span>
                </div>

                {deleteModal === items.id && (
                  <div className='fixed h-screen w-full bg-lightblack z-20 top-0 left-0 flex flex-col justify-center items-center'>
                    <div className='bg-white flex flex-col justify-start items-start gap-5 p-5 rounded-lg xxl:w-[30%] xl:w-[40%] lg:w-[40%] md:w-[60%] sm:w-[90%] '>
                      <div className='w-full flex flex-col gap-2'>
                        <div className='flex justify-between items-center w-full'>
                          <h3 className='font-semibold'>
                            Delete discount code:
                          </h3>

                          <button
                            type='button'
                            onClick={() => dispatch(setDeleteModal(false))}
                            className='text-xl'
                          >
                            <CgClose />
                          </button>
                        </div>

                        <hr className='border-gray w-full' />
                      </div>

                      <p className='font-light w-[80%]'>
                        Your client will not be able to use this discount code
                        again
                      </p>

                      <div className='flex justify-end items-center gap-5 ml-auto'>
                        <button
                          type='button'
                          onClick={() => dispatch(setDeleteModal(false))}
                          className='rounded-full px-5 h-12 border border-lightgrey '
                        >
                          Cancel
                        </button>
                        <button
                          type='button'
                          onClick={() => handleDeleteDiscount(items.id)}
                          className='rounded-full px-5 h-12 bg-danger text-white '
                        >
                          {!deleting ? 'Delete' : 'Deleting...'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {discountDetails && (
                  <section className='fixed h-screen w-full bg-lightblack z-20 top-0 left-0 flex flex-col justify-center items-center'>
                    <div className='bg-white flex flex-col justify-start items-start gap-5 p-5 rounded-lg xxl:w-[30%] xl:w-[40%] lg:w-[40%] md:w-[60%] sm:w-[90%] '>
                      <div className='flex justify-between items-center w-full'>
                        <h3 className='font-semibold'>Create Discounts</h3>
                        <button
                          type='button'
                          onClick={() => dispatch(setDiscountsDetails(false))}
                          className='text-xl'
                        >
                          <CgClose />{' '}
                        </button>
                      </div>

                      <hr className='w-full border-gray' />

                      <form className='flex flex-col justify-start items-start gap-5 w-full'>
                        <div className='flex flex-col justify-start items-start gap-3 w-full'>
                          <label htmlFor='code' className='text-sm'>
                            Percentage
                          </label>

                          <input
                            type='number'
                            name='percentage'
                            id='percentage'
                            disabled
                            value={localDetails?.percentage}
                            // onChange={handleInputChange}
                            className='h-12 w-full rounded-md outline-none border border-gray focus:border-lightgrey indent-2'
                          />
                        </div>

                        <div className='flex flex-col justify-start items-start gap-3 w-full'>
                          <label htmlFor='code' className='text-sm'>
                            Start date
                          </label>

                          <input
                            type='datetime-local'
                            name='started_at'
                            id='started_at'
                            disabled
                            value={localDetails?.started_at}
                            className='h-12 w-full rounded-md outline-none border border-gray focus:border-lightgrey indent-2'
                          />
                        </div>

                        <div className='flex flex-col justify-start items-start gap-3 w-full'>
                          <label htmlFor='code' className='text-sm'>
                            Expire date
                          </label>

                          <input
                            type='datetime-local'
                            name='expired_at'
                            id='expired_at'
                            value={localDetails?.expired_at}
                            onChange={handleInputChange}
                            className='h-12 w-full rounded-md outline-none border border-gray focus:border-lightgrey indent-2'
                          />
                        </div>

                        <div className='flex justify-end items-end  gap-5 ml-auto '>
                          <button
                            type='button'
                            onClick={() => dispatch(setDiscountsDetails(true))}
                            className='border border-lightgrey rounded-full h-12 px-5'
                          >
                            Cancel
                          </button>

                          <button
                            type='button'
                            disabled={
                              creating ||
                              !localDetails?.percentage ||
                              !localDetails?.started_at ||
                              !localDetails?.expired_at
                            }
                            onClick={handleUpdateDiscounts}
                            className={clsx(
                              'text-white px-5 h-12 rounded-full ring-2 ring-gray bg-primary',
                              creating && 'cursor-not-allowed opacity-50'
                            )}
                          >
                            {!creating ? 'Update' : 'Updating...'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </section>
                )}
              </div>
            )
          })}
        </section>
      ) : (
        <section className='flex flex-col justify-start items-start gap-5 w-full '>
          <div className='flex flex-col justify-center items-center gap-3 m-auto h-[20rem] '>
            <Image
              src={discountTagIcon}
              alt='discount tag'
              width={100}
              height={100}
            />
            <p className=''>No discount created yet</p>
          </div>
        </section>
      )}

      {createModal && (
        <div className='fixed h-screen w-full top-0 left-0 z-20 bg-lightblack flex flex-col justify-center items-center'>
          <div className='bg-white rounded-lg flex flex-col gap-5 p-5 lg:w-[40%] md:w-[60%] sm:w-[90%] '>
            <div className='flex justify-between items-center w-full'>
              <h3 className='font-semibold'>Create Discounts</h3>
              <button
                type='button'
                onClick={() => dispatch(setCreateDiscountModal(false))}
                className='text-xl'
              >
                <CgClose />{' '}
              </button>
            </div>

            <hr className='w-full border-gray' />

            <form className='flex flex-col justify-start items-start gap-5 w-full'>
              {/* <div className='flex flex-col justify-start items-start gap-3 w-full'>
                <label htmlFor='workspace_id' className='text-sm'>
                  Select business
                </label>

                <select
                  name='workspace_id'
                  id='workspace_id'
                  className='h-12 w-full rounded-md outline-none border border-gray focus:border-lightgrey indent-2'
                  value={selectedWorkspace}
                  onChange={(e) =>
                    dispatch(setSelectedWorkspace(e.target.value))
                  }
                >
                  <option value=''>Select a business</option>
                  {businessList.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    )
                  })}
                </select>
              </div> */}

              <div className='flex flex-col justify-start items-start gap-3 w-full'>
                <label htmlFor='code' className='text-sm'>
                  Percentage
                </label>

                <input
                  type='number'
                  name='percentage'
                  id='percentage'
                  value={percentage}
                  onChange={(e) => dispatch(setPercentage(e.target.value))}
                  className='h-12 w-full rounded-md outline-none border border-gray focus:border-lightgrey indent-2'
                />
              </div>

              <div className='flex flex-col justify-start items-start gap-3 w-full'>
                <label htmlFor='code' className='text-sm'>
                  Start date
                </label>

                <input
                  type='datetime-local'
                  name='started_at'
                  id='started_at'
                  value={startDate}
                  onChange={(e) => dispatch(setStart(e.target.value))}
                  className='h-12 w-full rounded-md outline-none border border-gray focus:border-lightgrey indent-2'
                />
              </div>

              <div className='flex flex-col justify-start items-start gap-3 w-full'>
                <label htmlFor='code' className='text-sm'>
                  Expire date
                </label>

                <input
                  type='datetime-local'
                  name='expired_at'
                  id='expired_at'
                  value={expireDate}
                  onChange={(e) => dispatch(setExpire(e.target.value))}
                  className='h-12 w-full rounded-md outline-none border border-gray focus:border-lightgrey indent-2'
                />
              </div>

              {errorMsg.length >= 1 && (
                <ul className='flex flex-col justify-start items-start gap-2 w-full px-5'>
                  {errorMsg.map((err, index) => {
                    return (
                      <li key={index} className='text-sm text-danger list-disc'>
                        {err}
                      </li>
                    )
                  })}
                </ul>
              )}

              <div className='flex justify-end items-end  gap-5 ml-auto '>
                <button
                  type='button'
                  onClick={() => dispatch(setCreateDiscountModal(false))}
                  className='border border-lightgrey rounded-full h-12 px-5'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  disabled={isSubmitDisabled}
                  onClick={() => handleCreateDiscounts()}
                  className={clsx(
                    'text-white px-5 h-12 rounded-full ring-2 ring-gray',
                    !isSubmitDisabled ? 'bg-primary' : 'bg-lightgrey'
                  )}
                >
                  {!creating ? 'Create Discount' : 'Creating...'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
