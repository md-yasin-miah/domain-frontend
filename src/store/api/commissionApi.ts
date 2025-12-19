import { apiSlice } from './apiSlice';
import type { PaginatedResponse, PaginationParams } from './types';

export interface Commission {
  id: number;
  name: string;
  description: string | null;
  rate: number;
  min_amount: number | null;
  max_amount: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommissionCreateRequest {
  name: string;
  description?: string;
  rate: number;
  min_amount?: number;
  max_amount?: number;
  is_active?: boolean;
}

export interface CommissionUpdateRequest {
  name?: string;
  description?: string;
  rate?: number;
  min_amount?: number;
  max_amount?: number;
  is_active?: boolean;
}

export interface CommissionCalculateRequest {
  price: number;
}

export interface CommissionCalculateResponse {
  commission_amount: number;
  rate: number;
  final_amount: number;
}

export const commissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommissions: builder.query<PaginatedResponse<Commission> | Commission[], PaginationParams>({
      query: (params) => ({
        url: '/commissions',
        method: 'GET',
        params,
      }),
      providesTags: ['Domain'],
    }),
    getCommission: builder.query<Commission, number>({
      query: (id) => ({
        url: `/commissions/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    createCommission: builder.mutation<Commission, CommissionCreateRequest>({
      query: (data) => ({
        url: '/commissions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    updateCommission: builder.mutation<Commission, { id: number; data: CommissionUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/commissions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    deleteCommission: builder.mutation<void, number>({
      query: (id) => ({
        url: `/commissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),
    calculateCommission: builder.mutation<CommissionCalculateResponse, CommissionCalculateRequest>({
      query: (data) => ({
        url: '/commissions/calculate',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCommissionsQuery,
  useGetCommissionQuery,
  useCreateCommissionMutation,
  useUpdateCommissionMutation,
  useDeleteCommissionMutation,
  useCalculateCommissionMutation,
} = commissionApi;

