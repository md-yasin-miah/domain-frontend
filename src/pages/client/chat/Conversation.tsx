import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Send,
  User,
  Package,
  Image as ImageIcon,
  Paperclip,
  Check,
  CheckCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { timeFormat } from '@/lib/helperFun';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import {
  useGetConversationQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessageAsReadMutation,
  useSyncMessagesMutation,
  useUpdateActivityMutation,
} from '@/store/api/messagingApi';
import { useAppSelector } from '@/store/hooks';
import { useToast } from '@/hooks/use-toast';

// Polling intervals (in milliseconds)
const MESSAGE_POLL_INTERVAL = 2500; // Poll messages every 2.5 seconds
const ACTIVITY_UPDATE_INTERVAL = 12000; // Update activity every 12 seconds

const Conversation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const activityUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const conversationId = Number(id);

  // Fetch conversation details
  const { data: conversation, isLoading: isLoadingConversation } = useGetConversationQuery(
    conversationId,
    { skip: !conversationId }
  );

  // Fetch all messages with polling enabled
  const { data: messagesData, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetMessagesQuery(
    {
      conversationId,
      params: { skip: 0, limit: 1000 }, // Fetch all messages (backend supports up to 1000)
    },
    {
      skip: !conversationId,
      // Enable polling for real-time updates
      pollingInterval: MESSAGE_POLL_INTERVAL,
    }
  );

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();
  const [syncMessages] = useSyncMessagesMutation();
  const [updateActivity] = useUpdateActivityMutation();

  // Extract messages from response
  const messages = React.useMemo(() => {
    if (!messagesData) return [];
    if (Array.isArray(messagesData)) return messagesData;
    if ('items' in messagesData) return messagesData.items;
    return [];
  }, [messagesData]);

  // Get the other participant
  const otherParticipant = React.useMemo(() => {
    if (!conversation || !currentUser) return null;
    if (conversation.participant1_id === currentUser.id) {
      return conversation.participant2;
    }
    return conversation.participant1;
  }, [conversation, currentUser]);

  // Start activity updates
  useEffect(() => {
    if (!conversationId) return;

    // Update activity immediately
    updateActivity(conversationId).catch((error) => {
      console.error('Error updating activity:', error);
    });

    // Then update every 10-15 seconds
    activityUpdateIntervalRef.current = setInterval(() => {
      updateActivity(conversationId).catch((error) => {
        console.error('Error updating activity:', error);
      });
    }, ACTIVITY_UPDATE_INTERVAL);

    return () => {
      if (activityUpdateIntervalRef.current) {
        clearInterval(activityUpdateIntervalRef.current);
        activityUpdateIntervalRef.current = null;
      }
    };
  }, [conversationId, updateActivity]);

  // Sync messages on page unload
  useEffect(() => {
    if (!conversationId) return;

    const handleBeforeUnload = async () => {
      try {
        await syncMessages(conversationId).unwrap();
      } catch (error) {
        console.error('Error syncing messages:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also sync when component unmounts
      syncMessages(conversationId).catch((error) => {
        console.error('Error syncing messages on unmount:', error);
      });
    };
  }, [conversationId, syncMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (messages.length > 0 && currentUser) {
      const unreadMessages = messages.filter(
        (msg) => !msg.is_read && msg.sender_id !== currentUser.id
      );

      if (unreadMessages.length > 0) {
        // Mark each message as read via REST API
        unreadMessages.forEach((msg) => {
          markAsRead({ messageId: msg.id, conversationId }).catch((error) => {
            console.error('Error marking message as read:', error);
          });
        });
      }
    }
  }, [messages, currentUser, conversationId, markAsRead]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    } else {
      // Fallback to scrollIntoView if container ref is not available
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || isSending) return;

    const content = messageContent.trim();
    setMessageContent('');

    try {
      await sendMessage({
        conversationId,
        data: { content },
      }).unwrap();

      // Refetch messages to get the latest (includes Redis messages)
      refetchMessages();
      scrollToBottom();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'data' in error
          ? (error as { data?: { message?: string; detail?: string } }).data?.message ||
          (error as { data?: { detail?: string } }).data?.detail
          : 'Failed to send message';

      toast({
        title: 'Error',
        description: errorMessage || 'Failed to send message',
        variant: 'destructive',
      });

      // Restore message content on error
      setMessageContent(content);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Loading state
  if (isLoadingConversation || isLoadingMessages) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Conversation Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The conversation you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate(ROUTES.CLIENT.CHAT.ROOT)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Conversations
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-card p-4">
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.CLIENT.CHAT.ROOT}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">
                {otherParticipant?.username || otherParticipant?.email || 'Unknown User'}
              </span>
              {conversation.listing && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Package className="h-3 w-3" />
                  <span>{conversation.listing.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Live
            </Badge>
          </div>
          {conversation.listing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/marketplace/${conversation.listing?.slug}`)}
            >
              <Package className="w-4 h-4 mr-2" />
              View Listing
            </Button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground text-sm">
              Start the conversation by sending a message below.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUser?.id;
            const showAvatar = !isOwnMessage;

            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  isOwnMessage ? 'justify-end' : 'justify-start'
                )}
              >
                {/* Avatar (only for received messages) */}
                {showAvatar && (
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={cn(
                    'flex flex-col gap-1 max-w-[70%]',
                    isOwnMessage ? 'items-end' : 'items-start'
                  )}
                >
                  {/* Sender Name (only for received messages) */}
                  {!isOwnMessage && message.sender && (
                    <span className="text-xs font-medium text-muted-foreground px-2">
                      {message.sender.username || message.sender.email}
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2 shadow-sm',
                      isOwnMessage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border text-foreground'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-2 p-2 rounded bg-background/50"
                          >
                            {attachment.file_type?.startsWith('image/') ? (
                              <ImageIcon className="h-4 w-4" />
                            ) : (
                              <Paperclip className="h-4 w-4" />
                            )}
                            <a
                              href={attachment.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs hover:underline truncate"
                            >
                              {attachment.filename}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timestamp and Read Status */}
                  <div
                    className={cn(
                      'flex items-center gap-2 text-xs text-muted-foreground px-2',
                      isOwnMessage ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <span>{timeFormat(message.created_at, 'MMM DD, HH:mm')}</span>
                    {isOwnMessage && (
                      <span>
                        {message.is_read ? (
                          <CheckCheck className="h-3 w-3 text-primary" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Avatar (only for sent messages, for alignment) */}
                {isOwnMessage && (
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t bg-card p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              rows={1}
              className="resize-none min-h-[60px] max-h-[120px] pr-12"
              disabled={isSending}
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Attach file"
                disabled
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Attach image"
                disabled
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!messageContent.trim() || isSending}
            className="bg-primary hover:bg-primary/90"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default Conversation;
