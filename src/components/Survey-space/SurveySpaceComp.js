'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Survey } from 'survey-react-ui'
import { StylesManager, Model } from 'survey-core'
import { toast } from 'react-toastify'

StylesManager.applyTheme('defaultV2')

import 'survey-core/defaultV2.min.css'

import { setSurveyjson } from '../../redux/BookingSurvey'

export default function SurveySpaceComp({ transactionId }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()

  const json = useSelector((state) => state.survey.surveyjson)

  const survey = new Model(json)
  survey.focusFirstQuestionAutomatic = false

  const updateSurvey = async (sender) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/bookings/review/${transactionId}`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ ...sender.data, is_reviewed: true }),
        }
      )
      const data = await res.json()

      if (data?.status !== true) {
        toast.error(
          'There was an error while trying to post your survey, please try again.'
        )
        return
      }

      toast.success('Thanks for submitting your feedback about this business.')

      setTimeout(() => {
        if (searchParams.get('origin') === 'mobile') {
          window.open(searchParams.get('redirect'))
        } else {
          router.push('/')
        }
      }, 3500)
    } catch (error) {}
  }

  const fetchSurveyDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/bookings/review/${transactionId}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        }
      )
      const data = await res.json()
      dispatch(setSurveyjson(data?.data[0]))
    } catch (error) {}
  }

  useEffect(() => {
    fetchSurveyDetails()
  }, [])

  survey.onComplete.add(updateSurvey)

  return <Survey model={survey} />
}
