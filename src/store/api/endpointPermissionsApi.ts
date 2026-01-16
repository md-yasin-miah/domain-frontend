import { apiSlice } from './apiSlice';

export interface EndpointPermission {
  id: number;
  endpoint: string;
  method: string;
  role_id: number | null;
  permission_type: 'allow' | 'deny';
  created_at: string;
  updated_at: string;
}

export interface EndpointPermissionCreateRequest {
  endpoint: string;
  method: string;
  role_id?: number | null;
  permission_type: 'allow' | 'deny';
}

export interface EndpointPermissionUpdateRequest {
  endpoint?: string;
  method?: string;
  role_id?: number | null;
  permission_type?: 'allow' | 'deny';
}

export const endpointPermissionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEndpointPermissions: builder.query<PaginatedResponse<EndpointPermission> | EndpointPermission[], PaginationParams>({
      query: (params) => ({
        url: '/endpoint-permissions',
        method: 'GET',
        params,
      }),
      providesTags: ['Permission'],
    }),
    getEndpointPermission: builder.query<EndpointPermission, number>({
      query: (id) => ({
        url: `/endpoint-permissions/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Permission', id }],
    }),
    createEndpointPermission: builder.mutation<EndpointPermission, EndpointPermissionCreateRequest>({
      query: (data) => ({
        url: '/endpoint-permissions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Permission'],
    }),
    updateEndpointPermission: builder.mutation<EndpointPermission, { id: number; data: EndpointPermissionUpdateRequest }>({
      query: ({ id, data }) => ({
        url: `/endpoint-permissions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Permission', id }, 'Permission'],
    }),
    deleteEndpointPermission: builder.mutation<void, number>({
      query: (id) => ({
        url: `/endpoint-permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Permission'],
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

