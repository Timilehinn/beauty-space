import React from 'react'
import CardIcon from '../../assets/icons/Card.svg'
import PaypalIcon from '../../assets/icons/Paypal.svg'
import PaystackIcon from '../../assets/icons/payment-successful-icon.svg'

const PaymentMethod = ({ setSelectedPaymentOption, active }) => {
  return (
    <>
      {active && (
        <div>
          <h2 className='text-lg font-normal'>Payment Method</h2>
          <span className='text-sm mb-8'>Select one of the payment method</span>
          <div className='flex py-7 border-lightgrey rounded-lg space-y-4 flex-col'>
            <label
              htmlFor='creditCard'
              className='flex items-center gap-x-5 cursor-pointer'
            >
              <input type='radio' name='paymentMethod' id='creditCard' />
              <div className='card flex p-4 items-center gap-x-3 rounded-lg w-[335px]'>
                <CardIcon />
                <span>Credit Card</span>
              </div>
            </label>
            <label
              htmlFor='paypal'
              className='flex items-center gap-x-5 cursor-pointer'
            >
              <input type='radio' name='paymentMethod' id='paypal' />
              <div className='card flex p-4 items-center gap-x-3 rounded-lg w-[335px]'>
                <PaypalIcon />
                <span>Paypal</span>
              </div>
            </label>
            <label
              htmlFor='paypal'
              className='flex items-center gap-x-5 cursor-pointer'
            >
              <input type='radio' name='paymentMethod' id='paypal' />
              <div className='card flex p-4 items-center gap-x-3 rounded-lg w-[335px]'>
                {/* <PaystackIcon /> */}
                <img
                  src={'https://d3upyygarw3mun.cloudfront.net/paystack.png'}
                  height={25}
                  width={25}
                />
                <span>Paystack</span>
              </div>
            </label>
          </div>
        </div>
      )}
    </>
  )
}

export default PaymentMethod
