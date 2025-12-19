import { apiSlice } from './apiSlice';
import type {
  Dispute,
  DisputeCreateRequest,
  DisputeComment,
  PaginatedResponse,
  PaginationParams,
} from './types';

export const disputesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDisputes: builder.query<PaginatedResponse<Dispute> | Dispute[], PaginationParams>({
      query: (params) => ({
        url: '/disputes',
        method: 'GET',
        params,
      }),
      providesTags: ['Ticket'],
    }),
    getDispute: builder.query<Dispute, number>({
      query: (id) => ({
        url: `/disputes/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),
    createDispute: builder.mutation<Dispute, DisputeCreateRequest>({
      query: (data) => ({
        url: '/disputes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Ticket'],
    }),
    updateDispute: builder.mutation<Dispute, { id: number; data: Partial<Dispute> }>({
      query: ({ id, data }) => ({
        url: `/disputes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, 'Ticket'],
    }),
    resolveDispute: builder.mutation<Dispute, { id: number; resolution: string }>({
      query: ({ id, resolution }) => ({
        url: `/disputes/${id}/resolve`,
        method: 'POST',
        body: { resolution },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, 'Ticket'],
    }),
    addDisputeComment: builder.mutation<DisputeComment, { id: number; comment: string }>({
      query: ({ id, comment }) => ({
        url: `/disputes/${id}/comments`,
        method: 'POST',
        body: { comment },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, 'Ticket'],
    }),
  }),
});

export const {
  useGetDisputesQuery,
  useGetDisputeQuery,
  useCreateDisputeMutation,
  useUpdateDisputeMutation,
  useResolveDisputeMutation,
  useAddDisputeCommentMutation,
} = disputesApi;

