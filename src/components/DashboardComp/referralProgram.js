'use client'

import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { BiCopy, BiShare } from 'react-icons/bi'
import { GiTakeMyMoney } from 'react-icons/gi'
import { HiMiniUsers } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'
import { GET_REFERRALS, GET_REFERRALS_REWARDS } from '../../api/referralRoutes'
import { getReferralCode } from '../../redux/admin_user'
import { handleResponse } from '../../api/router'
import useCookieHandler from '../../hooks/useCookieHandler'
import Loader from '../Loader/Loader'
import ServicesPaginationComp from './Businesses/ServicesPaginationComp'
import ReferralLineChart from './ReferralLineChart'

const steps = [
  {
    number: 1,
    title: 'Invite a Business',
    description:
      'Share your referral link to introduce a business to our platform.',
  },
  {
    number: 2,
    title: 'They Subscribe to a Plan',
    description:
      "When the business signs up for any paid plan, you're one step closer to earning.",
  },
  {
    number: 3,
    title: 'Earn a Reward',
    description:
      'Receive 1% of their first subscription payment or 1% after their first 5 bookings—your choice!',
  },
]

export default function ReferralProgramComp() {
  const router = useRouter()
  const { token } = useCookieHandler('user_token')

  const [loading, setLoading] = useState(true)
  const [failure, setFailure] = useState(false)
  const [referrals, setReferrals] = useState(null)

  const [sortOrder, setSortOrder] = useState('latest')
  const [sortRewards, setSortRewards] = useState('latest')
  const [rewardData, setRewardData] = useState(null)

  const [currentReferralsPage, setCurrentReferralsPage] = useState(1)
  const [currentRewardsPage, setCurrentRewardsPage] = useState(1)
  const [referralLastPage, setReferralLastPage] = useState(null)
  const [rewardsLastPage, setRewardsLastPage] = useState(null)

  const [viewAll, setViewAll] = useState(null)

  const [copied, setCopied] = useState(false)
  const referralCode = useSelector(getReferralCode)

  /**
   * The `copyToClipboard` function copies the provided text to the clipboard and displays a success or
   * error message using a toast notification.
   * @param text - The `text` parameter in the `copyToClipboard` function is the text that you want to
   * copy to the clipboard. It could be a referral link, code, or any other text that you want to copy.
   */

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const getUsersReferrals = async (page = 1) => {
    setLoading(true)
    try {
      const res = await GET_REFERRALS(token, page)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { status, data, error } = handleResponse(res)

      if (status) {
        setReferrals(data?.data)
        setReferralLastPage(data?.last_page)

        setLoading(false)
        setFailure(false)
      } else {
        throw new Error('An error occurred', error)
      }
    } catch (error) {
      setLoading(false)
      setFailure(true)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  const getUsersReferralsRewards = async (page = 1) => {
    setLoading(true)
    try {
      const res = await GET_REFERRALS_REWARDS(token, page)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { status, data, error } = handleResponse(res)

      if (status) {
        setRewardData(data?.data)
        setRewardsLastPage(data?.last_page)

        setLoading(false)
        setFailure(false)
      } else {
        throw new Error('An error occurred', error)
      }
    } catch (error) {
      setLoading(false)
      setFailure(true)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  useEffect(() => {
    if (!token) return
    getUsersReferrals(currentReferralsPage)
    getUsersReferralsRewards(currentRewardsPage)
  }, [token, currentReferralsPage, currentRewardsPage])

  const handleReferralsPageChange = ({ selected: selectedPage }) => {
    setCurrentReferralsPage(selectedPage + 1)
    setLoading(true)
    getUsersReferrals(selectedPage + 1)
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setFailure(true)
      })
  }

  const handleRewardsPageChange = ({ selected: selectedPage }) => {
    setCurrentRewardsPage(selectedPage + 1)
    setLoading(true)
    getUsersReferralsRewards(selectedPage + 1)
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setFailure(true)
      })
  }

  /* The above code is a React code snippet that uses the `useMemo` hook to sort an array of referral
  objects based on their `referral_date` property. The sorting order is determined by the
  `sortOrder` state variable, which can be either 'latest' or 'older'. The `handleSortChange`
  function is used to update the `sortOrder` state based on the selected value from an input
  element. */
  const sortedReferrals = useMemo(() => {
    if (!referrals) return []

    return [...referrals].sort((a, b) => {
      const dateA = new Date(a.referral_date)
      const dateB = new Date(b.referral_date)

      return sortOrder === 'latest'
        ? dateB - dateA // Latest first
        : dateA - dateB // Older first
    })
  }, [referrals, sortOrder])

  const sortedRewards = useMemo(() => {
    if (!rewardData) return []

    return [...rewardData].sort((a, b) => {
      const dateA = new Date(a.reward_date)
      const dateB = new Date(b.reward_date)

      return sortRewards === 'latest'
        ? dateB - dateA // Latest first
        : dateA - dateB // Older first
    })
  }, [rewardData, sortRewards])

  const handleSortChange = (event) => {
    setSortOrder(event.target.value)
  }

  const handleRewardSort = (event) => {
    setSortRewards(event.target.value)
  }

  /* The above code is using the `useMemo` hook in React to calculate the total rewards from an array of
`rewardData`. It first checks if `rewardData` exists and is an array, and if not, it returns 0.
Then, it uses the `reduce` method to sum up the `reward_amount` values of each object in the
`rewardData` array. The result is stored in the `totalRewards` variable. The `useMemo` hook ensures
that this calculation is only performed when the `rewardData` array changes. */
  const totalRewards = useMemo(() => {
    if (!rewardData || !Array.isArray(rewardData)) return 0
    return rewardData.reduce(
      (sum, reward) => sum + parseFloat(reward.reward_amount || 0),
      0
    )
  }, [rewardData])

  /**
   * The `handleShare` function allows users to share a referral message using the Web Share API or
   * fallback to copying to clipboard if the API is not available.
   */
  const handleShare = async () => {
    const shareMessage = `Hey! 🌟 Want to unlock a secret to earning rewards effortlessly? Sign up at https://beautyspaceng.com/signup using my referral code: ${referralCode}. Share your referral link and watch the magic happen. You could start earning just by helping businesses join our platform. Intrigued? Get started now and see the rewards roll in! 💰✨`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Share Referral Code',
          text: shareMessage,
        })
      } else {
        // Fallback to copying to clipboard if share is not available
        copyToClipboard(shareMessage)
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <>
      <Loader failure={failure} isLoading={loading} />
      <main className='flex flex-col justify-start items-start gap-5 w-full relative lg:px-16 md:px-10 sm:px-5 py-5'>
        <header className='grid grid-cols-1 gap-5 w-full content-center place-items-center py-5 lg:grid-cols-2'>
          <div className='flex flex-col justify-start items-center gap-3 bg-white p-4 rounded-md w-full shadow-2fl ring-1 ring-gray lg:flex-row'>
            <div className='flex flex-col gap-2 border border-gray py-2 px-5 w-full rounded-md'>
              <span className='uppercase text-xs'>Rewards</span>
              <h1 className='font-semibold text-4xl'>
                &#8358;
                {totalRewards.toLocaleString('en-NG', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h1>
            </div>

            <div className='flex flex-col gap-2 border border-gray py-2 px-5 w-full rounded-md'>
              <span className='uppercase text-xs'>Referrals</span>
              <h1 className='font-semibold text-4xl'>
                {sortedReferrals.length}
              </h1>
            </div>
          </div>

          <div className='flex flex-col justify-start items-start gap-3 bg-white p-4 rounded-md w-full shadow-2fl ring-1 ring-gray'>
            <label htmlFor='referral_link' className='font-semibold'>
              Your referral link{' '}
            </label>

            <div className='flex flex-col justify-start items-center gap-5 w-full lg:flex-row'>
              <div className='relative w-full lg:w-[80%]'>
                <input
                  type='text'
                  name='referral_link'
                  id='referral_link'
                  className='h-12 outline-none indent-2 rounded-md w-full border border-gray'
                  value={referralCode}
                  readOnly
                />
                <button
                  type='button'
                  className={`absolute top-4 right-3 z-10 text-xl 
            ${copied ? 'text-green' : 'text-primary'}
            hover:scale-110 transition-all duration-200`}
                  onClick={() => copyToClipboard(referralCode)}
                  title={copied ? 'Copied!' : 'Copy to clipboard'}
                >
                  <BiCopy />
                </button>

                {copied && (
                  <div className='absolute top-14 right-3 bg-green text-white px-2 py-1 rounded text-sm'>
                    Copied!
                  </div>
                )}
              </div>

              <button
                type='button'
                onClick={handleShare}
                className='flex justify-center items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors duration-200 w-full lg:w-auto'
              >
                <BiShare className='text-xl' />
                <span>Share</span>
              </button>
            </div>
          </div>
        </header>

        <section className='grid grid-cols-1 content-center place-items-center gap-5 w-full lg:grid-cols-2 '>
          <div className='flex flex-col justify-start items-start gap-7 w-full rounded-md ring-1 ring-gray bg-white shadow-2fl p-5 overflow-auto scrollbar-hide lg:h-[40vh] md:h-[45vh] sm:h-[35vh] '>
            <div className='flex flex-col justify-start items-start gap-2'>
              <h1 className='text-2xl font-semibold'>Refer a business</h1>
              <span className='text-sm'>And you can earn</span>
            </div>

            <div className='relative flex flex-col justify-start items-start gap-5 w-full'>
              <h4 className='text-purple font-semibold'>How it works</h4>

              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className='flex items-start gap-5 relative'
                >
                  {/* Number Circle */}
                  <div className='flex-shrink-0'>
                    <span className='w-12 h-12 rounded-full bg-white border-2 border-gray flex items-center justify-center text-purple text-xl font-semibold'>
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className='flex flex-col justify-start items-start gap-1'>
                    <h3 className='text-lg font-semibold text-black'>
                      {step.title}
                    </h3>
                    <p className='text-lightgrey leading-relaxed'>
                      {step.description}
                    </p>
                  </div>

                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className='absolute left-6 top-12 w-0.5 h-20 bg-gray'></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col justify-start items-start gap-8 w-full rounded-md ring-1 ring-gray bg-white shadow-2fl p-5 overflow-auto scrollbar-hide lg:h-[40vh] md:h-[45vh] sm:h-[35vh] '>
            <h1 className='text-xl font-semibold capitalize'>earnings</h1>

            <div className='w-full flex justify-center items-center m-auto lg:h-[80%] md:h-[80%] sm:h-[75%]'>
              {rewardData?.length !== 0 ? (
                <ReferralLineChart rewardData={rewardData} />
              ) : (
                <div className='m-auto flex flex-col justify-center items-center gap-3'>
                  <GiTakeMyMoney className='text-[4rem]' />
                  <span className='text-lightgrey'>
                    You have not earn any rewards yet!
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className='flex flex-col justify-start items-start gap-5 w-full rounded-md ring-1 ring-gray bg-white shadow-2fl p-5 overflow-auto scrollbar-hide lg:h-[40vh] md:h-[45vh] sm:h-[35vh] '>
            <header className='flex justify-between items-center w-full'>
              <h1 className='capitalize font-medium flex justify-start items-center gap-5 text-xl'>
                Referral List{' '}
                <button
                  type='button'
                  onMouseDown={() => setViewAll('referral_list')}
                  className='text-primary text-sm font-semibold hover:underline'
                >
                  View all
                </button>
              </h1>

              <select
                name='filter'
                id='filter'
                value={sortOrder}
                onChange={handleSortChange}
                className='h-12 border border-gray rounded-md outline-none w-32'
              >
                <option value='latest'>Latest</option>
                <option value='older'>Older</option>
              </select>
            </header>

            {sortedReferrals.length !== 0 ? (
              <div className='w-full overflow-x-auto scrollbar-hide'>
                <table className='min-w-full table-auto'>
                  <thead>
                    <tr>
                      <th className='px-4 py-2 text-left'>Full Name</th>
                      <th className='px-4 py-2 text-left'>Email</th>
                      <th className='px-4 py-2 text-left'>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedReferrals?.slice(0, 10)?.map((item) => (
                      <tr key={item.id} className='odd:bg-gray'>
                        <td className='px-4 py-2 text-left'>
                          {item?.referred.first_name} {item?.referred.last_name}
                        </td>
                        {/* <td className='px-4 py-2'>{item.lastName}</td> */}
                        <td className='px-4 py-2 text-left'>
                          {item?.referred.email}
                        </td>
                        <td className='px-4 py-2 text-left'>
                          {item?.referred.address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='h-[15vh] m-auto flex flex-col justify-center items-center gap-3'>
                <HiMiniUsers className='text-[4rem]' />
                <span className='text-lightgrey'>
                  You don&apos;t have any referrals yet!
                </span>
              </div>
            )}
          </div>

          <div className='flex flex-col justify-start items-start gap-5 w-full rounded-md ring-1 ring-gray bg-white shadow-2fl p-5 overflow-auto scrollbar-hide lg:h-[40vh] md:h-[45vh] sm:h-[35vh] '>
            <header className='flex justify-between items-center w-full'>
              <h1 className='capitalize font-medium flex justify-start items-center gap-5 text-xl'>
                Rewards List{' '}
                <button
                  type='button'
                  onMouseDown={() => setViewAll('rewards_list')}
                  className='text-primary text-sm font-semibold hover:underline'
                >
                  View all
                </button>
              </h1>

              <select
                name='filter'
                id='filter'
                value={sortRewards}
                onChange={handleRewardSort}
                className='h-12 border border-gray rounded-md outline-none w-32'
              >
                <option value='latest'>Latest</option>
                <option value='older'>Older</option>
              </select>
            </header>

            {sortRewards.length !== 0 ? (
              <div className='w-full overflow-x-auto scrollbar-hide'>
                <table className='min-w-full table-auto'>
                  <thead>
                    <tr>
                      <th className='px-4 py-2 text-left'>Date</th>
                      <th className='px-4 py-2 text-left'>Reward Type</th>
                      <th className='px-4 py-2 text-left'>Reward Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRewards?.slice(0, 10)?.map((item) => (
                      <tr key={item.id} className='odd:bg-gray'>
                        <td className='px-4 py-2 text-left'>
                          {moment(item.reward_date).format('LL')}
                        </td>
                        <td className='px-4 py-2 text-left'>
                          {item.reward_type}
                        </td>
                        <td className='px-4 py-2 text-left'>
                          &#8358;
                          {Number(item.reward_amount).toLocaleString('en-NG', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='h-[15vh] m-auto flex flex-col justify-center items-center gap-3'>
                <GiTakeMyMoney className='text-[4rem]' />
                <span className='text-lightgrey'>
                  You have not earn any rewards yet!
                </span>
              </div>
            )}
          </div>
        </section>

        {viewAll === 'referral_list' && (
          <main className='flex flex-col justify-center items-center m-auto fixed top-0 left-0 bg-lightblack w-full h-screen z-20'>
            <section className='bg-white h-[80vh] rounded-md ring-1 ring-gray p-5 w-full shadow-2fl flex flex-col justify-start items-start gap-5 overflow-auto scrollbar-hide lg:w-[60%] '>
              <header className='flex justify-between items-center w-full'>
                <h1 className='text-xl font-semibold'>Referral List:</h1>
                <button
                  type='button'
                  onMouseDown={() => setViewAll(false)}
                  className='text-2xl'
                >
                  <IoClose />
                </button>
              </header>

              <hr className='w-full border-gray' />

              <div className='w-full overflow-x-auto scrollbar-hide'>
                <table className='min-w-full table-auto'>
                  <thead>
                    <tr>
                      <th className='px-4 py-2 text-left'>Full Name</th>
                      <th className='px-4 py-2 text-left'>Email</th>
                      <th className='px-4 py-2 text-left'>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedReferrals?.map((item) => (
                      <tr key={item.id} className='odd:bg-gray'>
                        <td className='px-4 py-2 text-left'>
                          {item?.referred.first_name} {item?.referred.last_name}
                        </td>
                        <td className='px-4 py-2 text-left'>
                          {item?.referred.email}
                        </td>
                        <td className='px-4 py-2 text-left'>
                          {item?.referred.address}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedReferrals.length > 20 && (
                <ServicesPaginationComp
                  pageCount={referralLastPage}
                  handlePageClick={handleReferralsPageChange}
                />
              )}
            </section>
          </main>
        )}

        {viewAll === 'rewards_list' && (
          <main className='flex flex-col justify-center items-center m-auto fixed top-0 left-0 bg-lightblack w-full h-screen z-20'>
            <section className='bg-white h-[80vh] rounded-md ring-1 ring-gray p-5 w-full shadow-2fl flex flex-col justify-start items-start gap-5 overflow-auto scrollbar-hide lg:w-[60%] '>
              <header className='flex justify-between items-center w-full'>
                <h1 className='text-xl font-semibold'>Rewards List:</h1>
                <button
                  type='button'
                  onMouseDown={() => setViewAll(false)}
                  className='text-2xl'
                >
                  <IoClose />
                </button>
              </header>

              <hr className='w-full border-gray' />

              <div className='w-full overflow-x-auto scrollbar-hide'>
                <table className='min-w-full table-auto'>
                  <thead>
                    <tr>
                      <th className='px-4 py-2 text-left'>Date</th>
                      <th className='px-4 py-2 text-left'>Reward Type</th>
                      <th className='px-4 py-2 text-left'>Reward Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardData?.map((item) => (
                      <tr key={item.id} className='odd:bg-gray'>
                        <td className='px-4 py-2 text-left'>
                          {moment(item.reward_date).format('LL')}
                        </td>
                        <td className='px-4 py-2 text-left'>
                          {item.reward_type}
                        </td>
                        <td className='px-4 py-2 text-left'>
                          ₦
                          {Number(item.reward_amount).toLocaleString('en-NG', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedRewards.length > 20 && (
                <ServicesPaginationComp
                  pageCount={rewardsLastPage}
                  handlePageClick={handleRewardsPageChange}
                />
              )}
            </section>
          </main>
        )}
      </main>
    </>
  )
}
