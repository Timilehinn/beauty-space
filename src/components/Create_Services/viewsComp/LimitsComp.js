import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'

import {
  getServiceData,
  setServiceData,
} from '../../../redux/createWorkspaceSlice'

export default function LimitsComp({ prev, next, action }) {
  const dispatch = useDispatch()
  const serviceData = useSelector(getServiceData)

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('limits'))

    if (savedData && action !== 'edit') {
      dispatch(setServiceData(savedData))
    }
  }, [])

  const options = Array.from({ length: 100 }, (_, index) => index + 1)

  const validationSchema = Yup.object().shape({
    available_space: Yup.number()
      .required('Number of users is required')
      .min(1, 'Select at least 1 user'),
  })

  return (
    <main className='flex flex-col justify-start items-start gap-10 w-full border border-gray rounded-md p-5'>
      <div className='flex flex-col gap-3 w-full'>
        <h3 className=''>Limits</h3>
        <hr className='w-full border-gray' />
      </div>

      <Formik
        initialValues={{
          available_space: serviceData.available_space || '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          if (action !== 'edit') {
            localStorage.setItem('limits', JSON.stringify(values))
          }

          next(values)
        }}
      >
        {({ errors, touched }) => (
          <Form className='w-full flex flex-col justify-start items-start gap-5'>
            <div className='flex flex-col justify-start items-start gap-3 w-full'>
              <label htmlFor='users'>Available space</label>
              <Field
                as='select'
                id='available_space'
                name='available_space'
                value={serviceData.available_space}
                onChange={(e) => {
                  const newData = {
                    ...serviceData,
                    available_space: e.target.value,
                  }
                  dispatch(setServiceData(newData))
                }}
                className='border border-lightgrey h-12 rounded-md outline-none w-full'
              >
                <option value=''>Select number of users</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Field>
              {errors.available_space && touched.available_space ? (
                <span className='text-danger'>{errors.users}</span>
              ) : null}
            </div>

            <div className='flex items-center gap-5 ml-auto'>
              <button
                onClick={() => prev(serviceData)}
                className='rounded-full h-12 w-[150px] text-black border border-lightgrey '
              >
                Prev
              </button>

              <button
                type='submit'
                className='rounded-full h-12 w-[150px] text-white bg-primary ring-2 ring-gray'
              >
                Next
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  )
}
