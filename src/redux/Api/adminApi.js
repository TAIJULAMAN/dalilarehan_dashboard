import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation({
      query: (body) => ({
        url: "/admin/create",
        method: "POST",
        body,
      }),
    }),
    getAllAdmins: builder.query({
      query: () => ({
        url: "/admin/all",
        method: "GET",
      }),
      transformResponse: (response) => {
        if (Array.isArray(response)) return response;
        if (Array.isArray(response?.data)) return response.data;
        if (Array.isArray(response?.data?.admins)) return response.data.admins;
        console.log(response);
        return [];
      },
    }),
    getAdminMe: builder.query({
      query: () => ({
        url: "/admin/me",
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? response ?? null,
      providesTags: ["AdminMe"],
    }),
    updateAdminMe: builder.mutation({
      query: (body) => ({
        url: "/admin/me",
        method: "PATCH",
        body,
      }),
      transformResponse: (response) => response?.data ?? response ?? null,
      invalidatesTags: ["AdminMe"],
    }),
    updateAdmin: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/${id}`,
        method: "PATCH",
        body,
      }),
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateAdminMutation,
  useGetAllAdminsQuery,
  useGetAdminMeQuery,
  useUpdateAdminMeMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;

