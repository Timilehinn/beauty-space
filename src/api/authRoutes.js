import request from './router'

const Routes = {
  FORGETPASSWORD: '/subscriptions',
}

export async function FORGET_PASSWORD(token, email) {
  return await request(
    `${Routes.FORGETPASSWORD}`,
    { token, body: { email } },
    'POST'
  )
}
