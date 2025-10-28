import { baseApi } from "./baseApi";

export const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPrivacyPolicy: builder.query({
      query: () => ({
        url: "/legal/admin/privacy-policy",
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? response ?? null,
      providesTags: ["PrivacyPolicy"],
    }),
    updateAdminPrivacyPolicy: builder.mutation({
      query: (body) => ({
        url: "/legal/admin/privacy-policy",
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      invalidatesTags: ["PrivacyPolicy"],
    }),
    getAdminTermsConditions: builder.query({
      query: () => ({
        url: "/legal/admin/terms-conditions",
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? response ?? null,
      providesTags: ["TermsConditions"],
    }),
    updateAdminTermsConditions: builder.mutation({
      query: (body) => ({
        url: "/legal/admin/terms-conditions",
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      invalidatesTags: ["TermsConditions"],
    }),
    getAdminAboutUs: builder.query({
      query: () => ({
        url: "/legal/admin/about-us",
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? response ?? null,
      providesTags: ["AboutUs"],
    }),
    updateAdminAboutUs: builder.mutation({
      query: (body) => ({
        url: "/legal/admin/about-us",
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      invalidatesTags: ["AboutUs"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAdminPrivacyPolicyQuery,
  useUpdateAdminPrivacyPolicyMutation,
  useGetAdminTermsConditionsQuery,
  useUpdateAdminTermsConditionsMutation,
  useGetAdminAboutUsQuery,
  useUpdateAdminAboutUsMutation,
} = settingApi;
