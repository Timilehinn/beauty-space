import request from "./router";

const Routes = {
  USERS: '/users',
  SIGNUP: '/users',
  VERIFY_EMAIL: '/users/signup/verifyemail',
  SIGNIN: '/users/login',
  FETCH_DETAILS: '/users/retrieve-token',
  VERIFY_PASSWORD: '/users/signup/validatepassword',
  ACTIVATE_2FA: '/users',
  NOTIFICATIONS: '/notifications',
  SEND_RESET_LINK: '/users/forgot-password',
  READ_NOTIFICATIONS: '/notifications/multiple/mark-as-read',
  SETTINGS: '/settings',
  WEEKLY_REPORTS: '/reports/weekly-report',
  USER_OVERVIEW: '/user-dashboard',
  ACCOUNTS: '/accounts',
  BANKS: '/banks',
  CREATE_WITHDRAWAL: '/withdrawal/create',
  CREATE_PUSH_TOKEN: '/users/device-token/create',
  DELETE_PUSH_TOKEN: '/users/device-token/delete',
  WITHDRAWALS: '/withdrawal',
  UPDATE_PUSH_TOKEN: '/users/update',
}

export async function SIGNUP(payload) {
  const body = {
    ...payload
  };
  return await request(Routes.SIGNIN, { body }, 'POST');
}

export async function VERIFY_EMAIL(email) {
  const body = {
    email ,
  };
  return await request(Routes.VERIFY_EMAIL, { body }, 'POST');
}


export async function GET_USER_OVERVIEW(token){
  return await request(`${Routes.USER_OVERVIEW}`, { token }, 'GET');
}


export async function GET_WITHDRAWALS(token){
  return await request(Routes.WITHDRAWALS, { token }, 'GET');
}

export async function CREATE_WITHDRAWAL(token, amount, account_id){
  let body = {
    amount, account_id
  }
  return await request(Routes.CREATE_WITHDRAWAL, { token, body }, 'POST');
}

export async function VERIFY_2FA(token, secret, email){
  let body = { secret, email }
  return await request(`${Routes.ACTIVATE_2FA}/verify-secret`, { token, body }, 'POST');
}

export async function FETCH_DETAILS(token) {
  const body = { token }
  return await request(Routes.FETCH_DETAILS, { body }, 'POST');
}