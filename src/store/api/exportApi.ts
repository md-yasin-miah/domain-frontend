import { apiSlice } from './apiSlice';

export interface ExportParams {
  format?: 'csv' | 'xlsx';
  filters?: Record<string, any>;
}

export const exportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    exportListings: builder.query<Blob, ExportParams>({
      query: (params) => ({
        url: '/exports/listings/csv',
        method: 'GET',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportOrders: builder.query<Blob, ExportParams>({
      query: (params) => ({
        url: '/exports/orders/csv',
        method: 'GET',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useLazyExportListingsQuery,
  useLazyExportOrdersQuery,
} = exportApi;

