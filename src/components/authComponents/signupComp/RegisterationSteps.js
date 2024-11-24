'use client'

import { createClient } from 'contentful'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AccountType from './AccountType'
import RegisterEmail from './RegisterEmail'
import RegistrationFormDetails from './RegistrationFormDetails'
import UserInterest from './UserInterest'

import { getSignUpWorkspace } from '../../../redux/authRelated'
import { setLoginContent } from '../../../redux/indexData'
import EmailVerification from './EmailVerification'
import Subscription from './Subscription'

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY,
})

export default function RegistrationFormSteps() {
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(0)
  const accountType = useSelector(getSignUpWorkspace)
  const [regPayload, setRegPayload] = useState({
    payload: null,
    formData: null,
  })

  const nextStep = () => {
    setCurrentStep((prev) => {
      // if (prev === 2 && accountType !== 'User') {
      //   return prev + 2 // Skip to case 4 if accountType is not 'User'
      // }
      return prev + 1
    })
  }

  const prevStep = () => {
    setCurrentStep((prev) => {
      if (prev === 4 && accountType !== 'User') {
        return prev - 2 // Go back to case 2 if accountType is not 'User'
      }
      return prev - 1
    })
  }

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await client.getEntries({
          content_type: 'loginAndSignup',
        })
        dispatch(setLoginContent(res?.items[0]?.fields))
      } catch (error) {
        console.error('Error fetching login and signup content:', error)
      }
    }

    fetchHome()
  }, [dispatch])

  const renderSignupSteps = () => {
    switch (currentStep) {
      case 0:
        return <RegisterEmail next={nextStep} />
      case 1:
        return <EmailVerification prev={prevStep} next={nextStep} />
      case 2:
        return <AccountType prev={prevStep} next={nextStep} />
      case 3:
        return <UserInterest prev={prevStep} next={nextStep} />
      case 4:
        return (
          <RegistrationFormDetails
            prev={prevStep}
            next={nextStep}
            setRegPayload={setRegPayload}
          />
        )
      case 5:
        return (
          <Subscription
            prev={prevStep}
            next={nextStep}
            regPayload={regPayload}
          />
        )
      default:
        return null
    }
  }
  // return <Subscription prev={prevStep} next={nextStep} regPayload={regPayload} />
  return <main>{renderSignupSteps()}</main>
}
