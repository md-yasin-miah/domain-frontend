import { apiSlice } from './apiSlice';

export interface Verification {
  id: number;
  listing_id: number | null;
  user_id: number;
  verification_type: 'domain' | 'website' | 'identity';
  status: 'pending' | 'approved' | 'rejected';
  verification_data: Record<string, any> | null;
  notes: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationCreateRequest {
  listing_id?: number;
  verification_type: 'domain' | 'website' | 'identity';
  verification_data?: Record<string, any>;
  notes?: string;
}

export interface VerificationUpdateRequest {
  verification_data?: Record<string, any>;
  notes?: string;
}

export interface VerificationVerifyRequest {
  status: 'approved' | 'rejected';
  notes?: string;
}

export interface ProductVerification {
  id: number;
  user_id: number;
  listing_id: number | null;
  product_type: 'domain' | 'website';
  domain_name: string | null;
  domain_extension: string | null;
  website_url: string | null;
  verification_method: 'dns' | 'file_upload';
  verification_token: string;
  verification_code: string;
  dns_record_data: {
    type: string;
    name: string;
    value: string;
    full_record: string;
    instructions: string;
  } | null;
  verification_file_data: {
    file_path: string;
    file_url: string;
    filename: string;
    verification_code: string;
    instructions: string;
  } | null;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  verified_at: string | null;
  verified_by_id: number | null;
  verification_attempts: number;
  last_verification_check: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVerificationFilters {
  status?: 'pending' | 'verified' | 'rejected' | 'expired';
  product_type?: 'domain' | 'website';
}

export const verificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVerifications: builder.query<PaginatedResponse<Verification> | Verification[], PaginationParams>({
      query: (params) => ({
        url: '/verifications',
        method: 'GET',
        params,
      }),
      providesTags: ['Domain'],
    }),
    getVerification: builder.query<Verification, number>({
      query: (id) => ({
        url: `/verifications/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Domain', id }],
    }),
    createVerification: builder.mutation<Verification, VerificationCreateRequest>({
      query: (data) => ({
        url: '/verifications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
    updateVerification: builder.mutation<Verification, { id: number; data: VerificationUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/verifications/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    verifyVerification: builder.mutation<Verification, { id: number; data: VerificationVerifyRequest }>({
      query: ({ id, data }) => ({
        url: `/verifications/${id}/verify`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    rejectVerification: builder.mutation<Verification, { id: number; data: { notes?: string } }>({
      query: ({ id, data }) => ({
        url: `/verifications/${id}/reject`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Domain', id }, 'Domain'],
    }),
    deleteVerification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/verifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Domain'],
    }),
    // Product Verification endpoints
    getProductVerifications: builder.query<ProductVerification[], ProductVerificationFilters>({
      query: (params) => ({
        url: '/product-verification',
        method: 'GET',
        params,
      }),
      providesTags: ['Verification'],
    }),
    getProductVerification: builder.query<ProductVerification, number>({
      query: (id) => ({
        url: `/product-verification/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Verification', id }],
    }),
  }),
});

export const {
  useGetVerificationsQuery,
  useGetVerificationQuery,
  useCreateVerificationMutation,
  useUpdateVerificationMutation,
  useVerifyVerificationMutation,
  useRejectVerificationMutation,
  useDeleteVerificationMutation,
  useGetProductVerificationsQuery,
  useGetProductVerificationQuery,
} = verificationApi;

