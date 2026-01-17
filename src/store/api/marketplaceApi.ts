import { apiSlice } from './apiSlice';

export interface ListingType {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  icon: string;
  created_at: string;
  updated_at: string;
}

export const marketplaceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMarketplaceListings: builder.query<PaginatedResponse<MarketplaceListing>, MarketplaceListingFilters>({
      query: (params) => ({
        url: '/marketplace/listings',
        method: 'GET',
        params,
      }),
      providesTags: ['MarketplaceListing'],
    }),
    getMyMarketListing: builder.query<PaginatedResponse<MarketplaceListing>, MarketplaceListingFilters>({
      query: (params) => ({
        url: '/marketplace/listings/my',
        method: 'GET',
        params,
      }),
      providesTags: ['MyMarketplaceListing'],
    }),
    getMarketplaceListing: builder.query<MarketplaceListing, number>({
      query: (id) => ({
        url: `/marketplace/listings/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    createMarketplaceListing: builder.mutation<MarketplaceListing, ListingCreateRequest>({
      query: (data) => ({
        url: '/marketplace/listings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    updateMarketplaceListing: builder.mutation<MarketplaceListing, { id: number; data: ListingUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/marketplace/listings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    deleteMarketplaceListing: builder.mutation<void, number>({
      query: (id) => ({
        url: `/marketplace/listings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),
    getMarketplaceListingBySlug: builder.query<MarketplaceListing, string>({
      query: (slug) => ({
        url: `/marketplace/listings/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [{ type: 'Domain', id: result?.id }],
    }),
    incrementMarketplaceViewCount: builder.mutation<void, number>({
      query: (id) => ({
        url: `/marketplace/listings/${id}/view`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    featureMarketplaceListing: builder.mutation<MarketplaceListing, number>({
      query: (id) => ({
        url: `/marketplace/listings/${id}/feature`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Domain', id }, 'Domain'],
    }),
    updateMarketplaceListingStatus: builder.mutation<MarketplaceListing, { id: number; new_status: 'active' | 'draft' }>({
      query: ({ id, new_status }) => ({
        url: `/marketplace/listings/${id}/status`,
        method: 'PATCH',
        params: { new_status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Domain', id },
        'Domain',
        'MarketplaceListing',
        'MyMarketplaceListing',
      ],
    }),
    getMarketplaceListingTypes: builder.query<ListingType[], void>({
      query: () => ({
        url: '/marketplace/listing-types',
        method: 'GET',
      }),
      providesTags: ['Domain'],
    }),
    createMarketplaceListingType: builder.mutation<any, any>({
      query: (data) => ({
        url: '/marketplace/listing-types',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
  }),
});

export const {
  useGetMarketplaceListingsQuery,
  useGetMyMarketListingQuery,
  useGetMarketplaceListingQuery,
  useGetMarketplaceListingBySlugQuery,
  useCreateMarketplaceListingMutation,
  useUpdateMarketplaceListingMutation,
  useDeleteMarketplaceListingMutation,
  useIncrementMarketplaceViewCountMutation,
  useFeatureMarketplaceListingMutation,
  useUpdateMarketplaceListingStatusMutation,
  useGetMarketplaceListingTypesQuery,
  useCreateMarketplaceListingTypeMutation,
} = marketplaceApi;
