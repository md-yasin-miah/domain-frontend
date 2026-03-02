import { apiSlice } from './apiSlice';

export interface PaymentOrderInfo {
  id: number;
  order_number: string;
  status: string;
}

export interface Payment {
  id: number;
  payment_number: string;
  order_id: number;
  amount: number | string;
  currency: string;
  payment_method: string;
  transaction_id: string | null;
  status: string;
  paid_at: string | null;
  processed_at: string | null;
  refunded_at: string | null;
  refund_amount: number | string | null;
  refund_reason: string | null;
  created_at: string;
  updated_at: string;
  order?: PaymentOrderInfo | null;
}

export interface PaymentListParams {
  skip?: number;
  limit?: number;
  status?: string;
  payment_method?: string;
}

export interface PaymentUpdateRequest {
  status?: string;
  transaction_id?: string | null;
  provider_response?: Record<string, unknown> | null;
  refund_amount?: number | string | null;
  refund_reason?: string | null;
  refund_transaction_id?: string | null;
  additional_metadata?: Record<string, unknown> | null;
}

export interface PaymentCreateRequest {
  order_id: number;
  amount: number | string;
  currency: string;
  payment_method: string;
  transaction_id?: string | null;
  additional_metadata?: Record<string, unknown> | null;
}

export interface PaymentMethodInfo {
  id: string;
  name: string;
  display_name: string;
  description: string;
  enabled: boolean;
  supported_currencies: string[];
  icon: string;
  requires_redirect: boolean;
}

export interface PaymentListResponse {
  items: Payment[];
  pagination: {
    total: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
    has_next?: boolean;
    has_previous?: boolean;
  };
}

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentListResponse, PaymentListParams | void>({
      query: (params = {}) => ({
        url: '/payments',
        method: 'GET',
        params: {
          skip: params?.skip ?? 0,
          limit: params?.limit ?? 50,
          ...(params?.status && { status: params.status }),
          ...(params?.payment_method && { payment_method: params.payment_method }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((p) => ({ type: 'Payment' as const, id: p.id })),
              { type: 'Payment', id: 'LIST' },
            ]
          : [{ type: 'Payment', id: 'LIST' }],
    }),
    getPayment: builder.query<Payment, number>({
      query: (id) => ({
        url: `/payments/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),
    createPayment: builder.mutation<Payment, PaymentCreateRequest>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Payment', id: 'LIST' }],
    }),
    updatePayment: builder.mutation<Payment, { id: number; data: PaymentUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/payments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Payment', id }, { type: 'Payment', id: 'LIST' }],
    }),
    getPaymentByOrder: builder.query<Payment | null, number>({
      query: (orderId) => ({
        url: `/payments/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, orderId) => [{ type: 'Payment', id: `order-${orderId}` }],
    }),
    getPaymentMethods: builder.query<{ payment_methods: PaymentMethodInfo[] }, void>({
      query: () => ({
        url: '/payments/methods',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useGetPaymentByOrderQuery,
  useGetPaymentMethodsQuery,
} = paymentsApi;
