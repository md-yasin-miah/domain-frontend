import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { useUserRole } from '@/hooks/useUserRole';
import { Shield } from 'lucide-react';
import { useGetMyProfileQuery } from '@/store/api/profileApi';
import { InitialLoader } from '@/components/common/InitialLoader';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requirePermission?: string;
  requireRole?: string;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  requirePermission,
  requireRole
}: ProtectedRouteProps) {
  const { t } = useTranslation();
  const { user, loading, isAdmin } = useAuth();
  const { hasRole, loading: roleLoading } = useUserRole();
  const { hasPermission, loading: permissionLoading } = usePermission(requirePermission);
  const location = useLocation();
  const { data: profileCompletion, isLoading: profileLoading } = useGetMyProfileQuery(undefined, {
    skip: !user?.id || requireAdmin || location.pathname === '/client/profile-setup',
  });

  // Check profile completion from user object or profile completion query
  const profileCompleted = user?.is_profile_complete ?? null;

  if (loading || roleLoading || permissionLoading || (profileLoading && !requireAdmin && location.pathname !== '/client/profile-setup')) {
    return <InitialLoader message={t('auth.verifying')} />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to profile setup if profile is not completed (except for profile-setup page itself and admin routes)
  if (!requireAdmin && location.pathname !== '/client/profile-setup' && profileCompleted === false) {
    return <Navigate to="/client/profile-setup" replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t('auth.access_restricted')}</h1>
          <p className="text-muted-foreground">
            {t('auth.admin_required')}
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-primary hover:underline"
          >
            {t('auth.go_back')}
          </button>
        </div>
      </div>
    );
  }

  // Check role requirement
  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t('auth.access_denied')}</h1>
          <p className="text-muted-foreground">
            {t('auth.role_required')} {requireRole} {t('auth.to_access')}
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-primary hover:underline"
          >
            {t('auth.go_back')}
          </button>
        </div>
      </div>
    );
  }

  // Check permission requirement
  if (requirePermission && !hasPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t('auth.permission_required')}</h1>
          <p className="text-muted-foreground">
            {t('auth.permission_needed')}
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-primary hover:underline"
          >
            {t('auth.go_back')}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}