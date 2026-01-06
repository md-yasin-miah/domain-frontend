import { apiSlice } from './apiSlice';

export const offersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOffers: builder.query<PaginatedResponse<Offer>, ClientFiltersParams>({
      query: (params) => ({
        url: '/offers',
        method: 'GET',
        params,
      }),
      providesTags: ['Offer'],
    }),
    getOffer: builder.query<Offer, number>({
      query: (id) => ({
        url: `/offers/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Offer', id }],
    }),
    createOffer: builder.mutation<Offer, OfferCreateRequest>({
      query: (data) => ({
        url: '/offers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Offer'],
    }),
    acceptOffer: builder.mutation<Offer, number>({
      query: (id) => ({
        url: `/offers/${id}/accept`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Offer', id }, 'Offer'],
    }),
    rejectOffer: builder.mutation<Offer, number>({
      query: (id) => ({
        url: `/offers/${id}/reject`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Offer', id }, 'Offer'],
    }),
    counterOffer: builder.mutation<Offer, { id: number; data: OfferCounterRequest }>({
      query: ({ id, data }) => ({
        url: `/offers/${id}/counter`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Offer', id }, 'Offer'],
    }),
    updateOffer: builder.mutation<Offer, { id: number; data: Partial<OfferCreateRequest> }>({
      query: ({ id, data }) => ({
        url: `/offers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Offer', id }, 'Offer'],
    }),
    withdrawOffer: builder.mutation<void, number>({
      query: (id) => ({
        url: `/offers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Offer'],
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

