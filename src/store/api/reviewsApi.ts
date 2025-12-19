import { apiSlice } from './apiSlice';
import type {
  Review,
  ReviewCreateRequest,
  PaginatedResponse,
  PaginationParams,
} from './types';

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<PaginatedResponse<Review> | Review[], PaginationParams>({
      query: (params) => ({
        url: '/reviews',
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
    }),
    getReview: builder.query<Review, number>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),
    createReview: builder.mutation<Review, ReviewCreateRequest>({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateReview: builder.mutation<Review, { id: number; data: Partial<ReviewCreateRequest> }>({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }, 'Blog'],
    }),
    deleteReview: builder.mutation<void, number>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
    voteHelpfulness: builder.mutation<{ helpful: boolean }, { reviewId: number; helpful: boolean }>({
      query: ({ reviewId, helpful }) => ({
        url: `/reviews/${reviewId}/helpfulness`,
        method: 'POST',
        body: { helpful },
      }),
      invalidatesTags: (result, error, { reviewId }) => [{ type: 'Blog', id: reviewId }, 'Blog'],
    }),
    getHelpfulnessStats: builder.query<{ helpful_count: number; not_helpful_count: number }, number>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/helpfulness`,
        method: 'GET',
      }),
      providesTags: (result, error, reviewId) => [{ type: 'Blog', id: reviewId }],
    }),
    getHelpfulnessVotes: builder.query<any[], number>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/helpfulness/votes`,
        method: 'GET',
      }),
      providesTags: (result, error, reviewId) => [{ type: 'Blog', id: reviewId }],
    }),
    removeHelpfulnessVote: builder.mutation<void, number>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/helpfulness`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, reviewId) => [{ type: 'Blog', id: reviewId }, 'Blog'],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useVoteHelpfulnessMutation,
  useGetHelpfulnessStatsQuery,
  useGetHelpfulnessVotesQuery,
  useRemoveHelpfulnessVoteMutation,
} = reviewsApi;

