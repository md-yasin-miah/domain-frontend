import { apiSlice } from './apiSlice';

export const productVerificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Product Verification endpoints
    getProductVerifications: builder.query<ProductVerification[], ProductVerificationFilters>({
      query: (params) => ({
        url: '/product-verification',
        method: 'GET',
        params,
      }),
      providesTags: ['ProductVerification'],
    }),
    getProductVerification: builder.query<ProductVerification, number>({
      query: (id) => ({
        url: `/product-verification/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'ProductVerification', id }],
    }),
    createProductVerification: builder.mutation<ProductVerification, ProductVerificationCreateRequest>({
      query: (data) => ({
        url: '/product-verification',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ProductVerification'],
    }),
    verifyProductVerification: builder.mutation<ProductVerificationVerifyResponse, number>({
      query: (verificationId) => ({
        url: `/product-verification/${verificationId}/verify`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, verificationId) => [
        { type: 'ProductVerification', id: verificationId },
        'ProductVerification',
      ],
    }),
  }),
}); 

export interface ProductVerificationVerifyResponse {
  id: number;
  status: 'pending' | 'verified' | 'rejected' | 'expired' | 'failed';
  verification_method: 'dns' | 'file_upload';
  is_verified: boolean;
  verified_at: string | null;
  verification_attempts: number;
  last_verification_check: string | null;
  expires_at: string;
  can_create_listing: boolean;
  listing_id: number | null;
  message: string;
}

export const {
  useGetProductVerificationsQuery,
  useGetProductVerificationQuery,
  useCreateProductVerificationMutation,
  useVerifyProductVerificationMutation,
} = productVerificationApi;

