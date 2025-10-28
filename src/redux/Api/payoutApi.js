import { baseApi } from "./baseApi";

export const payoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPayouts: builder.query({
      // accepts optional { page, limit, status, search }
      query: ({ page = 1, limit = 20, status, search } = {}) => ({
        url: `/payouts/admin/all`,
        method: "GET",
        params: Object.assign(
          { page, limit },
          status ? { status } : {},
          search ? { search } : {}
        ),
      }),
      transformResponse: (response, meta, arg) => {
        const data = response?.data || {};
        const items = Array.isArray(data?.payouts)
          ? data.payouts
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        const pagination = data?.pagination || {
          currentPage: arg?.page ?? 1,
          totalPages: 1,
          totalRequests: items.length,
          hasNext: false,
          hasPrev: false,
          limit: arg?.limit ?? 20,
        };
        return { items, pagination };
      },
      providesTags: ["Payouts"],
    }),

    getAdminPayoutDetails: builder.query({
      query: ({ payoutId }) => ({
        url: `/payouts/admin/${payoutId}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      providesTags: ["Payouts"],
    }),

    approvePayout: builder.mutation({
      query: ({ payoutId }) => ({
        url: `/payouts/admin/${payoutId}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payouts"],
    }),

    rejectPayout: builder.mutation({
      query: ({ payoutId, reason } = {}) => ({
        url: `/payouts/admin/${payoutId}/reject`,
        method: "PATCH",
        // backend expects { rejectionReason: "..." }
        body: reason ? { rejectionReason: reason } : undefined,
      }),
      invalidatesTags: ["Payouts"],
    }),

    // Get current point -> euro rate
    getAdminPointRate: builder.query({
      query: () => ({ url: `/payouts/admin/point-rate`, method: "GET" }),
      transformResponse: (response) => response?.data ?? response ?? {},
      providesTags: ["Payouts"],
    }),

    // Update point -> euro rate
    updateAdminPointRate: builder.mutation({
      // body should contain the rate object accepted by backend, e.g. { pointToEuroRate: 1 }
      query: (body) => ({
        url: `/payouts/admin/point-rate`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Payouts"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminPayoutsQuery,
  useGetAdminPayoutDetailsQuery,
  useApprovePayoutMutation,
  useRejectPayoutMutation,
  useGetAdminPointRateQuery,
  useUpdateAdminPointRateMutation,
} = payoutApi;
