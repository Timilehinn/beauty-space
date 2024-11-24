'use client'

import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import Loader from '../../Loader/Loader'
import Card from '../../workspace-card/card'
import { getLoading, getUserInfo } from '../../../redux/admin_user'

export default function FavouriteServices() {
  const { t } = useTranslation()

  const loading = useSelector(getLoading)
  const user = useSelector(getUserInfo)

  return (
    <>
      <Loader isLoading={loading} />
      <main className='flex flex-col justify-start items-start gap-5 px-5 py-5 '>
        <h1 className='font-medium text-[18px] hidden sm:block'>
          {t('Favorite Services')}
        </h1>

        <section className='w-full h-[80%] flex flex-col justify-between gap-5 '>
          <div className='grid gap-5 xxl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1'>
            <Card
              isListView={false}
              isGridView={true}
              currentPagelist={user?.workspace_favourites}
              useExploreRoute={true}
            />
          </div>
        </section>
      </main>
    </>
  )
}
