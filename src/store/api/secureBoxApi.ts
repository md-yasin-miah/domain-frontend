import { apiSlice } from './apiSlice';
import type { PaginationParams } from './types';

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

export interface SecureBoxPendingResponse {
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
    getPendingSecureBoxes: builder.query<
      SecureBoxPendingResponse,
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
  }),
});

export const {
  useGetPendingSecureBoxesQuery,
  useApproveSecureBoxMutation,
} = secureBoxApi;
