'use client'

import clsx from 'clsx'
import { saveAs } from 'file-saver'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { BiCheck, BiDownload } from 'react-icons/bi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { CiMoneyBill } from 'react-icons/ci'
import { IoPieChartSharp } from 'react-icons/io5'
import { PiArrowLineUpRightLight, PiArrowUpThin } from 'react-icons/pi'

import Chart from '../../ChartsLine/Chart'
import Loader from '../../Loader/Loader'

import useCookieHandler from '../../../hooks/useCookieHandler'
import useLimitedRoute from '../../../hooks/useLimitedRoute'

import { getAccountType, getUserInfo } from '../../../redux/admin_user'
import {
  getChartData,
  getTotalAmount,
  getTotalTransactions,
  getTransactions,
  setChartData,
  setTotalAmount,
  setTotalTransactions,
  setTransactionDetails,
} from '../../../redux/insightSlice'

import xlsx from 'json-as-xlsx'
import { GET_BOOKINGS_BY_DATE } from '../../../api/bookingRoutes'
import { INSIGHTS } from '../../../api/insightRoutes'
import { handleResponse } from '../../../api/router'
import {
  TRANSACTIONS_EXCEL_DOWNLOAD,
  TRANSACTIONS_PDF_DOWNLOAD,
} from '../../../api/transactionsRoutes'
import ServicesPaginationComp from '../Businesses/ServicesPaginationComp'

export default function RevenueComp() {
  const router = useRouter()
  const dispatch = useDispatch()

  const { token } = useCookieHandler('user_token')
  const { success, errorAuth, loadingfinished } = useLimitedRoute('Owner')

  const [loading, setLoading] = useState(false)
  const [failure, setFailure] = useState(false)
  const [lastPage, setLastPage] = useState(null)
  const [chosenData, setChosenData] = useState([])
  const [blockStateChange, setBlockStateChange] = useState(false)
  const [currentPagination, setCurrentPagination] = useState(0)

  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [downloadModal, setDownloadModal] = useState(false)
  const [transactionModal, setTransactionModal] = useState(false)
  const [TranxFilterModal, setTranxFilterModal] = useState(false)
  const [activeTranx, setActiveTranx] = useState('14 days')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const chartHistory = useSelector(getChartData)
  const totalAmount = useSelector(getTotalAmount)
  const accountType = useSelector(getAccountType)

  const user = useSelector(getUserInfo)
  const transactions = useSelector(getTransactions)
  const totalTransactions = useSelector(getTotalTransactions)

  const handle14DaysClick = () => {
    setStartDate(moment().subtract(14, 'days').format('YYYY-MM-DD'))
    setEndDate(moment().format('YYYY-MM-DD'))
    setActiveTranx('14 days')
  }

  const handle30DaysClick = () => {
    setStartDate(moment().subtract(30, 'days').format('YYYY-MM-DD'))
    setEndDate(moment().format('YYYY-MM-DD'))
    setActiveTranx('30 days')
  }

  useEffect(() => {
    const currentDate = moment().format('YYYY-MM-DD')
    const last14Days = moment().subtract(14, 'days').format('YYYY-MM-DD')
    setStartDate(last14Days)
    setEndDate(currentDate)
  }, [user])

  const getUserTransactions = async (page = 1) => {
    if (!token) return
    setLoading(true)
    try {
      const res = await GET_BOOKINGS_BY_DATE(token, startDate, endDate, page)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)

      if (status) {
        dispatch(setTransactionDetails(data?.data))
        dispatch(setTotalTransactions(data?.total))
        setLastPage(data?.last_page)

        setLoading(false)
        setFailure(false)
      } else {
        throw new Error(error)
      }
    } catch (err) {
      setLoading(false)
      setFailure(true)
    } finally {
      setLoading(false)
      setFailure(false)
    }
  }

  const getUserInsight = async () => {
    if (!token) return
    try {
      const res = await INSIGHTS(token)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)

      if (status) {
        dispatch(setChartData(data))
      } else {
        throw new Error(error)
      }
    } catch (err) {}
  }

  useEffect(() => {
    if (!token && accountType === 'Admin') return
    getUserTransactions(currentPagination)
  }, [dispatch, currentPagination, startDate, endDate])

  useEffect(() => {
    if (!token) return
    getUserInsight()
  }, [token, dispatch])

  const handlePageChange = ({ selected: selectedPage }) => {
    setCurrentPagination(selectedPage + 1)
    setLoading(true)
    getUserTransactions(selectedPage + 1)
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false)
        setFailure(true)
      })
  }

  const base64RepairSystem = (str) => {
    str = str.replaceAll('\r', '')
    str = str.replaceAll('\n', '')
    return `data:application/pdf;base64,${str}`
  }

  const getTransactionsPdf = async () => {
    if (!token) return
    setLoadingPdf(true)

    try {
      const res = await TRANSACTIONS_PDF_DOWNLOAD(token)

      if (res.status === 401) {
        router.push('/')
        return
      }

      const { error, data, status } = handleResponse(res)

      if (status) {
        let content = data?.content
        setLoadingPdf(false)
        const repairedReceipt = base64RepairSystem(content) // coming back to remove the await after testing
        saveAs(repairedReceipt, `transactions.pdf`)
      } else {
        throw new Error(error)
      }
    } catch (error) {
      setLoadingPdf(false)
    } finally {
      setLoadingPdf(false)
    }
  }

  const getExcelTransaction = async () => {
    setLoadingExcel(true)
    try {
      const res = await TRANSACTIONS_EXCEL_DOWNLOAD(token)

      const { error, data, status } = handleResponse(res)

      if (status) {
        let settings = {
          fileName: data?.sheet,
          extraLength: 3,
          writeMode: 'writeFile',
          writeOptions: {},
        }
        setLoadingExcel(false)
        xlsx([data], settings)
      } else {
        throw new Error(error)
      }
    } catch (error) {
      setLoadingExcel(false)
    }
  }

  /* The code snippet `let date = new Date()
const currentYear = moment(date).format('YYYY')
const currentMonth = moment(date).format('MMM')` is retrieving the current date and then formatting
it to extract the current year and month using the `moment` library. */
  let date = new Date()
  const currentYear = moment(date).format('YYYY')
  const currentMonth = moment(date).format('MMM')

  if (!blockStateChange && chartHistory?.length > 0) {
    setChosenData(chartHistory?.filter((h) => h.year === Number(currentYear)))
    setBlockStateChange(true)
  }

  // get the current year
  const currentYearly = new Date().getFullYear()

  // filter the chart data by current year
  const currentYearData = chartHistory?.filter((d) => d.year === currentYearly)

  // map over the filtered data to extract the amount for each month
  const amounts = currentYearData[0]?.data?.map((d) => parseFloat(d.amount))

  // sum up the amounts for all the months to get the total amount paid for the current year
  const totalAmountPaid = amounts?.reduce((acc, val) => acc + val, 0)

  // set the total amount paid for the current year
  dispatch(setTotalAmount(totalAmountPaid))

  if (loading) return null

  return (
    <>
      <Loader
        failure={failure} //if your api or state fails and page should not show
        isLoading={loading} // if your api or state is still fetching
      />

      <section className='flex flex-col justify-start items-start gap-5 w-full h-full'>
        <header className='grid grid-cols-1 lg:grid-cols-2 gap-5 w-full'>
          <div className='bg-white shadow-2fl rounded-md p-5 flex flex-col justify-start items-start gap-8 w-full'>
            <div className='flex justify-between items-center w-full'>
              <div className='text-base flex items-center gap-2'>
                <CiMoneyBill className='text-2xl' />
                <p className=''> Total Revenue</p>
              </div>
            </div>

            <h1 className='text-2xl lg:text-5xl'>
              &#8358; {totalAmountPaid?.toLocaleString('en-US')}
            </h1>

            <div className='flex justify-start items-center gap-3'>
              <PiArrowUpThin className='text-green' />{' '}
              <span className='text-green'>0%</span>{' '}
              <span className='text-lightgrey text-sm'>vs last 7 days</span>
            </div>
          </div>

          <div className='bg-white shadow-2fl rounded-md p-5 flex flex-col justify-start items-start gap-8 w-full'>
            <div className='flex justify-between items-center w-full relative'>
              <div className='text-base flex items-center gap-2'>
                <PiArrowLineUpRightLight className='text-2xl' />
                <p className=''> Total Transactions</p>
              </div>

              <button
                onClick={() => setTranxFilterModal(!TranxFilterModal)}
                className='text-xl'
              >
                <BsThreeDotsVertical />
              </button>

              {TranxFilterModal && (
                <div className='bg-white p-2 rounded-md shadow-2fl w-[200px] flex flex-col justify-center items-center gap-2 absolute top-5 right-5'>
                  <button
                    onClick={handle14DaysClick}
                    className={clsx(
                      'hover:bg-gray text-left text-base w-full rounded-md px-4 h-9 flex justify-between items-center',
                      activeTranx === '14 days' ? 'bg-gray' : 'bg-transparent'
                    )}
                  >
                    <span className=''>14-days highlights</span>
                    {activeTranx === '14 days' && <BiCheck />}
                  </button>
                  <button
                    onClick={handle30DaysClick}
                    className={clsx(
                      'hover:bg-gray text-left text-base w-full rounded-md px-4 h-9 flex justify-between items-center',
                      activeTranx === '30 days' ? 'bg-gray' : 'bg-transparent'
                    )}
                  >
                    <span className=''>30-days highlights</span>
                    {activeTranx === '30 days' && <BiCheck />}
                  </button>
                </div>
              )}
            </div>

            <h1 className='text-2xl lg:text-5xl'>{totalTransactions}</h1>

            <div className='flex justify-start items-center gap-3'>
              <PiArrowUpThin className='text-green' />{' '}
              <span className='text-green'>5%</span>{' '}
              <span className='text-lightgrey text-sm'>vs last 7 days</span>
            </div>
          </div>
        </header>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 w-full h-full'>
          <div className='bg-white p-5 flex flex-col justify-start items-start gap-3 w-full rounded-md shadow-2fl h-full '>
            <h1 className='text-base'>Analytics</h1>

            {chosenData?.length > 0 ? (
              <Chart
                chosenData={chosenData}
                setChosenData={setChosenData}
                currentMonth={currentMonth}
                chartHistory={chartHistory}
              />
            ) : (
              <div className='flex flex-col justify-center items-center gap-2 m-auto xl:h-[300px] xxl:h-[350px] lg:h-[250px] md:h-[250px] sm:h-[250px] '>
                <IoPieChartSharp className='text-8xl text-lightgrey' />
                <span className='text-lightgrey'>No data available yet</span>
              </div>
            )}
          </div>

          <div className='bg-white p-5 flex flex-col justify-between items-start gap-3 w-full rounded-md shadow-2fl overflow-auto scrollbar-hide h-full '>
            <div className='flex flex-col gap-3 w-full'>
              <div className='flex justify-between items-center w-full'>
                <h1 className='text-base'>Transactions</h1>
                <div className='flex items-center gap-3 relative'>
                  <button
                    onClick={() => setDownloadModal(!downloadModal)}
                    className='flex justify-center items-center gap-2 border border-gray rounded-md px-3 h-9'
                  >
                    <BiDownload />
                    Download
                  </button>

                  {downloadModal && (
                    <div className='bg-white p-2 rounded-md shadow-2fl w-[150px] flex flex-col justify-center items-center gap-2 absolute top-10 -left-5'>
                      <button
                        type='button'
                        onClick={() => getTransactionsPdf()}
                        className='hover:bg-gray text-left text-base w-full rounded-md px-4 h-9'
                      >
                        {!loadingPdf ? 'PDF' : 'Downloading...'}
                      </button>
                      <button
                        type='button'
                        onClick={() => getExcelTransaction()}
                        className='hover:bg-gray text-left text-base w-full rounded-md px-4 h-9'
                      >
                        {!loadingExcel ? 'Excel' : 'Downloading...'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {totalTransactions >= 1 ? (
                <div className='flex flex-col justify-start items-start gap-3 w-full overflow-auto scrollbar-hide'>
                  <div className='w-full xxl:w-full xl:w-full md:w-full sm:min-w-[650px]'>
                    <div className='flex justify-between items-center gap-5 w-full border-b border-gray px-5'>
                      <span className='p-2 font-semibold w-[10rem]'>Date</span>
                      <span className='p-2 font-semibold w-[10rem]'>
                        Services
                      </span>
                      <span className='p-2 font-semibold w-[5rem]'>Price</span>
                      <span className='p-2 font-semibold w-[10rem]'>
                        Status
                      </span>
                    </div>

                    <div className='w-full'>
                      {transactions?.map((item) => (
                        <div
                          key={item?.id}
                          className='border-b border-gray last:border-b-0 flex justify-between items-center gap-5 w-auto px-5'
                        >
                          <p className='p-2 w-[10rem]'>
                            {moment
                              .utc(item?.bookings[0]?.start_date)
                              .format('LLL')}
                          </p>
                          <div className='flex flex-col justify-start items-start gap-1 p-2 w-[10rem]'>
                            <p className=''>
                              {
                                item?.bookings[0]?.user_space_services[0]
                                  ?.space_service?.name
                              }
                            </p>
                            <span className='text-primary'>
                              {item?.bookings[0]?.workspace?.name}
                            </span>
                          </div>
                          <p className='p-2 w-[5rem]'>{item?.amount_paid}</p>
                          <p
                            className={`p-2 w-[10rem] rounded-lg text-center ${
                              item?.payment_status === 'success'
                                ? 'bg-[#f2fcf8] text-[#517143] ring-1 ring-[#517143]'
                                : item?.payment_status === 'pending'
                                ? 'bg-[#fff5e0] text-[#a57020] ring-1 ring-[#a57020]'
                                : 'bg-[#fce8e8] text-[#bb1a1b] ring-1 ring-[#bb1a1b]'
                            }`}
                          >
                            {item?.payment_status}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='flex flex-col justify-center items-center gap-2 m-auto xl:h-[300px] xxl:h-[350px] lg:h-[250px] md:h-[250px] sm:h-[250px] '>
                  <IoPieChartSharp className='text-8xl text-lightgrey' />
                  <span className='text-lightgrey'>No data available yet</span>
                </div>
              )}
            </div>

            {totalTransactions > 20 && (
              <ServicesPaginationComp
                pageCount={lastPage}
                handlePageClick={handlePageChange}
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
