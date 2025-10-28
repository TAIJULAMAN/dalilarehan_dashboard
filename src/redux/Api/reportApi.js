import { baseApi } from "./baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReport: builder.query({
      query: () => ({
        url: "/reports/admin",
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["Report"],
    }),
    getReportById: builder.query({
      query: (reportId) => ({
        url: `/reports/admin/${reportId}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? null,
      providesTags: (_res, _err, id) => [{ type: "Report", id }],
    }),
    resolveReport: builder.mutation({
      query: ({ id, body }) => ({
        url: `/reports/admin/${id}/resolve`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Report"],
    }),
  }),
  overrideExisting: true,
});

export const { useGetReportQuery, useGetReportByIdQuery, useResolveReportMutation } = reportApi;