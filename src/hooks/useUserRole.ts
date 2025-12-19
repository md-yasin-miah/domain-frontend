import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { mockAuth } from '@/lib/mockData';

export interface UserRole {
  id: string;
  name: string;
  description: string;
}

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [primaryRole, setPrimaryRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setPrimaryRole(null);
      setLoading(false);
      return;
    }

    const fetchUserRoles = () => {
      try {
        const userRoles = mockAuth.getUserRoles(user.id);
        setRoles(userRoles);
        
        // Set primary role (first role, prioritizing Admin)
        if (userRoles && userRoles.length > 0) {
          const adminRole = userRoles.find(r => r.name === 'Admin');
          setPrimaryRole(adminRole ? 'Admin' : userRoles[0].name);
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setRoles([]);
        setPrimaryRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (roleName: string) => {
    return roles.some(role => role.name === roleName);
  };

  const isAdmin = hasRole('Admin');

  return {
    roles,
    primaryRole,
    loading,
    hasRole,
    isAdmin,
  };
};
