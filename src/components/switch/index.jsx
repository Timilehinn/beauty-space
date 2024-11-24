import React from 'react'
import { useTranslation } from 'next-i18next'

const Switch = () => {
  const { t } = useTranslation()

  return (
    <div className='flex justify-center'>
      <div className='relative inline-block w-10 mr-2 align-middle select-none'>
        <input
          type='checkbox'
          className='toggle-checkbox absolute block w-6 h-6 rounded-full bg-black border-2 border-black appearance-none cursor-pointer'
          id='toggle'
          role='switch'
        />
        <label
          htmlFor='toggle'
          className='toggle-label block overflow-hidden h-6 rounded-full bg-[lime] cursor-pointer'
        ></label>
      </div>
      <span className='text-lightgrey'>{t('Search as I move the map')}</span>
    </div>
  )
}

export default Switch
