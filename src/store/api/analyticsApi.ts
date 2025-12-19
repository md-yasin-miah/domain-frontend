import { apiSlice } from './apiSlice';

export interface ListingStats {
  listing_id: number;
  total_views: number;
  total_favorites: number;
  total_offers: number;
  total_orders: number;
  conversion_rate: number;
  average_offer_amount: number | null;
}

export interface SellerDashboardStats {
  seller_id: number;
  total_listings: number;
  active_listings: number;
  total_views: number;
  total_favorites: number;
  total_orders: number;
  total_revenue: number;
  average_listing_price: number;
  conversion_rate: number;
}

export interface AdminOverviewStats {
  total_users: number;
  active_users: number;
  total_listings: number;
  active_listings: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  active_disputes: number;
  platform_fees: number;
  recent_activity: any[];
}

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListingStats: builder.query<ListingStats, number>({
      query: (listingId) => ({
        url: `/analytics/listings/${listingId}/stats`,
        method: 'GET',
      }),
      providesTags: (result, error, listingId) => [{ type: 'Domain', id: listingId }],
    }),
    getSellerDashboard: builder.query<SellerDashboardStats, number>({
      query: (sellerId) => ({
        url: `/analytics/seller/${sellerId}/dashboard`,
        method: 'GET',
      }),
      providesTags: (result, error, sellerId) => [{ type: 'User', id: sellerId }],
    }),
    getAdminOverview: builder.query<AdminOverviewStats, void>({
      query: () => ({
        url: '/analytics/admin/overview',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetListingStatsQuery,
  useGetSellerDashboardQuery,
  useGetAdminOverviewQuery,
} = analyticsApi;

