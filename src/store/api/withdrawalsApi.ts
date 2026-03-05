/**
 * Withdrawals API: seller balance (earnings), request withdrawal, list my withdrawals.
 * Admin: list all, get one, update status (approve / reject / complete).
 */
import { apiSlice } from "./apiSlice";

export interface WithdrawalBalanceResponse {
  currency: string;
  wallet_balance: number;
  earnings_available: number;
  total_balance: number;
  total_earned: number;
  total_withdrawn: number;
  pending_balance: number;
  pending_withdrawal: number;
}

export interface WithdrawalUserInfo {
  id: number;
  username: string;
  email: string;
}

export interface WithdrawalItem {
  id: number;
  user_id: number;
  amount: number | string;
  currency: string;
  status: string;
  payout_method: string | null;
  payout_details: string | null;
  commission: number | string | null;
  net_amount: number | string | null;
  requested_at: string;
  processed_at: string | null;
  processed_by_id: number | null;
  admin_notes: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  user?: WithdrawalUserInfo;
  processed_by?: WithdrawalUserInfo;
}

export interface WithdrawalCreateRequest {
  amount: number;
  currency?: string;
  payout_method?: string;
  payout_details?: Record<string, unknown>;
}

export interface WithdrawalCreateResponse {
  withdrawal: WithdrawalItem;
  message: string;
}

export interface WithdrawalStatusUpdateRequest {
  status: "approved" | "rejected" | "completed";
  admin_notes?: string | null;
  rejection_reason?: string | null;
}

export interface WithdrawalStatusUpdateResponse {
  withdrawal: WithdrawalItem;
  message: string;
}

export interface PaginatedWithdrawalsResponse {
  items: WithdrawalItem[];
  pagination: {
    total: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
    has_next?: boolean;
    has_previous?: boolean;
  };
}

export const withdrawalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ----- User (seller) -----
    getWithdrawalBalance: builder.query<WithdrawalBalanceResponse, string | void>({
      query: (currency = "USD") => ({
        url: "/withdrawals/balance",
        method: "GET",
        params: { currency },
      }),
      providesTags: ["Withdrawal", "Wallet"],
    }),
    createWithdrawal: builder.mutation<
      WithdrawalCreateResponse,
      WithdrawalCreateRequest
    >({
      query: (body) => ({
        url: "/withdrawals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Withdrawal", "Wallet"],
    }),
    listMyWithdrawals: builder.query<
      PaginatedWithdrawalsResponse,
      { skip?: number; limit?: number; status?: string }
    >({
      query: (params) => ({
        url: "/withdrawals",
        method: "GET",
        params: {
          skip: params.skip ?? 0,
          limit: params.limit ?? 50,
          ...(params.status && { status: params.status }),
        },
      }),
      providesTags: ["Withdrawal"],
    }),

    // ----- Admin -----
    adminListWithdrawals: builder.query<
      PaginatedWithdrawalsResponse,
      { skip?: number; limit?: number; status?: string }
    >({
      query: (params) => ({
        url: "/withdrawals/admin/list",
        method: "GET",
        params: {
          skip: params.skip ?? 0,
          limit: params.limit ?? 50,
          ...(params.status && { status: params.status }),
        },
      }),
      providesTags: ["Withdrawal"],
    }),
    adminGetWithdrawal: builder.query<WithdrawalItem, number>({
      query: (id) => ({
        url: `/withdrawals/admin/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Withdrawal", id }],
    }),
    adminUpdateWithdrawal: builder.mutation<
      WithdrawalStatusUpdateResponse,
      { withdrawalId: number; data: WithdrawalStatusUpdateRequest }
    >({
      query: ({ withdrawalId, data }) => ({
        url: `/withdrawals/admin/${withdrawalId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Withdrawal"],
    }),
  }),
});

export const {
  useGetWithdrawalBalanceQuery,
  useCreateWithdrawalMutation,
  useListMyWithdrawalsQuery,
  useAdminListWithdrawalsQuery,
  useAdminGetWithdrawalQuery,
  useAdminUpdateWithdrawalMutation,
} = withdrawalsApi;
