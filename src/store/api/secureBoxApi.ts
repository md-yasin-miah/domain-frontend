/**
 * Secure Box API
 *
 * Overview (aligned with backend secure_box router):
 * - Secure box is 1:1 with Order. Created by seller after order is payment_received.
 * - Flow: Order paid → Seller creates secure box (content) → Admin approves/rejects →
 *   If approved, buyer can request OTP → verify OTP → access content (status becomes 'accessed').
 *
 * Relations:
 * - SecureBox.order_id → Order (one secure box per order)
 * - SecureBox.buyer_id, seller_id → User
 * - Create allowed only when order.status === 'payment_received'
 * - Update (content) allowed only when status is 'pending' or 'rejected'
 * - Request OTP / Verify OTP only when status === 'approved' (buyer only for content access)
 *
 * Endpoints:
 * - Order-scoped (buyer/seller/admin by role): get, create, update, update-payment-status, request-otp, verify-otp
 * - Admin only: list (all), pending, approve
 */
import { apiSlice } from './apiSlice';

export interface SecureBoxUserInfo {
  id: number;
  username: string;
  email: string;
}

export interface SecureBoxOrderInfo {
  id: number;
  order_number: string;
  status: string;
}

export interface SecureBoxItem {
  id: number;
  order_id: number;
  buyer_id: number;
  seller_id: number;
  status: string;
  reviewed_by_id: number | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  accessed_at: string | null;
  access_count: number;
  created_at: string;
  updated_at: string;
  content: string | null;
  order?: SecureBoxOrderInfo;
  buyer?: SecureBoxUserInfo;
  seller?: SecureBoxUserInfo;
}

export interface SecureBoxListParams {
  skip?: number;
  limit?: number;
  status?: string;
}

export interface SecureBoxListResponse {
  items: SecureBoxItem[];
  pagination: {
    total: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
    has_next?: boolean;
    has_previous?: boolean;
  };
}

/** GET /secure-box/orders/{order_id} */
export interface SecureBoxByOrderResponse {
  secure_box: SecureBoxItem | null;
  secure_box_available: boolean;
  can_view_content?: boolean;
  already_accessed?: boolean;
  message?: string;
}

/** POST /secure-box/orders/{order_id} - body */
export interface SecureBoxCreateRequest {
  content: string;
}

/** POST create response */
export interface SecureBoxCreateResponse {
  secure_box: SecureBoxItem;
  message: string;
}

/** PUT /secure-box/orders/{order_id} - body */
export interface SecureBoxUpdateRequest {
  content?: string | null;
}

/** PUT update response */
export interface SecureBoxUpdateResponse {
  secure_box: SecureBoxItem;
  message: string;
}

/** POST /secure-box/orders/{order_id}/update-payment-status - body */
export interface OrderPaymentStatusUpdateRequest {
  order_id: number;
  payment_status: 'paid' | 'pending' | 'failed';
  payment_transaction_id?: string | null;
  payment_method?: string | null;
}

export interface OrderPaymentStatusUpdateResponse {
  order_id: number;
  order_number: string;
  payment_status: string;
  order_status: string;
  secure_box_available: boolean;
  message: string;
}

/** POST /secure-box/orders/{order_id}/request-otp response */
export interface SecureBoxRequestOtpResponse {
  order_id: number;
  message: string;
  expires_in_minutes?: number;
  expires_at?: string;
  already_accessed?: boolean;
}

/** POST /secure-box/orders/{order_id}/verify-otp - body */
export interface SecureBoxVerifyOtpRequest {
  order_id: number;
  otp_code: string;
}

/** POST verify-otp response (content revealed) */
export interface SecureBoxContentResponse {
  content: string;
  accessed_at: string;
  access_count: number;
}

export interface SecureBoxApproveRequest {
  status: 'approved' | 'rejected';
  admin_notes?: string | null;
  rejection_reason?: string | null;
}

export interface SecureBoxApproveResponse {
  secure_box: SecureBoxItem;
  message: string;
}

export const secureBoxApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Admin ----------
    getSecureBoxList: builder.query<
      SecureBoxListResponse,
      SecureBoxListParams | void
    >({
      query: (params) => {
        const p = (params ?? {}) as SecureBoxListParams;
        return {
          url: '/secure-box/admin/list',
          method: 'GET',
          params: {
            skip: p.skip ?? 0,
            limit: p.limit ?? 50,
            ...(p.status && { status: p.status }),
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map((item) => ({ type: 'SecureBox' as const, id: item.id })),
              { type: 'SecureBox', id: 'LIST' },
            ]
          : [{ type: 'SecureBox', id: 'LIST' }],
    }),
    getPendingSecureBoxes: builder.query<
      SecureBoxListResponse,
      { skip?: number; limit?: number }
    >({
      query: (params) => ({
        url: '/secure-box/admin/pending',
        method: 'GET',
        params: { skip: params.skip ?? 0, limit: params.limit ?? 50 },
      }),
      providesTags: ['SecureBox'],
    }),
    approveSecureBox: builder.mutation<
      SecureBoxApproveResponse,
      { orderId: number; data: SecureBoxApproveRequest }
    >({
      query: ({ orderId, data }) => ({
        url: `/secure-box/orders/${orderId}/approve`,
        method: 'POST',
        body: {
          status: data.status,
          admin_notes: data.admin_notes ?? undefined,
          rejection_reason: data.rejection_reason ?? undefined,
        },
      }),
      invalidatesTags: ['SecureBox', 'User'],
    }),

    // ---------- Order-scoped (buyer/seller/admin by backend rules) ----------
    getSecureBoxByOrder: builder.query<SecureBoxByOrderResponse, number>({
      query: (orderId) => ({
        url: `/secure-box/orders/${orderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, orderId) => [
        { type: 'SecureBox', id: `order-${orderId}` },
      ],
    }),
    createSecureBox: builder.mutation<
      SecureBoxCreateResponse,
      { orderId: number; data: SecureBoxCreateRequest }
    >({
      query: ({ orderId, data }) => ({
        url: `/secure-box/orders/${orderId}`,
        method: 'POST',
        body: { order_id: orderId, content: data.content },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'SecureBox', id: `order-${orderId}` },
        'SecureBox',
      ],
    }),
    updateSecureBox: builder.mutation<
      SecureBoxUpdateResponse,
      { orderId: number; data: SecureBoxUpdateRequest }
    >({
      query: ({ orderId, data }) => ({
        url: `/secure-box/orders/${orderId}`,
        method: 'PUT',
        body: data.content !== undefined ? { content: data.content } : {},
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'SecureBox', id: `order-${orderId}` },
        'SecureBox',
      ],
    }),
    updateOrderPaymentStatus: builder.mutation<
      OrderPaymentStatusUpdateResponse,
      { orderId: number; data: OrderPaymentStatusUpdateRequest }
    >({
      query: ({ orderId, data }) => ({
        url: `/secure-box/orders/${orderId}/update-payment-status`,
        method: 'POST',
        body: { ...data, order_id: orderId },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'SecureBox', id: `order-${orderId}` },
        'Order',
      ],
    }),
    requestSecureBoxOtp: builder.mutation<
      SecureBoxRequestOtpResponse,
      number
    >({
      query: (orderId) => ({
        url: `/secure-box/orders/${orderId}/request-otp`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'SecureBox', id: `order-${orderId}` },
      ],
    }),
    verifySecureBoxOtp: builder.mutation<
      SecureBoxContentResponse,
      { orderId: number; data: SecureBoxVerifyOtpRequest }
    >({
      query: ({ orderId, data }) => ({
        url: `/secure-box/orders/${orderId}/verify-otp`,
        method: 'POST',
        body: { order_id: orderId, otp_code: data.otp_code },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'SecureBox', id: `order-${orderId}` },
      ],
    }),
  }),
});

export const {
  useGetSecureBoxListQuery,
  useGetPendingSecureBoxesQuery,
  useApproveSecureBoxMutation,
  useGetSecureBoxByOrderQuery,
  useCreateSecureBoxMutation,
  useUpdateSecureBoxMutation,
  useUpdateOrderPaymentStatusMutation,
  useRequestSecureBoxOtpMutation,
  useVerifySecureBoxOtpMutation,
} = secureBoxApi;
