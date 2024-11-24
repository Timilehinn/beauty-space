'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AccountActivities from './ActivitiesComp'
import Loader from '../../Loader/Loader'
import BankAccountComp from './BankAccountComp'
import BillingComp from './BillingComp'
import LoginAndSecurity from './LoginAndSecurity'
import LoyaltyComp from './loyaltyProgramComp'
import MarketingComp from './MarketingComp'
import NotificationComp from './NotificationComp'
import TeamComp from './TeamComp'
import UsersDetails from './UsersDetailsComp'
import { 
  getAccountType,
  getCurrentUserPlan,
  getIsFailure,
  getLoading,
 } from '../../../redux/admin_user'
import { getDspType, setDspType } from '../../../redux/dashboard_related'

const allTabs = [
  { id: 1, title: 'profile' },
  { id: 2, title: 'loyalty' },
  { id: 3, title: 'withdraw' },
  { id: 4, title: 'marketing' },
  { id: 5, title: 'billing' },
  { id: 6, title: 'team' },
  { id: 7, title: 'security' },
  { id: 8, title: 'notification' },
  { id: 9, title: 'activities' },
]

export default function SettingsComp() {
  const dispatch = useDispatch()

  const loading = useSelector(getLoading)
  const dspType = useSelector(getDspType)
  const isFailure = useSelector(getIsFailure)
  const accountType = useSelector(getAccountType)
  const currentSubscriptionPlan = useSelector(getCurrentUserPlan)

  // Filter tabs based on accountType and currentSubscriptionPlan
  const filteredTabs = allTabs.filter((tab) => {
    if (
      (tab.title === 'billing' ||
        tab.title === 'marketing' ||
        tab.title === 'withdraw' ||
        tab.title === 'team') &&
      accountType !== 'Owner'
    ) {
      return false
    }
    if (
      tab.title === 'loyalty' &&
      (currentSubscriptionPlan?.plan !== 'Business' || accountType === 'Staff')
    ) {
      return false
    }
    return true
  })

  useEffect(() => {}, [currentSubscriptionPlan])

  return (
    <>
      <Loader failure={isFailure} isLoading={loading} />
      <main className='grid grid-cols-1 content-start place-content-start place-items-start gap-10 bg-white w-full min-h-screen py-5 lg:px-10 md:px-10 sm:px-5 '>
        <header className='flex flex-col gap-3 w-full'>
          <h1 className='text-xl font-semibold'>Settings</h1>
          <section className='border-b border-gray py-3 flex justify-start items-start gap-5 w-full overflow-x-auto snap-x scrollbar-hide'>
            {filteredTabs.map((item) => (
              <button
                key={item.id}
                type='button'
                onClick={() => dispatch(setDspType(item.title))}
                className={`capitalize xl:text-base lg:text-base md:text-base sm:text-sm whitespace-nowrap flex justify-start items-start relative ${
                  dspType === item.title
                    ? 'after:absolute after:border-b-4 after:border-primary after:w-full after:-bottom-[13px] after:left-0 text-primary'
                    : 'hover:after:border-primary hover:after:border-b-4 hover:after:w-full hover:after:absolute hover:after:-bottom-[13px] '
                }`}
                style={{ scrollSnapAlign: 'start' }}
              >
                {item.title}
              </button>
            ))}
          </section>
        </header>

        <section className='w-full pb-5'>
          {dspType === 'billing' && accountType === 'Owner' && <BillingComp />}
          {dspType === 'profile' && <UsersDetails />}
          {dspType === 'marketing' && accountType === 'Owner' && (
            <MarketingComp />
          )}
          {dspType === 'security' && <LoginAndSecurity />}
          {dspType === 'activities' && <AccountActivities />}
          {dspType === 'withdraw' && accountType === 'Owner' && (
            <BankAccountComp />
          )}
          {dspType === 'notification' && <NotificationComp />}
          {dspType === 'loyalty' && <LoyaltyComp />}
          {dspType === 'team' && accountType === 'Owner' && <TeamComp />}
        </section>
      </main>
    </>
  )
}
