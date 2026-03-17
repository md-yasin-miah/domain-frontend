import { apiSlice } from './apiSlice';

/** Matches backend VerificationResponse / VerificationStatus (pending, verified, failed) */
export interface Verification {
  id: number;
  listing_id: number;
  verification_type: string;
  verification_method: string | null;
  verification_token: string | null;
  verification_code: string | null;
  status: string;
  verified_at: string | null;
  verified_by_id: number | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationCreateRequest {
  listing_id: number;
  verification_type: string;
  verification_method?: string | null;
  verification_token?: string | null;
  verification_code?: string | null;
}

export interface VerificationUpdateRequest {
  status?: string;
  verification_method?: string | null;
  verification_token?: string | null;
  verification_code?: string | null;
  expires_at?: string | null;
}

export interface VerificationFilters extends PaginationParams {
  listing_id?: number;
  status?: string;
  verification_type?: string;
}

export const verificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVerifications: builder.query<Verification[], VerificationFilters>({
      query: (params) => ({
        url: '/verifications',
        method: 'GET',
        params: {
          skip: params.skip,
          limit: params.limit,
          ...(params.listing_id != null && { listing_id: params.listing_id }),
          ...(params.status && { status: params.status }),
          ...(params.verification_type && { verification_type: params.verification_type }),
        },
      }),
      providesTags: ['User'],
    }),
    getVerification: builder.query<Verification, number>({
      query: (id) => ({
        url: `/verifications/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id: `verification-${id}` }, 'User'],
    }),
    createVerification: builder.mutation<Verification, VerificationCreateRequest>({
      query: (data) => ({
        url: '/verifications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateVerification: builder.mutation<Verification, { id: number; data: VerificationUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/verifications/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id: `verification-${id}` }, 'User'],
    }),
    verifyVerification: builder.mutation<Verification, number>({
      query: (id) => ({
        url: `/verifications/${id}/verify`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id: `verification-${id}` }, 'User'],
    }),
    rejectVerification: builder.mutation<Verification, number>({
      query: (id) => ({
        url: `/verifications/${id}/reject`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id: `verification-${id}` }, 'User'],
    }),
    deleteVerification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/verifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
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
} = verificationApi;
