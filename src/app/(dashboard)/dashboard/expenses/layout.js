'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'

export default function ExpensesLayout({ children }) {
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <section className='flex flex-col justify-start items-start gap-5 min-h-full pb-16 w-full overflow-auto scrollbar-hide '>
      <header className='bg-white w-full pt-4 px-5 flex flex-col justify-start items-start gap-5 lg:px-10'>
        <h1 className='text-2xl '>Insight</h1>

        <div className='flex justify-start items-center gap-5 w-full'>
          <Link href={'/dashboard/expenses'}>
            <p
              className={clsx(
                'hover:border-b-2 hover:border-primary hover:border-spacing-2',
                pathname === '/dashboard/expenses'
                  ? 'text-primary border-b-2 border-primary border-spacing-2'
                  : 'text-lightgrey'
              )}
            >
              {t('Expenses')}
            </p>
          </Link>

          <Link href={'/dashboard/expenses/visited-location'}>
            <p
              className={clsx(
                'hover:border-b-2 hover:border-primary hover:border-spacing-2',
                pathname === '/dashboard/expenses/visited-location'
                  ? 'text-primary border-b-2 border-primary border-spacing-2'
                  : 'text-lightgrey'
              )}
            >
              {t('Most Visited Places')}
            </p>
          </Link>

          <Link href={'/dashboard/expenses/reviews'}>
            <p
              className={clsx(
                'hover:border-b-2 hover:border-primary hover:border-spacing-2',
                pathname === '/dashboard/expenses/reviews'
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
