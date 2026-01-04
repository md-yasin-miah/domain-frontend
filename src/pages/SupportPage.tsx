import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Search, Plus, CheckCircle, AlertCircle, MessageCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/store/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useGetTicketsQuery, useCreateTicketMutation } from "@/store/api/supportApi";
import { useGetSupportCategoriesQuery } from "@/store/api/categoryApi";
import { getStatusColor, timeFormat } from "@/lib/helperfun";

const SupportPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category_id: '',
    priority: '' as 'low' | 'medium' | 'high' | 'urgent' | '',
    description: '',
    email: '',
    name: ''
  });

  const [tab, setTab] = useState(user ? 'tickets' : 'create');

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Fetch tickets
  const { data: ticketsData, isLoading: isLoadingTickets, error: ticketsError, refetch } = useGetTicketsQuery({
    page: 1,
    limit: 100,
  });

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetSupportCategoriesQuery({ is_active: true });

  // Create ticket mutation
  const [createTicket, { isLoading: isCreatingTicket }] = useCreateTicketMutation();

  const tickets = useMemo(() => ticketsData?.items || [], [ticketsData?.items]);
  const categories = categoriesData || [];

  // Filter tickets by status and search term
  const filteredTickets = useMemo(() => {
    let filtered = tickets;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.title?.toLowerCase().includes(searchLower) ||
        ticket.id.toString().includes(searchLower) ||
        ticket.category?.name?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [tickets, statusFilter, searchTerm]);

  // Get status counts
  const statusCounts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      in_progress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
    };
  }, [tickets]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'in_progress': return 'secondary';
      case 'resolved': return 'default';
      case 'closed': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`support.status.${status}`) || status;
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return 'text-gray-600 bg-gray-50 border-gray-200';
    switch (priority.toLowerCase()) {
      case 'urgent':
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityLabel = (priority?: string) => {
    if (!priority) return '';
    return t(`support.priority.${priority.toLowerCase()}`) || priority;
  };

  const handleCreateTicket = async () => {
    // Validate required fields
    if (!newTicket.subject || !newTicket.description) {
      toast({
        title: t('support.create.error.title'),
        description: t('support.create.error.description'),
        variant: "destructive"
      });
      return;
    }

    if (!user && (!newTicket.email || !newTicket.name)) {
      toast({
        title: t('support.create.error.title'),
        description: t('support.create.error.description'),
        variant: "destructive"
      });
      return;
    }

    try {
      const ticketData: TicketCreateRequest = {
        subject: newTicket.subject,
        description: newTicket.description,
      };
      if (newTicket.priority) {
        ticketData.priority = newTicket.priority;
      }
      if (newTicket.category_id) {
        ticketData.category_id = parseInt(newTicket.category_id);
      }
      await createTicket(ticketData).unwrap();

      toast({
        title: t('support.create.success.title'),
        description: t('support.create.success.description'),
      });

      // Reset form
      setNewTicket({
        subject: '',
        category_id: '',
        priority: '',
        description: '',
        email: '',
        name: ''
      });

      // Switch to tickets tab if user is logged in
      if (user) {
        setTab('tickets');
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data
        ? String(error.data.message)
        : t('support.create.error.server');
      toast({
        title: t('support.create.error.title'),
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleContactSubmit = async () => {
    // Contact form can also create a ticket
    if (!contactForm.subject || !contactForm.message || !contactForm.email || !contactForm.name) {
      toast({
        title: t('support.create.error.title'),
        description: t('support.create.error.description'),
        variant: "destructive"
      });
      return;
    }

    try {
      const ticketData: TicketCreateRequest = {
        subject: contactForm.subject,
        description: contactForm.message,
      };
      await createTicket(ticketData).unwrap();

      toast({
        title: t('support.create.success.title'),
        description: t('support.create.success.description'),
      });

      // Reset form
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error && typeof error.data === 'object' && error.data !== null && 'message' in error.data
        ? String(error.data.message)
        : t('support.create.error.server');
      toast({
        title: t('support.create.error.title'),
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            {t('support.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('support.subtitle')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">
            {t('support.tickets.title')} {statusCounts.all > 0 && `(${statusCounts.all})`}
          </TabsTrigger>
          <TabsTrigger value="create">{t('support.create.button')}</TabsTrigger>
          <TabsTrigger value="contact">{t('support.contact.title')}</TabsTrigger>
          <TabsTrigger value="knowledge">{t('support.knowledge.title')}</TabsTrigger>
        </TabsList>

        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="mt-6">
          {!user ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('support.tickets.no_tickets_title')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('support.tickets.no_tickets_description')}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => setTab('create')}>
                    {t('support.tickets.create_without_account')}
                  </Button>
                  <Button onClick={() => setTab('create')}>
                    {t('support.tickets.new_ticket')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Status Filter Tabs */}
              <div className="mb-6">
                <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">
                      {t('support.tabs.all')} ({statusCounts.all})
                    </TabsTrigger>
                    <TabsTrigger value="open">
                      {t('support.tabs.open')} ({statusCounts.open})
                    </TabsTrigger>
                    <TabsTrigger value="in_progress">
                      {t('support.tabs.in_progress')} ({statusCounts.in_progress})
                    </TabsTrigger>
                    <TabsTrigger value="resolved">
                      {t('support.tabs.resolved')} ({statusCounts.resolved})
                    </TabsTrigger>
                    <TabsTrigger value="closed">
                      {t('support.tabs.closed')} ({statusCounts.closed})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t('support.tickets.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Loading State */}
              {isLoadingTickets && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-20 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Error State */}
              {ticketsError && !isLoadingTickets && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t('support.error.title')}</h3>
                    <p className="text-muted-foreground mb-4">
                      {t('support.error.description')}
                    </p>
                    <Button onClick={() => refetch()}>
                      {t('common.retry')}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Tickets List */}
              {!isLoadingTickets && !ticketsError && (
                <>
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            {/* Ticket Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`} />
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="font-semibold text-lg">{ticket.title || ticket.id}</h3>
                                  <Badge variant={getStatusBadge(ticket.status)}>
                                    {getStatusLabel(ticket.status)}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 flex-wrap">
                                  <span>#{ticket.id}</span>
                                  {ticket.category && (
                                    <span>{t('support.detail.category')}: {ticket.category.name || t('support.no_category')}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                                  <span>{t('support.detail.created')}: {timeFormat(ticket.created_at, 'lll')}</span>
                                  <span>{t('support.detail.updated')}: {timeFormat(ticket.updated_at, 'lll')}</span>
                                  {ticket.assigned_to && (
                                    <span>{t('support.detail.assigned_to')}: {ticket.assigned_to.username || ticket.assigned_to.email}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 ml-4">
                              <Button variant="outline" size="sm">
                                {t('support.tickets.view_details')}
                              </Button>
                              {ticket.status !== 'closed' && (
                                <Button size="sm" className="bg-primary hover:bg-primary/90">
                                  {t('support.tickets.respond')}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Empty State */}
                  {filteredTickets.length === 0 && !isLoadingTickets && (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        {searchTerm ? t('support.empty.search') : t('support.empty.title')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm ? t('support.empty.search_description') : t('support.empty.description')}
                      </p>
                      {!searchTerm && (
                        <Button onClick={() => setTab('create')}>
                          <Plus className="w-4 h-4 mr-2" />
                          {t('support.tickets.create_ticket')}
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </TabsContent>

        {/* Create Ticket Tab */}
        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('support.create.title')}</CardTitle>
              <CardDescription>
                {t('support.create.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!user && (
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm">
                    <strong>{t('support.form.tip')}</strong> {t('support.form.tip_text')}
                  </p>
                </div>
              )}

              {!user && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('support.form.name')} *</label>
                    <Input
                      placeholder={t('support.form.name_placeholder')}
                      value={newTicket.name}
                      onChange={(e) => setNewTicket({ ...newTicket, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('support.form.email_required')} *</label>
                    <Input
                      type="email"
                      placeholder={t('support.form.email_placeholder_form')}
                      value={newTicket.email}
                      onChange={(e) => setNewTicket({ ...newTicket, email: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('support.create.subject')} *</label>
                  <Input
                    placeholder={t('support.create.subject_placeholder')}
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  />
                </div>
                {categories.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('support.form.category_label')}</label>
                    <Select
                      value={newTicket.category_id}
                      onValueChange={(value) => setNewTicket({ ...newTicket, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('support.form.category_placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCategories ? (
                          <SelectItem value="loading" disabled>{t('common.loading')}</SelectItem>
                        ) : (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('support.create.priority')}</label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as typeof newTicket.priority })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('support.form.priority_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('support.form.low')}</SelectItem>
                      <SelectItem value="medium">{t('support.form.medium')}</SelectItem>
                      <SelectItem value="high">{t('support.form.high')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('support.create.description_label')} *</label>
                <Textarea
                  placeholder={t('support.create.description_placeholder')}
                  rows={6}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                />
              </div>

              <Button
                onClick={handleCreateTicket}
                className="bg-primary hover:bg-primary/90"
                disabled={
                  isCreatingTicket ||
                  !newTicket.subject ||
                  !newTicket.description ||
                  (!user && (!newTicket.email || !newTicket.name))
                }
              >
                {isCreatingTicket ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('support.create.creating')}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('support.create.submit')}
                  </>
                )}
              </Button>

              {!user && (
                <p className="text-xs text-muted-foreground">
                  {t('support.form.required_fields_note')}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('support.contact.title')}</CardTitle>
              <CardDescription>
                {t('support.contact.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('support.contact.full_name')} *</label>
                  <Input
                    placeholder={t('support.contact.full_name_placeholder')}
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('support.contact.email')} *</label>
                  <Input
                    type="email"
                    placeholder={t('support.contact.email_placeholder')}
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('support.contact.phone')}</label>
                <Input
                  type="tel"
                  placeholder={t('support.contact.phone_placeholder')}
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('support.contact.subject')} *</label>
                <Input
                  placeholder={t('support.contact.subject_placeholder')}
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('support.contact.message')} *</label>
                <Textarea
                  placeholder={t('support.contact.message_placeholder')}
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>

              <Button
                onClick={handleContactSubmit}
                className="bg-primary hover:bg-primary/90"
                disabled={!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {t('support.contact.send_message')}
              </Button>

              <div className="pt-6 border-t">
                <h4 className="font-semibold mb-4">{t('support.contact.other_channels')}</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">{t('support.contact.email_label')}</p>
                    <p className="font-medium">soporte@adominioz.com</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">{t('support.contact.phone_label')}</p>
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">{t('support.contact.hours')}</p>
                    <p className="font-medium">{t('support.contact.hours_value')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">{t('support.contact.live_chat')}</p>
                    <p className="font-medium">{t('support.contact.live_chat_value')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* FAQ Categories */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>{t('support.knowledge.faq.title')}</CardTitle>
                <CardDescription>
                  {t('support.knowledge.faq.description')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>{t('support.knowledge.guides.title')}</CardTitle>
                <CardDescription>
                  {t('support.knowledge.guides.description')}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>{t('support.knowledge.troubleshooting.title')}</CardTitle>
                <CardDescription>
                  {t('support.knowledge.troubleshooting.description')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">{t('support.knowledge.popular_articles')}</h3>
            <div className="space-y-3">
              {[
                t('support.knowledge.popular_articles'),
                // These would typically come from an API
              ].map((article, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <p className="font-medium">{article}</p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportPage;
