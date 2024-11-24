import request from './router'

const Routes = {
  LOYALTY: '/loyalty-programs',
}

export async function CREATE_LOYALTY(token, values) {
  return await request(
    `${Routes.LOYALTY}`,
    { token, body: { ...values } },
    'POST'
  )
}

export async function GET_LOYALTY(token, loyal_code) {
  return await request(
    `${Routes.LOYALTY}?loyal_code=${loyal_code}`,
    { token },
    'GET'
  )
}

export async function GET_LOYALTY_CUSTOMERS(token, page = 1) {
  return await request(`${Routes.LOYALTY}/customers?${page}`, { token }, 'GET')
}
