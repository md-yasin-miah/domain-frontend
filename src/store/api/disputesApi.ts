import { apiSlice } from "./apiSlice";

/** Matches backend DisputeResponse */
export interface Dispute {
  id: number;
  order_id: number;
  dispute_number: string;
  initiator_id: number;
  respondent_id: number;
  dispute_type: string;
  title: string;
  description: string;
  status: string;
  resolution: string | null;
  resolved_by_id: number | null;
  resolved_at: string | null;
  resolution_action: string | null;
  created_at: string;
  updated_at: string;
}

export interface DisputeCreateRequest {
  order_id: number;
  dispute_type: string;
  title: string;
  description: string;
}

export interface DisputeUpdateRequest {
  title?: string;
  description?: string;
  status?: string;
  resolution?: string;
  resolution_action?: string;
}

/** Matches backend DisputeCommentResponse */
export interface DisputeComment {
  id: number;
  dispute_id: number;
  user_id: number;
  comment: string;
  is_internal: boolean;
  created_at: string;
  user?: { id: number; username?: string; email?: string } | null;
}

export interface DisputeFilters extends PaginationParams {
  status?: string;
  dispute_type?: string;
  order_id?: number;
}

export const disputesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDisputes: builder.query<PaginatedResponse<Dispute>, DisputeFilters>({
      query: (params) => ({
        url: "/disputes",
        method: "GET",
        params: {
          skip: params.skip,
          limit: params.limit,
          ...(params.status && { status: params.status }),
          ...(params.dispute_type && { dispute_type: params.dispute_type }),
          ...(params.order_id != null && { order_id: params.order_id }),
        },
      }),
      providesTags: ["User"],
    }),
    getDispute: builder.query<Dispute, number>({
      query: (id) => ({
        url: `/disputes/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "User", id: `dispute-${id}` },
        "User",
      ],
    }),
    getDisputeComments: builder.query<
      DisputeComment[],
      {
        disputeId: number;
        skip?: number;
        limit?: number;
        include_internal?: boolean;
      }
    >({
      query: ({ disputeId, skip, limit, include_internal }) => ({
        url: `/disputes/${disputeId}/comments`,
        method: "GET",
        params: { skip, limit, include_internal },
      }),
      providesTags: (result, error, { disputeId }) => [
        { type: "User", id: `dispute-comments-${disputeId}` },
        "User",
      ],
    }),
    createDispute: builder.mutation<Dispute, DisputeCreateRequest>({
      query: (data) => ({
        url: "/disputes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateDispute: builder.mutation<
      Dispute,
      { id: number; data: DisputeUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/disputes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `dispute-${id}` },
        "User",
      ],
    }),
    resolveDispute: builder.mutation<
      Dispute,
      { id: number; resolution: string; resolution_action?: string }
    >({
      query: ({ id, resolution, resolution_action }) => ({
        url: `/disputes/${id}/resolve`,
        method: "POST",
        params: { resolution, resolution_action },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `dispute-${id}` },
        "User",
      ],
    }),
    addDisputeComment: builder.mutation<
      DisputeComment,
      { id: number; comment: string; is_internal?: boolean }
    >({
      query: ({ id, comment, is_internal }) => ({
        url: `/disputes/${id}/comments`,
        method: "POST",
        body: { comment, is_internal: is_internal ?? false },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `dispute-${id}` },
        { type: "User", id: `dispute-comments-${id}` },
        "User",
      ],
    }),
    deleteDispute: builder.mutation<void, number>({
      query: (id) => ({
        url: `/disputes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetDisputesQuery,
  useGetDisputeQuery,
  useGetDisputeCommentsQuery,
  useCreateDisputeMutation,
  useUpdateDisputeMutation,
  useResolveDisputeMutation,
  useAddDisputeCommentMutation,
  useDeleteDisputeMutation,
} = disputesApi;
