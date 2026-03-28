import { apiSlice } from "./apiSlice";

export interface Follow {
  id: number;
  follower_id: number;
  seller_id: number;
  created_at: string;
}

/** Matches backend GET /social/seller/{id}/stats */
export interface SellerStats {
  seller_id: number;
  followers_count: number;
  active_listings_count: number;
  total_shares: number;
  is_following: boolean;
}

/** Matches backend ListingShareResponse */
export interface Share {
  id: number;
  listing_id: number;
  shared_by_id: number | null;
  share_platform: string;
  share_method: string;
  created_at: string;
}

export interface ShareCreateRequest {
  listing_id: number;
  share_platform: string;
  share_method: string;
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
        url: "/social/follow",
        method: "POST",
        body: { seller_id: sellerId },
      }),
      invalidatesTags: (result, error, sellerId) => [
        { type: "User", id: sellerId },
        "User",
      ],
    }),
    unfollowSeller: builder.mutation<void, number>({
      query: (sellerId) => ({
        url: `/social/follow/${sellerId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, sellerId) => [
        { type: "User", id: sellerId },
        "User",
      ],
    }),
    getFollowing: builder.query<Follow[], PaginationParams>({
      query: (params) => ({
        url: "/social/following",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    getFollowers: builder.query<
      Follow[],
      { sellerId: number; params?: PaginationParams }
    >({
      query: ({ sellerId, params }) => ({
        url: `/social/followers/${sellerId}`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { sellerId }) => [
        { type: "User", id: sellerId },
      ],
    }),
    checkFollowing: builder.query<
      { is_following: boolean; seller_id: number },
      number
    >({
      query: (sellerId) => ({
        url: `/social/following/check/${sellerId}`,
        method: "GET",
      }),
      providesTags: (result, error, sellerId) => [
        { type: "User", id: sellerId },
      ],
    }),
    getSellerStats: builder.query<SellerStats, number>({
      query: (sellerId) => ({
        url: `/social/seller/${sellerId}/stats`,
        method: "GET",
      }),
      providesTags: (result, error, sellerId) => [
        { type: "User", id: sellerId },
      ],
    }),

    // Shares
    trackShare: builder.mutation<Share, ShareCreateRequest>({
      query: (data) => ({
        url: "/social/shares",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { listing_id }) => [
        { type: "User", id: `listing-${listing_id}` },
        "User",
      ],
    }),
    getShares: builder.query<
      Share[],
      {
        skip?: number;
        limit?: number;
        listing_id?: number;
        share_platform?: string;
      }
    >({
      query: (params) => ({
        url: "/social/shares",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    getShare: builder.query<Share, number>({
      query: (id) => ({
        url: `/social/shares/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "User", id: `share-${id}` },
        "User",
      ],
    }),
    getListingShareStats: builder.query<ShareStats, number>({
      query: (listingId) => ({
        url: `/social/listings/${listingId}/share-stats`,
        method: "GET",
      }),
      providesTags: (result, error, listingId) => [
        { type: "User", id: `listing-${listingId}` },
        "User",
      ],
    }),
    deleteShare: builder.mutation<void, number>({
      query: (id) => ({
        url: `/social/shares/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
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
