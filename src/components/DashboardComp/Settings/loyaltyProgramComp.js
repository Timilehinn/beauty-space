import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Toggle from 'react-toggle'
import { getAppToken } from '../../../utils'
import { getUserInfo } from '../../../redux/admin_user'

function LoyaltyComp() {
  const token = getAppToken()
  const { t } = useTranslation()
  const router = useRouter()

  const userInfo = useSelector(getUserInfo)

  const [loyaltyDiscount, setLoyaltyDiscount] = useState(
    userInfo?.settings?.loyalty_discount || 1
  )
  const [loyaltyProgram, setLoyaltyProgram] = useState(
    userInfo?.settings?.loyalty_program || false
  )

  /**
   * The `handleLoyaltySettings` function handles the submission of loyalty program settings, including
   * opting in or out, and displays corresponding success or error messages.
   * @param e - The `e` parameter in the `handleLoyaltySettings` function is typically an event object,
   * commonly used in event handlers in JavaScript. In this case, it is likely representing an event that
   * triggers the loyalty settings handling function, such as a form submission event.
   */
  const handleLoyaltySettings = async (e) => {
    e.preventDefault()

    // Prepare form data
    const formData = {
      loyalty_program: loyaltyProgram,
      loyalty_discount: loyaltyDiscount,
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/settings`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await res.json()

      if (data?.status === true) {
        if (loyaltyProgram) {
          toast.success(
            'Your opt-in for the loyalty program has been successful'
          )
        } else {
          toast.success(
            'You have successfully opted out of the loyalty program'
          )
        }
        router.refresh()
      } else {
        throw new Error(
          loyaltyProgram
            ? 'An error occurred while trying to opt-in for the loyalty program. Please try again.'
            : 'An error occurred while trying to opt-out of the loyalty program. Please try again.'
        )
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred.')
    }
  }

  useEffect(() => {}, [userInfo])

  return (
    <main className='flex flex-col justify-start items-start gap-5 xxl:w-[60%] xl:w-[60%] lg:w-full md:w-full sm:w-full'>
      <div className='flex flex-col justify-start items-start gap-1'>
        <h1 className='text-lg font-semibold'>Loyalty </h1>
        <span className='text-lightgrey text-sm'>
          {t(
            'You need to toggle the button to activate your loyalty program and input your discount percentage you will be giving your loyal customer as well'
          )}
        </span>
      </div>

      <form
        onSubmit={handleLoyaltySettings}
        className='flex flex-col justify-start items-start gap-5 w-full border border-gray rounded-lg p-5'
      >
        <div className='flex justify-between items-center w-full '>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>{t('Loyalty Program:')}</label>
            <span className='text-lightgrey text-sm'>
              {t(
                `You are currently ${
                  loyaltyProgram
                    ? 'opt-in of loyalty program, which means everyone of your customers get a discount off as a loyal customers'
                    : 'opt-out of loyalty program, which means your customers do not enjoy any discount since you are not running any loyalty program for now. '
                }  `
              )}{' '}
            </span>
          </div>

          <Toggle
            defaultChecked={loyaltyProgram}
            icons={false}
            onChange={() => setLoyaltyProgram((prev) => !prev)}
          />
        </div>

        <hr className='w-full border-gray' />

        <div className='flex flex-col justify-start items-start gap-3 w-full'>
          <div className='flex flex-col gap-1'>
            <label htmlFor='loyalty_discount'>Loyalty Discount:</label>
            <span className='text-lightgrey text-sm'>
              {t(
                'This indicate the percentage you are willing to give your loyal customers on every bookings they made.'
              )}{' '}
            </span>
          </div>

          <input
            type='number'
            name='loyalty_discount'
            id='loyalty_discount'
            className='h-12 rounded-md w-full outline-none indent-3 border border-gray'
            value={loyaltyDiscount}
            onChange={(e) => setLoyaltyDiscount(Number(e.target.value))}
          />
        </div>

        <button
          type='submit'
          disabled={!loyaltyProgram || loyaltyDiscount === 0}
          className={clsx(
            'flex justify-center items-center w-full text-white rounded-md ring-1 ring-gray ml-0 h-12 px-5 lg:ml-auto lg:w-auto',
            !loyaltyProgram || loyaltyDiscount === 0
              ? 'bg-lightgrey'
              : ' bg-primary'
          )}
        >
          Save Changes
        </button>
      </form>
    </main>
  )
}

export default LoyaltyComp
