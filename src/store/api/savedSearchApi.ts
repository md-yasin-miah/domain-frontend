import { apiSlice } from './apiSlice';

export const savedSearchesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSavedSearches: builder.query<SavedSearch[] | PaginatedResponse<SavedSearch>, SavedSearchFilters>({
      query: (params) => ({
        url: '/saved-searches',
        method: 'GET',
        params,
      }),
      providesTags: ['SavedSearch'],
    }),
    getSavedSearch: builder.query<SavedSearch, number>({
      query: (id) => ({
        url: `/saved-searches/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'SavedSearch', id }],
    }),
    createSavedSearch: builder.mutation<SavedSearch, SavedSearchCreateRequest>({
      query: (data) => ({
        url: '/saved-searches',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SavedSearch'],
    }),
    updateSavedSearch: builder.mutation<SavedSearch, { id: number; data: SavedSearchUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/saved-searches/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'SavedSearch', id }, 'SavedSearch'],
    }),
    deleteSavedSearch: builder.mutation<void, number>({
      query: (id) => ({
        url: `/saved-searches/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SavedSearch'],
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

