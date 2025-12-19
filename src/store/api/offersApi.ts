import { apiSlice } from './apiSlice';
import type {
  Offer,
  OfferCreateRequest,
  OfferCounterRequest,
  PaginatedResponse,
  PaginationParams,
} from './types';

export const offersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query<PaginatedResponse<Offer> | Offer[], PaginationParams>({
      query: (params) => ({
        url: '/offers',
        method: 'GET',
        params,
      }),
      providesTags: ['Domain'],
    }),
    getOffer: builder.query<Offer, number>({
      query: (id) => ({
        url: `/offers/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    createOffer: builder.mutation<Offer, OfferCreateRequest>({
      query: (data) => ({
        url: '/offers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    acceptOffer: builder.mutation<Offer, number>({
      query: (id) => ({
        url: `/offers/${id}/accept`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Domain', id }, 'Domain'],
    }),
    rejectOffer: builder.mutation<Offer, number>({
      query: (id) => ({
        url: `/offers/${id}/reject`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Domain', id }, 'Domain'],
    }),
    counterOffer: builder.mutation<Offer, { id: number; data: OfferCounterRequest }>({
      query: ({ id, data }) => ({
        url: `/offers/${id}/counter`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    updateOffer: builder.mutation<Offer, { id: number; data: Partial<OfferCreateRequest> }>({
      query: ({ id, data }) => ({
        url: `/offers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    withdrawOffer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/offers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),
  }),
});

export const {
  useGetOffersQuery,
  useGetOfferQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useCounterOfferMutation,
  useWithdrawOfferMutation,
} = offersApi;

