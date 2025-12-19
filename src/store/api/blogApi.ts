import { apiSlice } from './apiSlice';
import type {
  BlogPost,
  BlogPostCreateRequest,
  PaginatedResponse,
  PaginationParams,
} from './types';

export interface BlogComment {
  id: number;
  post_id: number;
  user_id: number | null;
  parent_id: number | null;
  author_name: string;
  author_email: string | null;
  content: string;
  is_approved: boolean;
  is_spam: boolean;
  created_at: string;
  replies?: BlogComment[];
}

export const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
    getBlogComments: builder.query<BlogComment[], number>({
      query: (postId) => ({
        url: `/blog/posts/${postId}/comments`,
        method: 'GET',
      }),
      providesTags: (result, error, postId) => [{ type: 'Blog', id: postId }],
      // Return empty array if endpoint doesn't exist (404) or other errors
      transformResponse: (response: unknown) => {
        if (Array.isArray(response)) {
          return response as BlogComment[];
        }
        return [];
      },
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
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
} = blogApi;
