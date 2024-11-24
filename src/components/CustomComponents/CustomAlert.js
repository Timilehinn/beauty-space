import React from 'react'
import { BsXLg } from 'react-icons/bs'

const CustomAlert = ({ watcher, setWatcher }) => {
  return (
    <main className='h-full w-[100%] bg-[#1312129a] fixed inset-0 flex justify-center items-center z-10 '>
      <div className='py-2 space-y-4 bg-[white] w-[620px] h-[316px] rounded ml-[10px] p-[20px] pt-[20px] pb-[20px] shadow-2fl mt-[20px]'>
        <button
          type='button'
          onClick={() =>
            setWatcher({
              statement: '',
              value: false,
            })
          }
          className='flex justify-end w-[100%]'
        >
          <BsXLg />
        </button>
        <div className='h-[auto] flex flex-col justify-center items-center'>
          <p className=' mt-[30px] leading-6 text-[#141115]'>
            {watcher?.statement}
          </p>
          <button
            onClick={() =>
              setWatcher({
                statement: '',
                value: false,
              })
            }
            className='w-[177px] h-[52px] p-[20px] rounded mt-[30px] flex items-center justify-center bg-[#0559FD] text-[#FCFCFC] text-[17px]'
          >
            {'Ok'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default CustomAlert
