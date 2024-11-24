'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Model, StylesManager } from 'survey-core'
import { Survey } from 'survey-react-ui'
import { useRouter, useSearchParams } from 'next/navigation'

StylesManager.applyTheme('defaultV2')

import 'survey-core/defaultV2.min.css'

import { json } from './json'

export default function OwnerKYC() {
  const router = useRouter()
  const [file, setFile] = useState(null)

  const searchParams = useSearchParams()
  const user_id = searchParams.get('user_id')

  const survey = new Model(json)

  const updateKyc = async (sender) => {
    const sendingKyc = {
      means_of_id: sender.data?.means_of_id,
      document: file,
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/owner-kyc`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user_id}`,
          },
          body: JSON.stringify(sendingKyc),
        }
      )
      const data = await res.json()

      if (data?.status === true) {
        toast.success('Thank you for submitting your request.')
        setTimeout(() => {
          router.push('/')
        }, 5000)
      } else {
        toast.error('Error uploading your KYC')
      }
    } catch (error) {}
  }

  survey.onUploadFiles.add(function (survey, options) {
    var reader = new FileReader()

    reader.readAsDataURL(options?.files[0])

    reader.onload = (e) => {
      // setFile(e.target.result.toLocaleString()) // I am removing the to string that makinde added so it can display the file added
      setFile(e.target.result)
    }

    var formData = new FormData()
    options.files.forEach(function (file) {
      formData.append(file.name, file)
    })
    var xhr = new XMLHttpRequest()
    xhr.open(
      'POST',
      'https://api.surveyjs.io/private/Surveys/uploadFiles?accessKey=<your_access_key>'
    )
    xhr.onload = function () {
      var data = JSON.parse(xhr.responseText)
      options.callback(
        'success',
        options.files.map(function (file) {
          return { file: file, content: data[file.name] }
        })
      )
    }
    xhr.send(formData)
  })

  function detectIEOrEdge() {
    var ua = window.navigator.userAgent
    var msie = ua.indexOf('MSIE ')
    var trident = ua.indexOf('Trident/')
    var edge = ua.indexOf('Edge/')
    return edge > 0 || trident > 0 || msie > 0
  }

  survey.onDownloadFile.add(function (survey, options) {
    var xhr = new XMLHttpRequest()
    xhr.open(
      'GET',
      'https://api.surveyjs.io/private/Surveys/files?name=' + options.content
    )

    xhr.onloadstart = function (ev) {
      xhr.responseType = 'blob'
    }
    xhr.onload = function () {
      var file
      if (detectIEOrEdge()) {
        file = new Blob([xhr.response], options.fileValue.name, {
          type: options.fileValue.type,
        })
      } else {
        file = new File([xhr.response], options.fileValue.name, {
          type: options.fileValue.type,
        })
      }
      var reader = new FileReader()
      reader.onload = function (e) {
        options.callback('success', e.target.result)
      }
      reader.readAsDataURL(file)
    }
    xhr.send()
  })

  survey.onComplete.add(updateKyc)

  return <Survey model={survey} />
}
