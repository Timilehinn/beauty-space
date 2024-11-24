import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation.js'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import clsx from 'clsx'

import {
  CREATE_WITHDRAWAL,
  GET_USER_OVERVIEW,
  GET_WITHDRAWALS,
  VERIFY_2FA,
} from '../../api/userRoutes'
import { getAppToken, isBookingExpired } from '../../utils'
import { getBusinessBookings } from '../../redux/bookingSlice'
import { handleResponse } from '../../api/router'
import { GET_BOOKINGS } from '../../api/bookingRoutes.js'
import { FormatAmount } from '../../utils/formatAmount'
import { CircularSpinner } from '../LoadingIndicator'
import { getUsers } from '../../redux/admin_user'
import { TimesIcon } from '../../assets/icons'
import { usePermissions } from '../../hooks/usePermission.jsx'

export default function AvailableBalance({ savedAccounts, bankId }) {
  const router = useRouter
  const token = getAppToken()
  const userStore = useSelector(getUsers)

  const { hasPermission } = usePermissions()
  const userDetails = userStore.data
  const [loading, showLoading] = useState(false)
  const [businessBalance, setBusinessBalance] = useState(0)
  const [authModal, showAuthModal] = useState(false)
  // const bookings = useSelector(getBusinessBookings)
  const [secret, setSecret] = useState('')
  const [insight, setInsight] = useState({
    total_bookings: 0,
    total_expenses: 0,
    total_reviews: 0,
    total_expenses_ledger: 0,
    total_workspace_used: 0,
    total_platform_fees: 0,
  })
  const [fundData, setFundData] = useState({
    availableBalance: 0,
    withdrawable: 0,
    platformFee: 0,
    pendingBalance: 0,
  })

  const getBusinessBalance = async (func) => {
    try {
      let value = 0
      let pendingBalance = 0
      let insight = {}
      showLoading(true)
      async function userOverview() {
        const res = await GET_USER_OVERVIEW(token)
        const { error, status, data } = handleResponse(res)
        if (status !== true) {
        } else {
          value += parseFloat(res.data.total_expenses)
          pendingBalance = parseFloat(res.data.total_expenses_ledger)
        }
      }

      async function getWithdrawals() {
        const res = await GET_WITHDRAWALS(token)
        if (res.status !== true) {
        } else {
          // get total withdrawal
          const total = res.data.reduce((total, item) => total + item.amount, 0)
          value -= parseFloat(total)
        }
      }
      const resolved = await Promise.all([
        userOverview(),
        getWithdrawals(),
        GetbookedSpaces(),
      ])
      var businessBalance = value
      const expiredBookings = [...resolved[2]]
        .reverse()
        .filter((item) => isBookingExpired(item?.bookings[0]?.end_date))

      const freeBookingsSum = expiredBookings
        .slice(0, 5)
        .reduce((total, item) => total + parseFloat(item.amount_paid), 0)
      const balAfterFreeBookings = businessBalance - freeBookingsSum
      const platformFee =
        expiredBookings.length > 5 ? balAfterFreeBookings * 0.02 : 0

      setFundData({
        availableBalance: businessBalance,
        withdrawable: businessBalance - platformFee,
        platformFee,
        pendingBalance,
      })
      setBusinessBalance(value < 0 ? 0 : value)
    } catch (error) {
    } finally {
      showLoading(false)
      if (func) {
        func()
      }
    }
  }

  async function GetbookedSpaces() {
    try {
      const res = await GET_BOOKINGS(token, 1)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, status, data } = handleResponse(res)
      if (status !== true) {
        return []
      }
      return data?.data
    } catch (err) {
      return []
    }
  }

  async function createWithdrawal() {
    try {
      showLoading(true)
      const res = await CREATE_WITHDRAWAL(token, details.amount, bankId)
      const { status, data, error } = handleResponse(res)
      if (status !== true) {
        throw new Error(error)
      } else {
        getBusinessBalance(() => showAuthModal(false))
        toast.success('Your withdrawal is being processed')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      showLoading(false)
    }
  }

  async function onWithdraw() {
    try {
      if (!bankId) {
        throw new Error('Select a withdrawal account to continue')
      }
      if (!secret) {
        throw new Error('Enter your authentication code to continue')
      }
      showLoading(true)
      const res = await VERIFY_2FA(token, secret, userDetails?.email)

      const { status, data, error } = handleResponse(res)
      if (status !== true) {
        setSecret('')
        throw new Error(error)
      } else {
        await createWithdrawal()
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      showLoading(false)
    }
  }

  const openModal = () => {
    if (!bankId) {
      return toast.error('Select a withdrawal account to continue')
    }
    showAuthModal(true)
  }

  useEffect(() => {
    getBusinessBalance()
  }, [])

  return (
    <>
      <div className='w-[100%]'>
        <div className='w-[100%] mt-[10px] flex items-end justify-between'>
          <div>
            <p>Available balance</p>
            <h2 className='font-bold text-[45px]'>
              ₦{FormatAmount(fundData.availableBalance)}
            </h2>
          </div>
          {loading ? (
            <CircularSpinner />
          ) : (
            <>
              {savedAccounts.length > 0 && (
                <button
                  type='button'
                  disabled={!hasPermission('withdrawal:create')}
                  onClick={() => openModal()}
                  className={clsx(
                    'ring-2 ring-white rounded-full h-12 px-5 text-white ',
                    hasPermission('withdrawal:create')
                      ? 'bg-primary'
                      : 'bg-lightgrey'
                  )}
                >
                  Withdraw
                </button>
              )}
            </>
          )}
        </div>

        <div className='w-[100%] mt-[30px] flex items-center justify-between'>
          <div>
            <p>Pending balance</p>
            <h2 className='font-bold text-[25px] text-[orange]'>
              ₦{FormatAmount(fundData.pendingBalance)}
            </h2>
          </div>
          <div>
            <p>Platform fee</p>
            <h2 className='font-bold text-[25px]'>
              ₦{FormatAmount(fundData.platformFee)}
            </h2>
          </div>
        </div>
      </div>

      {authModal && (
        <article className='fixed top-0 left-0 w-full h-screen z-[999] flex justify-center items-center bg-lightblack p-10 '>
          <div className='flex flex-col justify-start items-start gap-8 bg-white shadow-2fl rounded-md p-5 xxl:w-[40%] xl:w-[40%] lg:w-[40%] md:w-[80%] sm:w-[90%] '>
            <div className='flex flex-col justify-center w-[100%] items-center gap-2 text-center'>
              <div className='w-[100%] flex justify-end'>
                <button
                  onClick={() => showAuthModal(false)}
                  className='cursor-pointer'
                >
                  <TimesIcon />
                </button>
              </div>

              <h2 className='text-lg font-medium'>
                Enter the code generated by your authenticator app.
              </h2>
              <p className='text-base w-[70%] text-lightblack'>
                To keep your account secure, we verify your identity to ensure
                this transaction is being carried out by you.
              </p>
            </div>

            <div className='w-[90%] p-5 flex flex-col justify-center items-center gap-5 mx-auto '>
              <input
                // id='overideBorder'
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className='rounded-md w-full h-12 text-center border border-lightgrey outline-none px-3 '
              />

              {/* {authError && (
                  <span className='text-danger text-sm'>{authError}</span>
                )} */}

              <button
                disabled={loading}
                onClick={onWithdraw}
                className='h-12 bg-primary px-5 text-white hover:bg-black rounded-md w-full'
              >
                {!loading ? 'Verify' : 'Loading...'}
              </button>
            </div>
          </div>
        </article>
      )}
    </>
  )
}
