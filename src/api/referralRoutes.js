import request from './router'

const Routes = {
  REFERRALS: '/referrals',
}

export async function GET_REFERRALS(token, page = 1) {
  return await request(`${Routes.REFERRALS}?page=${page}`, { token }, 'GET')
}

export async function GET_REFERRALS_REWARDS(token, page = 1) {
  return await request(
    `${Routes.REFERRALS}/rewards?page=${page}`,
    { token },
    'GET'
  )
}
