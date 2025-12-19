import { apiSlice } from './apiSlice';
import type { Listing } from './types';

export const favoritesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFavoriteListings: builder.query<Listing[], void>({
      query: () => ({
        url: '/favorites/listings',
        method: 'GET',
      }),
      providesTags: ['Domain'],
    }),
    addToFavorites: builder.mutation<void, number>({
      query: (listingId) => ({
        url: `/favorites/listings/${listingId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Domain'],
    }),
    removeFromFavorites: builder.mutation<void, number>({
      query: (listingId) => ({
        url: `/favorites/listings/${listingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),
  }),
});

export const {
  useGetFavoriteListingsQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = favoritesApi;

