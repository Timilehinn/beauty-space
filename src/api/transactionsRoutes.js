import request from './router'

const Routes = {
  TRANSACTIONS: '/transactions',
}

export async function TRANSACTIONS_PDF_DOWNLOAD(token) {
  return await request(`${Routes.TRANSACTIONS}/pdf-download`, { token }, 'POST')
}

export async function TRANSACTIONS_EXCEL_DOWNLOAD(token) {
  return await request(
    `${Routes.TRANSACTIONS}/excel-download`,
    { token },
    'POST'
  )
}

export async function CREATE_TRANSACTION(token, data) {
  let body = data
  return await request(`${Routes.TRANSACTIONS}`, { token, body }, 'POST');
}