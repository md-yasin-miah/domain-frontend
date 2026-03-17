/**
 * User account verification API (profile verification).
 * - User: GET my status, POST request verification.
 * - Admin: GET list requests, POST approve/reject by user_id.
 * Aligned with backend app/routers/verifications.py.
 */
import { apiSlice } from './apiSlice';

/** Current user's verification status (GET /verifications/me) */
export interface UserVerificationStatus {
  is_verified: boolean;
  verification_date: string | null;
  pending_request: boolean;
}

/** Uploaded document summary for a verification request */
export interface VerificationDocumentSummary {
  file_upload_id: number;
  file_url: string;
  original_filename: string;
  preview_url: string;
}

/** Single verification request (admin list / detail) */
export interface UserVerificationRequest {
  id: number;
  user_id: number;
  status: string;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by_id: number | null;
  admin_notes: string | null;
  created_at: string;
  user?: UserWithProfile;
  document_files?: VerificationDocumentSummary[] | null;
}

/** Profile as returned in verification user detail */
export interface UserProfileResponse {
  id: number;
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  address_line1: string | null;
  address_line2?: string | null;
  city: string | null;
  state?: string | null;
  country: string | null;
  postal_code: string | null;
  company_name: string | null;
  website: string | null;
  social_links?: Record<string, string> | null;
  is_verified: boolean;
  verification_date: string | null;
  created_at: string;
  updated_at: string;
}

/** User with profile (for admin verification detail) */
export interface UserWithProfile {
  id: number;
  username: string;
  email: string;
  name?: string | null;
  is_active: boolean;
  roles: string[];
  profile: UserProfileResponse | null;
  is_profile_complete: boolean;
}

/** Response for GET /verifications/users/{user_id} (admin) */
export interface VerificationUserDetailResponse {
  user: UserWithProfile;
  verification_requests: UserVerificationRequest[];
}

export interface VerificationRequestsParams {
  status_filter?: string;
  skip?: number;
  limit?: number;
}

export interface ApproveRejectBody {
  admin_notes?: string | null;
}

export const verificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /** Current user: get my verification status and whether I have a pending request */
    getMyVerificationStatus: builder.query<UserVerificationStatus, void>({
      query: () => ({
        url: '/verifications/me',
        method: 'GET',
      }),
      providesTags: ['Verification', 'User'],
    }),

    /** Current user: submit a verification request (creates pending request) */
    requestVerification: builder.mutation<UserVerificationRequest, void>({
      query: () => ({
        url: '/verifications/request',
        method: 'POST',
      }),
      invalidatesTags: ['Verification', 'User'],
    }),

    /** Admin: get full user details and all verification requests (GET /verifications/users/{user_id}) */
    getVerificationUserDetail: builder.query<VerificationUserDetailResponse, number>({
      query: (userId) => ({
        url: `/verifications/users/${userId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, userId) => [{ type: 'Verification', id: `user-${userId}` }, 'Verification'],
    }),

    /** Admin: list user verification requests */
    getVerificationRequests: builder.query<UserVerificationRequest[], VerificationRequestsParams>({
      query: (params) => ({
        url: '/verifications/requests',
        method: 'GET',
        params: {
          status_filter: params.status_filter || undefined,
          skip: params.skip ?? 0,
          limit: params.limit ?? 50,
        },
      }),
      providesTags: ['Verification'],
    }),

    /** Admin: approve a user's verification (sets profile.is_verified = true) */
    approveUserVerification: builder.mutation<
      { ok: boolean; message: string; user_id: number; is_verified: boolean; verification_date: string | null },
      { user_id: number; body?: ApproveRejectBody }
    >({
      query: ({ user_id, body }) => ({
        url: `/verifications/users/${user_id}/approve`,
        method: 'POST',
        body: body ?? {},
      }),
      invalidatesTags: ['Verification', 'User'],
    }),

    /** Admin: reject a user's verification request */
    rejectUserVerification: builder.mutation<
      { ok: boolean; message: string; user_id: number; requests_updated: number },
      { user_id: number; body?: ApproveRejectBody }
    >({
      query: ({ user_id, body }) => ({
        url: `/verifications/users/${user_id}/reject`,
        method: 'POST',
        body: body ?? {},
      }),
      invalidatesTags: ['Verification', 'User'],
    }),
  }),
});

export const {
  useGetMyVerificationStatusQuery,
  useRequestVerificationMutation,
  useGetVerificationRequestsQuery,
  useGetVerificationUserDetailQuery,
  useApproveUserVerificationMutation,
  useRejectUserVerificationMutation,
} = verificationApi;
