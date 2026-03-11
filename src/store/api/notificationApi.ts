import { apiSlice } from "./apiSlice";

export interface Notification {
  id: number;
  user_id: number;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  related_listing_id: number | null;
  related_order_id: number | null;
  related_offer_id: number | null;
  related_message_id: number | null;
  created_at: string;
}

export interface NotificationUnreadCount {
  unread_count: number;
}

export interface NotificationFilters {
  skip?: number;
  limit?: number;
  is_read?: boolean;
  notification_type?: string;
}

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStreamNotifications: builder.query<Notification[], void>({
      query: () => ({
        url: "/notifications/stream",
        method: "GET",
      }),
      providesTags: ["User", "Notification"],
    }),
    getNotifications: builder.query<
      PaginatedResponse<Notification>,
      NotificationFilters
    >({
      query: (params) => ({
        url: "/notifications",
        method: "GET",
        params: {
          skip: params.skip,
          limit: params.limit,
          ...(params.is_read !== undefined && { is_read: params.is_read }),
          ...(params.notification_type && {
            notification_type: params.notification_type,
          }),
        },
      }),
      providesTags: ["User", "Notification"],
    }),
    getNotification: builder.query<Notification, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getUnreadCount: builder.query<NotificationUnreadCount, void>({
      query: () => ({
        url: "/notifications/unread/count",
        method: "GET",
      }),
      providesTags: ["User", "Notification"],
    }),
    markAsRead: builder.mutation<Notification, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }, "User"],
    }),
    markAllAsRead: builder.mutation<{ updated_count: number }, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "POST",
      }),
      invalidatesTags: ["User", "Notification"],
    }),
    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Notification"],
    }),
    deleteAllNotifications: builder.mutation<
      void,
      { is_read?: boolean } | void
    >({
      query: (params) => ({
        url: "/notifications",
        method: "DELETE",
        ...(params &&
          typeof params === "object" &&
          params.is_read !== undefined && {
            params: { is_read: params.is_read },
          }),
      }),
      invalidatesTags: ["User", "Notification"],
    }),
  }),
});

export const {
  useGetStreamNotificationsQuery,
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationApi;
