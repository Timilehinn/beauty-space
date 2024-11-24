import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { BiChevronDown, BiEditAlt } from 'react-icons/bi'
import { MdClose, MdDelete } from 'react-icons/md'
import { toast } from 'react-toastify'

import { handleResponse } from '../api/router'
import { DELETE_MEMBER, UPDATE_TEAM_MEMBER } from '../api/teamRoutes'
import { getAppToken } from '../utils'
import { BsChatDots, BsChatFill } from 'react-icons/bs'
import { useClient } from '../providers/clientContext'

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

export default function TeamList({ team, onSelect }) {
  const token = getAppToken()
  const router = useRouter()
  const isSelectable = onSelect ? true : false
  const { client } = useClient();
  const [permissions, setPermissions] = useState(extraPermissions)
  const [roles, setRoles] = useState([
    { label: 'Manager', value: 'Manager' },
    { label: 'Staff', value: 'Staff' },
  ])

  const [revokeTeamModal, setRevokeTeamModal] = useState(false)
  const [editMemeberModal, setEditMemberModal] = useState(null)

  const [selectedMember, setSelectedMember] = useState(null)
  const [expandedGroups, setExpandedGroups] = useState({})

  /* The above code is a React useEffect hook that runs when the `selectedMember` state changes. It
checks if `selectedMember` and its nested properties `user` and `role` exist. If they do, it
extracts the permissions from the `selectedMember.user.role.permissions` array and updates the
`permissions` state based on whether each permission is included in the extracted permissions. This
allows for merging pre-selected permissions with additional permissions and updating the UI
accordingly. */
  useEffect(() => {
    if (selectedMember && selectedMember.user && selectedMember.user.role) {
      // Merge the pre-selected permissions with extraPermissions
      const selectedPermissions = selectedMember.user.role.permissions.map(
        (p) => p.name
      )

      // Update permissions state when selectedMember data is ready
      setPermissions((prevPermissions) =>
        prevPermissions.map((permission) => ({
          ...permission,
          isSelected: selectedPermissions.includes(permission.value),
        }))
      )
    }
  }, [selectedMember])

  const handleEditClick = (id) => {
    const member = team.find((member) => member.id === id)
    setSelectedMember(member)
    setEditMemberModal(id)
  }

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

  const handleRoleChange = (e) => {
    const newRoleType = e.target.value
    setSelectedMember((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        role: {
          ...prev.user.role,
          user_type: {
            ...prev.user.role.user_type,
            type: newRoleType, // Update only the `type` within `user_type`
          },
        },
      },
    }))
  }

  /**
   * The function `handleDeleteStaff` asynchronously deletes a staff member, displays a success message,
   * and refreshes the data if successful, otherwise shows an error message.
   * @param id - The `id` parameter in the `handleDeleteStaff` function is the unique identifier of the
   * staff member that you want to delete from your team. This identifier is used to specify which staff
   * member should be removed when making the delete request to the server.
   */
  const handleDeteleStaff = async (id) => {
    try {
      const res = await DELETE_MEMBER(token, id)

      const { data, error, status } = handleResponse(res)

      if (status) {
        toast.success('You succcessfully remove this staff from your team')
        // Wait briefly to allow the toast to be visible before refreshing
        setTimeout(() => {
          router.refresh() // Refreshes the data without a full reload
        }, 2000) // Adjust the delay if needed
      } else {
        throw new Error(
          'An error occurred while deleting this staff, kindly try again',
          error
        )
      }
    } catch (error) {
      toast.error(error)
    }
  }

  /**
   * The function `handleUpdateMember` updates a team member's information and permissions, displaying
   * success or error messages accordingly.
   * @param e - The `e` parameter in the `handleUpdateMember` function is typically an event object, such
   * as a form submission event. In this case, it is used to prevent the default behavior of the event,
   * which is often to submit a form and reload the page. By calling `e.preventDefault()
   */
  const handleUpdateMember = async (e) => {
    e.preventDefault()

    const selectedPermissions = permissions
      .filter((p) => p.isSelected)
      .map((p) => p.value)

    // Combine existing permissions with newly selected ones, avoiding duplicates
    const currentPermissions = selectedMember.user.role.permissions.map(
      (p) => p.name
    )

    const combinedPermissions = Array.from(
      new Set([...currentPermissions, ...selectedPermissions])
    )

    // Construct the formData object with required fields
    const formData = {
      email: selectedMember.user.email,
      firstName: selectedMember.user.first_name,
      lastName: selectedMember.user.last_name,
      role: selectedMember.user.role.user_type.type, // get updated role value
      job_title: selectedMember.user.job_title,
      permissions:
        selectedPermissions.length > 0
          ? combinedPermissions
          : currentPermissions,
    }

    try {
      const res = await UPDATE_TEAM_MEMBER(token, selectedMember.id, formData)

      const { data, error, status } = handleResponse(res)

      if (status) {
        toast.success('This member information has been updated successfully!')
        // Wait briefly to allow the toast to be visible before refreshing
        setTimeout(() => {
          router.refresh() // Refreshes the data without a full reload
        }, 2000) // Adjust the delay if needed
      } else {
        toast.error(error)
      }
    } catch (error) {
      throw new Error('An error occurred, kindly try again ')
    }
  }

  const startConversation = (user) => {
    if(user){
      let userMeta = {
        uid: user?.id,
        username: user?.first_name || user.email.substring(0,7),
        firstname: user?.first_name,
        lastname: user?.last_name,
        email: user?.email,
        profileUrl: user?.profile_url,
      }
      const msClient = client.newConversation(userMeta, null);
      const conversation = msClient.create();
      router.push(`/dashboard/inbox?conversation=${conversation.conversation.conversationId}`);
    }
  }

  return (
    <main className='w-full flex flex-col justify-start items-start gap-5'>
      {team.map((item) => {
        return (
          <section
            key={item.id}
            onClick={() => (isSelectable ? onSelect() : null)}
            className={`flex justify-between items-center gap-5 w-full ${
              isSelectable ? 'cursor-pointer' : 'default'
            }`}
          >
            <div className='flex justify-start items-center gap-5'>
              <div
                className={`flex items-center h-14 w-14 justify-center bg-lightgrey text-3xl rounded-full text-white font-bold`}
              >
                <h3>{item.user.first_name.substring(0, 1)}</h3>
              </div>

              <div className='flex flex-col justify-start items-start gap-1'>
                <h1 className='font-semibold'>
                  {item.user.first_name} {item.user.last_name}
                </h1>
                <p className='text-sm'>{item.user.email}</p>
                <span className='text-xs text-lightgrey'>
                  {item.user.role.user_type.type}
                </span>
              </div>
            </div>

            <div className='flex justify-start items-center gap-3'>
            <button
                onClick={() => startConversation(item?.user)}
                className='text-2xl border border-gray p-3 rounded-md hover:border-primary hover:text-primary'
              >
                <BsChatDots />
              </button>
              <button
                onClick={() => setRevokeTeamModal(true)}
                // onClick={() => handleDeteleStaff(item.id)}
                className='text-2xl border border-gray p-3 rounded-md hover:border-primary hover:text-primary'
              >
                <MdDelete />
              </button>

              <button
                onClick={() => handleEditClick(item.id)}
                className='text-2xl border border-gray p-3 rounded-md hover:border-primary hover:text-primary'
              >
                <BiEditAlt />
              </button>

              {isSelectable && (
                <input
                  type='checkbox'
                  id='checkbox'
                  checked={item.isSelected}
                />
              )}
            </div>

            {editMemeberModal !== null && (
              <section className='fixed top-0 left-0 h-screen w-full bg-lightblack flex justify-center items-center m-auto z-20'>
                <div
                  className='bg-white w-[90%] rounded-md ring-1 ring-gray px-5 py-10 flex flex-col justify-start items-start gap-5 overflow-auto scrollbar-hide
                 h-[70%] lg:w-[50%]'
                >
                  <header className='flex justify-between items-center w-full'>
                    <h1 className='font-semibold'>Update Member:</h1>
                    <button
                      type='button'
                      onClick={() => setEditMemberModal(null)}
                      className='text-2xl border border-gray p-1 rounded-md hover:border-primary'
                    >
                      <MdClose />
                    </button>
                  </header>

                  <hr className='w-full border-gray' />

                  <form
                    onSubmit={handleUpdateMember}
                    className='flex flex-col justify-start items-start gap-5 w-full'
                  >
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor='fullname'>Fullname</label>
                      <div className='grid grid-cols-2 gap-5'>
                        <input
                          type='text'
                          name='first_name'
                          id='first_name'
                          placeholder='First name'
                          value={selectedMember.user.first_name}
                          className='border border-gray h-12 rounded-lg w-full indent-4 outline-none'
                          disabled
                        />
                        <input
                          type='text'
                          name='last_name'
                          id='last_name'
                          placeholder='Last name'
                          value={selectedMember.user.last_name}
                          className='border border-gray h-12 rounded-lg w-full indent-4 outline-none'
                          disabled
                        />
                      </div>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor='email'>Email</label>
                      <input
                        type='email'
                        name='email'
                        id='email'
                        value={selectedMember.user.email}
                        className='border border-gray h-12 rounded-lg indent-4 outline-none'
                        disabled
                      />
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                      <label htmlFor='role'>Select role</label>
                      <select
                        name='role'
                        id='role'
                        className='border border-gray h-12 rounded-lg indent-4 outline-none'
                        value={
                          selectedMember?.user?.role?.user_type?.type || ''
                        } // Optional chaining to avoid errors
                        onChange={handleRoleChange}
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
                        placeholder='Job title'
                        value={selectedMember.user.job_title || ''}
                        className='border border-gray h-12 rounded-lg w-full indent-4 outline-none'
                        disabled
                      />
                    </div>
                    <div className='flex flex-col gap-5 w-full'>
                      <div className='flex justify-between items-start w-full'>
                        <div className='flex flex-col gap-1'>
                          <h3 className='font-semibold'>Access & Permission</h3>
                          <p className='text-lightgrey'>
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
                                {group.charAt(0).toUpperCase() + group.slice(1)}
                              </span>
                              <BiChevronDown />
                            </button>

                            {expandedGroups[group] && (
                              <div className='pl-4'>
                                {groupedPermissions[group].map((permission) => (
                                  <div
                                    key={permission.id}
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

                      <button
                        type='submit'
                        className='bg-primary text-white px-5 h-12 ring-1 ring-gray rounded-lg'
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            )}

            {revokeTeamModal && (
              <section className='fixed top-0 left-0 h-screen w-full bg-lightblack flex justify-center items-center m-auto z-20'>
                <div className='bg-white w-[90%] rounded-md ring-1 ring-gray px-5 py-10 flex flex-col justify-start items-start gap-5 lg:w-[40%] '>
                  <div className='flex flex-col justify-center items-center gap-2 w-[70%] mx-auto text-center'>
                    <h1 className='text-lg font-semibold'>
                      You are about to revoke this staff access
                    </h1>
                    <span className='text-lightgrey '>
                      Are you sure you want to continue with this, it cannot be
                      revert once you proceed!
                    </span>
                  </div>

                  <div className='flex items-center justify-center gap-5 mx-auto w-full'>
                    <button
                      onClick={() => setRevokeTeamModal(false)}
                      className='border border-gray h-12 text-black px-5 rounded-md focus:border-primary'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeteleStaff(item.id)}
                      className='bg-danger h-12 text-white rounded-md px-5 ring-1 ring-gray'
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              </section>
            )}
          </section>
        )
      })}
    </main>
  )
}
