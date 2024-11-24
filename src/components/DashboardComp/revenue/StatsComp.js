'use client'

import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { FaChartPie } from 'react-icons/fa'

import {
  GET_DISCOUNT_REPORTS,
  GET_MONTHLY_REPORT,
  GET_STAFF_REPORTS,
  GET_YEARLY_REPORT,
} from '../../../api/revenueRoutes'
import { handleResponse } from '../../../api/router'
import { GET_TEAMS } from '../../../api/teamRoutes'
import {
  getMonthlyReport,
  getYearlyReport,
  setMonthlyReport,
  setYearlyReport,
} from '../../../redux/insightSlice'

import { getCurrentBusiness } from '../../../redux/workspaceSlice'
import { getAppToken } from '../../../utils'

import Loader from '../../Loader/Loader'
import DiscountCharts from './discountchart'
import GenerateYears from './GenerateYears'
import MonthlyCharts from './MonthlyCharts'
import MonthlyDateRange from './MonthlyDateRange'
import StaffReportChart from './staffChart'
import YearOverYearChart from './YearOverYearChart'

// Format date function with an optional parameter to specify the format
export const formatDate = (date, format = 'short') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0') // Add leading zero if needed

  if (format === 'full') {
    const day = d.getDate().toString().padStart(2, '0') // Zero-padding for day
    return `${year}-${month}-${day}`
  }

  return `${year}-${month}`
}

// Function to get the date two months ago from today
export const getTwoMonthsAgoDate = () => {
  const date = new Date()
  date.setMonth(date.getMonth() - 2) // Correcting to two months ago
  return date
}

// Initialize the default years
const getDefaultYears = () => {
  const currentYear = new Date().getFullYear()
  return [currentYear - 1, currentYear]
}

const defaultYears = getDefaultYears()

const fullStartDate = formatDate(getTwoMonthsAgoDate(), 'full')
const fullEndDate = formatDate(new Date(), 'full')

export default function StatsComp() {
  const router = useRouter()
  const dispatch = useDispatch()
  const compareRef = useRef(null)
  const effectRan = useRef(false)
  const token = getAppToken()

  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [selectedYears, setSelectedYears] = useState(defaultYears)

  const [toggleCalendar, setToggleCalendar] = useState(false)
  const [toggleYears, setToggleYears] = useState(false)

  const [startDate, setStartDate] = useState(fullStartDate)
  const [endDate, setEndDate] = useState(fullEndDate)

  const [discountData, setDiscountData] = useState([])
  const [discountStartDate, setDiscountStartDate] = useState(fullStartDate)
  const [discountEndDate, setDiscountEndDate] = useState(fullEndDate)
  const [discountToggle, setDiscountToggle] = useState(false)
  const [withDiscounts, setWithDiscounts] = useState(null)

  const [modalToggle, setModalToggle] = useState(null)
  const [staffStartDate, setStaffStartDate] = useState(fullStartDate)
  const [staffEndDate, setStaffEndDate] = useState(fullEndDate)
  const [staffChartData, setStaffChartData] = useState([])
  const [staffId, setStaffId] = useState(null)
  const [teams, setTeams] = useState([])

  const monthlyData = useSelector(getMonthlyReport)
  const yearlyReportData = useSelector(getYearlyReport)

  const currentBusiness = useSelector(getCurrentBusiness)
  const business_id = currentBusiness ? currentBusiness.id : null

  /**
   * The function fetches a monthly report for a specific business and handles loading, success, and
   * error states accordingly.
   * @param businessId - The `businessId` parameter in the `fetchMonthlyReport` function is used to
   * identify the specific business for which the monthly report is being fetched. It is a unique
   * identifier assigned to each business in the system.
   * @param monthsYear - The `monthsYear` parameter in the `fetchMonthlyReport` function is likely a
   * string that represents the month and year for which the monthly report is being fetched. It could be
   * in a format like "MM-YYYY" or "Month Year". This parameter is used to specify the time period for
   */
  const fetchMonthlyReport = async (startMonth, endMonth) => {
    setLoading(true)
    const formattedStartDate = formatDate(startMonth, 'short') // Convert to short format for request
    const formattedEndDate = formatDate(endMonth, 'short') // Convert to short format for request

    try {
      const res = await GET_MONTHLY_REPORT(
        token,
        formattedStartDate,
        formattedEndDate,
        business_id
      )

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)
      if (status) {
        dispatch(setMonthlyReport(data))
        setFailure(false)
      } else {
        throw new Error(error)
      }
    } catch (error) {
      toast.error('Something went wrong, please try again')
      setFailure(true)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  const fetchYearlyReports = async (years) => {
    try {
      setLoading(true)
      const res = await GET_YEARLY_REPORT(token, years, business_id)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)
      if (status) {
        dispatch(setYearlyReport(data))
        setFailure(false)
      } else {
        throw new Error(error)
      }
    } catch (error) {
      toast.error('Something went wrong, please try again')
      setFailure(true)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  const fetchDiscountReport = async (startDate, endDate, withDiscount) => {
    setLoading(true)
    try {
      const res = await GET_DISCOUNT_REPORTS(
        token,
        startDate,
        endDate,
        withDiscount,
        business_id
      )

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)
      if (status) {
        setDiscountData(data)
        setFailure(false)
      } else {
        throw new Error(error)
      }
    } catch (error) {
      toast.error('Something went wrong, please try again')
      setFailure(true)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  const fetchStaffReport = async (startDate, endDate, staff_id) => {
    try {
      setLoading(true)
      const res = await GET_STAFF_REPORTS(
        token,
        startDate,
        endDate,
        staff_id,
        business_id
      )

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)
      if (status) {
        setStaffChartData(data)
        setFailure(false)
      } else {
        throw new Error(error)
      }
    } catch (error) {
      toast.error('Something went wrong, please try again')
      setFailure(true)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const res = await GET_TEAMS(token)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)
      if (status) {
        setTeams(data.data)
        setFailure(false)
      } else {
        throw new Error(error)
      }
    } catch (error) {
      toast.error('Something went wrong, please try again')
      setFailure(true)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value)
    setDiscountStartDate(e.target.value)
    setStaffStartDate(e.target.value)
  }

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value)
    setDiscountEndDate(e.target.value)
    setStaffEndDate(e.target.value)
  }

  useEffect(() => {
    fetchMonthlyReport(startDate, endDate, business_id)
    fetchYearlyReports(selectedYears, business_id)
    fetchDiscountReport(
      discountStartDate,
      discountEndDate,
      withDiscounts,
      business_id
    )
    fetchStaffReport(staffStartDate, staffEndDate, staffId, business_id)
    fetchTeams()
  }, [token, business_id])

  const handleApplyMonthly = () => {
    const formattedStartDate = startDate ? formatDate(startDate) : ''
    const formattedEndDate = endDate ? formatDate(endDate) : ''
    fetchMonthlyReport(formattedStartDate, formattedEndDate)
    setToggleCalendar(false)
  }

  const handleApplyYears = () => {
    fetchYearlyReports(selectedYears)
    setToggleYears(false)
  }

  const formatFullDate = (date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0') // Zero-padding for month
    const day = d.getDate().toString().padStart(2, '0') // Zero-padding for day
    return `${year}-${month}-${day}`
  }

  const handleDiscounts = () => {
    const formattedDiscountStartDate = formatFullDate(discountStartDate)
    const formattedDiscountEndDate = formatFullDate(discountEndDate)
    fetchDiscountReport(
      formattedDiscountStartDate,
      formattedDiscountEndDate,
      withDiscounts
    )
    setDiscountToggle(false)
  }

  const handleStaffReport = () => {
    const formattedStaffStartDate = formatFullDate(staffStartDate)
    const formattedStaffEndDate = formatFullDate(staffEndDate)
    fetchStaffReport(formattedStaffStartDate, formattedStaffEndDate, staffId)

    setModalToggle(false)
  }

  const handleClickOutside = (event) => {
    if (compareRef?.current && !compareRef?.current.contains(event.target)) {
      setToggleCalendar(false)
      setToggleYears(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <Loader
        isLoading={loading}
        failure={failure}
        redirectBack={'/dashboard/revenue'}
      />

      <main className='grid grid-cols-1 content-center place-items-center gap-5 w-full lg:grid-cols-2'>
        <div className='flex flex-col justify-center items-center w-full gap-5 bg-white rounded-md p-5 h-[50vh] '>
          <header className='flex justify-between items-start w-full relative'>
            <div className='flex flex-col justify-start items-start gap-1'>
              <span className=''>Monthly Sales</span>
              {/* <span className='text-sm'>Top 3 services</span> */}
            </div>

            <button
              type='button'
              onClick={() => setToggleCalendar(!toggleCalendar)}
              className='border border-gray rounded-md h-12 px-2 text-sm hover:border-primary'
            >
              Compare Sales
            </button>

            {toggleCalendar && (
              <div className='absolute top-[4rem] right-0 w-[250px] bg-white ring-1 ring-gray rounded-md p-3 flex flex-col justify-start items-start gap-5'>
                <MonthlyDateRange
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                  startDate={startDate}
                  endDate={endDate}
                />

                <div className='flex justify-end items-center gap-5 ml-auto'>
                  <button
                    type='button'
                    onClick={() => setToggleCalendar(false)}
                    className='text-lightgrey'
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    onClick={handleApplyMonthly}
                    className='text-primary'
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </header>

          <div className='w-full flex justify-center items-center m-auto lg:h-[80%] md:h-[80%] sm:h-[75%]'>
            {monthlyData?.length !== 0 ? (
              <MonthlyCharts />
            ) : (
              <div className='flex flex-col justify-center items-center gap-3 m-auto'>
                <FaChartPie className='text-[6rem] text-lightgrey' />
                <span className=' text-lightgrey'>No data available yet!</span>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col justify-center items-center w-full gap-5 bg-white rounded-md p-5 h-[50vh] '>
          <header className='flex justify-between items-start w-full relative'>
            <span className=''>Yearly Sales</span>

            <button
              type='button'
              onClick={() => setToggleYears(!toggleYears)}
              className='border border-gray rounded-md h-12 px-2 text-sm hover:border-primary'
            >
              Compare Sales
            </button>

            {toggleYears && (
              <div className='absolute top-[4rem] right-0 bg-white w-[250px] h-[200px] rounded-md ring-1 ring-gray p-4 flex flex-col justify-start items-start gap-3 '>
                <GenerateYears
                  isOpen={toggleYears}
                  onClose={() => setToggleYears(false)}
                  selectedYears={selectedYears}
                  setSelectedYears={setSelectedYears}
                  fetchYearlyReports={fetchYearlyReports}
                />

                <div className='flex justify-end items-center gap-5 ml-auto'>
                  <button
                    type='button'
                    onClick={() => setToggleYears(false)}
                    className='text-lightgrey'
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    onClick={handleApplyYears}
                    className='text-primary'
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </header>

          <div className='w-full flex justify-center items-center m-auto lg:h-[80%] md:h-[80%] sm:h-[75%]'>
            {yearlyReportData?.length !== 0 ? (
              <YearOverYearChart />
            ) : (
              <div className='flex flex-col justify-center items-center gap-3 m-auto'>
                <FaChartPie className='text-[6rem] text-lightgrey' />
                <span className=' text-lightgrey'>No data available yet!</span>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col justify-start items-center w-full gap-5 bg-white rounded-md p-5 h-[50vh] '>
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
                  startDate={discountStartDate}
                  endDate={discountEndDate}
                />

                <select
                  name='staff_id'
                  id='staff_id'
                  className='border border-lightgrey h-12 rounded-md p-1 outline-none w-full'
                  onChange={(e) => setStaffId(e.target.value)}
                >
                  <option value='select a staff'>Select a staff</option>
                  {teams.map((item) => {
                    return (
                      <option value={item.user_id} key={item.id}>
                        {item?.user?.first_name} {item?.user?.last_name}
                      </option>
                    )
                  })}
                </select>

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

        <div className='flex flex-col justify-center items-center w-full gap-5 bg-white rounded-md p-5 h-[50vh] '>
          <header className='flex justify-between items-start w-full relative'>
            <span className=''>Transactions Report</span>

            <button
              type='button'
              onClick={() => setDiscountToggle(!discountToggle)}
              className='border border-gray rounded-md h-12 px-2 text-sm hover:border-primary'
            >
              Compare Sales
            </button>

            {discountToggle && (
              <div className='absolute top-[4rem] right-0 bg-white w-[250px] rounded-md ring-1 ring-gray p-4 flex flex-col justify-start items-start gap-5 '>
                <MonthlyDateRange
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                  startDate={discountStartDate}
                  endDate={discountEndDate}
                />

                <div className='grid grid-cols-2 gap-2 w-full'>
                  <button
                    type='button'
                    onClick={() => setWithDiscounts(true)}
                    className={clsx(
                      `text-xs border border-gray h-12 rounded-md`,
                      withDiscounts ? 'border-primary' : 'border-gray'
                    )}
                  >
                    With Discount
                  </button>
                  <button
                    type='button'
                    onClick={() => setWithDiscounts(false)}
                    className={clsx(
                      `text-xs border border-gray h-12 rounded-md`,
                      !withDiscounts ? 'border-primary' : 'border-gray'
                    )}
                  >
                    Without Discount
                  </button>
                </div>

                <div className='flex justify-end items-center gap-5 ml-auto'>
                  <button
                    type='button'
                    onClick={() => setDiscountToggle(false)}
                    className='text-lightgrey'
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    onClick={handleDiscounts}
                    className='text-primary'
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </header>

          <div className='w-full flex justify-center items-center m-auto lg:h-[80%] md:h-[80%] sm:h-[75%]'>
            {discountData?.length !== 0 ? (
              <DiscountCharts chartDetails={discountData} />
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
