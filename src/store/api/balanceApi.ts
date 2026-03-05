/**
 * Balance API: GET /balance?currency=USD
 * Returns user balance (total_earned, available_balance, pending_balance, etc.)
 */
import { apiSlice } from './apiSlice';

export interface BalanceResponse {
  currency: string;
  wallet_balance: number | string;
  earnings_available: number | string;
  total_balance: number | string;
  total_earned: number | string;
  total_withdrawn: number | string;
  pending_balance: number | string;
  pending_withdrawal: number | string;
}

export const balanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBalance: builder.query<BalanceResponse, string | void>({
      query: (currency = 'USD') => ({
        url: '/balance',
        method: 'GET',
        params: { currency },
      }),
      providesTags: ['Balance'],
    }),
  }),
});

export const { useGetBalanceQuery } = balanceApi;
