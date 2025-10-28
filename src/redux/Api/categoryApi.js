import { baseApi } from "./baseApi";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceCategories: builder.query({
      query: (params = {}) => ({
        url: "/service-categories",
        method: "GET",
        params,
      }),
      transformResponse: (response) => {
        const data = response?.data ?? response ?? [];
        if (Array.isArray(data)) return data;
        return data?.categories ?? data?.serviceCategories ?? data?.items ?? [];
      },
      providesTags: ["ServiceCategories"],
    }),
    createServiceCategory: builder.mutation({
      query: (body) => ({
        url: "/service-categories",
        method: "POST",
        body,
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      invalidatesTags: ["ServiceCategories"],
    }),
    updateServiceCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/service-categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      invalidatesTags: ["ServiceCategories"],
    }),
    deleteServiceCategory: builder.mutation({
      query: (id) => ({
        url: `/service-categories/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response?.data ?? response ?? {},
      invalidatesTags: ["ServiceCategories"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetServiceCategoriesQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
} = categoryApi;
