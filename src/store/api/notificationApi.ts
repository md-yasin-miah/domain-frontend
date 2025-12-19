import { apiSlice } from './apiSlice';
import type { PaginatedResponse, PaginationParams } from './types';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_id: number | null;
  related_type: string | null;
  created_at: string;
}

export interface NotificationUnreadCount {
  count: number;
}

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<PaginatedResponse<Notification> | Notification[], PaginationParams>({
      query: (params) => ({
        url: '/notifications',
        method: 'GET',
        params,
      }),
      providesTags: ['User'],
    }),
    getNotification: builder.query<Notification, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    getUnreadCount: builder.query<NotificationUnreadCount, void>({
      query: () => ({
        url: '/notifications/unread/count',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    markAsRead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }, 'User'],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),
    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    deleteAllNotifications: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationApi;

