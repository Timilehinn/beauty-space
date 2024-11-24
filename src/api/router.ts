import { Dispatch, SetStateAction } from "react";

interface RequestI {
  body?: any;
  token?: string | null;
  headers?: any;
}

const traceError = (error: any) => {
  try {
    if (typeof error === 'string') {
      error = new Error(error)
    }
  } catch (e) {}
}

const formatResponse = async (endpoint: string, res: any) => {
  try {
    if(res?.status === 401 || res?.status === 403){
      return {
        status: false,
        statusCode: 401,
        message: 'Session expired, please re-login and try again.',
      }
    }
    const json = await res.json();
    return json
  } catch(err) {
    const msg = `${endpoint} ${res?.status}`;
    traceError(new Error(msg));
    // if (res?.status === 401) {
    //   return {
    //     status: false,
    //     statusCode: 401,
    //     message: 'Session expired, please re-login and try again.',
    //   }
    // }
    return {
      status: false,
      statusCode: 400,
      message: `Error ${res?.status}`,
    }
  }
}

/**
 *
 * @param endpoint The subroute to call e.g /auth/login
 * @param params Custom parameters e.g request body
 * @param config
 * @returns
 */
const request = async (endpoint: string, params: RequestI, method: string, ...config: any) => {
    const { body, token, headers } = params;
    const requestBody = {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...headers
      },
      ...config
    };
      const HOST_API = process.env.NEXT_PUBLIC_REACT_APP_BASE_URL

    const request = await fetch(`${HOST_API}${endpoint}`, requestBody);
    return formatResponse(endpoint, request);
};

export function handleResponse<TData>(res: any, func?: () => void): { error: string, status: boolean, data: TData } {
  if(func){
    func()
  }
  const errorArray = Object.values(res.errors).flat() as string[]
  return { error: errorArray[0] || 'An error occurred, please try again.', status: res.status, data: res.data }
}

export default request
