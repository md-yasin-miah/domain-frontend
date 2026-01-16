// ============ Role Types ============
interface RoleResponse {
  id: number;
  name: string;
  description: string | null;
  permissions: string[]; // Array of permission names
}

interface RoleCreateRequest {
  name: string;
  description?: string | null;
}

interface RoleUpdateRequest {
  name?: string;
  description?: string | null;
}

interface RolePermissionAssignRequest {
  permission_ids: number[];
}

// ============ Permission Types ============
interface PermissionResponse {
  id: number;
  name: string;
  description: string | null;
}

interface PermissionCreateRequest {
  name: string;
  description?: string | null;
}

interface PermissionUpdateRequest {
  name?: string;
  description?: string | null;
}

// ============ Query Params ============
interface RolesListParams {
  skip?: number;
  limit?: number;
  page?: number;
  size?: number;
  search?: string;
}

interface PermissionsListParams {
  skip?: number;
  limit?: number;
  page?: number;
  size?: number;
  search?: string;
}