import { useState, useEffect } from 'react';
import { useAuth } from '@/store/hooks/useAuth';
import { useUserRole } from './useUserRole';

export const usePermission = (permissionName?: string) => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !permissionName) {
      setHasPermission(false);
      setLoading(false);
      return;
    }

    // Admin always has all permissions
    if (isAdmin) {
      setHasPermission(true);
      setLoading(false);
      return;
    }

    // Mock: For non-admin users, grant basic permissions
    // In real implementation, this would check user's role permissions
    const mockPermissions = ['read', 'write', 'view'];
    setHasPermission(mockPermissions.includes(permissionName));
    setLoading(false);
  }, [user, permissionName, isAdmin]);

  return { hasPermission, loading };
};

export const usePermissions = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    // Mock permissions based on role
    const mockPermissions = isAdmin
      ? ['read', 'write', 'delete', 'admin', 'view', 'edit']
      : ['read', 'view'];

    setPermissions(mockPermissions);
    setLoading(false);
  }, [user, isAdmin]);

  const checkPermission = (permissionName: string) => {
    return isAdmin || permissions.includes(permissionName);
  };

  return {
    permissions,
    loading,
    checkPermission,
  };
};
