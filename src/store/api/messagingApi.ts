import { apiSlice } from './apiSlice';
import type {
  Conversation,
  Message,
  MessageCreateRequest,
  ConversationCreateRequest,
  PaginatedResponse,
  PaginationParams,
} from './types';

export const messagingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<PaginatedResponse<Conversation> | Conversation[], PaginationParams>({
      query: (params) => ({
        url: '/messages/conversations',
        method: 'GET',
        params,
      }),
      providesTags: ['Ticket'],
    }),
    createConversation: builder.mutation<Conversation, ConversationCreateRequest>({
      query: (data) => ({
        url: '/messages/conversations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Ticket'],
    }),
    getConversation: builder.query<Conversation, number>({
      query: (id) => ({
        url: `/messages/conversations/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Ticket', id }],
    }),
    getMessages: builder.query<PaginatedResponse<Message> | Message[], { conversationId: number; params?: PaginationParams }>({
      query: ({ conversationId, params }) => ({
        url: `/messages/conversations/${conversationId}/messages`,
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { conversationId }) => [{ type: 'Ticket', id: conversationId }],
    }),
    sendMessage: builder.mutation<Message, { conversationId: number; data: MessageCreateRequest }>({
      query: ({ conversationId, data }) => ({
        url: `/messages/conversations/${conversationId}/messages`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { conversationId }) => [{ type: 'Ticket', id: conversationId }, 'Ticket'],
    }),
    markMessageAsRead: builder.mutation<void, number>({
      query: (messageId) => ({
        url: `/messages/${messageId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Ticket'],
    }),
    attachFileToMessage: builder.mutation<void, { messageId: number; fileUploadId: number }>({
      query: ({ messageId, fileUploadId }) => ({
        url: `/messages/${messageId}/attachments/${fileUploadId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { messageId }) => [{ type: 'Ticket', id: messageId }, 'Ticket'],
    }),
    getMessageAttachments: builder.query<any[], number>({
      query: (messageId) => ({
        url: `/messages/${messageId}/attachments`,
        method: 'GET',
      }),
      providesTags: (result, error, messageId) => [{ type: 'Ticket', id: messageId }],
    }),
    removeMessageAttachment: builder.mutation<void, { messageId: number; attachmentId: number }>({
      query: ({ messageId, attachmentId }) => ({
        url: `/messages/${messageId}/attachments/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { messageId }) => [{ type: 'Ticket', id: messageId }, 'Ticket'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessageAsReadMutation,
  useAttachFileToMessageMutation,
  useGetMessageAttachmentsQuery,
  useRemoveMessageAttachmentMutation,
} = messagingApi;

