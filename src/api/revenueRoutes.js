import generateMonthsArray from '../components/DashboardComp/revenue/generateMonthsArray'
import request from './router'

const Routes = {
  REPORT: '/reports',
}

/**
 * The GET_MONTHLY_REPORT function sends a GET request to retrieve a monthly report based on specified
 * months and business ID.
 * @param token - A token is a piece of data that is used to access secure resources or services. It
 * acts as a credential to authenticate the identity of the user or application making the request. In
 * this context, the `token` parameter is likely a token that grants access to the API for retrieving
 * monthly reports. It
 * @param businessId - The `businessId` parameter is the identifier for the specific business for which
 * you want to retrieve the monthly report. It is used to specify the business entity for which the
 * report is being generated.
 * @param startMonth - The `startMonth` parameter represents the starting month for which you want to
 * generate the monthly report. It is used in the `GET_MONTHLY_REPORT` function to specify the
 * beginning month for the report data.
 * @param endMonth - The `endMonth` parameter in the `GET_MONTHLY_REPORT` function represents the end
 * month for which you want to generate the monthly report. It is used to specify the range of months
 * for which the report will be generated.
 * @returns The `GET_MONTHLY_REPORT` function is returning the result of the `request` function, which
 * is making a GET request to the specified API endpoint with the provided parameters such as `months`,
 * `business_id`, and `token`. The function is fetching a monthly report for a specific business within
 * the specified range of months.
 */
export async function GET_MONTHLY_REPORT(
  token,
  startMonth,
  endMonth,
  businessId
) {
  const months = generateMonthsArray(startMonth, endMonth, 'short')
  return await request(
    `${Routes.REPORT}/month-over-month?months=${months}&business_id=${businessId}`,
    { token },
    'GET'
  )
}

/**
 * The function GET_YEARLY_REPORT retrieves a yearly report using a provided token and specified years.
 * @param token - A token is a piece of data that is used to authenticate and authorize a user. In this
 * context, the token is likely used for authentication purposes when making a request to the server.
 * It could be a JWT token, an API key, or some other form of authentication token.
 * @param years - The `years` parameter in the `GET_YEARLY_REPORT` function is used to specify the
 * years for which you want to generate the yearly report. It is passed as a query parameter in the API
 * request to fetch the year-over-year report data.
 * @returns The GET_YEARLY_REPORT function is returning the result of the request made to the specified
 * endpoint `${Routes.REPORT}/year-over-year?years=` with the provided token using the 'GET'
 * method.
 */
export async function GET_YEARLY_REPORT(token, years, businessId) {
  return await request(
    `${Routes.REPORT}/year-over-year?years=${years}&business_id=${businessId}`,
    { token },
    'GET'
  )
}

/**
 * The function SWITCH_BUSINESS switches the user's active business using the provided token and
 * business ID.
 * @param token - A token is a piece of data that is used to access secure resources or services. It is
 * typically a unique string that identifies a user or a session and is used for authentication and
 * authorization purposes. In the context of the `SWITCH_BUSINESS` function, the token parameter is
 * likely a token that
 * @param business_id - The `business_id` parameter is the unique identifier of the business that the
 * user wants to switch to.
 * @returns The `SWITCH_BUSINESS` function is returning the result of the `request` function, which is
 * a promise.
 */
export async function SWITCH_BUSINESS(token, business_id) {
  let body = {
    business_id,
  }
  return await request(`/users/switch-business`, { token, body }, 'POST')
}

export async function GET_STAFF_REPORTS(
  token,
  start_date,
  end_date,
  staff_id,
  businessId
) {
  return await request(
    `${
      Routes.REPORT
    }/staff-reports?start_date=${start_date}&end_date=${end_date}${
      staff_id !== null ? `&staff_id=${staff_id}` : ''
    }&business_id=${businessId}`,
    { token },
    'GET'
  )
}

export async function GET_DISCOUNT_REPORTS(
  token,
  start_date,
  end_date,
  withDiscount, // this has to be a boolean
  businessId
) {
  const discountType = withDiscount ? 'with_discount' : 'without_discount'
  const url = `${
    Routes.REPORT
  }/sales-reports?start_date=${start_date}&end_date=${end_date}${
    withDiscount !== null ? `&discount_or_not=${discountType}` : ''
  }&business_id=${businessId}`

  return await request(url, { token }, 'GET')
}
