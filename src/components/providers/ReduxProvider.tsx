import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { useGetCurrentUserQuery } from '@/store/api/authApi';

interface ReduxProviderProps {
  children: ReactNode;
}

// Inner component that handles auth initialization
const AuthInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const { data: currentUser, error: userError } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated || !token,
  });

  useEffect(() => {
    // Update user if currentUser query returns data
    if (currentUser && token) {
      dispatch(setCredentials({ user: currentUser, token }));
    }
  }, [currentUser, token, dispatch]);

  // Handle authentication errors
  useEffect(() => {
    if (userError && 'status' in userError && userError.status === 401) {
      // Token is invalid, logout user
      dispatch(logout());
    }
  }, [userError, dispatch]);

  // Listen for storage changes (logout from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && !e.newValue && isAuthenticated) {
        dispatch(logout());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
};

export const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
};

