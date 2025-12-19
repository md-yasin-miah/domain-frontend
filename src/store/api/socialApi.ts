import { apiSlice } from './apiSlice';
import type { PaginatedResponse, PaginationParams } from './types';

export interface Follow {
  id: number;
  follower_id: number;
  seller_id: number;
  created_at: string;
}

export interface SellerStats {
  seller_id: number;
  followers_count: number;
  listings_count: number;
  total_sales: number;
  average_rating: number | null;
}

export interface Share {
  id: number;
  listing_id: number;
  user_id: number | null;
  platform: string;
  created_at: string;
}

export interface ShareCreateRequest {
  listing_id: number;
  platform: string;
}

export interface ShareStats {
  total_shares: number;
  shares_by_platform: Record<string, number>;
}

export const socialApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Follow/Unfollow
    followSeller: builder.mutation<Follow, number>({
      query: (sellerId) => ({
        url: '/social/follow',
        method: 'POST',
        body: { seller_id: sellerId },
      }),
      invalidatesTags: (result, error, sellerId) => [{ type: 'User', id: sellerId }, 'User'],
    }),
    unfollowSeller: builder.mutation<void, number>({
      query: (sellerId) => ({
        url: `/social/follow/${sellerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, sellerId) => [{ type: 'User', id: sellerId }, 'User'],
    }),
    getFollowing: builder.query<PaginatedResponse<Follow> | Follow[], PaginationParams>({
      query: (params) => ({
        url: '/social/following',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    getFollowers: builder.query<PaginatedResponse<Follow> | Follow[], { sellerId: number; params?: PaginationParams }>({
      query: ({ sellerId, params }) => ({
        url: `/social/followers/${sellerId}`,
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { sellerId }) => [{ type: 'User', id: sellerId }],
    }),
    checkFollowing: builder.query<{ is_following: boolean }, number>({
      query: (sellerId) => ({
        url: `/social/following/check/${sellerId}`,
        method: 'GET',
      }),
      providesTags: (result, error, sellerId) => [{ type: 'User', id: sellerId }],
    }),
    getSellerStats: builder.query<SellerStats, number>({
      query: (sellerId) => ({
        url: `/social/seller/${sellerId}/stats`,
        method: 'GET',
      }),
      providesTags: (result, error, sellerId) => [{ type: 'User', id: sellerId }],
    }),

    // Shares
    trackShare: builder.mutation<Share, ShareCreateRequest>({
      query: (data) => ({
        url: '/social/shares',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { listing_id }) => [{ type: 'Domain', id: listing_id }, 'Domain'],
    }),
    getShares: builder.query<PaginatedResponse<Share> | Share[], PaginationParams>({
      query: (params) => ({
        url: '/social/shares',
        method: 'GET',
        params,
      }),
      providesTags: ['Domain'],
    }),
    getShare: builder.query<Share, number>({
      query: (id) => ({
        url: `/social/shares/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    getListingShareStats: builder.query<ShareStats, number>({
      query: (listingId) => ({
        url: `/social/listings/${listingId}/share-stats`,
        method: 'GET',
      }),
      providesTags: (result, error, listingId) => [{ type: 'Domain', id: listingId }],
    }),
    deleteShare: builder.mutation<void, number>({
      query: (id) => ({
        url: `/social/shares/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),
  }),
});

export const {
  useFollowSellerMutation,
  useUnfollowSellerMutation,
  useGetFollowingQuery,
  useGetFollowersQuery,
  useCheckFollowingQuery,
  useGetSellerStatsQuery,
  useTrackShareMutation,
  useGetSharesQuery,
  useGetShareQuery,
  useGetListingShareStatsQuery,
  useDeleteShareMutation,
} = socialApi;

