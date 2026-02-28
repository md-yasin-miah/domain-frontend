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

/** Matches backend GET /analytics/admin/overview response */
export interface AdminOverviewStats {
  period_days: number;
  total_users: number;
  total_listings: number;
  active_listings: number;
  total_orders: number;
  completed_orders: number;
  total_revenue: number;
  total_offers: number;
  total_disputes: number;
  open_disputes: number;
}

export interface AdminOverviewParams {
  days?: number; // 1–365, default 30
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
    getAdminOverview: builder.query<AdminOverviewStats, AdminOverviewParams | void>({
      query: (params) => ({
        url: '/analytics/admin/overview',
        method: 'GET',
        params: params && typeof params === 'object' && params.days != null
          ? { days: params.days }
          : undefined,
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

