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
  Wifi,
  WifiOff,
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
} from '@/store/api/messagingApi';
import { useAppSelector } from '@/store/hooks';
import { useToast } from '@/hooks/use-toast';

const Conversation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const currentUser = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const [messageContent, setMessageContent] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<Set<string>>(new Set()); // Track pending message content
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingMessageTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const maxReconnectAttempts = 5;
  const PING_INTERVAL = 30000; // 30 seconds
  const MESSAGE_TIMEOUT = 10000; // 10 seconds to wait for message confirmation

  const conversationId = Number(id);

  // Fetch conversation details
  const { data: conversation, isLoading: isLoadingConversation } = useGetConversationQuery(
    conversationId,
    { skip: !conversationId }
  );

  // Fetch all messages (use large limit to fetch all messages)
  // CRITICAL: Fetch all messages to ensure we have complete conversation history
  // Backend stores messages in JSON, so we fetch all at once for smooth experience
  const { data: messagesData, isLoading: isLoadingMessages, refetch: refetchMessages } = useGetMessagesQuery(
    {
      conversationId,
      params: { skip: 0, limit: 1000 }, // Fetch all messages (backend supports up to 1000)
    },
    {
      skip: !conversationId,
      // Always refetch on mount to get latest messages from database
      refetchOnMountOrArgChange: true,
    }
  );

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkMessageAsReadMutation();

  // Extract messages from response
  // CRITICAL: This is the source of truth from backend, includes messages from ALL users
  const apiMessages = React.useMemo(() => {
    if (!messagesData) return [];
    if (Array.isArray(messagesData)) return messagesData;
    if ('items' in messagesData) return messagesData.items;
    return [];
  }, [messagesData]);

  // Effect to clean up localMessages that are now in API (prevents duplicates)
  // This ensures we don't keep old local messages that are already fetched
  // BUT preserves messages from both users during concurrent sends
  React.useEffect(() => {
    // Only clean up if we have both API messages and local messages
    const apiMessageIds = new Set(apiMessages.map(m => m.id));
    setLocalMessages((prev) => {
      // If no local messages, nothing to clean up
      if (prev.length === 0) return prev;

      // Keep only messages that aren't in API yet
      // This preserves messages from both users during concurrent sends
      const filtered = prev.filter((msg) => !apiMessageIds.has(msg.id));

      // Only update if we actually removed something (avoid unnecessary re-renders)
      if (filtered.length !== prev.length) {
        return filtered;
      }
      return prev;
    });
  }, [apiMessages]); // Only run when apiMessages change (after refetch)

  // Merge API messages with local messages (from WebSocket)
  // Backend stores messages in order with race condition fixes (row locking, duplicate ID detection)
  // CRITICAL: We must preserve messages from BOTH users during concurrent sends
  const messages = React.useMemo(() => {
    // Create a map of all messages, prioritizing API messages (source of truth)
    const messageMap = new Map<number, Message>();

    // First, add all API messages (these are the source of truth from backend)
    // Backend ensures all messages are saved even during concurrent sends
    // This includes messages from both user1 and user2
    apiMessages.forEach((msg) => {
      messageMap.set(msg.id, msg);
    });

    // Then, add/update with any local WebSocket messages
    // These are messages received via WebSocket that may not be in the API response yet
    // IMPORTANT: We preserve ALL messages from ALL users (user1 and user2)
    localMessages.forEach((msg) => {
      const existing = messageMap.get(msg.id);
      if (existing) {
        // Message exists in API - merge WebSocket updates (read status, etc.)
        messageMap.set(msg.id, {
          ...existing,
          is_read: msg.is_read ?? existing.is_read,
          read_at: msg.read_at ?? existing.read_at,
          // Preserve sender info from API if available
          sender: existing.sender || msg.sender,
          // Preserve offer_id from API (source of truth)
          offer_id: existing.offer_id ?? msg.offer_id ?? null,
        });
      } else {
        // New message from WebSocket that hasn't been fetched yet
        // This is critical for concurrent sends - preserves messages from both users
        // Backend will save it with proper ID, and it will appear in next API fetch
        // Include all fields including offer_id if present
        messageMap.set(msg.id, {
          ...msg,
          offer_id: msg.offer_id ?? null,
        });
      }
    });

    // Convert to array and sort by created_at (backend maintains order)
    // Backend's duplicate ID detection ensures no ID conflicts
    // This ensures messages from both users appear in correct order
    const sortedMessages = Array.from(messageMap.values()).sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      // If dates are equal, sort by ID as tiebreaker (backend ensures unique IDs)
      if (dateA === dateB) {
        return a.id - b.id;
      }
      return dateA - dateB;
    });

    return sortedMessages;
  }, [apiMessages, localMessages]);

  // Get the other participant
  const otherParticipant = React.useMemo(() => {
    if (!conversation || !currentUser) return null;
    if (conversation.participant1_id === currentUser.id) {
      return conversation.participant2;
    }
    return conversation.participant1;
  }, [conversation, currentUser]);

  // Get WebSocket URL
  const getWebSocketUrl = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || '';
    // Convert HTTP/HTTPS to WS/WSS
    const wsUrl = apiUrl.replace(/^http/, 'ws');
    return `${wsUrl}messages/ws/${conversationId}?token=${token}`;
  };

  // Connect to WebSocket
  const connectWebSocket = () => {
    if (!token || !conversationId || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    const wsUrl = getWebSocketUrl();

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;

        // Start ping interval to keep connection alive
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, PING_INTERVAL);

        // Wait for 'connected' message from server before showing toast
        // The server sends a 'connected' message after authentication
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'new_message') {
            // Backend sends message in this format:
            // { type: 'new_message', conversation_id: number, message: Message }
            const newMessage = data.message;

            // Ensure message has proper structure matching backend response
            const formattedMessage: Message = {
              id: newMessage.id,
              conversation_id: newMessage.conversation_id || conversationId,
              sender_id: newMessage.sender_id,
              content: newMessage.content,
              is_read: newMessage.is_read || false,
              read_at: newMessage.read_at || null,
              created_at: newMessage.created_at,
              sender: newMessage.sender ? {
                id: newMessage.sender.id,
                username: newMessage.sender.username,
                email: newMessage.sender.email,
              } : null,
              attachments: newMessage.attachments || [],
              offer_id: newMessage.offer_id || null, // Include offer_id if present
            };

            // Remove from pending messages if this is a message we sent
            if (currentUser && formattedMessage.sender_id === currentUser.id) {
              setPendingMessages((prev) => {
                const updated = new Set(prev);
                updated.delete(formattedMessage.content);
                return updated;
              });

              // Clear timeout for this message
              const timeout = pendingMessageTimeoutRef.current.get(formattedMessage.content);
              if (timeout) {
                clearTimeout(timeout);
                pendingMessageTimeoutRef.current.delete(formattedMessage.content);
              }
            }

            setLocalMessages((prev) => {
              // Check if message already exists (duplicate detection)
              if (prev.some((msg) => msg.id === formattedMessage.id)) {
                return prev;
              }
              // Add new message (from any user - user1 or user2)
              return [...prev, formattedMessage];
            });

            // Don't immediately refetch - let the message appear first
            // Only refetch if we need to sync with backend (after a delay to allow backend to save)
            // This prevents overwriting messages during concurrent sends
            setTimeout(() => {
              refetchMessages();
            }, 500); // Small delay to allow backend to save and broadcast

            scrollToBottom();
          } else if (data.type === 'messages_read') {
            // Backend sends: { type: 'messages_read', conversation_id, message_ids, read_by }
            const messageIds = data.message_ids || [];
            setLocalMessages((prev) =>
              prev.map((msg) =>
                messageIds.includes(msg.id)
                  ? { ...msg, is_read: true, read_at: new Date().toISOString() }
                  : msg
              )
            );
            // Refetch to sync read status, but preserve all messages
            // Use a delay to avoid race conditions with concurrent message sends
            setTimeout(() => {
              refetchMessages();
            }, 300);
          } else if (data.type === 'connected') {
            // Connection confirmed by server after authentication
            setIsConnected(true);
            setIsConnecting(false);
            toast({
              title: 'Connected',
              description: 'Real-time chat is now active',
            });
          } else if (data.type === 'error') {
            const errorMessage = data.message || 'An error occurred';

            // If error occurred while sending a message, restore it to input
            if (errorMessage.includes('message') || errorMessage.includes('save')) {
              // Try to find the pending message and restore it
              const pendingArray = Array.from(pendingMessages);
              if (pendingArray.length > 0) {
                // Restore the most recent pending message
                const lastPending = pendingArray[pendingArray.length - 1];
                setMessageContent(lastPending);
                setPendingMessages((prev) => {
                  const updated = new Set(prev);
                  updated.delete(lastPending);
                  return updated;
                });
              }
            }

            toast({
              title: 'WebSocket Error',
              description: errorMessage,
              variant: 'destructive',
            });
          } else if (data.type === 'pong') {
            // Heartbeat response - no action needed
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnecting(false);
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);

        // Handle specific close codes from backend
        if (event.code === 4001) {
          toast({
            title: 'Authentication Failed',
            description: 'Please refresh the page and log in again.',
            variant: 'destructive',
          });
          return; // Don't reconnect on auth failure
        } else if (event.code === 4003) {
          toast({
            title: 'Access Denied',
            description: 'You are not authorized to access this conversation.',
            variant: 'destructive',
          });
          return; // Don't reconnect on authorization failure
        } else if (event.code === 4004) {
          toast({
            title: 'Conversation Not Found',
            description: 'This conversation no longer exists.',
            variant: 'destructive',
          });
          return; // Don't reconnect if conversation doesn't exist
        }

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);

          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          toast({
            title: 'Connection Lost',
            description: 'Unable to reconnect. Please refresh the page.',
            variant: 'destructive',
          });
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setIsConnecting(false);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to real-time chat',
        variant: 'destructive',
      });
    }
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    // Clear all pending message timeouts
    pendingMessageTimeoutRef.current.forEach((timeout) => clearTimeout(timeout));
    pendingMessageTimeoutRef.current.clear();

    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounting');
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  };

  // Send message via WebSocket
  const sendMessageViaWebSocket = (content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'send_message',
          content: content.trim(),
        })
      );
      return true;
    }
    return false;
  };

  // Mark messages as read via WebSocket
  const markMessagesAsReadViaWebSocket = (messageIds: number[]): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN && messageIds.length > 0) {
      wsRef.current.send(
        JSON.stringify({
          type: 'mark_read',
          message_ids: messageIds,
        })
      );
      return true;
    }
    return false;
  };

  // Connect WebSocket when component mounts or conversation changes
  useEffect(() => {
    if (conversationId && token) {
      connectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, token]);

  // Auto-scroll to bottom when new messages arrive
  // Only scroll if user is near bottom (within 100px) to avoid interrupting reading
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timeout = setTimeout(() => {
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

        // Only auto-scroll if user is near bottom or if it's the initial load (few messages)
        if (isNearBottom || messages.length <= 10) {
          scrollToBottom();
        }
      } else {
        scrollToBottom();
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages.length]); // Only trigger on message count change, not on every message update

  // Mark messages as read when viewing
  useEffect(() => {
    if (messages.length > 0 && currentUser && isConnected) {
      const unreadMessages = messages.filter(
        (msg) => !msg.is_read && msg.sender_id !== currentUser.id
      );

      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg) => msg.id);
        // Try WebSocket first for real-time updates, fallback to REST API
        if (!markMessagesAsReadViaWebSocket(messageIds)) {
          // Fallback: mark each message individually via REST API
          unreadMessages.forEach((msg) => {
            markAsRead({ messageId: msg.id, conversationId }).catch((error) => {
              console.error('Error marking message as read:', error);
            });
          });
        }
      }
    }
  }, [messages, currentUser, conversationId, markAsRead, isConnected]);

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

    // Try WebSocket first for instant delivery
    if (isConnected && sendMessageViaWebSocket(content)) {
      // Track pending message to handle timeouts and errors
      setPendingMessages((prev) => new Set(prev).add(content));

      // Set timeout to check if message was received
      // Backend now uses row locking which may cause slight delays
      const timeout = setTimeout(() => {
        // Check if message is still pending after timeout
        setPendingMessages((prev) => {
          if (prev.has(content)) {
            // Message not received, might have failed
            // Refetch to check if it was saved
            refetchMessages();

            // After refetch, check if message exists
            setTimeout(() => {
              setPendingMessages((current) => {
                if (current.has(content)) {
                  // Still pending, likely failed - restore to input
                  setMessageContent(content);
                  toast({
                    title: 'Message Not Delivered',
                    description: 'The message may not have been sent. Please try again.',
                    variant: 'destructive',
                  });
                  return new Set(Array.from(current).filter((msg) => msg !== content));
                }
                return current;
              });
            }, 1000);

            return new Set(Array.from(prev).filter((msg) => msg !== content));
          }
          return prev;
        });
      }, MESSAGE_TIMEOUT);

      pendingMessageTimeoutRef.current.set(content, timeout);

      // Message sent via WebSocket
      // Backend will send it back via 'new_message' event after row lock and save
      // With the race condition fixes, backend ensures all messages are saved even during concurrent sends
    } else {
      // Fallback to REST API if WebSocket is not connected
      try {
        await sendMessage({
          conversationId,
          data: { content },
        }).unwrap();

        // Refetch messages to get the latest (backend handles race conditions)
        // Use a small delay to ensure backend has saved the message
        setTimeout(() => {
          refetchMessages();
          scrollToBottom();
        }, 300);
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
            {isConnected ? (
              <Badge variant="default" className="bg-green-500">
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            ) : isConnecting ? (
              <Badge variant="secondary">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Connecting...
              </Badge>
            ) : (
              <Badge variant="destructive">
                <WifiOff className="w-3 h-3 mr-1" />
                Disconnected
              </Badge>
            )}
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

                    {/* Offer Link (if message is related to an offer) */}
                    {message.offer_id && (
                      <div className="mt-2 pt-2 border-t border-current/20">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs p-1"
                          onClick={() => navigate(ROUTES.CLIENT.OFFERS.DETAILS(message.offer_id!))}
                        >
                          <Package className="h-3 w-3 mr-1" />
                          View Offer #{message.offer_id}
                        </Button>
                      </div>
                    )}

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
