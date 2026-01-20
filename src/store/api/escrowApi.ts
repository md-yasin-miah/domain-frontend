import { apiSlice } from './apiSlice';

export const escrowApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEscrows: builder.query<PaginatedResponse<Escrow> | Escrow[], PaginationParams>({
      query: (params) => ({
        url: '/escrow',
        method: 'GET',
        params,
      }),
      providesTags: ['Invoice'],
    }),
    getEscrow: builder.query<Escrow, number>({
      query: (id) => ({
        url: `/escrow/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),
    createEscrow: builder.mutation<Escrow, Partial<Escrow>>({
      query: (data) => ({
        url: '/escrow',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Invoice'],
    }),
    getEscrowByOrder: builder.query<Escrow, number>({
      query: (orderId) => ({
        url: `/escrow/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, orderId) => [{ type: 'Invoice', id: orderId }],
    }),
    releaseEscrow: builder.mutation<Escrow, { id: number; data?: EscrowReleaseRequest }>({
      query: ({ id, data }) => ({
        url: `/escrow/${id}/release`,
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
    refundEscrow: builder.mutation<Escrow, { id: number; data?: EscrowRefundRequest }>({
      query: ({ id, data }) => ({
        url: `/escrow/${id}/refund`,
        method: 'POST',
        body: data || {},
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
    updateEscrow: builder.mutation<Escrow, { id: number; data: Partial<Escrow> }>({
      query: ({ id, data }) => ({
        url: `/escrow/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
  }),
});

export const {
  useGetEscrowsQuery,
  useGetEscrowQuery,
  useCreateEscrowMutation,
  useGetEscrowByOrderQuery,
  useReleaseEscrowMutation,
  useRefundEscrowMutation,
  useUpdateEscrowMutation,
} = escrowApi;

