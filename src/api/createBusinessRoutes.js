import request from './router'

const Routes = {
  BUSINESS: '/workspaces',
}

export async function CREATE_SERVICE_GROUPS(
  token,
  category,
  asset_urls,
  formData
) {
  const body = {
    asset_urls,
    name: category,
    is_package: formData.is_package,
    price: formData.price,
  }
  return await request(`/service-groups`, { token, body }, 'POST')
}
