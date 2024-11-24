import request from './router'

const Routes = {
  BUSINESS: '/workspaces',
}

export async function GET_BUSINESS(token, page = 1) {
  return await request(`${Routes.BUSINESS}?page=${page}`, { token }, 'GET')
}

export async function GET_BUSINESSES(token, page = 1) {
  return await request(`/businesses?page=${page}`, { token }, 'GET')
}

export async function DELETE_BUSINESS(token, id) {
  return await request(`${Routes.BUSINESS}/${id}/delete`, { token }, 'POST')
}

export async function GET_MOST_VISITED_BUSINESSES(token, page = 1) {
  return await request(
    `${Routes.BUSINESS}/most-visited?page=${page}`,
    { token },
    'GET'
  )
}

export async function GET_WORKSPACE(token, space_id) {
  return await request(`${Routes.BUSINESS}/${space_id}`, { token }, 'GET')
}

export async function GET_WORKSPACE_WITH_SLUG(slug, token) {
  return await request(`/workspaces/${slug}`, { token }, 'GET')
}
