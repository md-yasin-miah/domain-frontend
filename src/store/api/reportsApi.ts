/**
 * Admin reports API. All endpoints require admin role.
 * Query param: days (default 30, 1–365).
 */
import { apiSlice } from "./apiSlice";

export interface ReportOverview {
  period_days: number;
  users: { total: number; new_in_period: number };
  listings: { total: number; active: number; new_in_period: number };
  orders: { total: number; completed: number };
  revenue: {
    platform_fee_in_period: number;
    gmv_in_period: number;
  };
  alerts: {
    open_disputes: number;
    open_support_tickets: number;
    pending_withdrawals: number;
  };
}

export interface ReportRevenue {
  period_days: number;
  total_platform_fee: number;
  total_gmv: number;
  by_day: Array<{ date: string; platform_fee: number; gmv: number }>;
}

export interface ReportUsers {
  period_days: number;
  total_users: number;
  active_users: number;
  new_registrations_in_period: number;
  registrations_by_day: Array<{ date: string; count: number }>;
  by_role: Array<{ role: string; count: number }>;
}

export interface ReportListings {
  period_days: number;
  total_listings: number;
  by_status: Array<{ status: string; count: number }>;
  by_listing_type: Array<{ listing_type: string; count: number }>;
  new_listings_by_day: Array<{ date: string; count: number }>;
}

export interface ReportOrders {
  period_days: number;
  total_orders: number;
  by_status: Array<{ status: string; count: number }>;
  all_time: { gmv: number; platform_fee: number };
  in_period: { gmv: number; platform_fee: number };
  orders_by_day: Array<{ date: string; count: number }>;
}

export interface ReportPayments {
  period_days: number;
  total_payments: number;
  by_status: Array<{ status: string; count: number }>;
  by_method: Array<{ method: string; count: number }>;
  total_paid_amount: number;
  paid_amount_in_period: number;
  payments_by_day: Array<{ date: string; count: number }>;
}

export interface ReportEscrow {
  total_escrows: number;
  by_status: Array<{ status: string; count: number }>;
  amounts: {
    pending_held: number;
    released_to_sellers: number;
    refunded_to_buyers: number;
  };
}

export interface ReportWithdrawals {
  period_days: number;
  total_withdrawals: number;
  by_status: Array<{ status: string; count: number }>;
  pending_amount: number;
  completed_amount_total: number;
  withdrawals_by_day: Array<{ date: string; count: number }>;
}

export interface ReportDisputes {
  period_days: number;
  total_disputes: number;
  by_status: Array<{ status: string; count: number }>;
  disputes_by_day: Array<{ date: string; count: number }>;
}

export interface ReportSupport {
  period_days: number;
  total_tickets: number;
  by_status: Array<{ status: string; count: number }>;
  by_priority: Array<{ priority: string; count: number }>;
  tickets_by_day: Array<{ date: string; count: number }>;
}

export interface ReportAuctions {
  period_days: number;
  total_auctions: number;
  active_auctions: number;
  new_auctions_in_period: number;
  total_bids: number;
  bids_in_period: number;
}

export interface ReportInvoices {
  period_days: number;
  total_invoices: number;
  by_status: Array<{ status: string; count: number }>;
  total_paid_amount: number;
  invoices_by_day: Array<{ date: string; count: number }>;
}

type ReportParams = { days?: number };

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReportOverview: builder.query<ReportOverview, ReportParams | void>({
      query: (params) => ({
        url: "/reports/overview",
        params: { days: params?.days ?? 30 },
      }),
    }),
    getReportRevenue: builder.query<ReportRevenue, ReportParams | void>({
      query: (params) => ({
        url: "/reports/revenue",
        params: { days: params?.days ?? 30 },
      }),
    }),
    getReportUsers: builder.query<ReportUsers, ReportParams | void>({
      query: (params) => ({
        url: "/reports/users",
        params: { days: params?.days ?? 30 },
      }),
    }),
    getReportListings: builder.query<ReportListings, ReportParams | void>({
      query: (params) => ({
        url: "/reports/listings",
        params: { days: params?.days ?? 30 },
      }),
    }),
    getReportOrders: builder.query<ReportOrders, ReportParams | void>({
      query: (params) => ({
        url: "/reports/orders",
        params: { days: params?.days ?? 30 },
      }),
    }),
    getReportPayments: builder.query<ReportPayments, ReportParams | void>({
      query: (params) => ({
        url: "/reports/payments",
        params: { days: params?.days ?? 30 },
      }),
    }),
    getReportEscrow: builder.query<ReportEscrow, void>({
      query: () => ({ url: "/reports/escrow" }),
    }),
    getReportWithdrawals: builder.query<ReportWithdrawals, ReportParams | void>({
      query: (params) => ({
        url: "/reports/withdrawals",
        params: { days: params?.days ?? 30 },
      }),
    }),
    getReportDisputes: builder.query<ReportDisputes, ReportParams | void>({
      query: (params) => ({
        url: "/reports/disputes",
        params: { days: params?.days ?? 30 },
      }),
    }),
    getReportSupport: builder.query<ReportSupport, ReportParams | void>({
      query: (params) => ({
        url: "/reports/support",
        params: { days: params?.days ?? 30 },
      }),
    }),
    getReportAuctions: builder.query<ReportAuctions, ReportParams | void>({
      query: (params) => ({
        url: "/reports/auctions",
        params: { days: params?.days ?? 30 },
      }),
    }),
    getReportInvoices: builder.query<ReportInvoices, ReportParams | void>({
      query: (params) => ({
        url: "/reports/invoices",
        params: { days: params?.days ?? 30 },
      }),
    }),
  }),
});

export const {
  useGetReportOverviewQuery,
  useGetReportRevenueQuery,
  useGetReportUsersQuery,
  useGetReportListingsQuery,
  useGetReportOrdersQuery,
  useGetReportPaymentsQuery,
  useGetReportEscrowQuery,
  useGetReportWithdrawalsQuery,
  useGetReportDisputesQuery,
  useGetReportSupportQuery,
  useGetReportAuctionsQuery,
  useGetReportInvoicesQuery,
} = reportsApi;
