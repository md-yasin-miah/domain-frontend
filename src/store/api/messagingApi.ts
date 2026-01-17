import { apiSlice } from './apiSlice';

export const messagingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<PaginatedResponse<Conversation> | Conversation[], PaginationParams>({
      query: (params) => ({
        url: '/messages/conversations',
        method: 'GET',
        params,
      }),
      providesTags: ['Messaging'],
    }),
    createConversation: builder.mutation<Conversation, ConversationCreateRequest>({
      query: (data) => ({
        url: '/messages/conversations',
        method: 'POST',
        params: {
          participant2_id: data.participant2_id,
          ...(data.listing_id && { listing_id: data.listing_id }),
        },
      }),
      invalidatesTags: ['Messaging'],
    }),
    getConversation: builder.query<Conversation, number>({
      query: (id) => ({
        url: `/messages/conversations/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Messaging', id }],
    }),
    getMessages: builder.query<PaginatedResponse<Message>, { conversationId: number; params?: PaginationParams }>({
      query: ({ conversationId, params }) => ({
        url: `/messages/conversations/${conversationId}/messages`,
        method: 'GET',
        params,
      }),
      providesTags: (result, error, { conversationId }) => [{ type: 'Messaging', id: conversationId }],
    }),
    sendMessage: builder.mutation<Message, { conversationId: number; data: MessageCreateRequest }>({
      query: ({ conversationId, data }) => ({
        url: `/messages/conversations/${conversationId}/messages`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { conversationId }) => [{ type: 'Messaging', id: conversationId }, 'Messaging'],
    }),
    markMessageAsRead: builder.mutation<Message, { messageId: number; conversationId: number }>({
      query: ({ messageId, conversationId }) => ({
        url: `/messages/${messageId}/read`,
        method: 'PUT',
        params: {
          conversation_id: conversationId,
        },
      }),
      invalidatesTags: (result, error, { conversationId }) => [{ type: 'Messaging', id: conversationId }, 'Messaging'],
    }),
    getMessage: builder.query<Message, { messageId: number; conversationId: number }>({
      query: ({ messageId, conversationId }) => ({
        url: `/messages/${messageId}`,
        method: 'GET',
        params: {
          conversation_id: conversationId,
        },
      }),
      providesTags: (result, error, { conversationId }) => [{ type: 'Messaging', id: conversationId }],
    }),
    deleteConversation: builder.mutation<void, number>({
      query: (conversationId) => ({
        url: `/messages/conversations/${conversationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Messaging'],
    }),
    // Attach file to message
    attachFileToMessage: builder.mutation<void, { messageId: number; fileUploadId: number }>({
      query: ({ messageId, fileUploadId }) => ({
        url: `/messages/${messageId}/attachments/${fileUploadId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { messageId }) => [{ type: 'Messaging', id: messageId }, 'Messaging'],
    }),
    getMessageAttachments: builder.query<MessageAttachment[], number>({
      query: (messageId) => ({
        url: `/messages/${messageId}/attachments`,
        method: 'GET',
      }),
      providesTags: (result, error, messageId) => [{ type: 'Messaging', id: messageId }],
    }),
    removeMessageAttachment: builder.mutation<void, { messageId: number; attachmentId: number }>({
      query: ({ messageId, attachmentId }) => ({
        url: `/messages/${messageId}/attachments/${attachmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { messageId }) => [{ type: 'Messaging', id: messageId }, 'Messaging'],
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
  useGetMessageQuery,
  useDeleteConversationMutation,
  useAttachFileToMessageMutation,
  useGetMessageAttachmentsQuery,
  useRemoveMessageAttachmentMutation,
} = messagingApi;

