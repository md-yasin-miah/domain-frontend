import { apiSlice } from './apiSlice';
export const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublicBlogPosts: builder.query<PaginatedResponse<BlogPost> | BlogPost[], PaginationParams>({
      query: (params) => ({
        url: "/blog/posts/public",
        method: 'GET',
        params,
      }),
      providesTags: ['PublicBlog'],
    }),
    getBlogPosts: builder.query<PaginatedResponse<BlogPost> | BlogPost[], PaginationParams>({
      query: (params) => ({
        url: '/blog/posts',
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
    }),
    getBlogPost: builder.query<BlogPost, number>({
      query: (id) => ({
        url: `/blog/posts/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),
    getBlogPostBySlug: builder.query<BlogPost, string>({
      query: (slug) => ({
        url: `/blog/posts/slug/${slug}`,
        method: 'GET',
        params: { increment_view: true },
      }),
      providesTags: (result, error, slug) => [{ type: 'Blog', id: result?.id }],
    }),
    getBlogComments: builder.query<PaginatedResponse<BlogComment>, { postId: number; params?: PaginationParams }>({
      query: ({ postId, params }) => ({
        url: `/blog/posts/${postId}/comments`,
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { postId }) => [{ type: 'Blog', id: `comments-${postId}` }],
    }),
    createBlogComment: builder.mutation<BlogComment, { postId: number; data: { content: string } }>({
      query: ({ postId, data }) => ({
        url: `/blog/posts/${postId}/comments`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Blog', id: `comments-${postId}` }],
    }),
    updateBlogComment: builder.mutation<BlogComment, { postId: number; commentId: number; data: { content: string } }>({
      query: ({ postId, commentId, data }) => ({
        url: `/blog/posts/${postId}/comments/${commentId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Blog', id: `comments-${postId}` }],
    }),
    deleteBlogComment: builder.mutation<void, { postId: number; commentId: number }>({
      query: ({ postId, commentId }) => ({
        url: `/blog/posts/${postId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Blog', id: `comments-${postId}` }],
    }),
    createBlogPost: builder.mutation<BlogPost, BlogPostCreateRequest>({
      query: (data) => ({
        url: '/blog/posts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlogPost: builder.mutation<BlogPost, { id: number; data: BlogPostCreateRequest }>({
      query: ({ id, data }) => ({
        url: `/blog/posts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }, 'Blog'],
    }),
    deleteBlogPost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/blog/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  useGetBlogPostBySlugQuery,
  useGetBlogCommentsQuery,
  useCreateBlogCommentMutation,
  useUpdateBlogCommentMutation,
  useDeleteBlogCommentMutation,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;
