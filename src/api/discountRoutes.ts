import request from './router';

enum Routes {
  DISCOUNTS = '/discounts',
}

export async function GET_AVAILABLE_DISCOUNTS(token: string) {
  return await request(`${Routes.DISCOUNTS}/all`, { token }, 'GET');
}

export async function APPLY_DISCOUNT(token: string, promo_code: string, workspace_id: number) {
  let body = { promo_code, workspace_id }
  return await request(`${Routes.DISCOUNTS}/promo-code/apply`, { token, body }, 'POST');
}

export async function GET_BUSINESS_DISCOUNTS(
  token: string,
  workspace_id?: number
) {
  return await request(`${Routes.DISCOUNTS}?workspace_id=${workspace_id}`,
    { token },
    "GET"
  );
}


