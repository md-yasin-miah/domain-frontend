import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  CreditCard,
  FileText,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/hooks/useAuth";
import { useGetMarketplaceListingsQuery } from "@/store/api/marketplaceApi";
import { useGetInvoicesQuery } from "@/store/api/invoiceApi";
import { useGetTicketsQuery } from "@/store/api/supportApi";
import { getStatusColor } from "@/lib/helperFun";
import { ROUTES } from "@/lib/routes";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: invoices, isLoading: invoicesLoading } = useGetInvoicesQuery({
    skip: 0,
  });
  const { data: domains, isLoading: domainsLoading } =
    useGetMarketplaceListingsQuery({
      listing_type_id: 1,
      skip: 0,
    });
  const { data: tickets, isLoading: ticketsLoading } = useGetTicketsQuery({
    skip: 0,
  });
  console.log({ domains });

  const loading = domainsLoading || invoicesLoading || ticketsLoading;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
      case "paid":
      case "closed":
        return "default";
      case "pending":
      case "open":
        return "secondary";
      case "inactive":
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const totalDuePayment = (invoices?.items || [])
    .filter((inv: Invoice) => inv.status === "issued")
    .reduce((sum, inv) => sum + Number(inv.amount), 0);

  if (loading) {
    return (
      <div className="container mx-auto">
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
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("client_dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("client_dashboard.subtitle")}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("client_dashboard.cards.total_domains")}
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains?.pagination?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("client_dashboard.cards.active_domains")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("client_dashboard.cards.total_invoices")}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices?.pagination?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("client_dashboard.cards.all_time_invoices")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("client_dashboard.cards.due_payment")}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalDuePayment || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("client_dashboard.cards.pending_payments")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("client_dashboard.cards.support_tickets")}
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets?.pagination?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("client_dashboard.cards.total_tickets")}
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
              {t("client_dashboard.recent_domains.title")}
            </CardTitle>
            <CardDescription>
              {t("client_dashboard.recent_domains.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {domains?.items?.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                {t("client_dashboard.recent_domains.no_domains")}
              </p>
            ) : (
              <div className="space-y-3">
                {domains?.items?.map((domain, index) => (
                  <div key={index}>
                    <Link to={ROUTES.CLIENT.DOMAINS}>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{domain.domain_name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {domain.expires_at
                              ? `${t(
                                  "client_dashboard.recent_domains.expires"
                                )}: ${new Date(
                                  domain.expires_at
                                ).toLocaleDateString()}`
                              : t("client_dashboard.recent_domains.no_expiry")}
                          </p>
                        </div>
                        <Badge
                          variant={getStatusBadgeVariant(domain.status)}
                          className={`text-xs ${getStatusColor(
                            domain.status
                          )} text-white capitalize`}
                        >
                          {domain.status?.replace(/_|-/g, " ")}
                        </Badge>
                      </div>
                    </Link>
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
                {t("client_dashboard.recent_tickets.title")}
              </CardTitle>
              <CardDescription>
                {t("client_dashboard.recent_tickets.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tickets?.items?.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {t("client_dashboard.recent_tickets.no_tickets")}
                </p>
              ) : (
                <div className="space-y-3">
                  {tickets?.items?.slice(0, 3).map((ticket, index) => (
                    <div key={index}>
                      <Link to={ROUTES.CLIENT.SUPPORT}>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm">
                              {ticket?.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              #{ticket?.id}
                            </p>
                          </div>
                          <Badge
                            variant={getStatusBadgeVariant(ticket.status)}
                            className={`text-xs ${getStatusColor(
                              ticket.status
                            )} text-white capitalize`}
                          >
                            {ticket.status?.replace(/_|-/g, " ")}
                          </Badge>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                {t("client_dashboard.recent_invoices.title")}
              </CardTitle>
              <CardDescription>
                {t("client_dashboard.recent_invoices.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices?.items?.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  {t("client_dashboard.recent_invoices.no_invoices")}
                </p>
              ) : (
                <div className="space-y-3">
                  {invoices?.items?.slice(0, 3).map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-sm">
                          {invoice?.invoice_number}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {t("client_dashboard.recent_invoices.due")}:{" "}
                          {new Date(invoice?.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          ${invoice?.amount}
                        </p>
                        <Badge
                          variant={getStatusBadgeVariant(invoice.status)}
                          className="text-xs"
                        >
                          {invoice.status}
                        </Badge>
                      </div>
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
                {t("client_dashboard.faq.title")}
              </CardTitle>
              <CardDescription>
                {t("client_dashboard.faq.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/client/faq">
                <Button variant="outline" className="w-full justify-between">
                  {t("client_dashboard.faq.view_faqs")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap">
        <Button onClick={() => navigate(ROUTES.CLIENT.SUPPORT)}>
          <MessageCircle className="h-4 w-4 mr-2" />
          {t("client_dashboard.actions.create_ticket")}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.CLIENT.ORDERS.INVOICES)}
        >
          <FileText className="h-4 w-4 mr-2" />
          {t("client_dashboard.actions.view_all_invoices")}
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.CLIENT.DOMAINS)}
        >
          <Globe className="h-4 w-4 mr-2" />
          {t("client_dashboard.actions.manage_domains")}
        </Button>
      </div>
    </div>
  );
}
