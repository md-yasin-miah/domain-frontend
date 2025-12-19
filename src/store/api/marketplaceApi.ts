import { apiSlice } from './apiSlice';
import type {
  Listing,
  ListingCreateRequest,
  ListingUpdateRequest,
  ListingFilters,
  PaginatedResponse,
} from './types';

export const marketplaceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListings: builder.query<PaginatedResponse<Listing> | Listing[], ListingFilters>({
      query: (params) => ({
        url: '/marketplace/listings',
        method: 'GET',
        params,
      }),
      providesTags: ['Domain'],
    }),
    getListing: builder.query<Listing, number>({
      query: (id) => ({
        url: `/marketplace/listings/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    createListing: builder.mutation<Listing, ListingCreateRequest>({
      query: (data) => ({
        url: '/marketplace/listings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    updateListing: builder.mutation<Listing, { id: number; data: ListingUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/marketplace/listings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    deleteListing: builder.mutation<void, number>({
      query: (id) => ({
        url: `/marketplace/listings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),
    getListingBySlug: builder.query<Listing, string>({
      query: (slug) => ({
        url: `/marketplace/listings/slug/${slug}`,
        method: 'GET',
      }),
      providesTags: (result, error, slug) => [{ type: 'Domain', id: result?.id }],
    }),
    incrementViewCount: builder.mutation<void, number>({
      query: (id) => ({
        url: `/marketplace/listings/${id}/view`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    featureListing: builder.mutation<Listing, number>({
      query: (id) => ({
        url: `/marketplace/listings/${id}/feature`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Domain', id }, 'Domain'],
    }),
    getListingTypes: builder.query<any[], void>({
      query: () => ({
        url: '/marketplace/listing-types',
        method: 'GET',
      }),
      providesTags: ['Domain'],
    }),
    createListingType: builder.mutation<any, any>({
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
  useGetListingsQuery,
  useGetListingQuery,
  useGetListingBySlugQuery,
  useCreateListingMutation,
  useUpdateListingMutation,
  useDeleteListingMutation,
  useIncrementViewCountMutation,
  useFeatureListingMutation,
  useGetListingTypesQuery,
  useCreateListingTypeMutation,
} = marketplaceApi;
