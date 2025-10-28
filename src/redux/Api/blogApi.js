import { baseApi } from "./baseApi";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
        getBlogs: builder.query({
      query: ({ page = 1, limit = 20, search = "" } = {}) => ({
        url: "/blogs",
        method: "GET",
        params: { page, limit, search: search || undefined },
      }),
      transformResponse: (response) => {
        const data = response?.data || {};
        const items = Array.isArray(data?.blogs)
          ? data.blogs
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
      providesTags: ["Blogs"],
    }),
  
    createBlog: builder.mutation({
      query: (body) => ({ url: "/blogs", method: "POST", body }),
      transformResponse: (response) => response?.data ?? response ?? null,
      invalidatesTags: ["Blogs"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, body }) => ({ url: `/blogs/${id}`, method: "PATCH", body }),
      transformResponse: (response) => response?.data ?? response ?? null,
      invalidatesTags: (_r, _e, { id }) => [{ type: "Blogs", id }, "Blogs"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({ url: `/blogs/${id}`, method: "DELETE" }),
      invalidatesTags: ["Blogs"],
    }),
    allBlogs: builder.query({
      query: () => ({ url: "/blogs", method: "GET" }),
      transformResponse: (response) => response?.data ?? response ?? null,
      providesTags: ["Blogs"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useAllBlogsQuery,
} = blogApi;
