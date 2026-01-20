import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { useGetCurrentUserQuery } from '@/store/api/authApi';
import { InitialLoader } from '@/components/common/InitialLoader';

interface ReduxProviderProps {
  children: ReactNode;
}

// Inner component that handles auth initialization (without navigation - that's handled in AuthRedirectHandler)
const AuthInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  const { data: currentUser, error: userError, isLoading: isLoadingUser } = useGetCurrentUserQuery(undefined, {
    skip: !token, // Fetch if token exists (even if user is not set yet)
  });
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch user data on mount if token exists but user is not loaded
  useEffect(() => {
    if (token && !user && currentUser) {
      // User data fetched from API, update credentials
      dispatch(setCredentials({ user: currentUser, token }));
      setIsInitializing(false);
    } else if (token && !user && !isLoadingUser && !currentUser) {
      // Token exists but user fetch failed or completed without data
      setIsInitializing(false);
    } else if (!token) {
      // No token, initialization complete
      setIsInitializing(false);
    } else if (user) {
      // User already loaded
      setIsInitializing(false);
    }
  }, [currentUser, token, user, dispatch, isLoadingUser]);

  // Handle authentication errors
  useEffect(() => {
    if (userError && 'status' in userError && userError.status === 401) {
      // Token is invalid, logout user
      dispatch(logout());
      setIsInitializing(false);
    }
  }, [userError, dispatch]);

  // Listen for storage changes (logout from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && !e.newValue && token) {
        dispatch(logout());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch, token]);

  // Show loading state while initializing auth (token exists but user not loaded yet)
  if (isInitializing && token && !user && isLoadingUser) {
    return <InitialLoader message={undefined} />;
  }

  return <>{children}</>;
};

export const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
};

