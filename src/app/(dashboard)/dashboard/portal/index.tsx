'use client'

import { getAccountType } from '../../../../redux/admin_user'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GET_WORKSPACE_WITH_SLUG } from '../../../../api/businessRoutes'
import { GET_BUSINESS_DISCOUNTS } from '../../../../api/discountRoutes'
import { handleResponse } from '../../../../api/router'
import { FETCH_DETAILS } from '../../../../api/userRoutes'
import {
  Business,
  Discount,
  GroupedService,
  GroupedServiceItem,
  UserDetails,
} from '../../../../global/types'
import { groupServicesByGroup } from '../../../../utils/formatter'
import { generateSlug, getAppToken } from '../../../../utils/index'
import Services from './Services'
import Summary from './Summary'

export default function POSPortal() {
  const token = getAppToken()
  const router = useRouter()
  const [loading, showLoading] = useState(false)
  const [business, setBusiness] = useState<Business | null>(null)
  const [groups, setGroups] = useState<Array<GroupedService>>([])
  const [selectedServices, setSelectedServices] = useState<
    Array<GroupedServiceItem>
  >([])
  const [discounts, setDiscounts] = useState<Array<Discount>>([])
  const [appliedDiscount, setAppliedDiscount] = useState<Omit<
    Discount,
    'workspace'
  > | null>(null)
  const [user, setUser] = useState<UserDetails | null>(null)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [serviceListView, showServiceListView] = useState(false)
  const [staffBusiness, setStaffBusiness] = useState([]);
  const [ selectedPackages, setSelectedPackages ] = useState<GroupedService[]>([])
  
  const accountType = useSelector(getAccountType)

  useEffect(() => {
    const checkScreenSize = () => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      if (screenWidth < 1024 || screenHeight < 768) {
        setIsSmallScreen(true)
      } else {
        setIsSmallScreen(false)
      }
    }

    checkScreenSize()

    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const getDiscounts = async (appToken: string, id: number) => {
    try {
      const res = await GET_BUSINESS_DISCOUNTS(token, id)
      const { data, error, status } = handleResponse<Array<Discount>>(res)

      console.log('discount', error)
      console.log('discount status', status)
      if (status) {
        var filtered = data.filter((d) => d.workspaces_id === id)
        setDiscounts(filtered)
      } else {
        return
      }
    } catch (error) {}
  }

  const selectService = (service: GroupedServiceItem) => {
    setSelectedServices((prev) => {
      let updatedServices = [...prev]

      const isSelected = updatedServices.some((s) => s.id === service.id)

      if (isSelected) {
        updatedServices = updatedServices.filter((s) => s.id !== service.id)
      } else {
        updatedServices.push(service)
      }

      return updatedServices
    })
  }

  const selectPackage = (data: GroupedService) => {
    setSelectedPackages((prev) => {
      const isSelected = prev.some((p) => p.id === data.id);
  
      if (isSelected) {
        return prev.filter((p) => p.id !== data.id);
      } else {
        return [...prev, data];
      }
    });
  };

  const getUserDetails = async () => {
    showLoading(true)

    try {
      const res = await FETCH_DETAILS(token)
      const { data, error, status } = handleResponse<UserDetails>(res)

      if (data && data?.business.name) {
        setUser(data)
        const business = await GET_WORKSPACE_WITH_SLUG(
          generateSlug(data?.business?.name || ''),
          token
        )

        const {
          data: businessData,
          error: businessError,
          status: businessStatus,
        } = handleResponse<Business>(business)

        if (businessStatus && businessData) {
          setBusiness(businessData)

          const groupedServices = groupServicesByGroup(businessData.services)
          setGroups(groupedServices)

          if (data.account_type[0].user_type.type !== 'Staff') {
            getDiscounts(token, businessData.id)
          }
        } else {
          throw new Error('An error occurred, please try again')
        }
      } else {
        throw new Error('An error occurred, please try again')
      }
    } catch (error) {
    } finally {
      showLoading(false)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [token, accountType])

  const clearSelection = () => {
    setSelectedServices([]);
    setSelectedPackages([])
  }

  if (isSmallScreen && serviceListView) {
    return (
      <Summary
        close={() => showServiceListView(false)}
        isSmallScreen={true}
        clearSelection={clearSelection}
        userId={user?.id}
        appliedDiscount={appliedDiscount}
        selectService={selectService}
        selectedServices={selectedServices}
        selectPackage={selectPackage}
        openingHours={business?.opening_hours || []}
        workspaceId={business?.id}
        selectedPackages={selectedPackages}
      />
    )
  }

  return (
    <main
      className='h-full w-full flex items-center'
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Services
        isSmallScreen={isSmallScreen}
        business={business}
        loading={loading}
        groups={groups}
        selectService={selectService}
        selectedServices={selectedServices}
        discounts={discounts}
        workspaceId={business?.id}
        setAppliedDiscount={setAppliedDiscount}
        showServiceListView={showServiceListView}
        selectedPackages={selectedPackages} 
        setSelectedPackages={setSelectedPackages}
        selectPackage={selectPackage}

      />
      {!isSmallScreen && (
        <Summary
          isSmallScreen={isSmallScreen}
          clearSelection={clearSelection}
          userId={user?.id}
          appliedDiscount={appliedDiscount}
          selectService={selectService}
          selectedServices={selectedServices}
          openingHours={business?.opening_hours || []}
          workspaceId={business?.id}
          selectPackage={selectPackage}
          selectedPackages={selectedPackages}
        />
      )}
    </main>
  )
}
