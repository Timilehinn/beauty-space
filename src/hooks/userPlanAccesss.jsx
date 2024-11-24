import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { pricingModels } from '../constants'
import {
  getCurrentUserPlan,
  getUserInfo,
  setCurrentUserPlan,
} from '../redux/admin_user'

export const useUserPlanAccess = () => {
  const dispatch = useDispatch()
  const [plans, setPlans] = useState(pricingModels)

  const userDetails = useSelector(getUserInfo)
  const currentSubscriptionPlan = useSelector(getCurrentUserPlan)

  // Simulate fetching plans and usage data from an API
  useEffect(() => {
    if (userDetails && userDetails?.subscriptions?.length > 0) {
      const latestSubscription =
        userDetails.subscriptions[userDetails.subscriptions.length - 1]

      // Check if the subscription status is not cancelled
      if (latestSubscription.status !== 'cancelled') {
        dispatch(setCurrentUserPlan(latestSubscription.subscription_plan))
      } else {
        // Set current plan to Basic if the subscription is cancelled
        const basicPlan = plans.find((plan) => plan.identifier === 'Basic')
        dispatch(setCurrentUserPlan(basicPlan))
      }
    }

    setPlans(pricingModels)
  }, [userDetails, dispatch, plans])

  const getCurrentPlan = useCallback(() => {
    // Ensure we're checking against the identifier of the current plan
    return (
      plans.find((plan) => plan.identifier === currentSubscriptionPlan?.plan) ||
      plans.find((plan) => plan.identifier === 'Basic') // Default to Basic plan if no match is found
    )
  }, [plans, currentSubscriptionPlan])

  const checkPermission = useCallback(
    (action, currentCount = 0) => {
      const currentPlan = getCurrentPlan()

      if (!currentPlan) {
        return false
      }

      const limit = currentPlan.usage[action]

      if (limit === 'Unlimited' || limit === true) {
        return true
      } else if (typeof limit === 'number') {
        return currentCount < limit
      } else if (limit === false) {
        return false
      }

      return false
    },
    [getCurrentPlan]
  )

  const executeAction = useCallback(
    (action, currentCount = 0, callback) => {
      if (checkPermission(action, currentCount)) {
        callback()
      }
    },
    [checkPermission]
  )

  return { checkPermission, executeAction }
}
