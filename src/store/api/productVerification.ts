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
  }),
}); 

export const {
  useGetProductVerificationsQuery,
  useGetProductVerificationQuery,
  useCreateProductVerificationMutation,
} = productVerificationApi;

