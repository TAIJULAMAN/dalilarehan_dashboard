import { baseApi } from "./baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: "/notifications/admin",
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response) => {
        const data = response?.data || {};
        const items = Array.isArray(data?.notifications)
          ? data.notifications
          : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];
        const pagination = data?.pagination || {
          currentPage: 1,
          totalPages: 1,
          total: items.length,
          hasNext: false,
          hasPrev: false,
          limit,
        };
        return { items, pagination };
      },
      providesTags: ["AdminNotifications"],
    }),
  
  }),
  overrideExisting: true,
});

export const {
  useGetAdminNotificationsQuery,
} = notificationApi;

