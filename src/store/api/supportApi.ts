import { apiSlice } from './apiSlice';

export const supportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<PaginatedResponse<SupportTicket>, SupportTicketFilters>({
      query: (params) => ({
        url: '/support/tickets',
        method: 'GET',
        params,
      }),
      providesTags: ['Ticket'],
    }),
    getTicket: builder.query<SupportTicket, { id: number; include_replies?: boolean }>({
      query: ({ id, include_replies }) => ({
        url: `/support/tickets/${id}`,
        method: 'GET',
        params: include_replies != null ? { include_replies } : undefined,
      }),
      providesTags: (result, error, { id }) => [{ type: 'Ticket', id }],
    }),
    addTicketReply: builder.mutation<SupportTicketReply, { ticketId: number; data: TicketReplyCreateRequest }>({
      query: ({ ticketId, data }) => ({
        url: `/support/tickets/${ticketId}/replies`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { ticketId }) => [{ type: 'Ticket', id: ticketId }],
    }),
    createTicket: builder.mutation<SupportTicket, TicketCreateRequest>({
      query: (data) => ({
        url: '/support/tickets',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Ticket'],
    }),
    updateTicket: builder.mutation<SupportTicket, { id: number; data: TicketUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/support/tickets/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Ticket', id }, 'Ticket'],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useAddTicketReplyMutation,
} = supportApi;

