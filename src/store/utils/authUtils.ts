import { AppDispatch } from '../index';
import { logout } from '../slices/authSlice';
import { apiSlice } from '../api/apiSlice';

/**
 * Shared utility function to handle logout logic
 * Clears auth state and resets API cache
 * Can be used from both hooks and non-hook contexts
 */
export const performLogout = (dispatch: AppDispatch) => {
  // Clear local state and storage
  dispatch(logout());

  // Clear any cached API data by resetting the API state
  // This ensures no stale data remains after logout
  dispatch(apiSlice.util.resetApiState());
};

