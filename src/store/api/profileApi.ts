import { apiSlice } from './apiSlice';
import type {
  UserProfile,
  ProfileCreateRequest,
  ProfileCompletionResponse,
} from './types';

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: '/profile/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    createProfile: builder.mutation<UserProfile, ProfileCreateRequest>({
      query: (data) => ({
        url: '/profile/me',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User', 'Auth'],
    }),
    updateProfile: builder.mutation<UserProfile, ProfileCreateRequest>({
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
    getPublicProfile: builder.query<UserProfile, number>({
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

