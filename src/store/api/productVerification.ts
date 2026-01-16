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
    getProductVerificationStatus: builder.query<ProductVerificationStatusResponse, number>({
      query: (verificationId) => ({
        url: `/product-verification/${verificationId}/status`,
        method: 'GET',
      }),
      providesTags: (result, error, verificationId) => [
        { type: 'ProductVerification', id: verificationId },
        'ProductVerification',
      ],
    }),
    createListingFromVerification: builder.mutation<MarketplaceListing, { verificationId: number; data: CreateListingFromVerificationRequest }>({
      query: ({ verificationId, data }) => ({
        url: `/product-verification/${verificationId}/create-listing`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { verificationId }) => [
        { type: 'ProductVerification', id: verificationId },
        'ProductVerification',
        'MarketplaceListing',
      ],
    }),
    downloadVerificationFile: builder.query<Blob, string>({
      query: (filename) => ({
        url: `/product-verification/files/${filename}`,
        method: 'GET',
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error('Failed to download file');
          }
          return await response.blob();
        },
      }),
    }),
  }),
});

export const {
  useGetProductVerificationsQuery,
  useGetProductVerificationQuery,
  useCreateProductVerificationMutation,
  useVerifyProductVerificationMutation,
  useGetProductVerificationStatusQuery,
  useCreateListingFromVerificationMutation,
  useLazyDownloadVerificationFileQuery,
} = productVerificationApi;

