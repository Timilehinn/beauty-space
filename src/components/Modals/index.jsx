import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { TimesIcon } from '../../assets/icons'

export const ModalHeader = ({ title, onClose }) => {
  return (
    <div className='w-[100%] flex flex-row justify-between'>
      <p className='text-[25px]'>{title}</p>
      <button
        className='p-[5px] hover:bg-[#F0F0F0] rounded transition-transform duration-500 transform-gpu hover:scale-105'
        onClick={onClose}
      >
        <TimesIcon />
      </button>
    </div>
  )
}

function AppModal({ modal, children }) {
  return (
    <>
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='fixed inset-0 z-[1000] bg-[rgba(0,0,0,.5)] flex items-center justify-center'
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='fixed inset-0 z-[1001] flex items-center justify-center'
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AppModal
