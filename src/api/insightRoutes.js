import request from './router'

const Routes = {
  INSIGHTS: '/insights',
}

export async function INSIGHTS(token) {
  return await request(`${Routes.INSIGHTS}`, { token }, 'GET')
}
