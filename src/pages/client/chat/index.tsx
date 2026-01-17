import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable, ColumnDef } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Search,
  User,
  Package,
  Clock,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { timeFormat } from '@/lib/helperFun';
import { useTranslation } from 'react-i18next';
import { useGetConversationsQuery, useDeleteConversationMutation } from '@/store/api/messagingApi';
import { useAppSelector } from '@/store/hooks';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ClientChatPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useGetConversationsQuery({
    skip: 0,
    limit: 50,
  });
  const [deleteConversation] = useDeleteConversationMutation();

  // Extract conversations from response (handle both array and paginated response)
  const conversations = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if ('items' in data) return data.items;
    return [];
  }, [data]);

  // Get the other participant (not the current user)
  const getOtherParticipant = (conversation: Conversation) => {
    if (!currentUser) return null;
    if (conversation.participant1_id === currentUser.id) {
      return conversation.participant2;
    }
    return conversation.participant1;
  };

  // Get unread count for current user
  const getUnreadCount = (conversation: Conversation) => {
    if (!currentUser) return 0;
    if (conversation.participant1_id === currentUser.id) {
      return conversation.participant1_unread_count;
    }
    return conversation.participant2_unread_count;
  };

  // Filter conversations based on search term
  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations;

    return conversations.filter((conversation) => {
      // Get other participant inline
      const otherParticipant = currentUser
        ? (conversation.participant1_id === currentUser.id
          ? conversation.participant2
          : conversation.participant1)
        : null;
      const participantName = otherParticipant?.username || otherParticipant?.email || '';
      const listingTitle = conversation.listing?.title || '';
      const lastMessageContent = conversation.last_message?.content || '';

      return (
        participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lastMessageContent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [conversations, searchTerm, currentUser]);

  // Handle delete conversation
  const handleDeleteConversation = async (conversationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteConversation(conversationId).unwrap();
      toast({
        title: 'Success',
        description: 'Conversation deleted successfully',
      });
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'data' in error
          ? (error as { data?: { message?: string } }).data?.message
          : 'Failed to delete conversation';

      toast({
        title: 'Error',
        description: errorMessage || 'Failed to delete conversation',
        variant: 'destructive',
      });
    }
  };

  // Define table columns
  const columns: ColumnDef<Conversation>[] = [
    {
      id: 'participant',
      accessorKey: 'participant1_id',
      header: 'Participant',
      cell: ({ row }) => {
        const otherParticipant = getOtherParticipant(row);
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">
                {otherParticipant?.username || otherParticipant?.email || 'Unknown User'}
              </span>
              {otherParticipant?.email && (
                <span className="text-xs text-muted-foreground">{otherParticipant.email}</span>
              )}
            </div>
          </div>
        );
      },
      minWidth: 200,
      enableSorting: true,
    },
    {
      id: 'listing',
      accessorKey: (row) => row.listing?.title || '',
      header: 'Listing',
      cell: ({ row }) => {
        if (!row.listing) {
          return <span className="text-muted-foreground text-sm">No listing</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{row.listing.title}</span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: 'last_message',
      accessorKey: (row) => row.last_message?.content || '',
      header: 'Last Message',
      cell: ({ row }) => {
        if (!row.last_message) {
          return <span className="text-muted-foreground text-sm">No messages yet</span>;
        }
        const content = row.last_message.content;
        const truncatedContent = content.length > 60 ? content.substring(0, 60) + '...' : content;
        return (
          <div className="flex flex-col gap-1 max-w-md">
            <span className="text-sm line-clamp-2">{truncatedContent}</span>
            {row.last_message.created_at && (
              <span className="text-xs text-muted-foreground">
                {timeFormat(row.last_message.created_at, 'MMM DD, YYYY HH:mm')}
              </span>
            )}
          </div>
        );
      },
      minWidth: 250,
      enableSorting: false,
    },
    {
      id: 'unread_count',
      accessorKey: (row) => getUnreadCount(row),
      header: 'Unread',
      cell: ({ row }) => {
        const unreadCount = getUnreadCount(row);
        if (unreadCount === 0) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }
        return (
          <Badge variant="default" className="bg-primary">
            {unreadCount}
          </Badge>
        );
      },
      enableSorting: true,
    },
    {
      id: 'last_message_at',
      accessorKey: 'last_message_at',
      header: 'Last Activity',
      cell: ({ row }) => {
        if (!row.last_message_at) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{timeFormat(row.last_message_at, 'MMM DD, YYYY HH:mm')}</span>
          </div>
        );
      },
      enableSorting: true,
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <MessageSquare className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Conversations</h2>
        <p className="text-muted-foreground mb-6">
          Failed to load conversations. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            Conversations
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your conversations and messages
          </p>
        </div>
        <Button onClick={() => navigate('/client/chat/new')}>
          <MessageSquare className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Conversations</CardDescription>
            <CardTitle className="text-2xl">{conversations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Unread Messages</CardDescription>
            <CardTitle className="text-2xl text-primary">
              {conversations.reduce((acc, conv) => acc + getUnreadCount(conv), 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>With Listings</CardDescription>
            <CardTitle className="text-2xl">
              {conversations.filter((conv) => conv.listing !== null).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search conversations by participant, listing, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredConversations}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No conversations found. Start a new conversation to get started!"
        emptyIcon={<MessageSquare className="w-16 h-16" />}
        enableSorting={true}
        onRowClick={(row) => navigate(`/client/chat/${row.id}`)}
        renderActions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/client/chat/${row.id}`)}>
                Open Conversation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => handleDeleteConversation(row.id, e)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        actionsColumnHeader="Actions"
      />
    </div>
  );
};

export default ClientChatPage;
