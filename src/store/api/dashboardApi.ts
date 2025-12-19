import { apiSlice } from './apiSlice';
import type {
  AdminDashboard,
  SellerDashboard,
  BuyerDashboard,
} from './types';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<AdminDashboard | SellerDashboard | BuyerDashboard, void>({
      query: () => ({
        url: '/dashboard',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getAdminDashboard: builder.query<AdminDashboard, void>({
      query: () => ({
        url: '/dashboard/admin',
        method: 'GET',
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
  useGetDashboardQuery,
  useGetAdminDashboardQuery,
  useGetSellerDashboardQuery,
  useGetBuyerDashboardQuery,
} = dashboardApi;

