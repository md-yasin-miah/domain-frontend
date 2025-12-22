import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

// Helper function to redirect based on role
const redirectBasedOnRole = (roles: unknown, navigate: (path: string, options?: { replace?: boolean }) => void) => {
  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    navigate('/client/dashboard', { replace: true });
    return;
  }

  // Normalize roles - handle both string array and object array
  const normalizedRoles = roles.map((r: unknown) => {
    if (typeof r === 'string') {
      return r.toLowerCase();
    }
    if (typeof r === 'object' && r !== null && 'name' in r) {
      const roleObj = r as { name: string };
      return roleObj.name?.toLowerCase() || '';
    }
    return '';
  }).filter((r: string) => r !== '');

  if (normalizedRoles.length === 0) {
    navigate('/client/dashboard', { replace: true });
    return;
  }

  // Prioritize admin role
  const adminRole = normalizedRoles.find((r: string) => r === 'admin');
  const primaryRole = adminRole || normalizedRoles[0];

  switch (primaryRole) {
    case 'admin':
      navigate('/admin/dashboard', { replace: true });
      break;
    case 'support':
      navigate('/support/dashboard', { replace: true });
      break;
    case 'accounts':
      navigate('/accounts/dashboard', { replace: true });
      break;
    case 'customer':
    default:
      navigate('/client/dashboard', { replace: true });
      break;
  }
};

/**
 * Component that handles redirecting authenticated users away from /auth
 * and to their appropriate dashboard based on role.
 * This component must be used inside a Router context.
 */
export const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  // Redirect authenticated users away from /auth and to their dashboard
  useEffect(() => {
    if (user && user.roles && location.pathname === '/auth') {
      redirectBasedOnRole(user.roles, navigate);
    }
  }, [user, location.pathname, navigate]);

  return null;
};

