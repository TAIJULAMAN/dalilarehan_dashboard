import { baseApi } from "./baseApi";

export const manageConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get subscription configurations
    getSubscriptionConfigs: builder.query({
      query: () => ({ url: `/admin/subscriptions/configs`, method: "GET" }),
      transformResponse: (response) => response?.data ?? response ?? {},
      providesTags: ["Config"],
    }),

    // Update subscription pricing/config (PATCH)
    updateSubscriptionPricing: builder.mutation({
      query: (body) => ({
        url: `/admin/subscriptions/pricing`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Config"],
    }),

    // Get loyalty config
    getLoyaltyConfig: builder.query({
      query: () => ({ url: `/admin/loyalty/config`, method: "GET" }),
      transformResponse: (response) => response?.data ?? response ?? {},
      providesTags: ["Config"],
    }),

    // Update loyalty config (PUT)
    updateLoyaltyConfig: builder.mutation({
      query: (body) => ({ url: `/admin/loyalty/config`, method: "PUT", body }),
      invalidatesTags: ["Config"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetSubscriptionConfigsQuery,
  useUpdateSubscriptionPricingMutation,
  useGetLoyaltyConfigQuery,
  useUpdateLoyaltyConfigMutation,
} = manageConfigApi;

export default manageConfigApi;
