import { apiSlice } from './apiSlice';
import type {
  Order,
  OrderCreateRequest,
  PaymentIntentResponse,
  PaymentIntentStatus,
  PaginatedResponse,
  OrderFilters,
} from './types';

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<PaginatedResponse<Order> | Order[], OrderFilters>({
      query: (params) => ({
        url: '/orders',
        method: 'GET',
        params,
      }),
      providesTags: ['Invoice'],
    }),
    getOrder: builder.query<Order, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),
    createOrder: builder.mutation<Order, OrderCreateRequest>({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Invoice'],
    }),
    updateOrder: builder.mutation<Order, { id: number; data: Partial<Order> }>({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
    cancelOrder: builder.mutation<Order, number>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
    createPaymentIntent: builder.mutation<PaymentIntentResponse, number>({
      query: (orderId) => ({
        url: `/orders/${orderId}/payment-intent`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, orderId) => [{ type: 'Invoice', id: orderId }],
    }),
    getPaymentIntentStatus: builder.query<PaymentIntentStatus, number>({
      query: (orderId) => ({
        url: `/orders/${orderId}/payment-intent/status`,
        method: 'GET',
      }),
      providesTags: (result, error, orderId) => [{ type: 'Invoice', id: orderId }],
    }),
    confirmPayment: builder.mutation<void, number>({
      query: (orderId) => ({
        url: `/orders/${orderId}/payment-intent/confirm`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, orderId) => [{ type: 'Invoice', id: orderId }, 'Invoice'],
    }),
    requestRefund: builder.mutation<Order, number>({
      query: (orderId) => ({
        url: `/orders/${orderId}/refund`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, orderId) => [{ type: 'Invoice', id: orderId }, 'Invoice'],
    }),
    completeOrder: builder.mutation<Order, number>({
      query: (orderId) => ({
        url: `/orders/${orderId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, orderId) => [{ type: 'Invoice', id: orderId }, 'Invoice'],
    }),
    getOrderByNumber: builder.query<Order, string>({
      query: (orderNumber) => ({
        url: `/orders/number/${orderNumber}`,
        method: 'GET',
      }),
      providesTags: (result, error, orderNumber) => [{ type: 'Invoice', id: result?.id }],
    }),
    cancelPaymentIntent: builder.mutation<void, number>({
      query: (orderId) => ({
        url: `/orders/${orderId}/payment-intent/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, orderId) => [{ type: 'Invoice', id: orderId }, 'Invoice'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetOrderByNumberQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useCancelOrderMutation,
  useCompleteOrderMutation,
  useCreatePaymentIntentMutation,
  useGetPaymentIntentStatusQuery,
  useConfirmPaymentMutation,
  useCancelPaymentIntentMutation,
  useRequestRefundMutation,
} = ordersApi;

