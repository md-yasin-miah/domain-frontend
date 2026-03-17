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

/** Single verification request (admin list) */
export interface UserVerificationRequest {
  id: number;
  user_id: number;
  status: string;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by_id: number | null;
  admin_notes: string | null;
  created_at: string;
  user?: UserResponse;
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
  useApproveUserVerificationMutation,
  useRejectUserVerificationMutation,
} = verificationApi;
