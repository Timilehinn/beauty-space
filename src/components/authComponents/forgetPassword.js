import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAppToken } from '../../utils'

export default function ForgetPasswordComp() {
  const router = useRouter()
  const { t } = useTranslation()
  const token = getAppToken()

  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return <div>ForgetPasswordComp</div>
}
