import { apiSlice } from './apiSlice';
import type { PaginatedResponse, PaginationParams } from './types';

export interface SearchAlert {
  id: number;
  user_id: number;
  name: string;
  search_params: Record<string, any>;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SearchAlertCreateRequest {
  name: string;
  search_params: Record<string, any>;
  is_active?: boolean;
}

export interface SearchAlertUpdateRequest {
  name?: string;
  search_params?: Record<string, any>;
  is_active?: boolean;
}

export const searchAlertsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSearchAlerts: builder.query<PaginatedResponse<SearchAlert> | SearchAlert[], PaginationParams>({
      query: (params) => ({
        url: '/search-alerts',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    getSearchAlert: builder.query<SearchAlert, number>({
      query: (id) => ({
        url: `/search-alerts/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createSearchAlert: builder.mutation<SearchAlert, SearchAlertCreateRequest>({
      query: (data) => ({
        url: '/search-alerts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateSearchAlert: builder.mutation<SearchAlert, { id: number; data: SearchAlertUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/search-alerts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    deleteSearchAlert: builder.mutation<void, number>({
      query: (id) => ({
        url: `/search-alerts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetSearchAlertsQuery,
  useGetSearchAlertQuery,
  useCreateSearchAlertMutation,
  useUpdateSearchAlertMutation,
  useDeleteSearchAlertMutation,
} = searchAlertsApi;

