import request from './router'

const Routes = {
  PEOPLE: '/people',
}

export async function GET_PEOPLE(token, page = 1) {
  return await request(`${Routes.PEOPLE}?page=${page}`, { token }, 'GET')
}

export async function GET_PEOPLE_DETAILS(token, id) {
  return await request(`${Routes.PEOPLE}/${id}`, { token }, 'GET')
}
