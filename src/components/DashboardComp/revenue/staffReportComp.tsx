'use client'

import router from 'next/router'
import { SetStateAction, useEffect, useState } from 'react'
import { FaChartPie } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { GET_STAFF_REPORTS } from '../../../api/revenueRoutes'
import { handleResponse } from '../../../api/router'
import { getUserInfo } from '../../../redux/admin_user'
import { getAppToken } from '../../../utils'
import Loader from '../../Loader/Loader'
import { StaffReport } from '../../../global/types'
import MonthlyDateRange from '../revenue/MonthlyDateRange'
import StaffReportChart from '../revenue/staffChart'
import { formatDate, getTwoMonthsAgoDate } from '../revenue/StatsComp'

/* The code snippet `const fullStartDate = formatDate(getTwoMonthsAgoDate(), 'full')` and `const
fullEndDate = formatDate(new Date(), 'full')` is initializing two variables `fullStartDate` and
`fullEndDate` with formatted date values. */
const fullStartDate = formatDate(getTwoMonthsAgoDate(), 'full')
const fullEndDate = formatDate(new Date(), 'full')

export default function StaffReports() {
  const [modalToggle, setModalToggle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [staffChartData, setStaffChartData] = useState<Array<StaffReport>>([])

  const [staffStartDate, setStaffStartDate] = useState(fullStartDate)
  const [staffEndDate, setStaffEndDate] = useState(fullEndDate)

  const token = getAppToken()

  const userInfo = useSelector(getUserInfo)

  /**
   * The function `fetchStaffReport` is an asynchronous function that fetches staff reports based on
   * specified parameters and handles the response accordingly.
   * @param {string} startDate - The `startDate` parameter in the `fetchStaffReport` function is a string
   * representing the start date for which you want to fetch the staff report data. It is used to specify
   * the beginning date range for the report data retrieval.
   * @param {string} endDate - The `endDate` parameter in the `fetchStaffReport` function is a string
   * that represents the end date for the staff report data that will be fetched. It is used to specify
   * the end date range for the report data retrieval.
   * @param {any} staff_id - The `staff_id` parameter in the `fetchStaffReport` function is used to
   * specify the ID of the staff member for whom you want to fetch the report. This ID is typically used
   * to identify the specific staff member within the system or database and retrieve relevant
   * information or data related to that staff member
   * @returns The `fetchStaffReport` function is returning a Promise.
   */
  const fetchStaffReport = async (
    startDate: string,
    endDate: string,
    staff_id: any
  ) => {
    try {
      setLoading(true)
      const res = await GET_STAFF_REPORTS(
        token,
        startDate,
        endDate,
        staff_id,
        userInfo.business.id
      )

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse<Array<StaffReport>>(res)

      if (status) {
        setStaffChartData(data)
        setFailure(false)
      } else {
        toast.error(error)
      }
    } catch (error) {
      throw new Error('Something went wrong, please try again')
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  const handleStartDateChange = (e: {
    target: { value: SetStateAction<string> }
  }) => {
    setStaffStartDate(e.target.value)
  }

  const handleEndDateChange = (e: {
    target: { value: SetStateAction<string> }
  }) => {
    setStaffEndDate(e.target.value)
  }

  /**
   * The `formatFullDate` function takes a date input and returns it in the format "YYYY-MM-DD".
   * @param {string | number | Date} date - The `date` parameter in the `formatFullDate` function can be
   * a string, a number, or a Date object.
   * @returns The `formatFullDate` function returns a formatted date string in the format "YYYY-MM-DD".
   */
  const formatFullDate = (date: string | number | Date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0') // Zero-padding for month
    const day = d.getDate().toString().padStart(2, '0') // Zero-padding for day
    return `${year}-${month}-${day}`
  }

  const handleStaffReport = () => {
    const formattedStaffStartDate = formatFullDate(staffStartDate)
    const formattedStaffEndDate = formatFullDate(staffEndDate)
    fetchStaffReport(
      formattedStaffStartDate,
      formattedStaffEndDate,
      userInfo.id
    )

    setModalToggle(false)
  }

  useEffect(() => {
    fetchStaffReport(staffStartDate, staffEndDate, userInfo.id)
  }, [token, userInfo.id])

  return (
    <>
      <Loader
        isLoading={loading}
        failure={failure}
        redirectBack={'/dashboard/revenue'}
      />

      <main className='w-full h-screen flex flex-col justify-start items-start gap-8 3xl:p-10 xl:p-10 md:p-10 sm:p-5'>
        <div className='flex flex-col justify-start items-center w-full gap-5 bg-white rounded-md p-5 h-full '>
          <header className='flex justify-between items-start w-full relative'>
            <span className=''>Staff Reports</span>

            <button
              type='button'
              onClick={() => setModalToggle('staff_report')}
              className='border border-gray rounded-md h-12 px-2 text-sm hover:border-primary'
            >
              Compare Sales
            </button>

            {modalToggle === 'staff_report' && (
              <div className='absolute top-[4rem] right-0 bg-white w-[250px] rounded-md ring-1 ring-gray p-4 flex flex-col justify-start items-start gap-5 '>
                <MonthlyDateRange
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                  startDate={staffStartDate}
                  endDate={staffEndDate}
                />

                <div className='flex justify-end items-center gap-5 ml-auto'>
                  <button
                    type='button'
                    onClick={() => setModalToggle(false)}
                    className='text-lightgrey'
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    onClick={handleStaffReport}
                    className='text-primary'
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </header>

          <div className='w-full flex justify-center items-center m-auto lg:h-[80%] md:h-[80%] sm:h-[75%]'>
            {staffChartData?.length !== 0 ? (
              <StaffReportChart chartDetails={staffChartData} />
            ) : (
              <div className='flex flex-col justify-center items-center gap-3 m-auto'>
                <FaChartPie className='text-[6rem] text-lightgrey' />
                <span className=' text-lightgrey'>No data available yet!</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
