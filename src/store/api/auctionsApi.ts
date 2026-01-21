import { apiSlice } from './apiSlice';

export const auctionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuctions: builder.query<PaginatedResponse<Auction> | Auction[], AuctionFilters>({
      query: (params) => ({
        url: '/auctions',
        method: 'GET',
        params,
      }),
      providesTags: ['Domain'],
    }),
    getAuction: builder.query<Auction, number>({
      query: (id) => ({
        url: `/auctions/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    getBids: builder.query<PaginatedResponse<Bid> | Bid[], { auctionId: number; skip?: number; limit?: number }>({
      query: ({ auctionId, skip, limit }) => ({
        url: `/auctions/${auctionId}/bids`,
        method: 'GET',
        params: { skip, limit },
      }),
      providesTags: (result, error, { auctionId }) => [{ type: 'Domain', id: auctionId }],
    }),
    placeBid: builder.mutation<Bid, { auctionId: number; data: BidCreateRequest }>({
      query: ({ auctionId, data }) => ({
        url: `/auctions/${auctionId}/bids`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { auctionId }) => [
        { type: 'Domain', id: auctionId },
        'Domain',
      ],
    }),
    createAuction: builder.mutation<Auction, AuctionCreateRequest>({
      query: (data) => ({
        url: '/auctions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    updateAuction: builder.mutation<Auction, { id: number; data: AuctionUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/auctions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    withdrawBid: builder.mutation<void, { auctionId: number; bidId: number }>({
      query: ({ auctionId, bidId }) => ({
        url: `/auctions/${auctionId}/bids/${bidId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { auctionId }) => [
        { type: 'Domain', id: auctionId },
        'Domain',
      ],
    }),
  }),
});

export const {
  useGetAuctionsQuery,
  useGetAuctionQuery,
  useGetBidsQuery,
  usePlaceBidMutation,
  useCreateAuctionMutation,
  useUpdateAuctionMutation,
  useWithdrawBidMutation,
} = auctionsApi;

