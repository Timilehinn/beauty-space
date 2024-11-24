'use client'

import { useSelector } from 'react-redux'

import BusinessServicesComp from './Businesses/BusinessComp'
import UserBookingsComp from './UserBookings/UserBookingsComp'

import { useProtectedRoute } from '../../hooks'
import { getAccountType, getUserInfo } from '../../redux/admin_user'
import { useClient } from '../../providers/clientContext'

export default function DashboardOverview() {
  const accountType = useSelector(getAccountType)
  const userData = useSelector(getUserInfo)
  const { client } = useClient()
  const { success, errorAuth, loadingfinished } =
    useProtectedRoute('user_token')

  return (
    <main className='h-screen'>
      {accountType === 'Owner' && <BusinessServicesComp />}
      {accountType === 'User' && <UserBookingsComp />}
      {accountType === 'Staff' && <BusinessServicesComp />}
      {accountType === 'Manager' && <BusinessServicesComp />}
    </main>
  )
}
