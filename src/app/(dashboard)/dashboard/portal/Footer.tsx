import clsx from 'clsx'
import { Field, Form, Formik } from 'formik'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { CgClose } from 'react-icons/cg'
import { FaGift } from 'react-icons/fa'
import {
  MdDiscount,
  MdHistory,
  MdOutlinePercent,
  MdQrCode,
} from 'react-icons/md'

import { APPLY_DISCOUNT } from '../../../../api/discountRoutes'
import {
  CREATE_LOYALTY,
  GET_LOYALTY,
  GET_LOYALTY_CUSTOMERS,
} from '../../../../api/loyaltyRoute'
import { handleResponse } from '../../../../api/router'
import {
  CreateLoyalCustomer,
  Discount,
  GroupedServiceItem,
  LoyaltyCustomer,
} from '../../../../global/types'
import { getAppToken } from '../../../../utils'
import Loading from '../../../loading'
import { requestResponse } from '../../../../hooks/requestResponse'
import { getAccountType, getUserInfo } from '../../../../redux/admin_user'
import { TimesIcon } from '../../../../assets/icons'

type Props = {
  discounts: Array<Discount>
  workspaceId: number | undefined
  onDiscountValidated: (data: Omit<Discount, 'workspace'>) => void
  services: Array<GroupedServiceItem>
  qrCode: string
  // loyaltyCustomers: Array<LoyaltyCustomer>
}

const LoyaltyFormSchema = Yup.object().shape({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  // phone_number: Yup.string().required('Phone Number is required'),
})

export default function Footer(props: Props) {
  const { discounts, onDiscountValidated, workspaceId, services, qrCode } =
    props

  const router = useRouter()
  const token = getAppToken()
  const userInfo = useSelector(getUserInfo)

  const [qrModal, showQrModal] = useState(false)
  const [loading, showLoading] = useState(false)
  const [discountModal, setDiscountModal] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  )
  const [loyaltyModal, setLoyaltyModal] = useState(false)
  const [createLoyaltyModal, setCreateLoyaltyModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [loyaltyCustomers, setLoyaltyCustomers] = useState([])
  const [suggestions, setSuggestions] = useState<LoyaltyCustomer | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [customerCreationCode, setCustomerCreationCode] = useState(null)
  const [customerCodeModal, setCustomerCodeModal] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const accountType = useSelector(getAccountType)

  // const actions = useMemo(() => {
  //   const isDisabled = () => {
  //     if (services.length === 0) {
  //       return true
  //     }
  //     return loading || discounts.length === 0
  //   }

  //   return [
  //     {
  //       name: 'History',
  //       onClick: () => router.push('/dashboard/bookings'),
  //       icon: <MdHistory size={20} color='white' />,
  //       disabled: false,
  //       loading: false,
  //     },
  //     {
  //       name: 'Apply discount',
  //       onClick: () => setDiscountModal(true),
  //       icon: <MdDiscount size={20} color='white' />,
  //       disabled: isDisabled(),
  //       loading: false,
  //     },
  //     {
  //       name: 'QR Code',
  //       onClick: () => showQrModal(true),
  //       icon: <MdQrCode size={25} color='white' />,
  //       disabled: false,
  //       loading: false,
  //     },
  //     {
  //       name: 'Loyalty',
  //       onClick: () => setLoyaltyModal(true),
  //       icon: <MdOutlinePercent size={25} color='white' />,
  //       disabled: false,
  //       loading: false,
  //     },
  //   ]
  // }, [discounts, loading, services])

  const actions = useMemo(() => {
    const isDisabled = () => {
      if (services.length === 0) {
        return true
      }
      return loading || discounts.length === 0
    }

    const baseActions = [
      {
        name: 'History',
        onClick: () => router.push('/dashboard/bookings'),
        icon: <MdHistory size={20} color='white' />,
        disabled: false,
        loading: false,
      },
      {
        name: 'Apply discount',
        onClick: () => setDiscountModal(true),
        icon: <MdDiscount size={20} color='white' />,
        disabled: isDisabled(),
        loading: false,
      },
      {
        name: 'QR Code',
        onClick: () => showQrModal(true),
        icon: <MdQrCode size={25} color='white' />,
        disabled: false,
        loading: false,
      },
    ]

    /* The above code is checking if the `loyalty_program` setting is enabled for a user in the
  `userInfo` object. If the `loyalty_program` setting is truthy, it adds an action object to the
  `baseActions` array. This action object includes a name, onClick function to set a `loyaltyModal`
  state to true, an icon component, and flags for disabled and loading states. */
    if (userInfo?.settings?.loyalty_program) {
      baseActions.push({
        name: 'Loyalty',
        onClick: () => setLoyaltyModal(true),
        icon: <MdOutlinePercent size={25} color='white' />,
        disabled: false,
        loading: false,
      })
    }

    return baseActions
  }, [discounts, loading, services, userInfo?.settings?.loyalty_program])

  const applyDiscount = async () => {
    try {
      if (selectedDiscount) {
        setIsLoading(true)
        const res = await APPLY_DISCOUNT(
          token,
          selectedDiscount?.code,
          workspaceId as number
        )
        const { status, error, data } =
          handleResponse<Omit<Discount, 'workspace'>>(res)
        if (status) {
          onDiscountValidated(data)
          setSelectedDiscount(null)
          toast.success('Discount applied successfully')
        } else {
          throw new Error('Failed to apply discount, please try again.')
        }
      } else {
        throw new Error('Select a discount to continue.')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const closeDiscountModal = () => {
    setDiscountModal(false)
    setSelectedDiscount(null)
  }

  const fetchLoyaltyCustomer = async () => {
    try {
      const res = await GET_LOYALTY_CUSTOMERS(token)

      const { data, status, error } = requestResponse(res)

      if (error.errors.message === 'Unauthorized') return

      if (status) {
        setLoyaltyCustomers(data?.data)
        toast.error(error)
      } else {
        throw new Error('An error occurred')
      }
    } catch (error) {}
  }

  /**
   * The function `handleSearchLoyalCustomer` fetches loyalty customers based on a search term and
   * updates suggestions accordingly.
   * @param {string} term - The `term` parameter in the `handleSearchLoyalCustomer` function is a string
   * that represents the search term used to look for loyal customers. This term is passed to the
   * `GET_LOYALTY` function to retrieve loyalty customer data based on the provided search term.
   */
  const handleSearchLoyalCustomer = async (term: string) => {
    try {
      setIsLoading(true) // Start loading
      setHasSearched(true) // Mark that a search has been initiated
      const res = await GET_LOYALTY(token, term) // Assuming GET_LOYALTY accepts a search term as a parameter

      const { data, status, error } = requestResponse(res)

      if (status) {
        setSuggestions(data || null)
      } else {
        throw new Error('An error occurred')
      }
    } catch (error) {
      // console.error('Error fetching loyalty customers:', error)
    } finally {
      setIsLoading(false) // End loading
    }
  }

  /**
   * The handleChange function in TypeScript React updates the search term, triggers a search for loyal
   * customers, and clears suggestions if the input value is empty.
   * @param e - The parameter `e` in the `handleChange` function is of type
   * `React.ChangeEvent<HTMLInputElement>`. This means that it is an event object representing a change
   * in an input element, specifically an `<input>` element in a React component.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.trim()) {
      handleSearchLoyalCustomer(value)
    } else {
      setSuggestions(null)
      setHasSearched(false) // Reset hasSearched if input is cleared
    }
  }

  /**
   * The function `handleCreateLoyalty` is responsible for creating a loyalty account for a customer and
   * handling the response accordingly.
   * @param {LoyaltyCustomer} values - The `values` parameter in the `handleCreateLoyalty` function is of
   * type `LoyaltyCustomer`. This parameter likely contains the data needed to create a loyalty account
   * for a customer, such as their name, email, loyalty points, etc.
   */
  const handleCreateLoyalty = async (values: CreateLoyalCustomer) => {
    setIsLoading(true)
    try {
      const res = await CREATE_LOYALTY(token, values)
      const { data, status, error } = requestResponse(res)

      if (status) {
        toast.success(
          'You have successfully created a loyalty account for this customer!'
        )
        setCustomerCreationCode(data?.code)
        setIsLoading(false)
        // setCreateLoyaltyModal(false)
        setCustomerCodeModal(true)
      } else {
        setErrorMsg(error)
        setIsLoading(false)
        throw new Error('An error occurred', error)
      }
    } catch (error) {
      setIsLoading(false)
      // console.error(error.message || 'An unexpected error occurred.')
    }
  }

  useEffect(() => {
    if (accountType !== 'Staff') {
      fetchLoyaltyCustomer()
    }
  }, [token, accountType])

  return (
    <div className='flex items-center h-[90px] w-[100%] bg-white justify-center border-t-[1px] border-t-[lightgrey] pt-[5px]'>
      {actions.map((action, i) => (
        <button
          key={i}
          disabled={action.disabled}
          onClick={() => (action.disabled ? null : action.onClick())}
          className='h-[80%] w-[120px] bg-accent_blue rounded-[7px] m-[5px] cursor:pointer flex flex-col items-center justify-center'
          style={{
            opacity: action.disabled ? 0.5 : 1,
            cursor: action.disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {action.loading ? (
            <Loading />
          ) : (
            <div className='flex flex-col items-center'>
              {action.icon}
              <p className='mt-[4px] text-white text-[12px] font-jakarta'>
                {action.name}
              </p>
            </div>
          )}
        </button>
      ))}

      {qrModal && (
        <section
          onClick={() => showQrModal(false)}
          className='fixed w-full h-screen top-0 left-0 bg-lightblack z-20 flex lg:justify-center lg:items-center md:justify-center md:items-center sm:justify-start sm:items-start '
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='relative bg-white rounded-md shadow-2fl flex flex-col gap-5 overflow-auto scrollbar-hide h-auto lg:justify-start 
          lg:items-center w-auto lg:p-10 md:p-10 sm:p-5'
          >
            <img src={qrCode} />
          </div>
        </section>
      )}

      {discountModal && (
        <section
          onClick={closeDiscountModal}
          className='fixed w-full h-screen top-0 left-0 bg-lightblack z-20 flex items-center justify-center p-4'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='relative bg-white rounded-md shadow-2fl flex flex-col p-5 w-full max-w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] h-auto max-h-[90vh]'
          >
            <div className='w-full flex items-center justify-between mb-4'>
              <p className='font-jakarta font-bold text-lg'>
                Available discounts
              </p>
              <button onClick={closeDiscountModal}>
                <TimesIcon />
              </button>
            </div>

            <div className='overflow-y-scroll scrollbar-hide h-[300px] sm:h-[400px] md:h-[500px] w-full mt-[10px]'>
              {discounts.map((discount, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedDiscount(discount)}
                  className={`shadow-1fl snap-start w-full rounded-[10px] flex-shrink-0 flex flex-col items-start justify-start mb-4 ${
                    selectedDiscount?.id === discount.id
                      ? 'border-[2px] border-accent_blue'
                      : ''
                  }`}
                >
                  <div className='relative w-full flex items-center rounded-t-[10px] justify-between gap-3 p-4 bg-purple text-white'>
                    <div className='flex flex-col gap-1'>
                      <h1 className='font-bold text-[20px] sm:text-[25px] md:text-[30px] uppercase'>
                        {discount.percentage}% off
                      </h1>
                      <span className='text-sm font-light'>
                        {discount?.workspace?.name}
                      </span>
                    </div>
                    <FaGift className='opacity-30 text-white text-[50px] sm:text-[60px] md:text-[70px]' />
                  </div>

                  <div className='bg-white w-full p-2 flex flex-col gap-1 rounded-b-lg'>
                    <span className='font-semibold text-[18px] sm:text-[22px] md:text-[25px]'>
                      {discount.code}
                    </span>
                    <span className='font-light text-sm text-lightgrey'>
                      Expires at: {moment(discount.expired_at).format('LLL')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {selectedDiscount && (
              <button
                onClick={applyDiscount}
                className='w-full rounded-[10px] px-5 h-12 text-white bg-accent_blue mt-4'
              >
                Apply discount
              </button>
            )}
          </div>
        </section>
      )}

      {loyaltyModal && (
        <section className='fixed top-0 left-0 h-screen w-full flex flex-col justify-center items-center bg-lightblack z-20'>
          <div className='bg-white h-[60vh] w-[50%] m-auto rounded-md p-5 ring-1 ring-gray overflow-y-auto scrollbar-hide flex flex-col justify-start items-start gap-5 '>
            <header className='flex justify-between items-center w-full'>
              <h2 className='font-semibold'>Loyalty Program: </h2>
              <button
                type='button'
                onMouseDown={() => setLoyaltyModal(false)}
                className='text-2xl'
              >
                <CgClose />
              </button>
            </header>
            <hr className='w-full border-gray' />

            <div className='flex flex-col justify-between items-center gap-5 w-full lg:flex-row'>
              <button
                type='button'
                onMouseDown={() => setCreateLoyaltyModal(true)}
                className='flex justify-center items-center h-12 px-5 rounded-md bg-primary text-white ring-1 ring-gray'
              >
                Create Customer
              </button>

              <div className='relative w-full lg:w-[60%]'>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={handleChange}
                  placeholder='Search a loyal customer'
                  className='h-12 border border-gray outline-none indent-3 rounded-md w-full focus:border-primary '
                />

                {isLoading && (
                  <div className='absolute top-[3.5rem] left-0 w-full bg-white border border-gray rounded-md p-3 text-center'>
                    Searching...
                  </div>
                )}

                {!isLoading && hasSearched && suggestions === null && (
                  <div className='absolute top-[3.5rem] left-0 w-full bg-white border border-gray rounded-md p-3 text-center'>
                    No results found.
                  </div>
                )}

                {suggestions && !isLoading && (
                  <div className='bg-white border border-gray rounded-md w-full absolute top-[3.5rem] left-0 flex flex-col justify-start items-start gap-2 p-3'>
                    <button
                      key={suggestions.id}
                      className='p-2 hover:bg-gray cursor-pointer rounded-md w-full flex justify-start items-center gap-2'
                      onClick={() => {
                        setSearchTerm(suggestions.code) // Use the code as the selected value
                        setSuggestions(null) // Clear suggestions once selected
                        setHasSearched(false)
                      }}
                    >
                      {suggestions.code} - {suggestions.customer.first_name}{' '}
                      {suggestions.customer.last_name}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className='overflow-auto w-full'>
              <table className='min-w-full table-auto border-collapse border border-gray-300'>
                <thead>
                  <tr className='bg-gray'>
                    <th className='p-4 border border-lightgrey text-left'>
                      Loyalty Code
                    </th>
                    <th className='p-4 border border-lightgrey text-left'>
                      Name
                    </th>
                    <th className='p-4 border border-lightgrey text-left'>
                      Phone Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loyaltyCustomers.map((item) => (
                    <tr key={item.id} className='odd:bg-gray'>
                      <td className='p-4 border border-lightgrey'>
                        {item.code}
                      </td>
                      <td className='p-4 border border-lightgrey'>
                        {item.customer.first_name} {item.customer.last_name}
                      </td>
                      <td className='p-4 border border-lightgrey'>
                        {item.customer.phone_number}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {createLoyaltyModal && (
              <div className='fixed bg-lightblack z-20 top-0 left-0 w-full h-screen flex flex-col justify-center items-center'>
                <div className='bg-white flex flex-col justify-start items-start gap-5 p-5 rounded-md ring-1 ring-gray'>
                  <header className='flex justify-between items-center w-full'>
                    <h1 className='font-semibold'>Create Loyalty Customer:</h1>
                    <button
                      type='button'
                      onMouseDown={() => setCreateLoyaltyModal(false)}
                      className='text-xl'
                    >
                      <CgClose />
                    </button>
                  </header>

                  <hr className='w-full border-gray' />

                  <Formik
                    initialValues={{
                      first_name: '',
                      last_name: '',
                      email: '',
                      phone_number: '',
                    }}
                    validationSchema={LoyaltyFormSchema}
                    onSubmit={(values, { resetForm }) => {
                      handleCreateLoyalty(values)
                      // resetForm()
                    }}
                  >
                    {({ isSubmitting, values, errors }) => (
                      <Form className='flex flex-col justify-start items-start gap-5 w-full'>
                        <div className='grid grid-cols-1 content-start place-items-start gap-5 lg:grid-cols-2'>
                          <div className='flex flex-col gap-3 w-full'>
                            <label htmlFor='first_name'>First Name:</label>
                            <Field
                              type='text'
                              name='first_name'
                              id='first_name'
                              className='h-12 border border-gray outline-none indent-3 w-full rounded-md focus:border-primary'
                            />
                            {errors.first_name && (
                              <span className='text-danger'>
                                {errors.first_name}
                              </span>
                            )}
                          </div>

                          <div className='flex flex-col gap-3 w-full'>
                            <label htmlFor='last_name'>Last Name:</label>
                            <Field
                              type='text'
                              name='last_name'
                              id='last_name'
                              className='h-12 border border-gray outline-none indent-3 w-full rounded-md focus:border-primary'
                            />
                            {errors.last_name && (
                              <span className='text-danger'>
                                {errors.last_name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className='flex flex-col gap-3 w-full'>
                          <label htmlFor='email'>Email:</label>
                          <Field
                            type='email'
                            name='email'
                            id='email'
                            className='h-12 border border-gray outline-none indent-3 w-full rounded-md focus:border-primary'
                          />
                          {errors.email && (
                            <span className='text-danger'>{errors.email}</span>
                          )}
                        </div>

                        <div className='flex flex-col gap-3 w-full'>
                          <label htmlFor='phone_number'>
                            Phone Number(Optional):
                          </label>
                          <Field
                            type='number'
                            name='phone_number'
                            id='phone_number'
                            className='h-12 border border-gray outline-none indent-3 w-full rounded-md focus:border-primary'
                          />
                          {errors.phone_number && (
                            <span className='text-danger'>
                              {errors.phone_number}
                            </span>
                          )}
                        </div>

                        {errorMsg && (
                          <ul className='flex flex-col justify-start items-start gap-2 list-disc'>
                            {(Array.isArray(errorMsg)
                              ? errorMsg
                              : [errorMsg]
                            ).map((item: string, i: number) => (
                              <li key={i} className='text-danger text-sm'>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}

                        <button
                          type='submit'
                          disabled={
                            isSubmitting ||
                            !values.first_name ||
                            !values.last_name ||
                            !values.email
                          }
                          className={clsx(
                            'flex justify-center items-center text-white rounded-md h-12 px-5 ring-1 ring-gray ml-auto w-full lg:w-auto',
                            isSubmitting ||
                              !values.first_name ||
                              !values.last_name ||
                              !values.email
                              ? 'bg-lightgrey'
                              : 'bg-primary'
                          )}
                        >
                          {isSubmitting ? 'Submitting...' : 'Create Loyalty'}
                        </button>
                      </Form>
                    )}
                  </Formik>

                  {customerCreationCode && customerCodeModal && (
                    <div className='fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center bg-lightblack z-20'>
                      <div className='bg-white p-5 rounded-md ring-1 ring-gray flex flex-col justify-center items-center gap-3 w-[40%]'>
                        <span className=''>Your customer loyalty code is:</span>
                        <h1 className='text-4xl font-semibold'>
                          {customerCreationCode}
                        </h1>
                        <button
                          type='button'
                          onMouseDown={() => {
                            setCustomerCodeModal(false)
                            setCreateLoyaltyModal(false)
                          }}
                          className='bg-primary h-12 px-5 rounded-md ring-1 ring-gray text-white'
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* <FullScreenLoader modal={loading} showModal={() => {}} /> */}
    </div>
  )
}
