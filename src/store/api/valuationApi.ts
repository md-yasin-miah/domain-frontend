import { apiSlice } from './apiSlice';
import type { PaginatedResponse, PaginationParams } from './types';

export interface Valuation {
  id: number;
  domain_name: string;
  estimated_value: number;
  currency: string;
  valuation_method: string;
  factors: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ValuationCreateRequest {
  domain_name: string;
  estimated_value: number;
  currency?: string;
  valuation_method?: string;
  factors?: Record<string, any>;
}

export interface ValuationCalculateRequest {
  domain_name: string;
  factors?: Record<string, any>;
}

export interface ValuationCalculateResponse {
  estimated_value: number;
  currency: string;
  factors: Record<string, any>;
}

export interface ComparableSale {
  id: number;
  domain_name: string;
  sale_price: number;
  sale_date: string;
  currency: string;
  created_at: string;
}

export interface ComparableSaleCreateRequest {
  domain_name: string;
  sale_price: number;
  sale_date: string;
  currency?: string;
}

export interface MarketTrend {
  id: number;
  category: string;
  trend_data: Record<string, any>;
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface MarketTrendCreateRequest {
  category: string;
  trend_data: Record<string, any>;
  period_start: string;
  period_end: string;
}

export const valuationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Valuations
    getValuations: builder.query<PaginatedResponse<Valuation> | Valuation[], PaginationParams>({
      query: (params) => ({
        url: '/valuations',
        method: 'GET',
        params,
      }),
      providesTags: ['Domain'],
    }),
    getValuation: builder.query<Valuation, number>({
      query: (id) => ({
        url: `/valuations/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    createValuation: builder.mutation<Valuation, ValuationCreateRequest>({
      query: (data) => ({
        url: '/valuations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    calculateValuation: builder.mutation<ValuationCalculateResponse, ValuationCalculateRequest>({
      query: (data) => ({
        url: '/valuations/calculate',
        method: 'POST',
        body: data,
      }),
    }),
    updateValuation: builder.mutation<Valuation, { id: number; data: Partial<ValuationCreateRequest> }>({
      query: ({ id, data }) => ({
        url: `/valuations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    deleteValuation: builder.mutation<void, number>({
      query: (id) => ({
        url: `/valuations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),

    // Comparable Sales
    getComparableSales: builder.query<PaginatedResponse<ComparableSale> | ComparableSale[], PaginationParams>({
      query: (params) => ({
        url: '/valuations/comparable-sales',
        method: 'GET',
        params,
      }),
      providesTags: ['Domain'],
    }),
    getComparableSale: builder.query<ComparableSale, number>({
      query: (id) => ({
        url: `/valuations/comparable-sales/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    createComparableSale: builder.mutation<ComparableSale, ComparableSaleCreateRequest>({
      query: (data) => ({
        url: '/valuations/comparable-sales',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    updateComparableSale: builder.mutation<ComparableSale, { id: number; data: Partial<ComparableSaleCreateRequest> }>({
      query: ({ id, data }) => ({
        url: `/valuations/comparable-sales/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    deleteComparableSale: builder.mutation<void, number>({
      query: (id) => ({
        url: `/valuations/comparable-sales/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),

    // Market Trends
    getMarketTrends: builder.query<PaginatedResponse<MarketTrend> | MarketTrend[], PaginationParams>({
      query: (params) => ({
        url: '/valuations/market-trends',
        method: 'GET',
        params,
      }),
      providesTags: ['Domain'],
    }),
    getMarketTrend: builder.query<MarketTrend, number>({
      query: (id) => ({
        url: `/valuations/market-trends/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    createMarketTrend: builder.mutation<MarketTrend, MarketTrendCreateRequest>({
      query: (data) => ({
        url: '/valuations/market-trends',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    updateMarketTrend: builder.mutation<MarketTrend, { id: number; data: Partial<MarketTrendCreateRequest> }>({
      query: ({ id, data }) => ({
        url: `/valuations/market-trends/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    deleteMarketTrend: builder.mutation<void, number>({
      query: (id) => ({
        url: `/valuations/market-trends/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),
  }),
});

export const {
  useGetValuationsQuery,
  useGetValuationQuery,
  useCreateValuationMutation,
  useCalculateValuationMutation,
  useUpdateValuationMutation,
  useDeleteValuationMutation,
  useGetComparableSalesQuery,
  useGetComparableSaleQuery,
  useCreateComparableSaleMutation,
  useUpdateComparableSaleMutation,
  useDeleteComparableSaleMutation,
  useGetMarketTrendsQuery,
  useGetMarketTrendQuery,
  useCreateMarketTrendMutation,
  useUpdateMarketTrendMutation,
  useDeleteMarketTrendMutation,
} = valuationApi;

