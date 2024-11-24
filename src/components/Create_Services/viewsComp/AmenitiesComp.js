import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { BiPlus } from 'react-icons/bi'
import { CgClose } from 'react-icons/cg'
import {
  getServiceData,
  setServiceData,
} from '../../../redux/createWorkspaceSlice'

export const amenityGroups = [
  {
    id: 1,
    name: 'Basic',
    created_at: '2023-09-16T10:37:04.000000Z',
    updated_at: null,
    items: [
      {
        id: 1,
        name: 'Wifi',
        amenity_groups_id: 1,
        created_at: '2023-09-16T10:37:24.000000Z',
        updated_at: null,
      },
      {
        id: 2,
        name: 'Air Conditioning',
        amenity_groups_id: 1,
        created_at: '2023-09-16T10:37:24.000000Z',
        updated_at: null,
      },
      {
        id: 3,
        name: 'Heating',
        amenity_groups_id: 1,
        created_at: '2023-09-16T10:37:24.000000Z',
        updated_at: null,
      },
    ],
  },
  {
    id: 5,
    name: 'Refreshments',
    created_at: '2023-09-16T10:37:04.000000Z',
    updated_at: null,
    items: [
      {
        id: 21,
        name: 'Drinks and Snacks',
        amenity_groups_id: 5,
        created_at: '2023-09-16T10:37:24.000000Z',
        updated_at: null,
      },
      {
        id: 30,
        name: 'Pastries',
        amenity_groups_id: 5,
        created_at: '2023-09-16T10:38:01.000000Z',
        updated_at: null,
      },
    ],
  },
  {
    id: 6,
    name: 'Others',
    created_at: '2023-09-16T10:37:04.000000Z',
    updated_at: null,
    items: [
      {
        id: 22,
        name: 'Pets Allowed',
        amenity_groups_id: 6,
        created_at: '2023-09-16T10:37:24.000000Z',
        updated_at: null,
      },
      {
        id: 23,
        name: 'Smoking Allowed',
        amenity_groups_id: 6,
        created_at: '2023-09-16T10:37:24.000000Z',
        updated_at: null,
      },
      {
        id: 24,
        name: 'Guests',
        amenity_groups_id: 6,
        created_at: '2023-09-16T10:37:24.000000Z',
        updated_at: null,
      },
    ],
  },
]

export default function AmenitiesComp({ prev, next, action }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const serviceData = useSelector(getServiceData)

  const [newAmenity, setNewAmenity] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [amenityGroupsState, setAmenityGroupsState] = useState(amenityGroups)
  const [addAmenitiesModal, setAddAmenitiesModal] = useState(false)
  const [currentGroupId, setCurrentGroupId] = useState(null)

  useEffect(() => {
    const savedAmenities = localStorage.getItem('selectedAmenities')
    if (savedAmenities && action !== 'edit') {
      const parsedAmenities = JSON.parse(savedAmenities)
      setSelectedAmenities(parsedAmenities)
      dispatch(setServiceData({ amenities: parsedAmenities }))
    }
  }, [dispatch])

  const amenitiesCalc = (state, amenity) => {
    const isExisting = selectedAmenities?.filter((x) => x !== amenity?.id)
    if (isExisting.length !== selectedAmenities?.length) {
      setSelectedAmenities(isExisting)
      return
    }
    setSelectedAmenities((prev) => [...prev, amenity?.id])
  }

  const addNewAmenity = () => {
    if (newAmenity.trim() === '') return

    const updatedGroups = amenityGroupsState.map((group) => {
      if (group.id === currentGroupId) {
        const newItem = {
          id: Date.now(),
          name: newAmenity,
          amenity_groups_id: currentGroupId,
          created_at: new Date().toISOString(),
          updated_at: null,
        }
        return { ...group, items: [...group.items, newItem] }
      }
      return group
    })

    setAmenityGroupsState(updatedGroups)
    setNewAmenity('')
    setAddAmenitiesModal(false)
  }

  const openModal = (groupId) => {
    setCurrentGroupId(groupId)
    setAddAmenitiesModal(true)
  }

  const handleProceed = () => {
    if (action !== 'edit') {
      localStorage.setItem(
        'selectedAmenities',
        JSON.stringify(selectedAmenities)
      )
    }
    dispatch(setServiceData({ amenities: selectedAmenities }))
    next({ amenities: amenityGroupsState })
  }

  return (
    <main className='flex flex-col justify-start items-start gap-5 w-full border border-gray p-5 rounded-md relative'>
      <div className='flex flex-col gap-1 w-full'>
        <h3 className='font-semibold text-lg'>Amenities</h3>
        <p>Let your guest know what amenities you have</p>
      </div>
      <hr className='w-full border-gray' />

      <div
        className='grid gap-5 w-full xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1'
        role='group'
        aria-labelledby='amenities-group'
      >
        {amenityGroupsState?.map((options) => (
          <div
            key={options.id}
            className='flex flex-col justify-start items-start gap-5'
          >
            <h4 className='font-semibold'> {options.name} </h4>
            {options.items?.map((items) => (
              <label
                key={items.id}
                className='flex justify-start items-center gap-2'
              >
                <input
                  type='checkbox'
                  name={items.id}
                  id='amenity'
                  checked={selectedAmenities.includes(items.id)}
                  onChange={(e) => amenitiesCalc(e.target.checked, items)}
                />
                {items.name}
              </label>
            ))}
            <button
              onClick={() => openModal(options.id)}
              className='text-primary flex items-center gap-3'
            >
              <BiPlus className='text-lg' /> Add Amenities
            </button>

            {addAmenitiesModal && currentGroupId === options.id && (
              <div className='fixed top-0 left-0 z-20 w-full h-screen bg-lightblack flex flex-col justify-center items-center'>
                <div className='bg-white rounded-md p-4 flex flex-col justify-start items-start gap-8 lg:w-[45%] lg:py-10 md:w-[75%] sm:w-[95%] '>
                  <div className='w-full flex flex-col gap-5'>
                    <div className='flex justify-between items-center w-full gap-5'>
                      <h3 className='font-semibold'>Add Amenity</h3>
                      <button
                        type='button'
                        onClick={() => setAddAmenitiesModal(false)}
                        className='text-lg'
                      >
                        <CgClose />
                      </button>
                    </div>
                    <hr className='w-full border-gray' />
                  </div>

                  <div className='flex flex-col justify-start items-start gap-3 w-full'>
                    <label htmlFor='name'>Name</label>
                    <input
                      type='text'
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder={`Add ${options.name} Amenity`}
                      className='border rounded-md border-lightgrey outline-none w-full indent-2 h-12'
                    />
                  </div>

                  <div className='flex justify-end items-center gap-4 ml-auto w-full'>
                    <button
                      type='button'
                      onClick={() => setAddAmenitiesModal(false)}
                      className='border border-lightgrey h-12 w-28 text-black rounded-full'
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={addNewAmenity}
                      className='bg-primary ring-2 ring-gray rounded-full h-12 w-28 text-white'
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='flex items-center gap-5 ml-auto'>
        <button
          onClick={() => prev(serviceData)}
          className='rounded-full h-12 w-[150px] text-black border border-lightgrey '
        >
          {t('Prev')}
        </button>

        <button
          onClick={handleProceed}
          className='rounded-full h-12 w-[150px] text-white bg-primary ring-2 ring-gray'
        >
          {t('Next')}
        </button>
      </div>
    </main>
  )
}
