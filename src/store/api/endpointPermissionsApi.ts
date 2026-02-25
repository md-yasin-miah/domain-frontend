import { apiSlice } from './apiSlice';

export interface PermissionBasicInfo {
  id: number;
  name: string;
  description: string | null;
}

export interface EndpointPermission {
  id: number;
  method: string;
  path_pattern: string;
  description: string | null;
  is_active: boolean;
  requires_auth: boolean;
  permission_id: number;
  created_at: string;
  updated_at: string;
  permission: PermissionBasicInfo | null;
}

export interface EndpointPermissionCreateRequest {
  method: string;
  path_pattern: string;
  description?: string | null;
  is_active?: boolean;
  requires_auth?: boolean;
  permission_id: number;
}

export interface EndpointPermissionUpdateRequest {
  method?: string;
  path_pattern?: string;
  description?: string | null;
  is_active?: boolean;
  requires_auth?: boolean;
  permission_id?: number;
}

export interface EndpointPermissionsListParams {
  skip?: number;
  limit?: number;
  method?: string;
  is_active?: boolean;
  permission_id?: number;
}

export const endpointPermissionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEndpointPermissions: builder.query<
      EndpointPermission[],
      EndpointPermissionsListParams | void
    >({
      query: (params = {}) => ({
        url: '/endpoint-permissions',
        method: 'GET',
        params: {
          skip: params?.skip ?? 0,
          limit: params?.limit ?? 100,
          method: params?.method,
          is_active: params?.is_active,
          permission_id: params?.permission_id,
        },
      }),
      providesTags: ['EndpointPermission'],
    }),
    getEndpointPermission: builder.query<EndpointPermission, number>({
      query: (id) => ({
        url: `/endpoint-permissions/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'EndpointPermission', id }],
    }),
    createEndpointPermission: builder.mutation<
      EndpointPermission,
      EndpointPermissionCreateRequest
    >({
      query: (data) => ({
        url: '/endpoint-permissions',
        method: 'POST',
        body: {
          ...data,
          method: data.method.toUpperCase(),
        },
      }),
      invalidatesTags: ['EndpointPermission'],
    }),
    updateEndpointPermission: builder.mutation<
      EndpointPermission,
      { id: number; data: EndpointPermissionUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/endpoint-permissions/${id}`,
        method: 'PUT',
        body: {
          ...data,
          ...(data.method && { method: data.method.toUpperCase() }),
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'EndpointPermission', id },
        'EndpointPermission',
      ],
    }),
    deleteEndpointPermission: builder.mutation<void, number>({
      query: (id) => ({
        url: `/endpoint-permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EndpointPermission'],
    }),
  }),
});

export const {
  useGetEndpointPermissionsQuery,
  useGetEndpointPermissionQuery,
  useCreateEndpointPermissionMutation,
  useUpdateEndpointPermissionMutation,
  useDeleteEndpointPermissionMutation,
} = endpointPermissionsApi;
