import { apiSlice } from './apiSlice';
import type { PaginatedResponse, PaginationParams } from './types';

export interface SavedSearch {
  id: number;
  user_id: number;
  name: string;
  search_params: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SavedSearchCreateRequest {
  name: string;
  search_params: Record<string, any>;
}

export interface SavedSearchUpdateRequest {
  name?: string;
  search_params?: Record<string, any>;
}

export const savedSearchesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSavedSearches: builder.query<PaginatedResponse<SavedSearch> | SavedSearch[], PaginationParams>({
      query: (params) => ({
        url: '/saved-searches',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    getSavedSearch: builder.query<SavedSearch, number>({
      query: (id) => ({
        url: `/saved-searches/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createSavedSearch: builder.mutation<SavedSearch, SavedSearchCreateRequest>({
      query: (data) => ({
        url: '/saved-searches',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateSavedSearch: builder.mutation<SavedSearch, { id: number; data: SavedSearchUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/saved-searches/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    deleteSavedSearch: builder.mutation<void, number>({
      query: (id) => ({
        url: `/saved-searches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetSavedSearchesQuery,
  useGetSavedSearchQuery,
  useCreateSavedSearchMutation,
  useUpdateSavedSearchMutation,
  useDeleteSavedSearchMutation,
} = savedSearchesApi;

