import { baseApi } from "./baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSubscriptionConfigs: builder.query({
      query: (params = {}) => ({
        url: "/admin/subscriptions/configs",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response?.data ?? response ?? [],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAdminSubscriptionConfigsQuery } = subscriptionApi;

