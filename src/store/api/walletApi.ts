/**
 * Wallet API: GET /wallet, POST /wallet/add-fund, GET /wallet/transactions
 */
import { apiSlice } from './apiSlice';

export interface WalletResponse {
  currency: string;
  balance: number | string;
  updated_at: string | null;
}

export interface AddFundPayload {
  amount: number;
  currency?: string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface WalletTransaction {
  id: number;
  user_id: number;
  amount: number | string;
  currency: string;
  type: string;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  created_at: string;
}

export interface WalletTransactionsResponse {
  items: WalletTransaction[];
  pagination: {
    total: number;
    page?: number;
    page_size?: number;
    total_pages?: number;
    has_next?: boolean;
    has_previous?: boolean;
  };
}

export const walletApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWallet: builder.query<WalletResponse, string | void>({
      query: (currency = 'USD') => ({
        url: '/wallet',
        method: 'GET',
        params: { currency },
      }),
      providesTags: ['Wallet'],
    }),
    addFund: builder.mutation<PaymentIntentResponse, AddFundPayload>({
      query: (body) => ({
        url: '/wallet/add-fund',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wallet'],
    }),
    getWalletTransactions: builder.query<
      WalletTransactionsResponse,
      {
        currency?: string;
        type?: string;
        skip?: number;
        limit?: number;
      } | void
    >({
      query: (params) => {
        const p = (params ?? {}) as {
          currency?: string;
          type?: string;
          skip?: number;
          limit?: number;
        };
        const skip = p.skip ?? 0;
        const limit = Math.min(Math.max(p.limit ?? 20, 1), 100);
        const queryParams: Record<string, string | number> = { skip, limit };
        if (p.currency?.trim()) queryParams.currency = p.currency.trim();
        if (p.type?.trim()) queryParams.type = p.type.trim();
        return {
          url: '/wallet/transactions',
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: ['Wallet'],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useAddFundMutation,
  useGetWalletTransactionsQuery,
} = walletApi;
