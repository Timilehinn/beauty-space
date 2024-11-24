import request from './router'

const Routes = {
  TEAM: '/teams',
}

/**
 *
 * @param {*} token string
 * @param {*} data { firstName : string, lastName : string, email: string, role : string, permissions : string[] }
 */
export async function CREATE_TEAM_MEMBER(token, data) {
  let body = data
  return await request(`${Routes.TEAM}`, { token, body }, 'POST')
}

/**
 *
 * @param {*} token string
 */
export async function GET_TEAMS(token) {
  return await request(`${Routes.TEAM}`, { token }, 'GET')
}

/**
 *
 * @param {*} token string
 * @param {*} id string (team member id)
 */
export async function DELETE_MEMBER(token, id) {
  return await request(`${Routes.TEAM}/${id}/delete`, { token }, 'DELETE')
}

export async function UPDATE_TEAM_MEMBER(token, id, formData) {
  let body = formData
  return await request(`${Routes.TEAM}/${id}/update`, { token, body }, 'PUT')
}
