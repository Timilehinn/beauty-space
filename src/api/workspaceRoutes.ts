import request from "./router";

enum Routes {
  GET_BUSINESSES = "/businesses",
}

export async function GET_BUSINESSES_CUSTOMERS(
  token: string
) {
  return await request(`${Routes.GET_BUSINESSES}/customers`,
    { token },
    "GET"
  );
}
