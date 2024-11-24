import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/`,
  }),
  endpoints: (builder) => ({
    listPosts: builder.query({
      query: (page = 1) => `workspaces?page=${page}`,
    }),
  }),
})

export const { useListPostsQuery } = api
