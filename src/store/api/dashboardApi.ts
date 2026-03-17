import { apiSlice } from './apiSlice';

// Admin dashboard response shape (matches GET /dashboard/admin)
export interface AdminDashboardStats {
  total_users: number;
  total_listings: number;
  active_listings: number;
  total_orders: number;
  completed_orders: number;
  total_support_tickets: number;
  open_support_tickets: number;
  total_blog_posts: number;
  published_blog_posts: number;
  total_payments: number;
  paid_payments: number;
  total_withdrawals: number;
  pending_withdrawals: number;
  total_disputes: number;
  open_disputes: number;
  total_offers: number;
  pending_offers: number;
  total_invoices: number;
  total_reviews: number;
  revenue_in_period: number;
  period_days: number;
}

export interface AdminDashboardGraphPoint {
  date: string;
  count?: number;
  total?: number;
}

export interface AdminDashboardRecentListing {
  id: number;
  title: string;
  slug: string;
  status: string;
  price: number;
  currency: string;
  seller_id: number;
  created_at: string | null;
}

export interface AdminDashboardRecentOrder {
  id: number;
  order_number: string;
  status: string;
  final_price: number;
  currency: string;
  buyer_id: number;
  seller_id: number;
  buyer?: { id: number; username: string; email: string | null };
  seller?: { id: number; username: string; email: string | null };
  created_at: string | null;
}

export interface AdminDashboardRecentSupportTicket {
  id: number;
  title: string;
  status: string;
  created_by_id: number;
  created_by?: { id: number; username: string; email: string | null };
  assigned_to_id: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AdminDashboardRecentBlogPost {
  id: number;
  title: string;
  slug: string;
  status: string;
  author_id: number;
  author?: { id: number; username: string; email: string | null };
  view_count: number;
  published_at: string | null;
  created_at: string | null;
}

export interface AdminDashboardRecentPayment {
  id: number;
  payment_number: string;
  order_id: number;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string | null;
  paid_at: string | null;
}

export interface AdminDashboardRecentWithdrawal {
  id: number;
  user_id: number;
  user?: { id: number; username: string; email: string | null };
  amount: number;
  currency: string;
  status: string;
  requested_at: string | null;
  processed_at: string | null;
}

export interface AdminDashboardRecentInvoice {
  id: number;
  invoice_number: string;
  order_id: number;
  total_amount: number;
  currency: string;
  status: string;
  created_at: string | null;
}

export interface AdminDashboardRecentOffer {
  id: number;
  listing_id: number;
  buyer_id: number;
  amount: number;
  status: string;
  buyer?: { id: number; username: string; email: string | null };
  created_at: string | null;
}

export interface AdminDashboardRecentReview {
  id: number;
  order_id: number;
  reviewer_id: number;
  reviewee_id: number;
  rating: number;
  comment: string | null;
  is_seller_review: boolean;
  is_approved: boolean;
  reviewer?: { id: number; username: string; email: string | null };
  created_at: string | null;
}

export interface AdminDashboardRecentDispute {
  id: number;
  order_id: number;
  status: string;
  created_at: string | null;
}

export interface AdminDashboard {
  period_days: number;
  stats: AdminDashboardStats;
  graphs: {
    users: AdminDashboardGraphPoint[];
    listings: AdminDashboardGraphPoint[];
    orders: AdminDashboardGraphPoint[];
    support_tickets: AdminDashboardGraphPoint[];
    blog_posts: AdminDashboardGraphPoint[];
    payments: AdminDashboardGraphPoint[];
    withdrawals: AdminDashboardGraphPoint[];
    revenue: AdminDashboardGraphPoint[];
  };
  recent_listings: AdminDashboardRecentListing[];
  recent_orders: AdminDashboardRecentOrder[];
  recent_support_tickets: AdminDashboardRecentSupportTicket[];
  recent_blog_posts: AdminDashboardRecentBlogPost[];
  recent_payments: AdminDashboardRecentPayment[];
  recent_withdrawals: AdminDashboardRecentWithdrawal[];
  recent_invoices: AdminDashboardRecentInvoice[];
  recent_offers: AdminDashboardRecentOffer[];
  recent_reviews: AdminDashboardRecentReview[];
  recent_disputes: AdminDashboardRecentDispute[];
}

export interface AdminDashboardParams {
  days?: number;
  limit_recent?: number;
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboard, AdminDashboardParams | void>({
      query: (params) => ({
        url: '/dashboard/admin',
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: ['User'],
    }),
    getSellerDashboard: builder.query<SellerDashboard, void>({
      query: () => ({
        url: '/dashboard/seller',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getBuyerDashboard: builder.query<BuyerDashboard, void>({
      query: () => ({
        url: '/dashboard/buyer',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetSellerDashboardQuery,
  useGetBuyerDashboardQuery,
} = dashboardApi;

