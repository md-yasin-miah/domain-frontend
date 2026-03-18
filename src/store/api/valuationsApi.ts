import { apiSlice } from "./apiSlice";
export const valuationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAutoValuation: builder.query<AutoValuationResponse, AutoValuationParams>(
      {
        query: (params) => ({
          url: "/valuations/auto",
          method: "GET",
          params,
        }),
      },
    ),
    getValuations: builder.query<Valuation[], ValuationFilters>({
      query: (params) => ({
        url: "/valuations",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    getValuation: builder.query<Valuation, number>({
      query: (id) => ({ url: `/valuations/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [
        { type: "User", id: `valuation-${id}` },
        "User",
      ],
    }),
    createValuation: builder.mutation<Valuation, Record<string, unknown>>({
      query: (data) => ({ url: "/valuations", method: "POST", body: data }),
      invalidatesTags: ["User"],
    }),
    calculateValuation: builder.mutation<Valuation, ValuationCalculateParams>({
      query: (params) => ({
        url: "/valuations/calculate",
        method: "POST",
        params,
      }),
      invalidatesTags: ["User"],
    }),
    updateValuation: builder.mutation<
      Valuation,
      { id: number; data: ValuationUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/valuations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `valuation-${id}` },
        "User",
      ],
    }),
    deleteValuation: builder.mutation<void, number>({
      query: (id) => ({ url: `/valuations/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),

    getComparableSales: builder.query<ComparableSale[], ComparableSaleFilters>({
      query: (params) => ({
        url: "/valuations/comparable-sales",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    getComparableSale: builder.query<ComparableSale, number>({
      query: (id) => ({
        url: `/valuations/comparable-sales/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "User", id: `comparable-${id}` },
        "User",
      ],
    }),
    createComparableSale: builder.mutation<
      ComparableSale,
      ComparableSaleCreateRequest
    >({
      query: (data) => ({
        url: "/valuations/comparable-sales",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateComparableSale: builder.mutation<
      ComparableSale,
      { id: number; data: ComparableSaleUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/valuations/comparable-sales/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `comparable-${id}` },
        "User",
      ],
    }),
    deleteComparableSale: builder.mutation<void, number>({
      query: (id) => ({
        url: `/valuations/comparable-sales/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    getMarketTrends: builder.query<MarketTrend[], MarketTrendFilters>({
      query: (params) => ({
        url: "/valuations/market-trends",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    getMarketTrend: builder.query<MarketTrend, number>({
      query: (id) => ({
        url: `/valuations/market-trends/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "User", id: `trend-${id}` },
        "User",
      ],
    }),
    createMarketTrend: builder.mutation<MarketTrend, MarketTrendCreateRequest>({
      query: (data) => ({
        url: "/valuations/market-trends",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateMarketTrend: builder.mutation<
      MarketTrend,
      { id: number; data: MarketTrendUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/valuations/market-trends/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id: `trend-${id}` },
        "User",
      ],
    }),
    deleteMarketTrend: builder.mutation<void, number>({
      query: (id) => ({
        url: `/valuations/market-trends/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getMarketTrendsInsights: builder.query<
      MarketTrendInsightsResponse,
      MarketTrendInsightsParams | void
    >({
      query: (params) => ({
        url: "/valuations/market-trends/insights",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetAutoValuationQuery,
  useLazyGetAutoValuationQuery,
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
} = valuationsApi;
