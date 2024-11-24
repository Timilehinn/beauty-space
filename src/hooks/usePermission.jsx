import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { getUserType } from '../redux/admin_user'

export const usePermissions = () => {
  const accountType = useSelector(getUserType)

  const permissions = useMemo(() => {
    if (!accountType || !accountType.permissions) return []

    return accountType.permissions.map((permission) => permission.name)
  }, [accountType])

  const hasPermission = (permissionName) => {
    return permissions.includes(permissionName)
  }

  return { hasPermission }
}
