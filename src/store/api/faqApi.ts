import { apiSlice } from './apiSlice';
import type {
  FAQ,
  FAQCreateRequest,
  PaginatedResponse,
  PaginationParams,
} from './types';

export const faqApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFAQs: builder.query<PaginatedResponse<FAQ> | FAQ[], PaginationParams>({
      query: (params) => ({
        url: '/faq',
        method: 'GET',
        params,
      }),
      providesTags: ['FAQ'],
    }),
    getFAQ: builder.query<FAQ, number>({
      query: (id) => ({
        url: `/faq/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'FAQ', id }],
    }),
    createFAQ: builder.mutation<FAQ, FAQCreateRequest>({
      query: (data) => ({
        url: '/faq',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['FAQ'],
    }),
    updateFAQ: builder.mutation<FAQ, { id: number; data: FAQCreateRequest }>({
      query: ({ id, data }) => ({
        url: `/faq/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'FAQ', id }, 'FAQ'],
    }),
    deleteFAQ: builder.mutation<void, number>({
      query: (id) => ({
        url: `/faq/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FAQ'],
    }),
  }),
});

export const {
  useGetFAQsQuery,
  useGetFAQQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} = faqApi;
