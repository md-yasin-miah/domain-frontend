import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { store } from '@/store';
import { logout, setCredentials, setToken, setRefreshToken, setError } from '@/store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  authApi
} from '@/store/api/authApi';
import { apiSlice } from '@/store/api/apiSlice';
import { profileApi } from '@/store/api/profileApi';
import { extractErrorMessage } from '@/lib/errorHandler';

/**
 * Custom hook to replace the old AuthContext
 * Provides the same interface but uses Redux under the hood
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const [loginMutation, { isLoading: loginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: signupLoading }] = useRegisterMutation();
  const { data: currentUser } = useGetCurrentUserQuery(undefined, {
    skip: !authState.token,
  });

  const signIn = async (email: string, password: string) => {
    try {
      dispatch(setError(null));
      // Login returns { access_token, refresh_token, token_type }
      const loginResult = await loginMutation({
        username: email, // Backend accepts username or email in username field
        password
      }).unwrap();

      // Store both tokens immediately - Redux updates are synchronous
      dispatch(setToken(loginResult.access_token));
      if (loginResult.refresh_token) {
        dispatch(setRefreshToken(loginResult.refresh_token));
      }

      // Verify tokens are in store and localStorage
      // Use a small delay to ensure Redux state is updated
      await new Promise(resolve => setTimeout(resolve, 0));

      const token = store.getState().auth.token;
      const storedToken = localStorage.getItem('auth_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');

      // Verify token was set - check both Redux state and localStorage
      if (!loginResult.access_token) {
        throw new Error('No access token received from login response');
      }

      if (!token || token !== loginResult.access_token) {
        // Token mismatch - try to read directly from localStorage as fallback
        const fallbackToken = localStorage.getItem('auth_token');
        if (!fallbackToken || fallbackToken !== loginResult.access_token) {
          throw new Error('Token was not set in store after login');
        }
        // If localStorage has the token but Redux doesn't, dispatch again
        dispatch(setToken(loginResult.access_token));
      }

      if (!storedToken || storedToken !== loginResult.access_token) {
        throw new Error('Token was not stored in localStorage after login');
      }

      if (loginResult.refresh_token && !storedRefreshToken) {
        console.warn('Refresh token not stored in localStorage');
      }

      // Fetch user data using the API directly with the token
      const userResult = await dispatch(
        authApi.endpoints.getCurrentUser.initiate(undefined, {
          forceRefetch: true,
        })
      ).unwrap();

      if (userResult) {
        dispatch(setCredentials({
          user: userResult,
          token: loginResult.access_token,
          refreshToken: loginResult.refresh_token, // Store refresh token from login response
        }));

        // Fetch profile completion status
        let profileCompletion = null;
        try {
          const completionResult = await dispatch(
            profileApi.endpoints.getProfileCompletion.initiate(undefined)
          ).unwrap();
          profileCompletion = completionResult;
        } catch (completionError) {
          // If profile completion API fails, continue without it
          console.warn('Failed to fetch profile completion:', completionError);
        }

        return {
          error: null,
          user: userResult,
          profileCompletion
        };
      }

      return { error: { message: 'Failed to fetch user data' }, user: null };
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error);
      dispatch(setError(errorMessage));
      return { error: { message: errorMessage, original: error }, user: null };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      dispatch(setError(null));
      const result = await registerMutation({
        email,
        password,
        username: username || email.split('@')[0]
      }).unwrap();
      return { error: null, user: result };
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error);
      dispatch(setError(errorMessage));
      return { error: { message: errorMessage, original: error } };
    }
  };

  const signOut = async () => {
    // Clear local state and storage
    dispatch(logout());

    // Clear any cached API data by resetting the API state
    // This ensures no stale data remains after logout
    dispatch(apiSlice.util.resetApiState());

    return { error: null };
  };

  return {
    user: authState.user,
    session: authState.user ? { user: authState.user } : null,
    loading: authState.loading || loginLoading || signupLoading,
    signUp,
    signIn,
    signOut,
    isAdmin: authState.isAdmin,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
  };
};

