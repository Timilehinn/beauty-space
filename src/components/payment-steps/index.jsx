'use client'

import React, { useState } from 'react'

import Paystack from '../../components/bookings/paymentsMethodsFn/Paystack'
import Steps from './Steps'

const PaymentSteps = ({
  amount_paid,
  setIsSuccess,
  userDetails,
  workspaceData,
  transactionId,
  dateBooked,
  blockPayment,
  selectedHours,
}) => {
  const [currentStep, setCurrentStep] = useState(3)

  const availableSteps = [
    {
      value: 1,
      text: 'Payment Info',
    },
    {
      value: 2,
      text: 'Payment',
    },
    {
      value: 3,
      text: 'Space Confirmation',
    },
  ]

  return (
    <main className='flex flex-col justify-start items-start gap-5 border border-lightgrey rounded-md p-5 bg-white shadow-2fl xl:w-auto lg:w-auto md:w-full sm:w-full'>
      <Steps current={currentStep} availableSteps={availableSteps} />
      <div className='flex flex-col justify-start items-start gap-5 w-full'>
        <h2 className='text-2xl font-semibold capitalize'>Payment Info</h2>

        <div className='flex justify-end items-end gap-4 ml-auto w-full'>
          <Paystack
            amount_paid={amount_paid}
            blockPayment={blockPayment}
            workspaceData={workspaceData}
            setIsSuccess={setIsSuccess}
            userDetails={userDetails}
            transactionId={transactionId}
            dateBooked={dateBooked}
            selectedHours={selectedHours}
          />
        </div>
      </div>
    </main>
  )
}

export default PaymentSteps
