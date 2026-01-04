import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetTicketsQuery, useCreateTicketMutation } from '@/store/api/supportApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Search,
  Plus,
  Loader2,
  Calendar,
  User,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getStatusColor, timeFormat } from '@/lib/helperfun';

const ClientSupportPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });

  const { data, isLoading, isError, refetch } = useGetTicketsQuery({
    skip: (page - 1) * 10,
    limit: 10,
    search: searchTerm || undefined,
  });

  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'closed':
        return 'default';
      case 'open':
        return 'secondary';
      case 'in_progress':
        return 'secondary';
      case 'resolved':
        return 'default';
      default:
        return 'secondary';
    }
  };

  // Filter tickets by status
  const filteredTickets = data?.items?.filter((ticket) => {
    if (statusFilter === 'all') return true;
    return ticket.status === statusFilter;
  }) || [];

  // Get counts for each status
  const allTickets = data?.items || [];
  const openCount = allTickets.filter((t) => t.status === 'open').length;
  const inProgressCount = allTickets.filter((t) => t.status === 'in_progress').length;
  const resolvedCount = allTickets.filter((t) => t.status === 'resolved').length;
  const closedCount = allTickets.filter((t) => t.status === 'closed').length;

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast({
        title: t('support.create.error.title'),
        description: t('support.create.error.description'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await createTicket({
        subject: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority,
      }).unwrap();

      toast({
        title: t('support.create.success.title'),
        description: t('support.create.success.description'),
      });

      setNewTicket({
        subject: '',
        description: '',
        priority: 'medium',
      });
      setIsCreateDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: t('support.create.error.title'),
        description: t('support.create.error.server'),
        variant: 'destructive',
      });
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('support.error.title')}</h3>
            <p className="text-muted-foreground mb-4">{t('support.error.description')}</p>
            <Button onClick={() => refetch()}>{t('common.retry')}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            {t('support.title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('support.subtitle')}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('support.create.button')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('support.create.title')}</DialogTitle>
              <DialogDescription>{t('support.create.description')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('support.create.subject')}</label>
                <Input
                  placeholder={t('support.create.subject_placeholder')}
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('support.create.priority')}</label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') =>
                    setNewTicket({ ...newTicket, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('support.priority.low')}</SelectItem>
                    <SelectItem value="medium">{t('support.priority.medium')}</SelectItem>
                    <SelectItem value="high">{t('support.priority.high')}</SelectItem>
                    <SelectItem value="urgent">{t('support.priority.urgent')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('support.create.description_label')}</label>
                <Textarea
                  placeholder={t('support.create.description_placeholder')}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleCreateTicket} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('support.create.creating')}
                  </>
                ) : (
                  t('support.create.submit')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('support.search_placeholder')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={t('support.filter_status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('support.filter.all')}</SelectItem>
                <SelectItem value="open">{t('support.status.open')}</SelectItem>
                <SelectItem value="in_progress">{t('support.status.in_progress')}</SelectItem>
                <SelectItem value="resolved">{t('support.status.resolved')}</SelectItem>
                <SelectItem value="closed">{t('support.status.closed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            {t('support.tabs.all')} ({allTickets.length})
          </TabsTrigger>
          <TabsTrigger value="open">
            {t('support.tabs.open')} ({openCount})
          </TabsTrigger>
          <TabsTrigger value="in_progress">
            {t('support.tabs.in_progress')} ({inProgressCount})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            {t('support.tabs.resolved')} ({resolvedCount})
          </TabsTrigger>
          <TabsTrigger value="closed">
            {t('support.tabs.closed')} ({closedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">{t('common.loading')}</span>
            </div>
          ) : filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? t('support.empty.search') : t('support.empty.title')}
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchTerm ? t('support.empty.search_description') : t('support.empty.description')}
                </p>
                {!searchTerm && (
                  <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('support.create.button')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {ticket.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            <span>{ticket.category?.name || t('support.no_category')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{timeFormat(ticket.created_at, 'MMM DD, YYYY')}</span>
                          </div>
                          {ticket.assigned_to && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{ticket.assigned_to.username}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={getStatusBadgeVariant(ticket.status)}
                          className={`${getStatusColor(ticket.status)} text-white capitalize`}
                        >
                          {ticket.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {data?.pagination && data.pagination.total_pages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    {t('support.pagination.showing', {
                      from: (page - 1) * 10 + 1,
                      to: Math.min(page * 10, data.pagination.total),
                      total: data.pagination.total,
                    })}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      {t('common.previous')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(data.pagination.total_pages, p + 1))}
                      disabled={page >= data.pagination.total_pages}
                    >
                      {t('common.next')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Ticket Detail Dialog */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {filteredTickets.find((t) => t.id === selectedTicket)?.title}
              </DialogTitle>
              <DialogDescription>
                {t('support.detail.description')}
              </DialogDescription>
            </DialogHeader>
            {(() => {
              const ticket = filteredTickets.find((t) => t.id === selectedTicket);
              if (!ticket) return null;
              return (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('support.detail.status')}</label>
                    <Badge
                      variant={getStatusBadgeVariant(ticket.status)}
                      className={`${getStatusColor(ticket.status)} text-white capitalize`}
                    >
                      {ticket.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('support.detail.description_label')}</label>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="text-muted-foreground">{t('support.detail.category')}</label>
                      <p className="font-medium">{ticket.category?.name || t('support.no_category')}</p>
                    </div>
                    <div>
                      <label className="text-muted-foreground">{t('support.detail.created')}</label>
                      <p className="font-medium">{timeFormat(ticket.created_at, 'MMM DD, YYYY HH:mm')}</p>
                    </div>
                    {ticket.assigned_to && (
                      <div>
                        <label className="text-muted-foreground">{t('support.detail.assigned_to')}</label>
                        <p className="font-medium">{ticket.assigned_to.username}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-muted-foreground">{t('support.detail.updated')}</label>
                      <p className="font-medium">{timeFormat(ticket.updated_at, 'MMM DD, YYYY HH:mm')}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                {t('common.close')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientSupportPage;
