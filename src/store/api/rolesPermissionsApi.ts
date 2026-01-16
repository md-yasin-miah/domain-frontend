import { apiSlice } from './apiSlice';

// ============ Role Types ============
export interface RoleResponse {
  id: number;
  name: string;
  description: string | null;
  permissions: string[]; // Array of permission names
}

export interface RoleCreateRequest {
  name: string;
  description?: string | null;
}

export interface RoleUpdateRequest {
  name?: string;
  description?: string | null;
}

export interface RolePermissionAssignRequest {
  permission_ids: number[];
}

// ============ Permission Types ============
export interface PermissionResponse {
  id: number;
  name: string;
  description: string | null;
}

export interface PermissionCreateRequest {
  name: string;
  description?: string | null;
}

export interface PermissionUpdateRequest {
  name?: string;
  description?: string | null;
}

// ============ Query Params ============
export interface RolesListParams {
  skip?: number;
  limit?: number;
  page?: number;
  size?: number;
  search?: string;
}

export interface PermissionsListParams {
  skip?: number;
  limit?: number;
  page?: number;
  size?: number;
  search?: string;
}

export const rolesPermissionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== ROLES ENDPOINTS ====================

    /**
     * Create a new role. Admin only.
     */
    createRole: builder.mutation<RoleResponse, RoleCreateRequest>({
      query: (data) => ({
        url: '/roles',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),

    /**
     * List all roles with pagination and search. Admin only.
     */
    listRoles: builder.query<RoleResponse[], RolesListParams>({
      query: (params) => ({
        url: '/roles',
        method: 'GET',
        params: {
          skip: params.skip ?? params.page ? (params.page! - 1) * (params.size ?? params.limit ?? 10) : 0,
          limit: params.limit ?? params.size ?? 100,
          search: params.search,
        },
      }),
      providesTags: ['Role'],
    }),

    /**
     * Get a specific role by ID. Admin only.
     */
    getRole: builder.query<RoleResponse, number>({
      query: (roleId) => ({
        url: `/roles/${roleId}`,
        method: 'GET',
      }),
      providesTags: (result, error, roleId) => [{ type: 'Role', id: roleId }],
    }),

    /**
     * Update a role. Admin only.
     */
    updateRole: builder.mutation<RoleResponse, { roleId: number; data: RoleUpdateRequest }>({
      query: ({ roleId, data }) => ({
        url: `/roles/${roleId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }, 'Role'],
    }),

    /**
     * Delete a role. Admin only.
     */
    deleteRole: builder.mutation<void, number>({
      query: (roleId) => ({
        url: `/roles/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),

    /**
     * Assign permissions to a role. Admin only.
     */
    assignPermissionsToRole: builder.mutation<RoleResponse, { roleId: number; data: RolePermissionAssignRequest }>({
      query: ({ roleId, data }) => ({
        url: `/roles/${roleId}/permissions`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }, 'Role', 'Permission'],
    }),

    /**
     * Remove a permission from a role. Admin only.
     */
    removePermissionFromRole: builder.mutation<RoleResponse, { roleId: number; permissionId: number }>({
      query: ({ roleId, permissionId }) => ({
        url: `/roles/${roleId}/permissions/${permissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }, 'Role', 'Permission'],
    }),

    /**
     * Get all permissions assigned to a role. Admin only.
     */
    getRolePermissions: builder.query<PermissionResponse[], number>({
      query: (roleId) => ({
        url: `/roles/${roleId}/permissions`,
        method: 'GET',
      }),
      providesTags: (result, error, roleId) => [{ type: 'Role', id: roleId }, 'Permission'],
    }),

    // ==================== PERMISSIONS ENDPOINTS ====================

    /**
     * Create a new permission. Admin only.
     */
    createPermission: builder.mutation<PermissionResponse, PermissionCreateRequest>({
      query: (data) => ({
        url: '/permissions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Permission'],
    }),

    /**
     * List all permissions with pagination and search. Admin only.
     */
    listPermissions: builder.query<PermissionResponse[], PermissionsListParams>({
      query: (params) => ({
        url: '/permissions',
        method: 'GET',
        params: {
          skip: params.skip ?? params.page ? (params.page! - 1) * (params.size ?? params.limit ?? 10) : 0,
          limit: params.limit ?? params.size ?? 100,
          search: params.search,
        },
      }),
      providesTags: ['Permission'],
    }),

    /**
     * Get a specific permission by ID. Admin only.
     */
    getPermission: builder.query<PermissionResponse, number>({
      query: (permissionId) => ({
        url: `/permissions/${permissionId}`,
        method: 'GET',
      }),
      providesTags: (result, error, permissionId) => [{ type: 'Permission', id: permissionId }],
    }),

    /**
     * Update a permission. Admin only.
     */
    updatePermission: builder.mutation<PermissionResponse, { permissionId: number; data: PermissionUpdateRequest }>({
      query: ({ permissionId, data }) => ({
        url: `/permissions/${permissionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { permissionId }) => [{ type: 'Permission', id: permissionId }, 'Permission'],
    }),

    /**
     * Delete a permission. Admin only.
     */
    deletePermission: builder.mutation<void, number>({
      query: (permissionId) => ({
        url: `/permissions/${permissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Permission'],
    }),

    /**
     * Get all roles that have this permission. Admin only.
     */
    getPermissionRoles: builder.query<RoleResponse[], number>({
      query: (permissionId) => ({
        url: `/permissions/${permissionId}/roles`,
        method: 'GET',
      }),
      providesTags: (result, error, permissionId) => [{ type: 'Permission', id: permissionId }, 'Role'],
    }),
  }),
});

export const {
  // Role hooks
  useCreateRoleMutation,
  useListRolesQuery,
  useGetRoleQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionsToRoleMutation,
  useRemovePermissionFromRoleMutation,
  useGetRolePermissionsQuery,
  // Permission hooks
  useCreatePermissionMutation,
  useListPermissionsQuery,
  useGetPermissionQuery,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useGetPermissionRolesQuery,
} = rolesPermissionsApi;
