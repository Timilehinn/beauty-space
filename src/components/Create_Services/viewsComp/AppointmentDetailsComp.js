import { Form, Formik } from 'formik'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from 'draft-js'
import draftToHtml from 'draftjs-to-html'

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)

import { BiPlus } from 'react-icons/bi'
import { CiEdit } from 'react-icons/ci'

import { useCookieHandler } from '../../../hooks'
import { TextField } from '../../loginComp/TextField'

import ServicesAutocompletePlaces from '../../DashboardComp/Businesses/auto_complete'
import EditServiceComp from '../../DashboardComp/Businesses/EditService'
import { ServiceItemComp } from '../../DashboardComp/Businesses/ServiceItems'
// import {GetServicesByGroup} from '../../../constants/'

import {
  getDescription,
  getServiceData,
  setDescription,
  // setGroupedServices,
  setServiceData,
} from '../../../redux/createWorkspaceSlice'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { groupServicesByGroup } from '../../../utils/formatServices'

export default function AppointmentDetailsComp({ next, action }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { token } = useCookieHandler('user_token')

  const data = useSelector(getServiceData)

  const [editServiceAction, setEditServiceAction] = useState('create')
  const [showServiceEdit, setShowServiceEdit] = useState(false)
  const [serviceToEdit, setServiceToEdit] = useState(null)
  const [address, setAddress] = useState('')
  const [unStructuredServices, setUnstructuredServices] = useState([])
  const [groupedServices, setGroupedServices] = useState([])
  const isMounted = useRef(false)

  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const description = useSelector(getDescription)

  const [isLocalStorageDataLoaded, setIsLocalStorageDataLoaded] =
    useState(false)

  const initialGroupedServices = useRef(groupedServices)

  useEffect(() => {
    // If the local storage data has already been loaded, don't run the useEffect
    if (isLocalStorageDataLoaded) return

    const savedData = localStorage.getItem('appointment-details')

    if (savedData && action !== 'edit') {
      const { name, description, address, services, city, state } =
        JSON.parse(savedData)

      setAddress(address || '')
      setUnstructuredServices(services || [])
      // const restructued_services = groupServicesByGroup(data.services)
      setGroupedServices(services)
      // dispatch(setGroupedServices(services))

      dispatch(
        setServiceData({ name, address, description, services, city, state })
      )

      if (description) {
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(description))
          )
        )
      }

      // Set isLocalStorageDataLoaded to true after loading the data
      setIsLocalStorageDataLoaded(true)
    }

    if (data && action === 'edit') {
      if (data.services) {
        if (data.services && data.services.length > 0) {
          setUnstructuredServices(data?.services)
          const restructued_services = groupServicesByGroup(data?.services)
          setGroupedServices(restructued_services)
          // dispatch(setGroupedServices(restructued_services))
        }
      }

      if (data.address) {
        setAddress(data.address)
      }

      if (data.description) {
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(convertFromHTML(data.description))
          )
        )
      } else {
        setEditorState(EditorState.createEmpty()) // Ensure editorState is set to empty if no description
      }
    }
  }, [data, isLocalStorageDataLoaded, action])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
    const editorText = draftToHtml(
      convertToRaw(editorState?.getCurrentContent())
    )
    // setDescription(editorText)
    dispatch(setDescription(editorText))
  }

  const addService = () => {
    setEditServiceAction('create')
    setShowServiceEdit(true)
  }

  const saveAddedService = (service) => {
    setGroupedServices((groups) => {
      let groupExists = false

      const updatedGroups = groups.map((group) => {
        if (group.id === service.id) {
          groupExists = true
          // Replace the existing services with the new services
          return { ...group, services: service.services }
        } else {
          return group
        }
      })

      // If the group doesn't exist, create a new group and add it to the array
      if (!groupExists) {
        const newGroup = {
          id: service.id,
          name: service.name,
          asset_urls: service.asset_urls,
          services: service.services, // Ensure this is correct
          is_package: service.is_package,
          price: service.price,
        }
        return [...updatedGroups, newGroup]
      }

      return updatedGroups
    })

    setServiceToEdit(null)
    setShowServiceEdit(false)
  }

  /**
   * The `removeService` function removes a specific service from a group of services based on the
   * service's ID and group ID.
   * @param service - The `service` parameter in the `removeService` function represents the service that
   * needs to be removed from the grouped services. It contains information such as the `id` of the
   * service and the `groupId` to which it belongs.
   */
  const removeService = (service) => {
    try {
      setGroupedServices((groups) => {
        return groups.map((group) => {
          if (group.id === service.groupId) {
            var updatedServices = group.services.filter(
              (serv) => serv.id !== service.id
            )
            return { ...group, services: updatedServices }
          } else {
            return group
          }
        })
      })
    } catch (error) {}
  }

  // const removeGroup = (groupId) => {
  //   try {
  //     setGroupedServices((groups) => {
  //       // Filter out the group with the specified groupId
  //       const updatedGroups = groups.filter((group) => group.id !== groupId)

  //       // Here you can apply any additional updates you need to the remaining groups
  //       return updatedGroups
  //     })
  //   } catch (error) {
  //     console.error('Failed to remove group:', error)
  //   }
  // }

  /* The above code is using the `useEffect` hook in React to monitor changes in the `groupedServices`
state. It compares the current `groupedServices` with the initial `groupedServices` to determine if
there has been a change. If a change is detected, it updates the `initialGroupedServices` reference
and dispatches an action to update the service data with the new `groupedServices`. This ensures
that the service data is updated only when there is a change in the `groupedServices` state. */
  useEffect(() => {
    const servicesChanged =
      JSON.stringify(initialGroupedServices.current) !==
      JSON.stringify(groupedServices)

    // Only dispatch if a change is detected
    if (servicesChanged) {
      initialGroupedServices.current = groupedServices

      // Dispatch the update
      dispatch(
        setServiceData({
          ...data,
          services: groupedServices,
        })
      )
    }
  }, [groupedServices, dispatch])

  return (
    <main className='flex flex-col justify-start items-start gap-5 w-full border border-gray p-5 rounded-lg relative '>
      <Formik
        initialValues={{
          name: data.name || '',
          city: data.city || '',
          state: data.state || '',
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // Validation check
          let missingFields = []
          if (description.trim() === '' && data.description.trim() === '') {
            missingFields.push('Description')
          }
          if (!address || address.trim() === '') {
            missingFields.push('Address')
          }
          if (groupedServices.length === 0) {
            missingFields.push('Services')
          }

          if (missingFields.length > 0) {
            toast.error(
              `Please provide the following details: ${missingFields.join(
                ', '
              )}`
            )
            setSubmitting(false)
            return
          }

          // Save form values to localStorage
          const formData = {
            name: data.name,
            city: data.city,
            state: data.state,
            description: description || data.description,
            address: address,
            services: groupedServices,
          }

          if (action !== 'edit') {
            localStorage.setItem(
              'appointment-details',
              JSON.stringify(formData)
            )
          }

          next(formData)

          setSubmitting(true)
          setTimeout(() => {
            resetForm()
            setSubmitting(false)
          }, 500)
        }}
      >
        {() => (
          <Form className='flex flex-col justify-around items-start gap-5 w-full h-[80%]'>
            <TextField
              type='text'
              name='name'
              label={'Business Name'}
              value={data.name}
              onChange={(e) => {
                const newData = { ...data, name: e.target.value }
                dispatch(setServiceData(newData))
              }}
              placeholder='beautyspace spa'
              className='outline-none rounded-md indent-4 border border-gray w-full focus:border-lightgrey h-12'
            />

            <div className='flex flex-col justify-start items-start gap-3 w-full scrollbar-hide'>
              <label className='font-medium'>{t('Description')}</label>
              <Editor
                toolbarClassName='toolbarClassName'
                wrapperClassName='wrapperClassName'
                editorClassName='editorClassName'
                wrapperStyle={{ width: '100%' }}
                toolbarStyle={{
                  borderColor: '#e6e6e8',
                  border: '1px solid #e6e6e8',
                  borderRadius: '5px',
                }}
                editorStyle={{
                  maxWidth: '100%',
                  border: '1px solid #e6e6e8',
                  padding: '0 10px',
                  height: '200px',
                  borderRadius: '5px',
                }}
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
              />
            </div>

            <hr className='w-full border-gray' />

            <div className='flex flex-col justify-start items-start gap-5 w-full'>
              <div className='flex justify-between items-center w-full'>
                <div className='flex flex-col gap-2'>
                  <p className=''>Sub-Service</p>
                  <span className='text-sm'>
                    Add specific services customers can book
                  </span>
                </div>

                {!showServiceEdit && groupedServices.length >= 1 && (
                  <button
                    type='button'
                    onClick={() => addService()}
                    className='flex items-center gap-1 text-primary'
                  >
                    <BiPlus className='text-xl' /> Add
                  </button>
                )}
              </div>

              {!showServiceEdit && groupedServices.length < 1 && (
                <div className='flex flex-col justify-center items-center gap-3 w-full'>
                  <Image
                    src='/empty_banks.png'
                    width={100}
                    height={100}
                    alt='empty icon'
                  />
                  <p className='text-lightgrey'>No available sub-services</p>
                  <button
                    type='button'
                    onClick={() => addService()}
                    className='flex items-center gap-1 text-primary'
                  >
                    <BiPlus className='text-xl' /> Add
                  </button>
                </div>
              )}

              {showServiceEdit && (
                <EditServiceComp
                  token={token}
                  action={editServiceAction}
                  serviceToEdit={serviceToEdit}
                  addService={(details) => saveAddedService(details)}
                  onCancel={() => {
                    setEditServiceAction('create')
                    setServiceToEdit(null)
                    setShowServiceEdit(false)
                  }}
                />
              )}

              {!showServiceEdit && groupedServices.length >= 1 && (
                <div className='flex flex-col justify-start items-start gap-3 w-full border border-gray rounded-md p-3'>
                  {/* GROUPED SERVICES */}
                  {groupedServices?.map((group, i) => {
                    return (
                      <div
                        key={i}
                        className='w-full flex flex-col gap-2 border-b border-gray last:border-none'
                      >
                        <section className='w-full flex justify-between items-center'>
                          <h3 className='font-semibold capitalize text-base'>
                            {group.name}
                          </h3>
                          <button
                            type='button'
                            onClick={() => {
                              setServiceToEdit(group)
                              setEditServiceAction('edit')
                              setShowServiceEdit(true)
                            }}
                            className='cursor-pointer flex justify-center items-center text-xl border hover:text-primary border-gray w-10 rounded-md h-10'
                          >
                            <CiEdit />
                          </button>
                        </section>
                        {group.services.map((service, j) => {
                          return (
                            <ServiceItemComp
                              key={j}
                              index={j}
                              onRemove={(service) => removeService(service)}
                              onUpdate={(service) => {
                                setServiceToEdit(service)
                                setEditServiceAction('edit')
                                setShowServiceEdit(true)
                              }}
                              service={{
                                details: service,
                                group: {
                                  asset_urls: group.asset_urls,
                                  createdAt: group.created_at,
                                  name: group.name,
                                  updatedAt: group.updated_at,
                                  user_id: group.user_id,
                                },
                              }}
                            />
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <hr className='w-full border-gray' />

            <div className='grid content-center place-items-center gap-5 w-full lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1'>
              <TextField
                type='text'
                name='city'
                label={'City'}
                value={data.city}
                onChange={(e) => {
                  const newData = { ...data, city: e.target.value }
                  dispatch(setServiceData(newData))
                }}
                placeholder='Ikeja'
                className='outline-none rounded-md indent-4 border border-gray w-full focus:border-lightgrey h-12'
              />

              <TextField
                type='text'
                name='state'
                label={'State'}
                value={data.state}
                onChange={(e) => {
                  const newData = { ...data, state: e.target.value }
                  dispatch(setServiceData(newData))
                }}
                placeholder='Lagos'
                className='outline-none rounded-md indent-4 border border-gray w-full focus:border-lightgrey h-12'
              />
            </div>

            <div className='w-full relative '>
              <label htmlFor='address'>{t('Address')}</label>
              <ServicesAutocompletePlaces
                location={address}
                setAddressPicked={setAddress}
                noAbsoulte={'absolute'}
                placeholder={'Enter your address'}
              />
            </div>

            <button
              type='submit'
              className='rounded-full h-14 w-[150px] text-white bg-primary ring-2 ring-gray ml-auto'
            >
              {t('Next')}
            </button>
          </Form>
        )}
      </Formik>
    </main>
  )
}
