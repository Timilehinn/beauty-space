'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useUserPlanAccess } from '../../../../hooks/userPlanAccesss'

export default function Layout({ children }) {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { checkPermission } = useUserPlanAccess()

  return (
    <section className='flex flex-col justify-start items-start gap-5 h-screen pb-16 w-full overflow-auto scrollbar-hide '>
      <header className='bg-white w-full pt-4 px-5 flex flex-col justify-start items-start gap-5 lg:px-10'>
        <h1 className='text-2xl '>Insight</h1>

        <div className='flex justify-start items-center gap-5 w-full'>
          <Link href={'/dashboard/revenue'}>
            <p
              className={clsx(
                'hover:border-b-2 hover:border-primary hover:border-spacing-2',
                pathname === '/dashboard/revenue'
                  ? 'text-primary border-b-2 border-primary border-spacing-2'
                  : 'text-lightgrey'
              )}
            >
              {t('Finance')}
            </p>
          </Link>

          {checkPermission('extensive_reporting') && (
            <Link href={'/dashboard/revenue/stats'}>
              <p
                className={clsx(
                  'hover:border-b-2 hover:border-primary hover:border-spacing-2',
                  pathname === '/dashboard/revenue/stats'
                    ? 'text-primary border-b-2 border-primary border-spacing-2'
                    : 'text-lightgrey'
                )}
              >
                {t('Stats')}
              </p>
            </Link>
          )}

          <Link href={'/dashboard/revenue/reviews'}>
            <p
              className={clsx(
                'hover:border-b-2 hover:border-primary hover:border-spacing-2',
                pathname === '/dashboard/revenue/reviews'
                  ? 'text-primary border-b-2 border-primary border-spacing-2'
                  : 'text-lightgrey'
              )}
            >
              {t('Reviews')}
            </p>
          </Link>
        </div>
      </header>

      <div className='px-5 w-full lg:px-10'>{children}</div>
    </section>
  )
}
