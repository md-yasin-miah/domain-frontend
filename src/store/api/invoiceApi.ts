import { apiSlice } from './apiSlice';
import type { PaginatedResponse, PaginationParams } from './types';

export interface Invoice {
  id: number;
  invoice_number: string;
  order_id: number;
  user_id: number;
  amount: number;
  currency: string;
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceCreateRequest {
  order_id: number;
  amount: number;
  currency?: string;
  due_date?: string;
}

export interface InvoiceUpdateRequest {
  amount?: number;
  currency?: string;
  status?: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
  issue_date?: string;
  due_date?: string;
}

export const invoiceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<PaginatedResponse<Invoice> | Invoice[], PaginationParams>({
      query: (params) => ({
        url: '/invoices',
        method: 'GET',
        params,
      }),
      providesTags: ['Invoice'],
    }),
    getInvoice: builder.query<Invoice, number>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Invoice', id }],
    }),
    getInvoiceByOrder: builder.query<Invoice, number>({
      query: (orderId) => ({
        url: `/invoices/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: (result, error, orderId) => [{ type: 'Invoice', id: result?.id }, 'Invoice'],
    }),
    createInvoice: builder.mutation<Invoice, InvoiceCreateRequest>({
      query: (data) => ({
        url: '/invoices',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Invoice'],
    }),
    updateInvoice: builder.mutation<Invoice, { id: number; data: InvoiceUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
    issueInvoice: builder.mutation<Invoice, number>({
      query: (id) => ({
        url: `/invoices/${id}/issue`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
    markInvoiceAsPaid: builder.mutation<Invoice, number>({
      query: (id) => ({
        url: `/invoices/${id}/mark-paid`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Invoice', id }, 'Invoice'],
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useGetInvoiceByOrderQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useIssueInvoiceMutation,
  useMarkInvoiceAsPaidMutation,
} = invoiceApi;

