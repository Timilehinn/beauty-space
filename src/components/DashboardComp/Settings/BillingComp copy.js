'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie'
import moment from 'moment'
import clsx from 'clsx'

import { BsBank } from 'react-icons/bs'
import { CgClose } from 'react-icons/cg'
import { BiCheck } from 'react-icons/bi'

import {
  CANCEL_SUBSCRIPTION,
  DOWNGRADE_SUBSCRIPTION,
  UPGRADE_SUBSCRIPTION,
} from '../../../api/billingRoutes'

import {
  getCurrentUserPlan,
  getUsers,
  setCurrentUserPlan,
} from '../../../redux/admin_user'
import { pricingModels } from '../../../constants'
import { FormatAmount } from '../../../utils/formatAmount'
import { handleResponse } from '../../../api/router'
import { PaystackHook } from '../../PaystackHook'
import { CircularSpinner } from '../../LoadingIndicator'
import { usePermissions } from '../../../hooks/usePermission'
import {
  getSavedBankDetails,
  setFailure,
  setLoadingBanks,
  setSavedBankDetails,
} from '../../../redux/financeSlice'

export default function BillingComp() {
  const cookies = new Cookies()
  const router = useRouter()
  const dispatch = useDispatch()
  const token = cookies.get('user_token')

  const currentSubscriptionPlan = useSelector(getCurrentUserPlan)
  const banksListing = useSelector(getSavedBankDetails)
  const userStore = useSelector(getUsers)
  const userDetails = userStore.data

  const [upgradeToggle, setUpgradeToggle] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [interval, setInterval] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedBank, setSelectedBank] = useState(null)
  const [downgradeModal, setDowngradeModal] = useState(false)
  const [currentPlanInterval, setCurrentPlanInterval] = useState(null)

  const { hasPermission } = usePermissions()

  const getAvailableBanks = async () => {
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
        dispatch(setFailure(false))
        dispatch(setLoadingBanks(false))
        dispatch(setSavedBankDetails(data?.data))
      } else {
        throw new Error('please try again' || error)
      }
    } catch (error) {
      dispatch(setFailure(true))
    } finally {
      dispatch(setLoadingBanks(false))
    }
  }

  useEffect(() => {
    if (!token) return
    getAvailableBanks()
  }, [dispatch])

  useEffect(() => {
    if (userDetails && userDetails?.subscriptions.length > 0) {
      const _sub =
        userDetails.subscriptions[userDetails.subscriptions.length - 1]
      setInterval(_sub.subscription_plan.interval)
      setCurrentPlanInterval(_sub.subscription_plan.interval)
      const meta = pricingModels.find(
        (sub) => sub.identifier === _sub.subscription_plan.plan.split(' ')[0]
      )
      if (meta) {
        setCurrentPlan({
          currentPlan: userDetails?.subscriptions[0],
          meta,
        })
      }

      dispatch(setCurrentUserPlan(_sub))
    }
  }, [userDetails])

const calculatePriceDiff = () => {
  try {
    var amount = 0;
    if(!currentPlan) {
      return amount
    }
    var planAmount = currentPlan.currentPlan?.subscription_plan.amount;
    var currentPlan = currentPlan?.currentPlan
      if(currentPlan.subscription_plan.interval === 'monthly'){
        var planAmountPerDay = planAmount / 30;
        if(planAmount > 0) {
          const dueDate = moment(currentPlan?.subscription_plan.created_at).add(30, 'days');
          const daysLeft = dueDate.diff(moment(), 'days');
          if(daysLeft > 0){
            var amountUnused = planAmountPerDay * daysLeft;
            amount = amountUnused
          }
        }
      }else{
        var planAmountPerDay = planAmount / 365;
        if(planAmount > 0) {
          const dueDate = moment(currentPlan?.subscription_plan.created_at).add(365, 'days');
          const daysLeft = dueDate.diff(moment(), 'days');
          if(daysLeft > 0){
            var amountUnused = planAmountPerDay * daysLeft;
            amount = amountUnused
          }
        }
      }
      return amount
  } catch (error) {
    return 0
  }
}

  const handleUpgradeBtn = async () => {
    setUpgradeToggle(!upgradeToggle)
  }

  const onSuccess = (ref) => {
    upgradePlan(ref.reference)
  }

  const onClose = () => {}

  const upgradePlan = async (ref) => {
    try {
      setLoading(true)
      var priceDiff = calculatePriceDiff()
      const planDuration = interval === 'monthly' ? '' : ' Yearly'
      const res = await UPGRADE_SUBSCRIPTION(
        token,
        currentPlan.currentPlan.id,
        selectedPlan.identifier + planDuration,
        (selectedPlan.pricing.value * multiplier) - priceDiff,
        'Success',
        ref
      )

      const { data, error, status } = handleResponse(res)
      if (status) {
        toast.success('Plan upgraded successfully!')
        router.refresh()
      } else {
        throw new Error('Plan upgrade failed, please try again' || error)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const downgradePlan = async () => {
    try {
      setLoading(true)

      const res = await DOWNGRADE_SUBSCRIPTION(
        token,
        selectedPlan.identifier,
        selectedBank,
        currentSubscriptionPlan?.id
      )

      const { data, error, status } = handleResponse(res)
      if (status) {
        toast.success('Plan downgraded successfully!')
        router.refresh()
      } else {
        throw new Error('Plan upgrade failed, please try again' || error)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      setLoading(true)

      const res = await CANCEL_SUBSCRIPTION(
        token,
        currentSubscriptionPlan?.id,
        currentSubscriptionPlan?.subscription_id
      )

      const { data, error, status } = handleResponse(res)
      if (status) {
        toast.success('Your plan has been successfully cancelled!')
        router.refresh()
      } else {
        throw new Error('Plan upgrade failed, please try again' || error)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const multiplier = interval === 'monthly' ? 1 : 12

  const handleDowngradeModal = () => {
    setDowngradeModal(!downgradeModal)
  }

  return (
    <main className='relative flex flex-col justify-start items-start gap-5 xxl:w-[60%] xl:w-[60%] lg:w-full md:w-full sm:w-full '>
      <h2 className='text-xl font-semibold'>Billing</h2>
      {currentPlan && (
        <section className='border border-gray rounded-md p-5 w-full flex flex-col justify-start items-start gap-5'>
          <div className='flex flex-col justify-start items-start gap-5 w-full'>
            <header className='flex justify-between items-center w-full'>
              <h2 className='text-[25px] font-semibold'>
                {currentPlan.meta.title}
              </h2>
              {loading ? (
                <CircularSpinner />
              ) : (
                <button
                  type='button'
                  disabled={!hasPermission('billings:create')}
                  onClick={handleUpgradeBtn}
                  className={clsx(
                    'bg-black ring-2 ring-white rounded-full h-12 px-5 text-white',
                    hasPermission('billings:create')
                      ? 'bg-black'
                      : 'bg-lightgrey'
                  )}
                >
                  Upgrade
                </button>
              )}
            </header>
            <hr className='border-gray w-full' />
            <div className='flex flex-col justify-start items-start gap-3'>
              <h3 className='font-semibold'>Included in your plan</h3>
              {currentPlan.meta.perks.map((perk, index) => {
                return (
                  <div
                    key={index}
                    className='flex justify-start items-center gap-2'
                  >
                    <BiCheck />
                    <span className=''>{perk.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className='border border-gray rounded-md p-5 w-full flex flex-col justify-start items-start gap-5 '>
        <h2 className='text-lg font-semibold'>Billing History</h2>

        <div className='w-full overflow-x-auto scrollbar-hide'>
          <div className='grid grid-cols-8 content-start place-items-start gap-5 border-b border-gray py-2 w-full'>
            <span className='font-semibold col-span-2 lg:text-base md:text-base sm:text-sm'>
              Date{' '}
            </span>
            <span className='font-semibold col-span-2 lg:text-base md:text-base sm:text-sm'>
              Plan{' '}
            </span>
            <span className='font-semibold col-span-2 lg:text-base md:text-base sm:text-sm'>
              Price{' '}
            </span>
            <span className='font-semibold col-span-2 lg:text-base md:text-base sm:text-sm'>
              Status{' '}
            </span>
          </div>

          {userDetails?.billings.length >= 1 ? (
            <div className='w-full'>
              {userDetails?.billings
                .filter((item) => item.payment_status !== 'Success')
                .map((item) => {
                  return (
                    <div
                      key={item.id}
                      className='grid grid-cols-8 content-start place-items-start gap-5 w-auto border-b border-gray py-2 last:border-none'
                    >
                      <span className='col-span-2 lg:text-base md:text-base sm:text-sm'>
                        {moment(item.created_at).format('LL')}
                      </span>
                      <span className='col-span-2 lg:text-base md:text-base sm:text-sm'>
                        {item?.subscription?.subscription_plan?.plan}
                      </span>
                      <span className='col-span-2 lg:text-base md:text-base sm:text-sm'>
                        {new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                        }).format(item?.amount_paid)}
                      </span>
                      <span className='col-span-2 lg:text-base md:text-base sm:text-sm'>
                        {item?.payment_status}
                      </span>
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className='flex flex-col justify-center items-center gap-3 m-auto h-[10rem]'>
              No payment made yet
            </p>
          )}
        </div>
      </section>

      {upgradeToggle && (
        <section className='fixed w-full h-screen top-0 left-0 bg-lightblack z-20 flex lg:justify-center lg:items-center md:justify-center md:items-center sm:justify-start sm:items-start '>
          <div
            className='relative bg-white rounded-md shadow-2fl flex flex-col gap-5 overflow-auto scrollbar-hide h-full xxl:h-auto xl:h-auto lg:justify-start 
          lg:items-center lg:h-[90%] lg:w-auto lg:p-10 md:w-[80%] md:h-[70%] md:p-10 sm:p-5 sm:h-screen sm:w-full '
          >
            <button
              type='button'
              onClick={handleUpgradeBtn}
              className='text-2xl absolute top-6 right-4 z-10'
            >
              <CgClose />
            </button>
            <h1 className='text-xl lg:text-2xl font-semibold text-center'>
              Choose the right plan for your business
            </h1>
            <div className='flex justify-center items-center gap-5 bg-gray rounded-md p-1'>
              <button
                type='button'
                onMouseDown={() => setInterval('monthly')}
                className={clsx(
                  'rounded-md p-2 h-full flex justify-center items-center gap-2 px-5 lg:text-base md:text-base sm:text-sm',
                  interval === 'monthly'
                    ? 'bg-white text-black'
                    : 'bg-transparent'
                )}
              >
                Monthly billings
              </button>
              <button
                type='button'
                onMouseDown={() => setInterval('yearly')}
                className={clsx(
                  'rounded-md p-2 h-full flex justify-center items-center gap-2 px-5 lg:text-base md:text-base sm:text-sm',
                  interval === 'yearly'
                    ? 'bg-white text-black'
                    : 'bg-transparent'
                )}
              >
                Yearly{' '}
                <span className='text-primary'>({`save up to 20%`})</span>
              </button>
            </div>
            <div className='flex justify-center items-start gap-5 flex-col w-full lg:flex-row '>
              {pricingModels.map((item, i) => {
                return (
                  <div
                    key={i}
                    className={`border border-gray hover:border-[#4F9ED0] hover:cursor-pointer p-5 rounded-md flex flex-col justify-start items-start gap-8 w-full lg:w-[20rem] min-h-[30rem]`}
                  >
                    <div className='flex flex-col  w-[100%] justify-start items-start gap-2'>
                      <div className='flex  w-[100%] items-center justify-between'>
                        <h4 className='font-medium'>{item.title}</h4>
                      </div>
                      <h6 className='font-medium text-[grey] text-[14px]'>
                        {item.description}
                      </h6>
                      <p className='font-semibold text-2xl'>
                        ₦
                        {FormatAmount(
                          interval === 'monthly'
                            ? item.pricing.value * multiplier
                            : item.pricing.value * 0.8 * multiplier
                        )}
                        <span className='text-lightgrey font-light text-base'>
                          {interval === 'monthly' ? '/ monthly' : '/ yr'}
                        </span>
                      </p>
                    </div>

                    <div className='flex flex-col gap-5 w-full'>
                      {(() => {
                        switch (currentPlan.meta.identifier) {
                          case 'Basic':
                            // PaystackHook for upgrading from Basic to Starter or Business
                            if (
                              ['Starter', 'Business'].includes(item.identifier)
                            ) {
                              return (
                                <PaystackHook
                                  email={userDetails.email}
                                  amount={
                                    interval === 'monthly'
                                      ? item.pricing.value * multiplier
                                      : item.pricing.value * 0.8 * multiplier
                                  }
                                  onSuccess={onSuccess}
                                  onClose={onClose}
                                  renderButton={({ onClick }) => (
                                    <button
                                      onClick={onClick}
                                      type='button'
                                      className='w-full rounded-full px-5 h-12 text-white bg-primary'
                                    >
                                      Upgrade
                                    </button>
                                  )}
                                />
                              )
                            }
                            break

                          case 'Business':
                            // If current plan is Business and interval is monthly
                            if (currentPlanInterval === 'monthly') {
                              // Downgrade button should appear ONLY on Starter plan in the monthly tab
                              if (
                                item.identifier === 'Starter' &&
                                interval === 'monthly'
                              ) {
                                return (
                                  <button
                                    type='button'
                                    onClick={() => {
                                      setSelectedPlan(item)
                                      handleDowngradeModal()
                                    }}
                                    className='w-full rounded-full px-5 h-12 text-white bg-primary'
                                  >
                                    Downgrade
                                  </button>
                                )
                              }

                              // PaystackHook for upgrading on the yearly tab
                              if (
                                ['Starter', 'Business'].includes(
                                  item.identifier
                                ) &&
                                interval === 'yearly'
                              ) {
                                return (
                                  <PaystackHook
                                    email={userDetails.email}
                                    amount={
                                      interval === 'monthly'
                                        ? item.pricing.value * multiplier
                                        : item.pricing.value * 0.8 * multiplier
                                    }
                                    onSuccess={onSuccess}
                                    onClose={onClose}
                                    renderButton={({ onClick }) => (
                                      <button
                                        onClick={onClick}
                                        type='button'
                                        className='w-full rounded-full px-5 h-12 text-white bg-primary'
                                      >
                                        Upgrade
                                      </button>
                                    )}
                                  />
                                )
                              }
                            }

                            // If current plan is Business and interval is yearly
                            if (currentPlanInterval === 'yearly') {
                              // Downgrade button on Starter plan in the yearly tab
                              if (
                                item.identifier === 'Starter' &&
                                interval === 'yearly'
                              ) {
                                return (
                                  <button
                                    type='button'
                                    onClick={() => {
                                      setSelectedPlan(item)
                                      handleDowngradeModal()
                                    }}
                                    className='w-full rounded-full px-5 h-12 text-white bg-primary'
                                  >
                                    Downgrade
                                  </button>
                                )
                              }

                              // Downgrade button on Starter and Business plans in the monthly tab
                              if (
                                ['Starter', 'Business'].includes(
                                  item.identifier
                                ) &&
                                interval === 'monthly'
                              ) {
                                return (
                                  <button
                                    type='button'
                                    onClick={() => {
                                      setSelectedPlan(item)
                                      handleDowngradeModal()
                                    }}
                                    className='w-full rounded-full px-5 h-12 text-white bg-primary'
                                  >
                                    Downgrade
                                  </button>
                                )
                              }
                            }
                            break

                          case 'Starter':
                            // If current plan is Starter and interval is yearly
                            if (currentPlanInterval === 'yearly') {
                              // Downgrade button on Starter and Business plans in the monthly tab
                              if (
                                ['Starter', 'Business'].includes(
                                  item.identifier
                                ) &&
                                interval === 'monthly'
                              ) {
                                return (
                                  <button
                                    type='button'
                                    onClick={() => {
                                      setSelectedPlan(item)
                                      handleDowngradeModal()
                                    }}
                                    className='w-full rounded-full px-5 h-12 text-white bg-primary'
                                  >
                                    Downgrade
                                  </button>
                                )
                              }
                            }

                            // PaystackHook for upgrading to Business in the yearly tab
                            if (
                              item.identifier === 'Business' &&
                              interval === 'yearly'
                            ) {
                              return (
                                <PaystackHook
                                  email={userDetails.email}
                                  amount={
                                    interval === 'monthly'
                                      ? item.pricing.value * multiplier
                                      : item.pricing.value * 0.8 * multiplier
                                  }
                                  onSuccess={onSuccess}
                                  onClose={onClose}
                                  renderButton={({ onClick }) => (
                                    <button
                                      onClick={onClick}
                                      type='button'
                                      className='w-full rounded-full px-5 h-12 text-white bg-primary'
                                    >
                                      Upgrade
                                    </button>
                                  )}
                                />
                              )
                            }
                            break

                          default:
                            break
                        }
                      })()}

                      {currentPlan.meta.identifier === item.identifier &&
                        currentPlanInterval === interval && (
                          <button
                            type='button'
                            disabled={true}
                            className='text-base text-white rounded-full h-12 w-full bg-lightgrey'
                          >
                            Current Plan
                          </button>
                        )}

                      {currentPlan.meta.identifier !== 'Basic' &&
                        currentPlan.meta.identifier === item.identifier &&
                        currentPlanInterval === interval && (
                          <button
                            type='button'
                            onClick={handleCancelSubscription}
                            className='text-base text-primary bg-transparent'
                          >
                            Cancel Plan
                          </button>
                        )}
                    </div>

                    <div className='flex flex-col justify-start items-start gap-3'>
                      {item.perks.map((perk, index) => {
                        return (
                          <div
                            key={index}
                            className='flex justify-start items-center gap-2'
                          >
                            <BiCheck />
                            <span className=''>{perk.title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {downgradeModal && (
              <div className='fixed w-full h-screen top-0 left-0 flex justify-center items-center m-auto bg-lightblack'>
                <div className='flex flex-col justify-start items-start gap-5 w-full bg-white rounded-lg p-5 lg:w-[40%]'>
                  <p>Select a withdrawal account.</p>

                  <div className='flex flex-col gap-3 w-full'>
                    {' '}
                    {banksListing?.map((acct) => {
                      return (
                        <div
                          onClick={() => setSelectedBank(acct.id)}
                          key={acct.id}
                          className={`${
                            selectedBank === acct.id
                              ? 'border-[#4F9ED0]'
                              : 'border-[#D3D3D3]'
                          } cursor-pointer border p-4 rounded-md flex justify-between items-center w-full`}
                        >
                          <div className='flex justify-start items-center gap-3'>
                            <span className='bg-gray p-2 rounded-full h-11 w-11 flex justify-center items-center'>
                              <BsBank className='text-lg text-primary ' />
                            </span>
                            <div className='flex flex-col justify-start items-start gap-1'>
                              <h1 className='font-semibold'>
                                {acct.bank_name}
                              </h1>
                              <p className='text'>{acct.account_number}</p>
                            </div>
                          </div>

                          <div className='flex flex-col items-center'>
                            <div className='h-[18px] w-[18px] mb-[15px] rounded-[18px] border-[#4F9ED0] border-[1px] flex justify-center items-center'>
                              {selectedBank?.id === acct.id && (
                                <div className='h-[10px] w-[10px] rounded-[18px] bg-[#4F9ED0]' />
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className='grid grid-cols-2 gap-5 w-full'>
                    <button
                      onClick={handleDowngradeModal}
                      className='rounded-full h-14 w-full border border-gray text-black'
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!selectedBank}
                      onClick={downgradePlan}
                      className={clsx(
                        'rounded-full h-14 w-full text-white',
                        !selectedBank ? 'bg-gray' : 'bg-primary'
                      )}
                    >
                      {' '}
                      Confirm{' '}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
