import { apiSlice } from './apiSlice';

export interface BulkStatusUpdateRequest {
  listing_ids: number[];
  status: 'draft' | 'active' | 'sold' | 'expired' | 'suspended';
}

export interface BulkDeleteRequest {
  listing_ids: number[];
}

export interface BulkFeatureRequest {
  listing_ids: number[];
  featured: boolean;
}

export interface BulkOperationResponse {
  success: boolean;
  updated_count: number;
  failed_count: number;
  errors?: string[];
}

export const bulkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    bulkUpdateListingStatus: builder.mutation<BulkOperationResponse, BulkStatusUpdateRequest>({
      query: (data) => ({
        url: '/bulk/listings/status',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    bulkDeleteListings: builder.mutation<BulkOperationResponse, BulkDeleteRequest>({
      query: (data) => ({
        url: '/bulk/listings/delete',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    bulkFeatureListings: builder.mutation<BulkOperationResponse, BulkFeatureRequest>({
      query: (data) => ({
        url: '/bulk/listings/feature',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
  }),
});

export const {
  useBulkUpdateListingStatusMutation,
  useBulkDeleteListingsMutation,
  useBulkFeatureListingsMutation,
} = bulkApi;

