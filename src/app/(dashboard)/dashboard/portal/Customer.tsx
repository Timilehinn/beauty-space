import { useState } from 'react'
import { GET_LOYALTY } from '../../../../api/loyaltyRoute'
import { handleResponse } from '../../../../api/router'
import { getAppToken } from '../../../../utils'
import { UserDetails } from '../../../../global/types'

type ReceiptProps = {
  next: (id: number) => void
  isSmallScreen?: boolean
}

export type LoyaltyMember = {
  id: number
  code: string
  user_id: number
  business_id: number
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  customer: UserDetails
}

export default function Customer(props: ReceiptProps) {
  const { next, isSmallScreen } = props
  const token = getAppToken()
  const [loyaltyCode, setLoyaltyCode] = useState('')
  const [loading, showLoading] = useState(false)

  const getLoyaltyCode = async () => {
    try {
      showLoading(true)
      const res = await GET_LOYALTY(token, loyaltyCode)
      const { data, status, error } = handleResponse<LoyaltyMember>(res)
      if (status) {
        next(data.customer.id)
      } else {
        throw new Error(error)
      }
    } catch (error) {
      // toast.error(error)
    } finally {
      showLoading(false)
    }
  }

  return (
    <div
      className={`${
        isSmallScreen ? 'w-[100%]' : 'w-[35%]'
      } flex flex-col justify-between`}
      style={{ height: 'calc(100vh - 70px)' }}
    >
      <div className='flex items-center justify-between border-b-[1px] border-b-[lightgrey] px-[10px] py-[10px]'>
        <p className='font-jakarta'>Customer</p>
      </div>
      <div className='w-full flex-1 overflow-y-scroll scrollbar-hide p-[20px]'>
        <input
          placeholder='Enter loyalty code'
          type='text'
          name='code'
          id='code'
          className='h-12 outline-none indent-2 rounded-md w-full border border-gray'
          value={loyaltyCode}
          onChange={(e) => setLoyaltyCode(e.target.value)}
        />
      </div>
      <div className='w-full p-[10px] border-t-[1px] border-t-[lightgrey] py-[16.5px]'>
        <button
          onClick={getLoyaltyCode}
          disabled={!loyaltyCode || loading}
          style={{
            opacity: !loyaltyCode || loading ? 0.5 : 1,
            cursor: !loyaltyCode || loading ? 'not-allowed' : 'pointer',
          }}
          className='w-full flex items-center justify-center bg-accent_blue rounded-[8px] py-[15px] border-[1px] border-[lightgrey]'
        >
          <p className='text-[white] font-jakarta'>
            {loading ? 'Loading...' : 'Continue'}
          </p>
        </button>
      </div>
    </div>
  )
}
