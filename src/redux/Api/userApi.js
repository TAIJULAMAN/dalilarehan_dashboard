import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    currentUser: builder.query({
      query: () => ({
        url: "/users/current-user",
        method: "GET",
      }),
      transformResponse: (response) =>
        response?.data?.user ?? response?.data ?? response ?? null,
      providesTags: ["CurrentUser"],
    }),
    getAdminUsers: builder.query({
      query: (params = {}) => ({
        url: "/users/admin/users",
        method: "GET",
        params,
      }),
      transformResponse: (response) =>
        response?.data?.users ?? response?.data ?? [],
      providesTags: ["Users"],
    }),
    getAdminUsersPaged: builder.query({
      query: (params = {}) => ({
        url: "/users/admin/users",
        method: "GET",
        params,
      }),
      transformResponse: (response) => {
        const data = response?.data ?? response ?? {};
        if (Array.isArray(data)) return { users: data, pagination: undefined };
        const users = data?.users ?? [];
        const pagination = data?.pagination ?? undefined;
        return { users, pagination };
      },
      providesTags: ["Users"],
    }),
    getAdminUsersRatio: builder.query({
      query: ({ year } = {}) => ({
        url: "/users/admin/users/ratio",
        method: "GET",
        params: { year },
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      providesTags: ["UsersRatio"],
    }),
    getAdminUsersCounts: builder.query({
      query: () => ({
        url: "/users/admin/users/counts",
        method: "GET",
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      providesTags: ["UsersCounts"],
    }),
    getProvidersPaged: builder.query({
      query: (params = {}) => ({
        url: "/users/providers",
        method: "GET",
        params,
      }),
      transformResponse: (response) => {
        const data = response?.data ?? response ?? {};
        if (Array.isArray(data))
          return { providers: data, pagination: undefined };
        const providers = data?.providers ?? [];
        const pagination = data?.pagination ?? undefined;
        return { providers, pagination };
      },
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/admin/users/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      invalidatesTags: ["Users", "UsersCounts", "UsersRatio"],
    }),
    deleteProvider: builder.mutation({
      query: ({ id }) => ({
        url: `/users/admin/providers/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      invalidatesTags: ["Users", "UsersCounts", "UsersRatio"],
    }),
    changeAdminPassword: builder.mutation({
      query: (body) => ({
        url: "/admin/me/change-password",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
    }),
    exportProviders: builder.query({
      query: (params = {}) => ({
        url: "/admin/export/providers",
        method: "GET",
        params,
      }),
      // server likely returns CSV/text; baseApi will return text for non-json
      transformResponse: (response) => response?.data ?? response ?? null,
      providesTags: ["Users"],
    }),
    exportUsers: builder.query({
      query: (params = {}) => ({
        url: "/admin/export/users",
        method: "GET",
        params,
      }),
      transformResponse: (response) => response?.data ?? response ?? null,
      providesTags: ["Users"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCurrentUserQuery,
  useGetAdminUsersQuery,
  useGetAdminUsersPagedQuery,
  useGetAdminUsersRatioQuery,
  useGetAdminUsersCountsQuery,
  useGetProvidersPagedQuery,
  useDeleteUserMutation,
  useDeleteProviderMutation,
  useChangeAdminPasswordMutation,
  useExportProvidersQuery,
  useExportUsersQuery,
  useLazyExportProvidersQuery,
  useLazyExportUsersQuery,
} = userApi;
