import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

// Base query for API calls
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    // Always set Authorization header if token exists
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Only set Content-Type if not already set (FormData will be handled automatically)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    headers.set('Accept', 'application/json');
    return headers;
  },
});

// Base query with reauth logic (can be extended later for token refresh)
const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  // Handle FormData - don't set Content-Type header, browser will set it with boundary
  if (args && typeof args === 'object' && 'body' in args && args.body instanceof FormData) {
    // Remove Content-Type header for FormData requests
    if (args.headers && typeof args.headers === 'object' && 'Content-Type' in args.headers) {
      const headers = args.headers as Record<string, string>;
      delete headers['Content-Type'];
    }
  }

  const result = await baseQuery(args, api, extraOptions);

  // Handle 401 errors - could implement token refresh here
  if (result.error && 'status' in result.error && result.error.status === 401) {
    // Optionally: try to refresh token or logout user
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'User',
    'Domain',
    'Blog',
    'FAQ',
    'Role',
    'Permission',
    'Invoice',
    'Ticket',
    'Category',
    'Notification',
    'Upload',
    'Verification',
    'Analytics',
    'Valuation',
    'Social',
    'Bulk',
    'Export',
    'SavedSearch',
    'SearchAlert',
    'Commission',
  ],
  endpoints: () => ({}),
});

