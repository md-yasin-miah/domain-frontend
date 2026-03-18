import { apiSlice } from './apiSlice';
import type { PaginationParams } from './types';

/** Matches backend ValuationResponse */
export interface Valuation {
  id: number;
  listing_id: number | null;
  valuation_type: string;
  domain_name: string | null;
  domain_extension: string | null;
  estimated_value: number;
  min_estimate: number | null;
  max_estimate: number | null;
  currency: string;
  domain_length_score: number | null;
  domain_age_years: number | null;
  domain_authority_score: number | null;
  backlinks_count: number | null;
  monthly_traffic: number | null;
  monthly_revenue: number | null;
  comparable_sales_count: number;
  calculated_at: string;
  created_at: string;
  updated_at: string;
  valuation_data: Record<string, unknown> | null;
}

export interface ValuationFilters extends PaginationParams {
  listing_id?: number;
  valuation_type?: string;
}

export interface ValuationUpdateRequest {
  estimated_value?: number;
  min_estimate?: number;
  max_estimate?: number;
  valuation_data?: Record<string, unknown>;
}

/** Matches backend ComparableSaleResponse */
export interface ComparableSale {
  id: number;
  domain_name: string;
  domain_extension: string;
  sale_price: number;
  currency: string;
  sale_date: string;
  sale_source: string | null;
  buyer_type: string | null;
  domain_length: number | null;
  domain_age_years: number | null;
  has_numbers: boolean;
  has_hyphens: boolean;
  created_at: string;
}

export interface ComparableSaleCreateRequest {
  domain_name: string;
  domain_extension: string;
  sale_price: number;
  currency?: string;
  sale_date: string;
  sale_source?: string | null;
  buyer_type?: string | null;
  domain_age_years?: number | null;
}

export interface ComparableSaleFilters extends PaginationParams {
  domain_extension?: string;
  min_price?: number;
  max_price?: number;
}

export interface ComparableSaleUpdateRequest {
  sale_price?: number;
  sale_date?: string;
  sale_source?: string | null;
  buyer_type?: string | null;
}

/** Matches backend MarketTrendResponse */
export interface MarketTrend {
  id: number;
  trend_type: string;
  trend_key: string;
  period_start: string;
  period_end: string;
  average_sale_price: number;
  median_sale_price: number;
  total_sales_count: number;
  total_sales_volume: number;
  price_change_percentage: number | null;
  sales_count_change_percentage: number | null;
  currency: string;
  trend_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface MarketTrendFilters extends PaginationParams {
  trend_type?: string;
  trend_key?: string;
}

export interface MarketTrendCreateRequest {
  trend_type: string;
  trend_key: string;
  period_start: string;
  period_end: string;
  average_sale_price: number;
  median_sale_price: number;
  total_sales_count: number;
  total_sales_volume: number;
  price_change_percentage?: number | null;
  sales_count_change_percentage?: number | null;
  currency?: string;
  trend_data?: Record<string, unknown> | null;
}

export interface MarketTrendUpdateRequest {
  average_sale_price?: number;
  median_sale_price?: number;
  total_sales_count?: number;
  total_sales_volume?: number;
  price_change_percentage?: number | null;
  sales_count_change_percentage?: number | null;
  trend_data?: Record<string, unknown> | null;
}

/** GET /valuations/market-trends/insights */
export interface MarketTrendInsightsResponse {
  summary: string;
  key_trends: string[];
  extension_highlights: { extension: string; insight: string }[];
  recommendations: string[];
  generated_at: string;
  data_used?: Record<string, unknown> | null;
}

export interface MarketTrendInsightsParams {
  limit_sales?: number;
  limit_trends?: number;
  include_data_used?: boolean;
}

/** Params for POST /valuations/calculate (query params) */
export interface ValuationCalculateParams {
  domain_name: string;
  domain_extension: string;
  domain_age_years?: number;
  domain_authority_score?: number;
  backlinks_count?: number;
  monthly_traffic?: number;
  monthly_revenue?: number;
}

export const valuationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getValuations: builder.query<Valuation[], ValuationFilters>({
      query: (params) => ({
        url: '/valuations',
        method: 'GET',
        params: {
          skip: params.skip,
          limit: params.limit,
          ...(params.listing_id != null && { listing_id: params.listing_id }),
          ...(params.valuation_type && { valuation_type: params.valuation_type }),
        },
      }),
      providesTags: ['User'],
    }),
    getValuation: builder.query<Valuation, number>({
      query: (id) => ({ url: `/valuations/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'User', id: `valuation-${id}` }, 'User'],
    }),
    createValuation: builder.mutation<Valuation, Record<string, unknown>>({
      query: (data) => ({ url: '/valuations', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    calculateValuation: builder.mutation<Valuation, ValuationCalculateParams>({
      query: (params) => ({
        url: '/valuations/calculate',
        method: 'POST',
        params: {
          domain_name: params.domain_name,
          domain_extension: params.domain_extension,
          ...(params.domain_age_years != null && { domain_age_years: params.domain_age_years }),
          ...(params.domain_authority_score != null && { domain_authority_score: params.domain_authority_score }),
          ...(params.backlinks_count != null && { backlinks_count: params.backlinks_count }),
          ...(params.monthly_traffic != null && { monthly_traffic: params.monthly_traffic }),
          ...(params.monthly_revenue != null && { monthly_revenue: params.monthly_revenue }),
        },
      }),
      invalidatesTags: ['User'],
    }),
    updateValuation: builder.mutation<Valuation, { id: number; data: ValuationUpdateRequest }>({
      query: ({ id, data }) => ({ url: `/valuations/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id: `valuation-${id}` }, 'User'],
    }),
    deleteValuation: builder.mutation<void, number>({
      query: (id) => ({ url: `/valuations/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),

    getComparableSales: builder.query<ComparableSale[], ComparableSaleFilters>({
      query: (params) => ({
        url: '/valuations/comparable-sales',
        method: 'GET',
        params: {
          skip: params.skip,
          limit: params.limit,
          ...(params.domain_extension && { domain_extension: params.domain_extension }),
          ...(params.min_price != null && { min_price: params.min_price }),
          ...(params.max_price != null && { max_price: params.max_price }),
        },
      }),
      providesTags: ['User'],
    }),
    getComparableSale: builder.query<ComparableSale, number>({
      query: (id) => ({ url: `/valuations/comparable-sales/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'User', id: `comparable-${id}` }, 'User'],
    }),
    createComparableSale: builder.mutation<ComparableSale, ComparableSaleCreateRequest>({
      query: (data) => ({ url: '/valuations/comparable-sales', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    updateComparableSale: builder.mutation<ComparableSale, { id: number; data: ComparableSaleUpdateRequest }>({
      query: ({ id, data }) => ({ url: `/valuations/comparable-sales/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id: `comparable-${id}` }, 'User'],
    }),
    deleteComparableSale: builder.mutation<void, number>({
      query: (id) => ({ url: `/valuations/comparable-sales/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),

    getMarketTrends: builder.query<MarketTrend[], MarketTrendFilters>({
      query: (params) => ({
        url: '/valuations/market-trends',
        method: 'GET',
        params: {
          skip: params.skip,
          limit: params.limit,
          ...(params.trend_type && { trend_type: params.trend_type }),
          ...(params.trend_key && { trend_key: params.trend_key }),
        },
      }),
      providesTags: ['User'],
    }),
    getMarketTrend: builder.query<MarketTrend, number>({
      query: (id) => ({ url: `/valuations/market-trends/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'User', id: `trend-${id}` }, 'User'],
    }),
    createMarketTrend: builder.mutation<MarketTrend, MarketTrendCreateRequest>({
      query: (data) => ({ url: '/valuations/market-trends', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    updateMarketTrend: builder.mutation<MarketTrend, { id: number; data: MarketTrendUpdateRequest }>({
      query: ({ id, data }) => ({ url: `/valuations/market-trends/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id: `trend-${id}` }, 'User'],
    }),
    deleteMarketTrend: builder.mutation<void, number>({
      query: (id) => ({ url: `/valuations/market-trends/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    getMarketTrendsInsights: builder.query<MarketTrendInsightsResponse, MarketTrendInsightsParams | void>({
      query: (params) => ({
        url: '/valuations/market-trends/insights',
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: ['User'],
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
  useGetMarketTrendsInsightsQuery,
} = valuationApi;
