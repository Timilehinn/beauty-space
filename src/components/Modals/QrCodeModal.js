import React from 'react'
import { MdClose } from 'react-icons/md'

export default function QrCodeModal({ setQrCodeModal, qrCode }) {
  return (
    <article className='fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-[#0808088f] '>
      <div className='flex flex-col justify-start items-start gap-8 bg-white shadow-2fl rounded-md p-5 xxl:w-[40%] xl:w-[40%] lg:w-[40%] md:w-[80%] sm:w-[90%] '>
        <header className='flex justify-between items-center w-full'>
          <h1 className='text-lg font-semibold'>Scan QR Code </h1>
          <button
            type='button'
            onClick={() => setQrCodeModal(false)}
            className='cursor-pointer text-lg'
          >
            <MdClose />{' '}
          </button>
        </header>

        <img src={qrCode} className='w-[250px] h-full mx-auto ' />
      </div>
    </article>
  )
}
