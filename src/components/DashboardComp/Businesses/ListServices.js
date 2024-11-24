'use client'

import React, { useState, useEffect, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'

import { HiOutlinePlus } from 'react-icons/hi2'
import { RemoteIcon } from '../../../assets/shared/RemoteIcon'

import ServiceComp from './ServiceComp'
import SelectElement from '../../../components/Select'
import { getAccountType } from '../../../redux/admin_user'
import { getTotalSpaces } from '../../../redux/workspaceSlice'
import SimpleSearchInput from '../../../components/SimpleSearchInput'

export default function ListServicesComp({ toggle, setDelete, spaces }) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [sort, setSort] = useState('none')
  const [layout, setLayout] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const accountType = useSelector(getAccountType)
  const totalWorkspaces = useSelector(getTotalSpaces)

  const sortMethod = {
    none: { method: (a, b) => null },
    lowestToHighest: { method: (a, b) => (a.price > b.price ? 1 : -1) },
    highestToLowest: { method: (a, b) => (a.price > b.price ? -1 : 1) },
  }

  /**
   * The `handleGridView` function toggles CSS classes on list and grid view buttons when the list view
   * button is clicked.
   */
  const handleGridView = () => {
    let listBtn = document.getElementById('listView')
    let gridBtn = document.getElementById('gridView')
    listBtn?.addEventListener('click', function () {
      listBtn?.classList?.toggle('clicked-list')
      gridBtn?.classList?.remove('clicked-grid')
    })
  }

  /**
   * The `handleListView` function toggles the 'clicked-grid' class on the grid button and removes the
   * 'clicked-list' class from the list button when the grid button is clicked.
   */
  const handleListView = () => {
    let gridBtn = document.getElementById('gridView')
    let listBtn = document.getElementById('listView')
    gridBtn?.addEventListener('click', function () {
      gridBtn?.classList?.toggle('clicked-grid')
      listBtn?.classList?.remove('clicked-list')
    })
  }

  useEffect(() => {
    handleGridView()
    handleListView()

    return () => {}
  }, [])

  useLayoutEffect(() => {
    let listBtn = document.getElementById('listView')
    listBtn?.classList?.toggle('clicked-list')
    return () => {}
  }, [])

  return (
    <main className='xl:p-10 lg:p-10 md:p-10 sm:p-5 flex flex-col justify-center items-center gap-5 w-full'>
      {!accountType === 'Sales' && (
        <div className='lg:hidden md:hidden sm:flex sm:flex-row sm:justify-start sm:items-center sm:gap-4 sm:p-5 '>
          <Link
            href={'/dashboard/businesses'}
            className={clsx(
              pathname === '/dashboard/businesses'
                ? 'text-primary'
                : 'text-[grey] '
            )}
          >
            {' '}
            {t('All')}{' '}
          </Link>
          <Link
            href={'/dashboard/businesses/booked'}
            className={clsx(
              pathname === '/dashboard/businesses/booked'
                ? 'text-primary'
                : 'text-[grey] '
            )}
          >
            {' '}
            {t('Booked')}{' '}
          </Link>
          <Link
            href={'/dashboard/businesses/unbooked'}
            className={clsx(
              pathname === '/dashboard/businesses/unbooked'
                ? 'text-primary'
                : 'text-[grey] '
            )}
          >
            {' '}
            {t('Unbooked')}{' '}
          </Link>
        </div>
      )}

      <div className='bg-white shadow-2fl rounded-xl p-5 flex flex-col justify-start items-start gap-3 w-full '>
        <div className='flex justify-between items-center w-full  '>
          <div className='flex justify-center items-center gap-2'>
            <span className='text-primary text-base'>
              {accountType === 'Sales' ? ` ${totalWorkspaces}` : spaces.length}
            </span>
            <p className='text-[18px] font-small'>{t('Services')}</p>
          </div>

          {accountType === 'Owner' && (
            <Link
              href='/addspace'
              className='flex justify-center items-center gap-2 lg:w-[120px] lg:h-[48px] md:w-[100px] md:h-[40px] sm:w-[100px] sm:h-[40px] rounded bg-primary 
            text-white hover:text-white'
            >
              <HiOutlinePlus />
              <p>Add New</p>
            </Link>
          )}
        </div>

        <div
          className='flex w-full lg:flex-row lg:justify-between lg:items-center md:flex-row md:justify-between md:items-start md:gap-3 sm:flex-col 
          sm:justify-start sm:items-start sm:gap-3  '
        >
          <div className='xxl:w-[50%] xl:w-[50%] lg:w-[60%] lg:flex lg:flex-row lg:gap-4 md:w-[50%] sm:gap-2 md:flex-row sm:flex-col sm:w-full'>
            {accountType === 'Sales' ? (
              <div
                className='flex xl:flex-row xl:justify-start xl:items-center lg:flex-row md:flex-col md:justify-start md:items-start md:gap-3 
                 sm:flex-col sm:justify-start sm:items-start sm:gap-3 w-full'
              >
                <SelectElement
                  t={t}
                  label={'Sort By Price:'}
                  selectedValue={(v) => setSort(v)}
                  options={[
                    { label: 'lowest price', value: 'lowestToHighest' },
                    { label: 'highest price', value: 'highestToLowest' },
                  ]}
                />

                <SimpleSearchInput
                  placeholder={'Search for a business'}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            ) : (
              <div className='xl:w-[50%] lg:w-[50%] md:w-full sm:w-full '>
                <SelectElement
                  t={t}
                  label={'Sort By Price:'}
                  selectedValue={(v) => setSort(v)}
                  options={[
                    { label: 'lowest price', value: 'lowestToHighest' },
                    { label: 'highest price', value: 'highestToLowest' },
                  ]} // This component needs to be modify to be able to take a styling props, I want to be able to modify the styling based on where I want to use it.
                />
              </div>
            )}
          </div>

          <div
            className='flex flex-row xl:justify-start xl:w-auto lg:w-auto lg:justify-start md:justify-between md:w-auto sm:justify-between sm:w-full 
          items-center gap-5 '
          >
            {accountType === 'Sales' ||
              (accountType === 'Admin' && <FilterButton toggle={toggle} />)}

            <div className='flex justify-center items-center gap-3 '>
              <DisplayStyleButton
                icon={'List'}
                view={'listView'}
                onClick={() => setLayout(true)}
              />
              <DisplayStyleButton
                icon={'Grid'}
                view={'gridView'}
                onClick={() => setLayout(false)}
              />
            </div>
          </div>
        </div>

        {layout && (
          <div className='flex justify-between items-center xl:gap-5 lg:gap-5 md:gap-5 sm:gap-5 w-full '>
            <p className=' xl:w-[25%] lg:w-[25%] md:w-[25%] sm:w-[50%] text-xs'>
              {' '}
              {t('Business Name')}
            </p>
            <p className='xl:w-[10%] lg:w-[10%] md:w-[15%] sm:w-[30%] text-xs'>
              {' '}
              {t('Date')}{' '}
            </p>
            <p className=' xl:w-[7%] lg:w-[7%] md:w-[7%] lg:flex md:hidden sm:hidden text-xs'>
              {' '}
              {t('Time')}{' '}
            </p>
            <p className='xl:w-[10%] lg:w-[10%] md:w-[15%] lg:flex md:flex sm:hidden text-xs'>
              {' '}
              {t('Status')}{' '}
            </p>
            <p className='xl:w-[10%] lg:w-[10%] md:w-[10%] sm:w-[30%] lg:flex md:flex sm:hidden text-xs'>
              {' '}
              {t('Price')}{' '}
            </p>

            <span className='xl:w-[3%] lg:w-[3%] md:w-[3%] sm:w-[5%] text-xs'></span>
          </div>
        )}
      </div>

      {layout ? (
        <section className='rounded-lg flex flex-col gap-4 w-full '>
          {spaces
            ?.filter((workspace) =>
              workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => b.created_at.localeCompare(a.created_at))
            .sort(sortMethod[sort]?.method)
            .map((data) => {
              return (
                <ServiceComp
                  data={data}
                  key={data.id}
                  layout={layout}
                  setDelete={setDelete}
                />
              )
            })}
        </section>
      ) : (
        <section className='rounded-lg w-full grid xxl:grid-cols-5 special:grid-cols-3 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 sm:grid-cols-1 '>
          {spaces
            ?.filter((workspace) =>
              workspace.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => b.created_at.localeCompare(a.created_at))
            .sort(sortMethod[sort]?.method)
            .map((data) => {
              return (
                <ServiceComp
                  data={data}
                  key={data.id}
                  layout={layout}
                  setDelete={setDelete}
                />
              )
            })}
        </section>
      )}
    </main>
  )
}

//COMPONENTS
const FilterButton = ({ toggle }) => (
  <div
    onClick={() => toggle()}
    className='flex items-center cursor-pointer hover:bg-[#dbdada73] rounded-lg py-1 px-2'
  >
    <RemoteIcon
      h={'h-8'}
      w={'w-8'}
      localStyles={'pr-0'}
      name={'Filter-Filled'}
    />
    Filter
  </div>
)

const DisplayStyleButton = ({ icon, view, onClick }) => (
  <button id={view} type='button' className='p-1' onClick={onClick}>
    <Image
      alt={icon}
      width={24}
      height={24}
      src={`https://d3upyygarw3mun.cloudfront.net/${icon}.svg`}
    />
  </button>
)
