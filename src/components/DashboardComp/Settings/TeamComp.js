'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getUsers } from '../../../redux/admin_user'

import { BiChevronDown } from 'react-icons/bi'
import { CgClose } from 'react-icons/cg'
import { RiTeamLine } from 'react-icons/ri'

import { handleResponse } from '../../../api/router'
import { CREATE_TEAM_MEMBER, GET_TEAMS } from '../../../api/teamRoutes'
import { VERIFY_EMAIL } from '../../../api/userRoutes'
import { pricingModels } from '../../../constants'
import { requestResponse } from '../../../hooks/requestResponse'
import { useUserPlanAccess } from '../../../hooks/userPlanAccesss'
import { getAppToken } from '../../../utils'
import { CircularSpinner } from '../../LoadingIndicator'
import TeamList from '../../TeamList'

const extraPermissions = [
  {
    value: 'businesses:create',
    label: 'Create new businesses',
    isSelected: false,
  },
  { value: 'businesses:update', label: 'Update businesses', isSelected: false },
  { value: 'businesses:delete', label: 'Delete businesses', isSelected: false },
  {
    value: 'amenities:create',
    label: 'Create new amenities',
    isSelected: false,
  },
  { value: 'amenities:update', label: 'Update amenities', isSelected: false },
  { value: 'amenities:delete', label: 'Delete amenities', isSelected: false },
  {
    value: 'categories:create',
    label: 'Create new categories',
    isSelected: false,
  },
  { value: 'categories:update', label: 'Update categories', isSelected: false },
  { value: 'categories:delete', label: 'Delete categories', isSelected: false },
  { value: 'people:view', label: 'View people', isSelected: false },
  { value: 'reviews:view', label: 'View reviews', isSelected: false },
  { value: 'accounts:view', label: 'View accounts', isSelected: false },
  { value: 'accounts:create', label: 'Create new accounts', isSelected: false },
  { value: 'accounts:update', label: 'Update accounts', isSelected: false },
  { value: 'accounts:delete', label: 'Delete accounts', isSelected: false },
  { value: 'withdrawal:view', label: 'View withdrawals', isSelected: false },
  {
    value: 'withdrawal:create',
    label: 'Create new withdrawals',
    isSelected: false,
  },
  {
    value: 'withdrawal:update',
    label: 'Update withdrawals',
    isSelected: false,
  },
  {
    value: 'withdrawal:delete',
    label: 'Delete withdrawals',
    isSelected: false,
  },
  { value: 'banks:view', label: 'View banks', isSelected: false },
  { value: 'banks:create', label: 'Create new banks', isSelected: false },
  { value: 'banks:update', label: 'Update banks', isSelected: false },
  { value: 'banks:delete', label: 'Delete banks', isSelected: false },
  { value: 'discounts:view', label: 'View discounts', isSelected: false },
  {
    value: 'discounts:create',
    label: 'Create new discounts',
    isSelected: false,
  },
  { value: 'discounts:update', label: 'Update discounts', isSelected: false },
  { value: 'discounts:delete', label: 'Delete discounts', isSelected: false },
  {
    value: 'service-groups:view',
    label: 'View service groups',
    isSelected: false,
  },
  {
    value: 'service-groups:create',
    label: 'Create new service groups',
    isSelected: false,
  },
  {
    value: 'service-groups:update',
    label: 'Update service groups',
    isSelected: false,
  },
  {
    value: 'service-groups:delete',
    label: 'Delete service groups',
    isSelected: false,
  },
  { value: 'teams:create', label: 'Create new teams', isSelected: false },
  { value: 'teams:update', label: 'Update teams', isSelected: false },
  { value: 'teams:delete', label: 'Delete teams', isSelected: false },
]

export default function TeamComp() {
  const router = useRouter()
  const dispatch = useDispatch()
  const userStore = useSelector(getUsers)
  const userDetails = userStore.data

  const [loading, showLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(null)
  const [interval, setInterval] = useState('monthly')

  const multiplier = interval === 'yearly' ? 12 : 1

  const [roles, setRoles] = useState([
    { label: 'Manager', value: 'Manager' },
    { label: 'Staff', value: 'Staff' },
  ])
  const [addTeamModal, setAddTeamModal] = useState(false)
  const [permissions, setPermissions] = useState(extraPermissions)
  const [team, setTeam] = useState([])
  const token = getAppToken()

  const { checkPermission } = useUserPlanAccess()

  const [expandedGroups, setExpandedGroups] = useState({})

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const [group] = permission.value.split(':')
    if (!acc[group]) acc[group] = []
    acc[group].push(permission)
    return acc
  }, {})

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }))
  }

  const onSelectPermission = (value) => {
    setPermissions((prev) =>
      prev.map((permission) =>
        permission.value === value
          ? { ...permission, isSelected: !permission.isSelected }
          : permission
      )
    )
  }

  const togglePermission = (value) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((permission) =>
        permission.value === value
          ? { ...permission, isSelected: !permission.isSelected }
          : permission
      )
    )
  }

  useEffect(() => {
    if (userDetails && userDetails?.subscriptions.length > 0) {
      const _sub =
        userDetails.subscriptions[userDetails.subscriptions.length - 1]
      setInterval(_sub.subscription_plan.interval)
      const meta = pricingModels.find(
        (sub) => sub.identifier === _sub.subscription_plan.plan.split(' ')[0]
      )
      if (meta) {
        setCurrentPlan({
          currentPlan: userDetails?.subscriptions[0],
          meta,
        })
      }
    }
  }, [userDetails])

  const getTeam = async () => {
    try {
      showLoading(true)
      const res = await GET_TEAMS(token)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = requestResponse(res)
      if (status) {
        setTeam(data.data)
      } else {
        throw new Error(error)
      }
    } catch (err) {
      toast.error('Something went wrong, please try again')
    } finally {
      showLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const selectedPermissions = permissions
      .filter((p) => p.isSelected)
      .map((p) => p.value)

    const formData = {
      email: event.target.email.value,
      firstName: event.target.first_name.value,
      lastName: event.target.last_name.value,
      role: event.target.role.value,
      job_title: event.target.job_title.value,
      permissions: selectedPermissions,
    }

    addTeamMember(formData)
  }

  const addTeamMember = async (formData) => {
    try {
      showLoading(true)
      const emailValidation = await VERIFY_EMAIL(formData.email)
      const {
        error: emailError,
        status: emailStatus,
        data: emailData,
      } = handleResponse(emailValidation)
      if (!emailStatus) {
        return toast.error(emailError)
      }
      const res = await CREATE_TEAM_MEMBER(token, formData)
      const { error, status, data } = requestResponse(res)
      if (status) {
        setAddTeamModal(false)
        toast.success('Team member invite sent')
        getTeam()
      } else {
        toast.error(error)
      }
    } catch (error) {
      toast.error('Something went wrong, please try again.')
    } finally {
      showLoading(false)
    }
  }

  useEffect(() => {
    getTeam()
  }, [dispatch, token])

  return (
    <main className='flex flex-col justify-start items-start gap-5 relative xxl:w-[60%] xl:w-[60%] lg:w-full md:w-full sm:w-full'>
      <div className='flex justify-between items-center w-full'>
        <h1 className='text-semibold text-[25px]'>Team</h1>
        <button
          disabled={!checkPermission('create_team', team?.length)}
          onClick={() => setAddTeamModal(!addTeamModal)}
          className={clsx(
            'rounded-full h-12 px-5 text-white',
            !checkPermission('create_team', team?.length)
              ? 'bg-lightgrey'
              : 'bg-primary'
          )}
        >
          Add Team
        </button>
      </div>

      {team.length > 0 ? (
        <TeamList team={team} />
      ) : (
        <section className='h-[40vh] w-full flex flex-col justify-center items-center gap-3 m-auto'>
          <RiTeamLine className='text-6xl' />
          <p className=''>No team created yet!</p>
        </section>
      )}

      {addTeamModal && (
        <section className='fixed z-20 bg-lightblack w-full h-screen top-0 left-0 flex justify-center items-center'>
          <div className='flex flex-col justify-start items-start gap-5 w-full rounded-md p-5 bg-white h-[70vh] overflow-y-auto scrollbar-hide lg:w-[40%] '>
            <div className='flex justify-between items-center w-full'>
              <p className=''>Add team member</p>
              <button
                type='button'
                onClick={() => setAddTeamModal(false)}
                className='text-xl'
              >
                <CgClose />
              </button>
            </div>

            <hr className='w-full border-gray' />

            <form
              onSubmit={handleSubmit}
              className='flex flex-col justify-start items-start gap-5 w-full'
            >
              <div className='flex flex-col gap-2 w-full'>
                <label htmlFor='fullname'>Fullname</label>
                <div className='grid grid-cols-2 gap-5'>
                  {' '}
                  <input
                    type='text'
                    name='first_name'
                    id='first_name'
                    placeholder='First name'
                    className='border border-gray h-12 rounded-lg w-full indent-4 outline-none'
                  />
                  <input
                    type='text'
                    name='last_name'
                    id='last_name'
                    placeholder='Last name'
                    className='border border-gray h-12 rounded-lg w-full indent-4 outline-none'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-2 w-full'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  className='border border-gray h-12 rounded-lg indent-4 outline-none'
                />
              </div>

              <div className='flex flex-col gap-2 w-full'>
                <label htmlFor='role'>Select role</label>
                <select
                  name='role'
                  id='role'
                  className='border border-gray h-12 rounded-lg indent-4 outline-none'
                >
                  {roles.map((role, i) => (
                    <option key={i} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col gap-2 w-full'>
                <label htmlFor='job_title'>Job title:</label>
                <input
                  type='text'
                  name='job_title'
                  id='job_title'
                  placeholder='Job title '
                  className='border border-gray h-12 rounded-lg w-full indent-4 outline-none'
                />
              </div>

              <div className='flex flex-col gap-5 w-full'>
                <div className='flex justify-between items-start w-full'>
                  <div className='flex flex-col gap-1'>
                    <h3 className='font-semibold'>Access & Permission</h3>
                    <p className='text-lightgrey '>
                      Select extra permissions for this role
                    </p>
                  </div>

                  <BiChevronDown className='text-xl' />
                </div>

                <div className='flex flex-col gap-3 w-full overflow-scroll scrollbar-hide h-[200px]'>
                  {Object.keys(groupedPermissions).map((group) => (
                    <div key={group} className='flex flex-col gap-2'>
                      <button
                        type='button'
                        onClick={() => toggleGroup(group)}
                        className='font-semibold flex justify-between items-center w-full'
                      >
                        <span>
                          {' '}
                          {group.charAt(0).toUpperCase() + group.slice(1)}
                        </span>

                        <BiChevronDown />
                      </button>

                      {expandedGroups[group] && (
                        <div className='pl-4'>
                          {groupedPermissions[group].map((permission) => (
                            <div
                              key={permission.value}
                              className='cursor-pointer flex justify-start items-center gap-2'
                            >
                              <input
                                type='checkbox'
                                name='permission'
                                id={permission.value}
                                value={permission.value}
                                checked={permission.isSelected}
                                onChange={() =>
                                  onSelectPermission(permission.value)
                                }
                              />
                              <span>{permission.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className='w-full flex flex-col items-center'>
                  <CircularSpinner />
                </div>
              ) : (
                <button
                  type='submit'
                  className='bg-primary text-white h-12 rounded-lg w-full'
                >
                  Add
                </button>
              )}
            </form>
          </div>
        </section>
      )}
    </main>
  )
}
