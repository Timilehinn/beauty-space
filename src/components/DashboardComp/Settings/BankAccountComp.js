'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Field, Form, Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

import { toast } from 'react-toastify'
import { MdClose, MdDeleteOutline } from 'react-icons/md'
import { GoArrowUpRight } from 'react-icons/go'
import { BsBank } from 'react-icons/bs'

import { TextField } from '../../loginComp/TextField'
import useCookieHandler from '../../../hooks/useCookieHandler'

import {
  getModal,
  setBanks,
  setFailure,
  setLoadingBanks,
  setModal,
  getBanks,
  setValidatedAccount,
  getValidatedAccount,
  getSavedBankDetails,
  setSavedBankDetails,
  setAddBankErrors,
  getAddBankErrors,
  setAccountBalance,
} from '../../../redux/financeSlice'
import { getUserInfo } from '../../../redux/admin_user'
import AvailableBalance from '../AvailableBalance'
import { setDspType } from '../../../redux/dashboard_related'
import { useUserPlanAccess } from '../../../hooks/userPlanAccesss'

export default function BankAccountComp() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { token } = useCookieHandler('user_token')

  const { checkPermission } = useUserPlanAccess()

  const [validateLoading, setValidateLoading] = useState(false)
  const [validateFailure, setValidateFailure] = useState(false)
  const [isBankDetailsValidated, setIsBankDetailsValidated] = useState(false)
  const [selectedBank, setSelectedBank] = useState(null)

  const modal = useSelector(getModal)
  const userData = useSelector(getUserInfo)
  const availableBanks = useSelector(getBanks)
  const addBankErrors = useSelector(getAddBankErrors)
  const savedAccounts = useSelector(getSavedBankDetails)
  const validatedAccountDetails = useSelector(getValidatedAccount)

  const getAvailableBalance = useCallback(async () => {
    if (!token) return
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/user-dashboard`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 401) {
        router.push('/')
        return
      }

      const data = await response.json()

      // Update the state with the converted value
      dispatch(setAccountBalance(data.data.total_expenses))

      if (data?.status !== true) {
        return
      }
    } catch (error) {}
  }, [token])

  /**
   * The function `getAvailableBanks` makes an asynchronous request to fetch available banks data and
   * handles success and error responses accordingly.
   */
  const getAvailableBanks = useCallback(async () => {
    if (!token) return
    dispatch(setLoadingBanks(true))

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/banks`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 401) {
        router.push('/')
        return
      }

      const data = await response.json()

      if (data?.status === true) {
        dispatch(setLoadingBanks(false))
        dispatch(setFailure(false))
        dispatch(setBanks(data?.data?.data))
      } else {
        dispatch(setLoadingBanks(false))
        dispatch(setFailure(true))
      }
    } catch (error) {
      dispatch(setLoadingBanks(false))
      dispatch(setFailure(true))
    }
  }, [dispatch, token])

  /**
   * The function `getSavedAccount` fetches account data from a specified URL using a bearer token and
   * updates the state based on the response status.
   */
  const getSavedAccount = useCallback(async () => {
    if (!token) return
    dispatch(setLoadingBanks(true))

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/accounts`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 401) {
        router.push('/')
        return
      }

      const data = await response.json()

      if (data?.status === true) {
        dispatch(setLoadingBanks(false))
        dispatch(setFailure(false))
        dispatch(setSavedBankDetails(data?.data))
      } else {
        dispatch(setLoadingBanks(false))
        dispatch(setFailure(true))
      }
    } catch (error) {
      dispatch(setLoadingBanks(false))
      dispatch(setFailure(true))
    }
  }, [dispatch, token])

  /**
   * The function `handleAddBankDetails` sends a POST request to validate bank account details and
   * updates state based on the response.
   * @param values - The `values` parameter in the `handleAddBankDetails` function likely contains the
   * data needed to validate a bank account. This data could include information such as the bank code,
   * account number, and any other details required for the validation process. The function sends this
   * data to a server endpoint for validation
   */
  const handleAddBankDetails = async (values) => {
    if (!token) return
    setValidateLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/accounts/account-validation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      )

      // if (res.status === 401) {
      //   router.push('/')
      //   return
      // }

      const data = await res.json()

      if (data?.status === true) {
        setValidateLoading(false)
        setValidateFailure(false)
        dispatch(setValidatedAccount(data?.data?.account_data))
        setIsBankDetailsValidated(true)

        // Store the selected bank information in state
        const selectedBankInfo = availableBanks.find(
          (bank) => bank.sort_code === values.bank_code
        )
        // setSelectedBank(selectedBankInfo)
      } else {
        setValidateLoading(false)
        setValidateFailure(true)
        setIsBankDetailsValidated(false)
        dispatch(setAddBankErrors(data?.errors || []))
        return
      }
    } catch (error) {}
  }

  const handleAddBankAccount = async () => {
    if (!token) return
    setValidateLoading(true)

    try {
      // Check if 2FA is enabled
      if (userData.data.settings.twofa) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/accounts/create`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              account_number: validatedAccountDetails.account_number,
              bank_name: selectedBank.bank_name,
            }),
          }
        )

        const data = await res.json()

        if (data?.status === true) {
          setValidateLoading(false)
          setValidateFailure(false)
          toast.success('Your bank details have been added successfully')
          dispatch(setModal('add-bank'))
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        } else {
          setValidateLoading(false)
          setValidateFailure(true)
          dispatch(setAddBankErrors(data?.errors || []))
          return
        }
      } else {
        toast.error(
          `Navigate login & security to set up your two-factor authentication on your account before you can perform this action. `
        )

        setTimeout(() => {
          // Redirect user to 'settings' for 2FA setup
          // You can replace '/settings' with the actual route for your settings page
          // window.location.href = '/dashboard/settings'
          dispatch(setModal(false))
        }, 5000)
      }
    } catch (error) {
      toast.error('Error occurred while adding your bank details:', error)
      // Handle the error by setting an error message in state or displaying a generic error message to the user
      // Example: setErrorMessage('An error occurred while processing bank details. Please try again later.');
    } finally {
      dispatch(setAddBankErrors(data?.errors || []))
    }
  }

  useEffect(() => {
    getSavedAccount()
    getAvailableBanks()
    getAvailableBalance()
  }, [token, getSavedAccount, getAvailableBanks, getAvailableBalance])

  return (
    <>
      <main className='flex flex-col justify-start items-start gap-5 xxl:w-[60%] xl:w-[60%] lg:w-full md:w-full sm:w-full'>
        <section className='flex flex-col justify-start items-start gap-8 w-full '>
          {savedAccounts && savedAccounts?.length > 0 && (
            <AvailableBalance
              savedAccounts={savedAccounts}
              bankId={selectedBank?.id}
            />
          )}
          <article className='flex justify-between items-center w-full '>
            <h1 className=' font-medium'>Bank Detail</h1>

            <button
              type='button'
              disabled={
                !checkPermission('withdrawal_account', savedAccounts?.length)
              }
              onClick={() => dispatch(setModal(true))}
              className={clsx(
                'ring-2 ring-white rounded-full h-12 px-5 text-white',
                !checkPermission('withdrawal_account', savedAccounts?.length)
                  ? 'bg-lightgrey'
                  : 'bg-primary'
              )}
            >
              Add bank
            </button>
          </article>

          {savedAccounts?.length >= 1 &&
          checkPermission('withdrawal_account') ? (
            <div className='flex flex-col justify-start items-start gap-5 w-full'>
              <div className='bg-lightprimary flex justify-between items-center w-full p-4 rounded-md relative before:absolute before:h-full before:w-5 before:border-primary before:border-l-4 before:rounded-l-md before:top-0 before:left-0'>
                <p className='w-[60%]'>
                  {t(
                    `You've used up the limit of bank account you can add. Upgrade to add more bank accounts`
                  )}
                </p>

                <button
                  type='button'
                  onClick={() => dispatch(setDspType('billing'))}
                  className='text-primary flex justify-center items-center gap-2'
                >
                  Upgrade <GoArrowUpRight />
                </button>
              </div>

              <div className='flex flex-col justify-start items-start gap-4 w-full'>
                <p>Select a withdrawal account.</p>
                {savedAccounts?.map((acct) => {
                  return (
                    <div
                      onClick={() => setSelectedBank(acct)}
                      key={acct.id}
                      className={`${
                        selectedBank?.id === acct.id
                          ? 'border-[#4F9ED0]'
                          : 'border-[#D3D3D3]'
                      } cursor-pointer border p-4 rounded-md flex justify-between items-center w-full`}
                    >
                      <div className='flex justify-start items-center gap-3'>
                        <span className='bg-gray p-2 rounded-full h-11 w-11 flex justify-center items-center'>
                          <BsBank className='text-lg text-primary ' />
                        </span>
                        <div className='flex flex-col justify-start items-start gap-1'>
                          <h1 className='font-semibold'>{acct.bank_name}</h1>
                          <p className='text'>{acct.account_number}</p>
                        </div>
                      </div>

                      <div className='flex flex-col items-center'>
                        <div className='h-[18px] w-[18px] mb-[15px] rounded-[18px] border-[#4F9ED0] border-[1px] flex justify-center items-center'>
                          {selectedBank?.id === acct.id && (
                            <div className='h-[10px] w-[10px] rounded-[18px] bg-[#4F9ED0]' />
                          )}
                        </div>

                        <button type='button' className='text-2xl'>
                          <MdDeleteOutline />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center gap-3 m-auto h-[15rem]'>
              <BsBank className='text-[6rem] text-gray ' />
              <p className='text-lightgrey'>No bank added yet</p>
            </div>
          )}
        </section>

        {modal && (
          <article className='fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-lightblack z-10 '>
            <div className='flex flex-col justify-start items-start gap-8 bg-white shadow-2fl rounded-md p-5 xxl:w-[40%] xl:w-[40%] lg:w-[40%] md:w-[80%] sm:w-[90%] '>
              <header className='flex justify-between items-center w-full'>
                <h1 className='text-lg font-semibold'>Add bank details</h1>
                <button
                  type='button'
                  onClick={() => {
                    dispatch(setModal(false))
                  }}
                  className='cursor-pointer text-xl'
                >
                  <MdClose />{' '}
                </button>
              </header>

              <div className='flex flex-col justify-center items-center gap-3 w-full'>
                <Formik
                  initialValues={{
                    bank_code: '',
                    account_number: '',
                  }}
                  onSubmit={(values, actions) => {
                    handleAddBankDetails(values, actions)
                  }}
                >
                  {() => (
                    <Form className='w-full flex flex-col justify-start items-start gap-5'>
                      <div className='flex flex-col justify-start items-start gap-2 w-full'>
                        <label htmlFor='bank_code' className='font-medium'>
                          Banks
                        </label>
                        <Field
                          as='select'
                          name='bank_code'
                          className='h-11 w-full border border-lightgrey px-4 rounded-lg outline-none xl:text-base lg:text-base md:text-lg sm:text-base '
                        >
                          <option value='' disabled>
                            Select a bank
                          </option>
                          {availableBanks.map((item) => (
                            <option key={item.id} value={item.sort_code}>
                              {item.bank_name}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <TextField
                        type='text'
                        label='Account Number'
                        name='account_number'
                        placeholder='Enter your account number'
                        className='border border-lightgrey h-11 rounded-md outline-none w-full indent-3'
                      />

                      {!validateLoading && (
                        <h1 className='text-lg uppercase font-medium'>
                          {validatedAccountDetails.account_name}
                        </h1>
                      )}

                      {Object.keys(addBankErrors)?.length > 0 && (
                        <div className='flex flex-col justify-start items-start gap-2 w-full px-5'>
                          <ul>
                            {Object.entries(addBankErrors)?.map(
                              ([key, value]) => (
                                <li key={key} className='text-danger list-disc'>
                                  {Array.isArray(value)
                                    ? `${key}: ${value.join(', ')}`
                                    : `${key}: ${value}`}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {!isBankDetailsValidated ? (
                        <button
                          type='submit'
                          className='h-12 py-2 px-5 rounded-md text-white bg-primary ml-auto '
                        >
                          {validateLoading ? 'Validating...' : 'Add Bank'}
                        </button>
                      ) : (
                        <button
                          type='button'
                          onClick={() => {
                            handleAddBankAccount()
                          }}
                          className='h-12 py-2 px-5 rounded-md text-white bg-primary ml-auto '
                        >
                          {validateLoading ? 'Saving...' : 'Save'}
                        </button>
                      )}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </article>
        )}
      </main>
    </>
  )
}
