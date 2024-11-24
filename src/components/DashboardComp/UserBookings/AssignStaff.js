import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { ASSIGN_STAFF, UNASSIGN_STAFF } from '../../../api/bookingRoutes.js'
import { handleResponse } from '../../../api/router'
import { GET_TEAMS } from '../../../api/teamRoutes.js'
import { getAppToken, isBookingExpired } from '../../../utils'

import { TimesIcon } from '../../../assets/icons'
import { CircularSpinner } from '../../LoadingIndicator'

const StaffItem = ({
  firstName,
  lastName,
  email,
  role,
  isSelected,
  isLastItem,
  onSelectStaff,
  isSelectable,
}) => {
  return (
    <div
      onClick={() => onSelectStaff?.()}
      className={`flex w-[100%] cursor-pointer px-[10px] justify-between items-center mb-4 ${
        !isLastItem ? 'border-b-[1px]' : ''
      } pb-[20px] border-gray`}
    >
      <div className='flex flex-1 justify-center items-center'>
        <div
          className={`flex items-center h-[60px] w-[60px] justify-center bg-[lightgrey] rounded-full text-white font-bold`}
        >
          <h3>{firstName.substring(0, 1)}</h3>
        </div>
        <div className='flex-1 ml-[8px]'>
          <p className='font-bold'>
            {firstName} {lastName}
          </p>
          <p className='text-sm'>{email}</p>
          <div className='mt-1 bg-blue-500 rounded-full inline-block'>
            <p className='text-xs text-grey'>{role}</p>
          </div>
        </div>
      </div>
      {isSelectable === true && (
        <input type='checkbox' id='checkbox' checked={isSelected} />
      )}
    </div>
  )
}

export default function AssignStaff({
  bookingId,
  workspaceId,
  staff,
  refresh,
  bookingDate,
}) {
  const router = useRouter()
  const token = getAppToken()

  const [loading, setLoading] = useState(false)
  const [modal, showModal] = useState(false)
  const [team, setTeam] = useState([])
  const [loadingTeams, setLoadingTeams] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)

  const getTeam = async () => {
    try {
      setLoadingTeams(true)
      const res = await GET_TEAMS(token)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)
      if (status) {
        setTeam(data.data)
      } else {
        throw new Error(error)
      }
    } catch (err) {
      toast.error('Something went wrong, please try again')
    } finally {
      setLoadingTeams(false)
    }
  }

  useEffect(() => {
    getTeam()
  }, [])

  const onSelectStaff = (item) => {
    if (selectedStaff?.user_id === item.user_id) {
      setSelectedStaff(null)
    } else {
      setSelectedStaff(item)
    }
  }

  const unAssign = async () => {
    try {
      if (staff) {
        setLoading(true)
        const res = await UNASSIGN_STAFF(
          token,
          bookingId,
          workspaceId,
          staff?.id
        )
        const { error, status, data } = handleResponse(res)
        if (status) {
          toast.success('Staff member successfully unassigned')
          refresh()
        } else {
          throw new Error(error)
        }
      }
    } catch (error) {
      toast.error('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  const assignStaff = async () => {
    try {
      if (!selectedStaff) {
        return toast.error('Select a staff member to continue')
      }
      setLoading(true)
      const res = await ASSIGN_STAFF(
        token,
        bookingId,
        workspaceId,
        selectedStaff?.user_id
      )
      const { error, status, data } = handleResponse(res)
      if (status) {
        setSelectedStaff(null)
        showModal(false)
        toast.success(`${selectedStaff?.user.first_name} has been assigned.`)
        refresh()
      } else {
        showModal(false)
        throw new Error(error)
      }
    } catch (error) {
      showModal(false)
      toast.error('Something went wrong, please try again')
    } finally {
      setLoading(false)
    }
  }

  const staffNameExists = () => {
    if (staff?.last_name === 'null' || staff?.first_name === 'null')
      return false
    if (staff?.first_name && staff?.last_name) return true
    return false
  }

  if (isBookingExpired(bookingDate) && staff) {
    return (
      <>
        <hr className='w-full border-gray' />
        <div
          className={`w-full cursor-pointer justify-between items-center mb-4 pb-[20px] border-gray`}
        >
          <h4 className='font-semibold mb-[10px] capitalize'>Assigned Staff</h4>
          <div className='flex items-center justify-between w-full'>
            <div className='flex flex-1 justify-center items-center'>
              <div
                className={`flex items-center h-[50px] w-[50px] justify-center bg-[lightgrey] rounded-full text-white font-bold`}
              >
                <h3>{staff?.email?.substring(0, 1)}</h3>
              </div>

              <div className='flex-1 ml-[8px]'>
                {staffNameExists() && (
                  <p className='font-bold text-[17px]'>
                    {staff?.first_name} {staff?.last_name}
                  </p>
                )}
                <p
                  className={`${
                    staffNameExists() ? 'text-[13px]' : 'text-[17px]'
                  } `}
                >
                  {staff?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isBookingExpired(bookingDate)) {
    return <></>
  }

  return (
    <>
      <hr className='w-full border-gray' />
      {staff ? (
        <div
          className={`w-full cursor-pointer justify-between items-center mb-4 pb-[20px] border-gray`}
        >
          <h4 className='font-semibold mb-[10px] capitalize'>Assigned Staff</h4>
          <div className='flex items-center justify-between w-full'>
            <div className='flex flex-1 justify-center items-center'>
              <div
                className={`flex items-center h-[50px] w-[50px] justify-center bg-[lightgrey] rounded-full text-white font-bold`}
              >
                <h3>{staff?.email?.substring(0, 1)}</h3>
              </div>

              <div className='flex-1 ml-[8px]'>
                {staffNameExists() && (
                  <p className='font-bold text-[17px]'>
                    {staff?.first_name} {staff?.last_name}
                  </p>
                )}
                <p
                  className={`${
                    staffNameExists() ? 'text-[13px]' : 'text-[17px]'
                  } `}
                >
                  {staff?.email}
                </p>
              </div>
            </div>
            {loading ? (
              <CircularSpinner />
            ) : (
              <button
                onClick={() => unAssign()}
                className='h-12 bg-primary px-5 text-white hover:bg-black rounded-md w-[150px]'
              >
                Unassign Staff
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className='w-[100%] flex justify-end'>
          {loading ? (
            <CircularSpinner />
          ) : (
            <button
              onClick={() => showModal(true)}
              className='h-12 bg-primary px-5 text-white hover:bg-black rounded-md w-[200px]'
            >
              Assign Staff
            </button>
          )}
        </div>
      )}

      {modal && (
        <article className='fixed top-0 left-0 w-full h-screen z-[999] flex justify-center items-center bg-lightblack p-10 '>
          <div className='flex flex-col justify-start items-start gap-8 bg-white shadow-2fl rounded-md p-5 xxl:w-[40%] xl:w-[40% h-[80%] lg:w-[40%] md:w-[80%] sm:w-[90%] '>
            <div className='flex flex-col justify-center w-[100%] items-center gap-2 text-center'>
              <div className='w-[100%] flex justify-end'>
                <button
                  className='cursor-pointer'
                  onClick={() => showModal(false)}
                >
                  <TimesIcon />
                </button>
              </div>

              <h2 className='text-lg font-medium'>
                Assign a staff member to this service
              </h2>
            </div>
            <div className='overflow-y-scroll w-[100%] h-full'>
              {team.map((item, i) => (
                <StaffItem
                  firstName={item.user.first_name}
                  lastName={item.user.last_name}
                  role={item.user.role.user_type.type}
                  email={item.user.email}
                  isSelected={item.id === selectedStaff?.id}
                  isLastItem={i + 1 === team.length}
                  onSelectStaff={() => onSelectStaff(item)}
                  isSelectable
                />

                //   <div
                //   key={i}
                //   onClick={() => onSelectStaff(item)}
                //   className={`flex w-[100%] cursor-pointer px-[10px] justify-between items-center mb-4 ${i + 1 !== team.length? 'border-b-[1px]' : ''} pb-[20px] border-gray`}
                // >
                //   <div className="flex flex-1 justify-center items-center">
                //     <div
                //       className={`flex items-center h-[60px] w-[60px] justify-center bg-[lightgrey] rounded-full text-white font-bold`}
                //     >
                //       <h3>{item.user.first_name.substring(0, 1)}</h3>
                //     </div>
                //     <div className="flex-1 ml-[8px]">
                //       <p className="font-bold">
                //         {item.user.first_name} {item.user.last_name}
                //       </p>
                //       <p className="text-sm">{item.user.email}</p>
                //       <div className="mt-1 bg-blue-500 rounded-full inline-block">
                //         <p className="text-xs text-grey">
                //           {item.user.role.user_type.type}
                //         </p>
                //       </div>
                //     </div>
                //   </div>
                //   <input type="checkbox" id="checkbox" checked={item.id === selectedStaff?.id} />
                // </div>
              ))}
              <button
                onClick={() => (loading ? null : assignStaff())}
                className='h-12 bg-primary px-5 text-white hover:bg-black rounded-md w-full'
              >
                {loading ? 'loading...' : 'Assign Staff'}
              </button>
            </div>
          </div>
        </article>
      )}
    </>
  )
}
