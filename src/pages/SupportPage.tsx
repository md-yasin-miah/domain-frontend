import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MessageSquare, Search, Plus, CheckCircle, AlertCircle, MessageCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/store/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useGetTicketsQuery, useCreateTicketMutation } from "@/store/api/supportApi";
import { useGetSupportCategoriesQuery } from "@/store/api/categoryApi";
import { getStatusColor, timeFormat } from "@/lib/helperFun";
import { ticketCreateSchema, contactFormSchema, type TicketCreateFormData, type ContactFormData } from "@/schemas/support";
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constant';
import SupportTicketDetailsModal from "@/pages/component/SupportTicketDetailsModal";

const SupportPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [tab, setTab] = useState(user ? 'tickets' : 'create');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ticket creation form
  const ticketForm = useForm<TicketCreateFormData>({
    resolver: zodResolver(ticketCreateSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
    },
  });

  // Contact form
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      title: '',
      message: '',
      category_id: '',
    },
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
  const handleCreateTicket = async (data: TicketCreateFormData) => {
    try {
      // Validate and parse the form data (schema matches TicketCreateRequest exactly)
      const validatedData = ticketCreateSchema.parse(data);
      const ticketData: TicketCreateRequest = {
        title: validatedData.title,
        description: validatedData.description,
        msg: validatedData.description,
        category_id: parseInt(validatedData.category_id),
      };
      await createTicket(ticketData).unwrap();

      toast({
        title: t('support.create.success.title'),
        description: t('support.create.success.description'),
      });

      // Reset form
      ticketForm.reset();

      // Switch to tickets tab if user is logged in
      if (user) {
        setTab('tickets');
      }
    } catch (error: unknown) {
      console.error({ error });
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

  const handleContactSubmit = async (data: ContactFormData) => {
    try {
      // Map message to description for API (schema matches TicketCreateRequest structure)
      const ticketData: TicketCreateRequest = {
        title: data.title,
        description: data.message,
        msg: data.message,
        category_id: parseInt(data.category_id),
      };
      await createTicket(ticketData).unwrap();

      toast({
        title: t('support.create.success.title'),
        description: t('support.create.success.description'),
      });

      // Reset form
      contactForm.reset();
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
                                  <Badge
                                    variant={getStatusBadge(ticket.status)}
                                    className={getStatusColor(ticket.status)}
                                  >
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setIsModalOpen(true);
                                }}
                              >
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
            <CardContent>
              <Form {...ticketForm}>
                <form onSubmit={ticketForm.handleSubmit(handleCreateTicket)} className="space-y-6">
                  {!user && (
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <p className="text-sm">
                        <strong>{t('support.form.tip')}</strong> {t('support.form.tip_text')}
                      </p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={ticketForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('support.create.title_label')} *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('support.create.title_placeholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {categories.length > 0 && (
                      <FormField
                        control={ticketForm.control}
                        name="category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('support.form.category_label')} *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('support.form.category_placeholder')} />
                                </SelectTrigger>
                              </FormControl>
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <FormField
                    control={ticketForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('support.create.description_label')} *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('support.create.description_placeholder')}
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                    disabled={isCreatingTicket}
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
                </form>
              </Form>
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
            <CardContent>
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-6">
                  <FormField
                    control={contactForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('support.contact.title')} *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('support.contact.title_placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {categories.length > 0 && (
                    <FormField
                      control={contactForm.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('support.form.category_label')} *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value?.toString() || ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('support.form.category_placeholder')} />
                              </SelectTrigger>
                            </FormControl>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('support.contact.message')} *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('support.contact.message_placeholder')}
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t('support.contact.send_message')}
                  </Button>
                </form>
              </Form>

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
            <Link to={ROUTES.CLIENT.FAQ}>
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
            </Link>

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

      {/* Ticket Details Modal */}
      <SupportTicketDetailsModal
        ticket={selectedTicket}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default SupportPage;
