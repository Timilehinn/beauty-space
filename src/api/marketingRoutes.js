import request from './router'

const Routes = {
  DISCOUNTS: '/discounts',
}

/**
 * The function GET_DISCOUNTS makes an asynchronous request to retrieve discounts using a provided
 * token.
 * @param token - A token is a piece of data that is used to authenticate a user or a system. It is
 * often used in web applications to verify the identity of a user and grant access to certain
 * resources or functionalities. In this case, the token is likely used to authenticate the user and
 * authorize access to the discounts
 * @returns The `GET_DISCOUNTS` function is being returned, which is an asynchronous function that
 * makes a GET request to the `DISCOUNTS` route with the provided token.
 */
export async function GET_DISCOUNTS(token) {
  return await request(`${Routes.DISCOUNTS}`, { token }, 'GET')
}

/**
 * The function CREATE_DISCOUNTS sends a POST request to create discounts using the provided token and
 * form data.
 * @param token - A token is a piece of data that is used to authenticate a user or provide access to a
 * system or service. It is often used in web development to verify the identity of a user and grant
 * them access to certain resources or functionalities. In this context, the token is likely being used
 * to authenticate the
 * @param formData - The `formData` parameter likely contains the data needed to create a discount.
 * This could include information such as the discount amount, discount code, expiration date, and any
 * other relevant details required to create a discount in the system.
 * @returns The `CREATE_DISCOUNTS` function is returning the result of the `request` function with the
 * parameters `${Routes.DISCOUNTS}/create`, { token, body }, 'POST'.
 */
export async function CREATE_DISCOUNTS(token, formData) {
  let body = {
    ...formData,
  }
  return await request(`${Routes.DISCOUNTS}/create`, { token, body }, 'POST')
}

/**
 * The UPDATE_DISCOUNTS function updates a discount with the provided discountId using the data object
 * and authentication token.
 * @param token - The `token` parameter is a unique identifier that is used for authentication and
 * authorization purposes. It is typically provided by the server to the client for accessing protected
 * resources or performing actions on behalf of a user. In this context, the `token` is likely used to
 * authenticate the user making the request to
 * @param discountId - The `discountId` parameter is the unique identifier of the discount that you
 * want to update. It is used to specify which discount you are targeting for the update operation.
 * @param data - The `data` parameter in the `UPDATE_DISCOUNTS` function is an object containing the
 * updated discount information that you want to send to the server for updating a specific discount.
 * It may include properties such as `name`, `percentage`, `start_date`, `end_date`, or any other
 * relevant
 * @returns The UPDATE_DISCOUNTS function is returning the result of the request made to update a
 * discount with the provided discountId and data.
 */
export async function UPDATE_DISCOUNTS(token, discountId, data) {
  let body = {
    ...data,
  }
  return await request(
    `${Routes.DISCOUNTS}/${discountId}/update`,
    { token, body },
    'POST'
  )
}

/**
 * The function DELETE_DISCOUNTS sends a DELETE request to delete a discount with the specified
 * discountId using the provided token.
 * @param token - The `token` parameter is a unique identifier that is used for authentication and
 * authorization purposes. It is typically provided by the user or system making the request to access
 * or modify resources. In this case, it is used to authenticate the user before allowing the deletion
 * of a discount with the specified `discountId
 * @param discountId - The `discountId` parameter is the unique identifier of the discount that you
 * want to delete. It is used to specify which discount should be deleted when making the DELETE
 * request to the server.
 * @returns The DELETE_DISCOUNTS function is returning the result of the request made to delete a
 * discount with the specified discountId using the provided token.
 */
export async function DELETE_DISCOUNTS(token, discountId) {
  return await request(
    `${Routes.DISCOUNTS}/${discountId}/delete`,
    { token },
    'DELETE'
  )
}
