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
    getTicket: builder.query<SupportTicket, number>({
      query: (id) => ({
        url: `/support/tickets/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
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
} = supportApi;

