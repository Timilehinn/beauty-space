import request from './router'

const Routes = {
  BOOK_SPACE: '/bookings',
}

export async function BOOK_SPACE(token, data) {
  let body = data
  return await request(`${Routes.BOOK_SPACE}`, { token, body }, 'POST')
}

export async function GET_BOOKINGS(token, page = 1) {
  return await request(`${Routes.BOOK_SPACE}?page=${page}`, { token }, 'GET')
}

export async function GET_BOOKINGS_BY_DATE(token, from, to, page = 1) {
  return await request(
    `${Routes.BOOK_SPACE}?date_from=${from}&date_to=${to}&page=${page}`,
    { token },
    'GET'
  )
}

export async function REJECT_BOOKING(token, id) {
  return await request(`${Routes.BOOK_SPACE}/${id}/reject`, { token }, 'POST')
}

export async function GET_SERVEY_DETAILS(transactionId) {
  return await request(
    `${Routes.BOOK_SPACE}/review/${transactionId}`,
    {},
    'GET'
  )
}

export async function FIND_BOOKING(token, code) {
  return await request(`${Routes.BOOK_SPACE}/search/${code}`, { token }, 'GET')
}

export async function COMPLETE_REVIEW(transactionId, data) {
  let body = data
  return await request(
    `${Routes.BOOK_SPACE}/review/${transactionId}`,
    { token: '', body },
    'POST'
  )
}

export async function GET_BOOKING_BY_ID(token, id) {
  return await request(`${Routes.BOOK_SPACE}/${id}`, { token }, 'GET')
}

export async function ASSIGN_STAFF(token, bookingId, workspaceId, staffId) {
  let body = {
    workspaces_id: workspaceId,
    staff_id: staffId,
  }
  return await request(
    `${Routes.BOOK_SPACE}/${bookingId}/assign-staff`,
    { token, body },
    'PUT'
  )
}

export async function UNASSIGN_STAFF(token, bookingId, workspaceId, staffId) {
  let body = {
    workspaces_id: workspaceId,
    staff_id: staffId,
  }
  return await request(
    `${Routes.BOOK_SPACE}/${bookingId}/unassign-staff`,
    { token, body },
    'PUT'
  )
}
