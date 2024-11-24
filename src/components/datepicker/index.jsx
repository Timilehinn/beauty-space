import React, { useState, useEffect } from 'react'

import { DatePicker, Space } from 'antd'
import {
  setDateFilterPicked,
  setDatePicked,
  setFilterViaCoordinates,
} from '../../redux/filterOptions'
import { useDispatch } from 'react-redux'

const CAMCDatePicker = ({
  fromFilter,
  placeholderText,
  fromHomepage,
  setIsComponentVisible,
}) => {
  const dispatch = useDispatch()
  const [selectedValue, setSelectedValue] = useState('')

  useEffect(() => {
    if (fromFilter && selectedValue) {
      dispatch(setDateFilterPicked(selectedValue))
      dispatch(setFilterViaCoordinates(true))
    }
  }, [selectedValue])

  const onChange = (date, dateString) => {
    if (fromHomepage) {
      datePickedChange()
      return
    }
    setSelectedValue(dateString)
    dispatchEvent(setDatePicked(date))
  }

  return (
    <Space
      direction='vertical'
      className='btn px-4 h-10 cursor-pointer bg-blue-600 text-black lg:ml-1'
    >
      <DatePicker
        onClick={() => setIsComponentVisible(true)}
        className='cursor-pointer'
        placeholder={placeholderText && placeholderText}
        onChange={onChange}
        bordered={false}
      />
    </Space>
  )
}

export default CAMCDatePicker
