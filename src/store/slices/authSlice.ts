import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserResponse } from '../api/types';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

// Initialize from localStorage - only token, user data will be fetched from API
const getStoredAuth = () => {
  try {
    const storedToken = localStorage.getItem('auth_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    if (storedToken) {
      return {
        user: null, // User data will be fetched from /auth/me
        token: storedToken,
        refreshToken: storedRefreshToken,
        isAuthenticated: false, // Will be set to true after fetching user data
        isAdmin: false, // Will be set after fetching user data
      };
    }
  } catch (error) {
    console.error('Error parsing stored auth:', error);
  }

  return {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isAdmin: false,
  };
};

const storedAuth = getStoredAuth();

const initialState: AuthState = {
  ...storedAuth,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: UserResponse; token: string; refreshToken?: string }>) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken || null;
      state.isAuthenticated = true; state.isAdmin = user.roles?.some((r: unknown) => {
        if (typeof r === 'string') {
          return r.toLowerCase() === 'admin';
        }
        if (typeof r === 'object' && r !== null && 'name' in r) {
          const roleObj = r as { name: string };
          return roleObj.name?.toLowerCase() === 'admin' || roleObj.name === 'Admin';
        }
        return false;
      }) || false;
      state.error = null;

      // Store only token in localStorage (not user data for security)
      localStorage.setItem('auth_token', token);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<UserResponse>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        state.isAdmin = state.user.roles?.some((r) => r.name === 'Admin') || false;
        // User data is not stored in localStorage for security
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      try {
        localStorage.setItem('auth_token', action.payload);
      } catch (error) {
        console.error('Failed to store token in localStorage:', error);
      }
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      try {
        localStorage.setItem('refresh_token', action.payload);
      } catch (error) {
        console.error('Failed to store refresh token in localStorage:', error);
      }
    },
  },
});

export const { setCredentials, logout, setLoading, setError, updateUser, setToken, setRefreshToken } = authSlice.actions;
export default authSlice.reducer;

