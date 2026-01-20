import { apiSlice } from './apiSlice';

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaginatedResponse<Payment> | Payment[], PaginationParams>({
      query: (params) => ({
        url: '/payments',
        method: 'GET',
        params,
      }),
      providesTags: ['Invoice'],
    }),
    getPayment: builder.query<Payment, number>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),
    createPayment: builder.mutation<Payment, PaymentCreateRequest>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Invoice'],
    }),
    updatePayment: builder.mutation<Payment, { id: number; data: Partial<Payment> }>({
      query: ({ id, data }) => ({
        url: `/payments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
    getPaymentByOrder: builder.query<Payment, number>({
      query: (orderId) => ({
        url: `/payments/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, orderId) => [{ type: 'Invoice', id: orderId }],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useGetPaymentByOrderQuery,
} = paymentsApi;

