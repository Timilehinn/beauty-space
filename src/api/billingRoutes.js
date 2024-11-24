import request from './router'

const Routes = {
  SUBSCRIPTION: '/subscriptions',
}

/**
 *
 * @param {*} token
 * @param {*} id
 * @param {*} plan "Starter"|"Business"|"Starter Yearly"|"Business Yearly"|string
 * @param {*} amount_paid
 * @param {*} payment_status
 * @param {*} transaction_id
 * @returns
 */
export async function UPGRADE_SUBSCRIPTION(
  token,
  id,
  plan,
  amount_paid,
  payment_status,
  transaction_id
) {
  let body = {
    plan,
    amount_paid,
    payment_status,
    transaction_id,
  }
  return await request(
    `${Routes.SUBSCRIPTION}/${id}/upgrade`,
    { token, body },
    'POST'
  )
}

export async function DOWNGRADE_SUBSCRIPTION(token, currentPlanId, plan, accountId) {
  return await request(`${Routes.SUBSCRIPTION}/${currentPlanId}/downgrade`, { token, body: { plan, account_id: accountId } }, 'POST');
}

export async function CANCEL_SUBSCRIPTION(token, id, subscription_id) {
  let body = {
    subscription_id,
  }
  return await request(
    `${Routes.SUBSCRIPTION}/${id}/cancel`,
    { token, body },
    'POST'
  )
}
