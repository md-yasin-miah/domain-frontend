import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, CreditCard, FileText, MessageCircle, AlertCircle, HelpCircle, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetClientProfileQuery,
  useGetClientDomainsQuery,
  useGetClientInvoicesQuery,
  useGetSupportTicketsQuery,
} from "@/store/api/userApi";

interface ClientDomain {
  id: string;
  domain_name: string;
  status: string;
  expiry_date: string | null;
  auto_renew: boolean;
}

interface ClientInvoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  description: string | null;
}

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Use RTK Query hooks
  const { data: profile, isLoading: profileLoading } = useGetClientProfileQuery(user?.id || '', {
    skip: !user?.id,
  });
  const { data: domains = [], isLoading: domainsLoading } = useGetClientDomainsQuery(user?.id || '', {
    skip: !user?.id,
  });
  const { data: invoices = [], isLoading: invoicesLoading } = useGetClientInvoicesQuery(user?.id || '', {
    skip: !user?.id,
  });
  const { data: tickets = [], isLoading: ticketsLoading } = useGetSupportTicketsQuery(user?.id || '', {
    skip: !user?.id,
  });

  const loading = profileLoading || domainsLoading || invoicesLoading || ticketsLoading;

  useEffect(() => {
    if (user && profile && !profile.profile_completed) {
      navigate('/client/profile-setup');
    }
  }, [user, profile, navigate]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
      case 'closed':
        return 'default';
      case 'pending':
      case 'open':
        return 'secondary';
      case 'inactive':
      case 'overdue':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const totalDuePayment = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <p className="text-muted-foreground">Manage your domains, invoices, and support tickets</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">
              Active domains
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">
              All time invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Payment</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDuePayment.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Pending payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.length}</div>
            <p className="text-xs text-muted-foreground">
              Total tickets
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Domains */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              Recent Domains
            </CardTitle>
            <CardDescription>
              Your latest domain registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {domains.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No domains found
              </p>
            ) : (
              <div className="space-y-3">
                {domains.map((domain) => (
                  <div key={domain.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{domain.domain_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {domain.expiry_date ? `Expires: ${new Date(domain.expiry_date).toLocaleDateString()}` : 'No expiry date'}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(domain.status)}>
                      {domain.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Tickets & Invoices */}
        <div className="space-y-6">
          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
                Recent Tickets
              </CardTitle>
              <CardDescription>
                Your latest support tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No tickets found
                </p>
              ) : (
                <div className="space-y-3">
                  {tickets.slice(0, 3).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{ticket.subject}</h4>
                        <p className="text-xs text-muted-foreground">#{ticket.ticket_number}</p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(ticket.status)} className="text-xs">
                        {ticket.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* FAQ Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/client/faq">
                <Button variant="outline" className="w-full justify-between">
                  View FAQs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Recent Invoices
              </CardTitle>
              <CardDescription>
                Your latest billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No invoices found
                </p>
              ) : (
                <div className="space-y-3">
                  {invoices.slice(0, 3).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{invoice.invoice_number}</h4>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(invoice.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">${invoice.amount}</p>
                        <Badge variant={getStatusBadgeVariant(invoice.status)} className="text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap">
        <Button onClick={() => navigate('/user/soporte')}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
        <Button variant="outline" onClick={() => navigate('/user/facturas')}>
          <FileText className="h-4 w-4 mr-2" />
          View All Invoices
        </Button>
        <Button variant="outline" onClick={() => navigate('/user/mis-dominios')}>
          <Globe className="h-4 w-4 mr-2" />
          Manage Domains
        </Button>
      </div>
    </div>
  );
}