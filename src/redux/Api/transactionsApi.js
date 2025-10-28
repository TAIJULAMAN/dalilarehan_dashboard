import { baseApi } from "./baseApi";

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminTransactions: builder.query({
      query: ({
        page = 1,
        limit = 20,
        types = ["points_purchase", "subscription_payment"],
        status = "completed",
      } = {}) => {
        const typeQuery = (Array.isArray(types) ? types : [types])
          .filter(Boolean)
          .map((t) => `type=${encodeURIComponent(t)}`)
          .join("&");
        const qs = `page=${page}&limit=${limit}${
          typeQuery ? `&${typeQuery}` : ""
        }&status=${encodeURIComponent(status)}`;
        return {
          url: `/transactions/admin/all?${qs}`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        const data = response?.data || {};
        const items = Array.isArray(data?.transactions)
          ? data.transactions
          : [];
        const pagination = data?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalTransactions: items.length,
          hasNext: false,
          hasPrev: false,
          limit,
        };
        return { items, pagination };
      },
    }),
    getMonthlyAdminAnalytics: builder.query({
      query: ({ year } = {}) => ({
        url: "/transactions/admin/analytics/monthly",
        method: "GET",
        params: { year },
      }),
      transformResponse: (response) => response?.data ?? [],
    }),
    getAdminDashboard: builder.query({
      query: () => ({
        url: "/transactions/admin/dashboard",
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? {},
    }),
    getPointsAdminConfig: builder.query({
      query: () => ({
        url: "/points/admin/config",
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      providesTags: ["PointsConfig"],
    }),
    updatePointsAdminConfig: builder.mutation({
      query: (body) => ({
        url: "/points/admin/config",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PointsConfig"],
    }),
    getAdminTransactionInvoice: builder.query({
      query: ({ id }) => ({
        url: `/transactions/admin/${id}/invoice`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminTransactionsQuery,
  useGetMonthlyAdminAnalyticsQuery,
  useGetAdminDashboardQuery,
  useGetPointsAdminConfigQuery,
  useUpdatePointsAdminConfigMutation,
  useGetAdminTransactionInvoiceQuery,
} = transactionsApi;
