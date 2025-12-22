import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const useUserRole = () => {
  const { user } = useAuth();

  // Extract roles from user object - API returns roles as array of strings
  const roles = useMemo(() => {
    if (!user || !user.roles) return [];
    
    // Handle both formats: array of strings or array of objects
    if (Array.isArray(user.roles)) {
      return user.roles.map((role: string | { name: string }) => 
        typeof role === 'string' ? role : role.name
      );
    }
    return [];
  }, [user]);

  // Get primary role (first role, prioritizing admin)
  const primaryRole = useMemo(() => {
    if (!roles || roles.length === 0) return null;
    
    // Prioritize admin role
    const adminIndex = roles.findIndex((r: string) => 
      r.toLowerCase() === 'admin' || r === 'Admin'
    );
    
    if (adminIndex !== -1) {
      return roles[adminIndex];
    }
    
    // Return first role
    return roles[0];
  }, [roles]);

  const hasRole = (roleName: string) => {
    if (!roles || roles.length === 0) return false;
    return roles.some((role: string) => 
      role.toLowerCase() === roleName.toLowerCase() || role === roleName
    );
  };

  const isAdmin = hasRole('admin') || hasRole('Admin');

  return {
    roles,
    primaryRole,
    loading: false, // No async loading needed
    hasRole,
    isAdmin,
  };
};
