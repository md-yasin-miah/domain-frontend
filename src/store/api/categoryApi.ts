import { apiSlice } from './apiSlice';

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Support Categories
    getSupportCategories: builder.query<Category[], { is_active: boolean }>({
      query: (params) => ({
        url: '/categories/support',
        method: 'GET',
        params,
      }),
      providesTags: ['Category'],
    }),
    getSupportCategory: builder.query<Category, number>({
      query: (id) => ({
        url: `/categories/support/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    createSupportCategory: builder.mutation<Category, CategoryCreateRequest>({
      query: (data) => ({
        url: '/categories/support',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateSupportCategory: builder.mutation<Category, { id: number; data: CategoryUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/categories/support/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),
    deleteSupportCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/support/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // FAQ Categories
    getFAQCategories: builder.query<PaginatedResponse<Category> | Category[], PaginationParams>({
      query: (params) => ({
        url: '/categories/faq',
        method: 'GET',
        params,
      }),
      providesTags: ['Category'],
    }),
    getFAQCategory: builder.query<Category, number>({
      query: (id) => ({
        url: `/categories/faq/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    createFAQCategory: builder.mutation<Category, CategoryCreateRequest>({
      query: (data) => ({
        url: '/categories/faq',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateFAQCategory: builder.mutation<Category, { id: number; data: CategoryUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/categories/faq/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),
    deleteFAQCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/faq/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // Blog Categories
    getBlogCategories: builder.query<PaginatedResponse<Category> | Category[], PaginationParams>({
      query: (params) => ({
        url: '/categories/blog',
        method: 'GET',
        params,
      }),
      providesTags: ['Category'],
    }),
    getBlogCategory: builder.query<Category, number>({
      query: (id) => ({
        url: `/categories/blog/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    createBlogCategory: builder.mutation<Category, CategoryCreateRequest>({
      query: (data) => ({
        url: '/categories/blog',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateBlogCategory: builder.mutation<Category, { id: number; data: CategoryUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/categories/blog/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, 'Category'],
    }),
    deleteBlogCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/blog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetSupportCategoriesQuery,
  useGetSupportCategoryQuery,
  useCreateSupportCategoryMutation,
  useUpdateSupportCategoryMutation,
  useDeleteSupportCategoryMutation,
  useGetFAQCategoriesQuery,
  useGetFAQCategoryQuery,
  useCreateFAQCategoryMutation,
  useUpdateFAQCategoryMutation,
  useDeleteFAQCategoryMutation,
  useGetBlogCategoriesQuery,
  useGetBlogCategoryQuery,
  useCreateBlogCategoryMutation,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = categoryApi;

