import { apiSlice } from './apiSlice';
import type {
  Auction,
  Bid,
  BidCreateRequest,
  AuctionCreateRequest,
  AuctionUpdateRequest,
  PaginatedResponse,
  PaginationParams,
} from './types';

export const auctionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuctions: builder.query<PaginatedResponse<Auction> | Auction[], PaginationParams>({
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
    getBids: builder.query<PaginatedResponse<Bid> | Bid[], number>({
      query: (auctionId) => ({
        url: `/auctions/${auctionId}/bids`,
        method: 'GET',
      }),
      providesTags: (result, error, auctionId) => [{ type: 'Domain', id: auctionId }],
    }),
    placeBid: builder.mutation<Bid, { auctionId: number; data: BidCreateRequest }>({
      query: ({ auctionId, data }) => ({
        url: `/auctions/${auctionId}/bids`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { auctionId }) => [{ type: 'Domain', id: auctionId }, 'Domain'],
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
    deleteAuction: builder.mutation<void, number>({
      query: (id) => ({
        url: `/auctions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),
    withdrawBid: builder.mutation<void, { auctionId: number; bidId: number }>({
      query: ({ auctionId, bidId }) => ({
        url: `/auctions/${auctionId}/bids/${bidId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { auctionId }) => [{ type: 'Domain', id: auctionId }, 'Domain'],
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
  useDeleteAuctionMutation,
  useWithdrawBidMutation,
} = auctionsApi;

