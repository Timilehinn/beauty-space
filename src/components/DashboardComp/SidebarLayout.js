'use client'

import { useSelector } from 'react-redux'

import { getAccountType } from '../../redux/admin_user'
import ManagerSidebarMenu from './ManagerSidebar'
import OwnerDashSidebar from './OwnerDashSidebar'
import SalesDashSidebar from './SalesDashSidebar'
import StaffSidebar from './StaffSidebar'
import UserDashSidebar from './UserDashSidebar'

export default function SidebarLayout() {
  const accountType = useSelector(getAccountType)

  return (
    <aside className='relative z-20'>
      {accountType === 'Owner' && <OwnerDashSidebar />}
      {accountType === 'Sales' && <SalesDashSidebar />}
      {/* {accountType === 'Owner' && <AdminDashSider />} */}
      {accountType === 'User' && <UserDashSidebar />}
      {accountType === 'Staff' && <StaffSidebar />}
      {accountType === 'Manager' && <ManagerSidebarMenu />}
    </aside>
  )
}
