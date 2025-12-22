import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout, setCredentials, setToken, setError } from '@/store/slices/authSlice';
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  authApi
} from '@/store/api/authApi';
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
  const [logoutMutation] = useLogoutMutation();
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

      // Store token first
      dispatch(setToken(loginResult.access_token));

      // Fetch user data using the API directly (since query is skipped initially)
      const userResult = await dispatch(
        authApi.endpoints.getCurrentUser.initiate(undefined)
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

      // After registration, user is returned but no token
      // User needs to login separately
      return { error: null, user: result };
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error);
      dispatch(setError(errorMessage));
      return { error: { message: errorMessage, original: error } };
    }
  };

  const signOut = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error);
    } finally {
      dispatch(logout());
    }
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

