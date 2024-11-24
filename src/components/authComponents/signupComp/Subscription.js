'use client'
import Cookies from 'universal-cookie'
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { usePaystackPayment } from 'react-paystack'
import { setInterest } from '../../../redux/authRelated'
import { pricingModels } from '../../../constants'
import { HighlightCheckIcon } from '../../../assets/icons'
import { generateId } from '../../../utils'
import LoadingIndicator, { CircularSpinner } from '../../LoadingIndicator'
import { useRouter } from 'next/navigation'
import { BiCheck } from 'react-icons/bi'
import { FormatAmount } from '../../../utils/formatAmount'

const beautyOptions = [
  { id: 1, name: 'Barbing' },
  { id: 2, name: 'Spas' },
  { id: 3, name: 'Beauty Studios' },
  { id: 4, name: 'Hair Salons' },
  { id: 5, name: 'Nail Studios' },
]

export default function Subscription({ next, prev, regPayload }) {
  const cookies = new Cookies()
  const dispatch = useDispatch();
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState(pricingModels[0]);
  const [togglePaymentMethod, setTogglePaymentMethod] = useState('monthly')
  const [currentPlan, setCurrentPlan] = useState('Basic')

  const handleUpgradeBtn = () => {
    setUpgradeToggle(!upgradeToggle)
  }
  const [ loading, showLoading ] = useState(false);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: regPayload?.payload?.email,
    amount: 50 * 100,
    publicKey: `${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_API_KEY}`,
    channels: ['card']
  }

  const initializePayment = usePaystackPayment(config)
  const [selectedOptions, setSelectedOptions] = useState([]);


  const handleSubmit = () => {
    activatePlan()
  }
  
  const createAccount = async (authorization_code, amount) => {
    try {
      const getAmount = () => {
        if(amount > 0 && togglePaymentMethod === 'yearly'){
          // deduct 20 percent for yearly
          return amount - 20/amount * 100
        }
        return amount
      }
      showLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            ...regPayload.payload,
            plan: selectedPlan.identifier,
            amount_paid: getAmount()*100,
            payment_status: 'Success',
            transaction_id: generateId(),
            authorization_code: authorization_code
          }),
        }
      )
      const data = await res.json()

      if (data?.status !== true) {
        localStorage.setItem('profileFormDetails', JSON.stringify(regPayload.formData))
        const errorMessages = Object.values(data.errors).flat()
        // setMessage(errorMessages)
        throw new Error(errorMessages[0])
      } else {
        localStorage.removeItem('profileFormDetails')
        localStorage.removeItem('interest')
        localStorage.removeItem('accountType')
        localStorage.removeItem('photo')
        cookies.remove('user_token', { path: '/' })

        cookies.set('user_token', data?.data?.token, {
          path: '/',
          maxAge: 2600000,
          sameSite: 'none',
          secure: true,
        })

        toast.success('Account created successfully.')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      showLoading(false)
    }
  }


  const verifyCardPayment = async (ref) => {
    try {
      showLoading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/transactions/${ref}/verify`,
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
          },
        }
      )
      const data = await res.json();
      if (data?.status !== true) {
        const errorMessages = Object.values(data.errors).flat()
        throw new Error(errorMessages[0])
      } else {
        let authorization = data.data[0].authorization
        createAccount(authorization.authorization_code, 50)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      showLoading(false)
    }
  }

  const onSuccess = (data) => {
    console.log(JSON.stringify(data))
    verifyCardPayment(data.reference)
  }

  const onClose = () => {
    
  }

  const activatePlan = () => {
    if(selectedPlan.identifier === 'Basic'){
      return createAccount('null', 0);
    }else{
      initializePayment(onSuccess, onClose)
    }
  }
  const multiplier = togglePaymentMethod === 'yearly' ? 12 : 1 


  return (
    <main className='h-screen w-full bg-dashgrey flex flex-col justify-center items-center'>
      <div className='bg-white px-5 py-10 rounded-md flex flex-col justify-start items-start gap-10 h-full lg:m-auto lg:h-[auto] lg:w-[auto]'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-xl'>BeautySpace</h1>
          <div className='flex gap-5'>
            <button
              type='button'
              onClick={() => prev()}
              className='h-10 w-16 px-5 text-white bg-lightgrey rounded-3xl flex justify-center items-center'
            >
              
              <FaArrowLeft />
            </button>
            {loading ? (
                <CircularSpinner />
              ):(
                <button
                type='button'
                onClick={handleSubmit}
                className='h-10 w-16 px-5 text-white bg-purple rounded-3xl flex justify-center items-center'
              >
                <FaArrowRight />
              </button>
              )}
         
          </div>
        </div>

        <div className='flex flex-col gap-5 w-full items-center '>
          {/* <h1 className='font-semibold'>Select Your Interests:</h1> */}
          {/* <section className='flex flex-col w-[100%] lg:w-[80%] items-start gap-5 items-center flex-wrap'>
            <h1 className='text-[25px] font-semibold text-lightgrey'>{selectedPlan.name}</h1>
            <h2 className='font-semibold mt-[-10px] text-[25px] text-center'>{selectedPlan.description}</h2>
            <div className='flex w-[100%] flex-col lg:flex-row lg:w-[90%] justify-between'>
              {pricingModels.map((price, i) => (
                <div key={i} onClick={() => setSelectedPlan(price)} className={`cursor-pointer ${price.identifier === selectedPlan.identifier? 'border-[#4F9ED0]' : 'border-[#D3D3D3]'} rounded-lg border-[.5px] mb-[10px] lg:mb-[0px] w-[100%] lg:w-[30%] p-[10px]`}>
                  <div className='w-[100%] flex justify-between'>
                    <p className='font-bold'>{price.name}</p>
                    <div className='h-[18px] w-[18px] rounded-[18px] border-[#4F9ED0] border-[1px] flex justify-center items-center'>
                      {price.identifier === selectedPlan.identifier && (
                        <div className='h-[10px] w-[10px] rounded-[18px] bg-[#4F9ED0]' />
                      )}
                    </div>
                  </div>
                  <p className='font-medium'>{i === 0? '₦0/mo' : price.pricing.price}</p>
                </div>
              ))}
            </div>
           <div className='w-[100%] lg:w-[90%] '>
            <h3 className='mb-[15px]'>{selectedPlan.perkTitle}</h3>
            {selectedPlan.perks.map((perk, i) => (
              <div key={i} className='w-[100%] flex mb-[20px]'>
                <HighlightCheckIcon />
                <p className='ml-[8px]'>{perk.title}</p>
              </div>
            ))}
          </div>
          </section> */}

<section className='w-full h-[100%] flex lg:justify-center lg:items-center md:justify-center md:items-center sm:justify-start sm:items-start '>
          <div
            className='relative bg-white rounded-md flex flex-col gap-5 overflow-auto scrollbar-hide h-full xxl:h-auto xl:h-auto lg:justify-start 
          lg:items-center lg:h-[90%] lg:w-auto lg:p-10 md:w-[80%] md:h-[70%] md:p-10 sm:p-5 sm:h-screen sm:w-full '
          >
            <h1 className='text-xl lg:text-2xl font-semibold text-center'>
              Choose the right plan for your business
            </h1>
            <div className='flex justify-center items-center gap-5 bg-gray rounded-md p-1'>
              <button
                type='button'
                onMouseDown={() => setTogglePaymentMethod('monthly')}
                className={clsx(
                  'rounded-md p-2 h-full flex justify-center items-center gap-2 px-5 lg:text-base md:text-base sm:text-sm',
                  togglePaymentMethod === 'monthly'
                    ? 'bg-white text-black'
                    : 'bg-transparent'
                )}
              >
                Monthly billings
              </button>
              <button
                type='button'
                onMouseDown={() => setTogglePaymentMethod('yearly')}
                className={clsx(
                  'rounded-md p-2 h-full flex justify-center items-center gap-2 px-5 lg:text-base md:text-base sm:text-sm',
                  togglePaymentMethod === 'yearly'
                    ? 'bg-white text-black'
                    : 'bg-transparent'
                )}
              >
                Yearly{' '}
                <span className='text-primary'>({`save up to 20%`})</span>
              </button>
            </div>

            <div className='flex justify-center items-start gap-5 flex-col w-full lg:flex-row '>
              {pricingModels.map((item) => {
                return (
                  <div
                    onClick={() => setSelectedPlan(item)}
                    key={item.id}
                    className={`${item.identifier === selectedPlan.identifier? 'border-[#4F9ED0]' : 'border-[#D3D3D3]'} border border-gray hover:border-[#4F9ED0] hover:cursor-pointer p-5 rounded-md flex flex-col justify-start items-start gap-8 w-full lg:w-[20rem] min-h-[30rem]`}
                  >
                    
                    <div className='flex flex-col  w-[100%] justify-start items-start gap-2'>
                      <div className='flex  w-[100%] items-center justify-between'>
                        <h4 className='font-medium'>{item.title}</h4>
                        <div className='h-[18px] w-[18px] rounded-[18px] border-[#4F9ED0] border-[1px] flex justify-center items-center'>
                          {item.identifier === selectedPlan.identifier && (
                            <div className='h-[10px] w-[10px] rounded-[18px] bg-[#4F9ED0]' />
                          )}
                        </div>
                      </div>
                      <h6 className='font-medium text-[grey] text-[14px]'>{item.description}</h6>
                      <p className='font-semibold text-2xl'>
                        &#8358;{FormatAmount(item.pricing.value * multiplier)}
                        <span className='text-lightgrey font-light text-base'>
                          {togglePaymentMethod === 'monthly'
                            ? '/ monthly'
                            : '/ yr'}
                        </span>
                      </p>
                    </div>
                    {/* <button
                      type='button'
                      className={clsx(
                        'w-full rounded-full px-5 h-12 text-white',
                        'bg-primary'
                      )}
                    >
                      Get Started
                    </button> */}

                    <div className='flex flex-col justify-start items-start gap-3'>
                      {item.perks.map((desc, index) => {
                        return (
                          <div
                            key={index}
                            className='flex items-start gap-2'
                          >
                            <HighlightCheckIcon />
                            <span className='flex-1'>{desc.title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        </div>
      </div>
    </main>
  )
}
