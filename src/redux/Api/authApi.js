import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/admin/login",
        method: "POST",
        body: data,
      }),
    }),
    me: builder.query({
      query: () => ({
        url: "/admin/me",
        method: "GET",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useLoginMutation, useMeQuery, useLogoutMutation } = authApi;