import { apiSlice } from './apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<UserResponse>, PaginationParams>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    getUser: builder.query<UserResponse, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<UserResponse, UserCreateRequest>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<UserResponse, { id: number; data: UserUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    updatePassword: builder.mutation<void, { id: number; data: PasswordUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}/password`,
        method: 'PUT',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, { id: number; data: PasswordResetRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}/password/reset`,
        method: 'PUT',
        body: data,
      }),
    }),
    assignRole: builder.mutation<void, { id: number; roleId: number }>({
      query: ({ id, roleId }) => ({
        url: `/users/${id}/roles`,
        method: 'POST',
        body: { role_id: roleId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    removeRole: builder.mutation<void, { id: number; roleId: number }>({
      query: ({ id, roleId }) => ({
        url: `/users/${id}/roles/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    activateUser: builder.mutation<UserResponse, number>({
      query: (id) => ({
        url: `/users/${id}/activate`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }, 'User'],
    }),
    deactivateUser: builder.mutation<UserResponse, number>({
      query: (id) => ({
        url: `/users/${id}/deactivate`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }, 'User'],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getUserStats: builder.query<UserStats, number>({
      query: (id) => ({
        url: `/users/${id}/stats`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    getRoles: builder.query<Role[], void>({
      query: () => ({
        url: '/roles',
        method: 'GET',
      }),
      providesTags: ['Role'],
    }),
    // Client-specific convenience queries
    getClientProfile: builder.query<ClientProfile, string | number>({
      query: (userId) => ({
        url: `/profile/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, userId) => [{ type: 'User', id: Number(userId) }],
    }),
    // Client profile mutations
    updateClientProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: '/profile/me',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    createClientProfile: builder.mutation<any, any>({
      query: (data) => ({
        url: '/profile/me',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useResetPasswordMutation,
  useAssignRoleMutation,
  useRemoveRoleMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useDeleteUserMutation,
  useGetUserStatsQuery,
  useGetRolesQuery,
  useGetClientProfileQuery,
  useUpdateClientProfileMutation,
  useCreateClientProfileMutation,
} = userApi;
