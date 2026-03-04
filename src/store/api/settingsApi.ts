/**
 * Settings API: GET (public) and PUT (admin) /settings.
 * Returns flat key-value website settings including commission options.
 */
import { apiSlice } from './apiSlice';

export interface SettingsResponse {
  site_name?: string;
  site_logo_url?: string;
  site_description?: string;
  default_currency?: string;
  support_email?: string;
  buyer_commission_percent?: number | string;
  seller_commission_percent?: number | string;
  buyer_commission_type?: string;
  seller_commission_type?: string;
  buyer_commission_fixed?: number | string;
  seller_commission_fixed?: number | string;
  [key: string]: unknown;
}

export interface SettingsUpdateRequest {
  site_name?: string | null;
  site_logo_url?: string | null;
  site_description?: string | null;
  default_currency?: string | null;
  support_email?: string | null;
  buyer_commission_percent?: number | null;
  seller_commission_percent?: number | null;
  buyer_commission_type?: string | null;
  seller_commission_type?: string | null;
  buyer_commission_fixed?: number | null;
  seller_commission_fixed?: number | null;
}

export const settingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<SettingsResponse, void>({
      query: () => ({
        url: '/settings',
        method: 'GET',
      }),
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<SettingsResponse, SettingsUpdateRequest>({
      query: (body) => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
