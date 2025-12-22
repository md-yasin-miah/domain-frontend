import { apiSlice } from './apiSlice';
import type {
  UserProfile,
  ProfileCreateRequest,
  ProfileCompletionResponse,
} from './types';

// ClientProfile type from API response
export interface ClientProfile {
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  avatar_url: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  company_name: string;
  website: string;
  social_links: {
    [key: string]: string;
  } | null;
  id: number;
  user_id: number;
  is_verified: boolean;
  verification_date: string;
  created_at: string;
  updated_at: string;
}

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<ClientProfile, void>({
      query: () => ({
        url: '/profile/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    createProfile: builder.mutation<ClientProfile, ProfileCreateRequest>({
      query: (data) => ({
        url: '/profile/me',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),
    updateProfile: builder.mutation<ClientProfile, Partial<ClientProfile>>({
      query: (data) => ({
        url: '/profile/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),
    getProfileCompletion: builder.query<ProfileCompletionResponse, void>({
      query: () => ({
        url: '/profile/me/completion',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getPublicProfile: builder.query<ClientProfile, number>({
      query: (userId) => ({
        url: `/profile/${userId}`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useGetProfileCompletionQuery,
  useGetPublicProfileQuery,
} = profileApi;

