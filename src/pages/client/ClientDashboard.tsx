import { useState } from "react";
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
  FileText,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetMarketplaceListingsQuery } from "@/store/api/marketplaceApi";
import { useGetInvoicesQuery } from "@/store/api/invoiceApi";
import { useGetTicketsQuery } from "@/store/api/supportApi";
import { useGetBalanceQuery } from "@/store/api/balanceApi";
import { getStatusColor, getStatusLabel } from "@/lib/helperFun";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/contexts/CurrencyContext";

const CURRENCIES = ["USD", "EUR", "GBP", "CAD"] as const;

function formatBalance(amount: number | string, currency: string): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(isNaN(n) ? 0 : n);
}

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

  const { currency } = useCurrency();
  const { data: balance, isLoading: balanceLoading } =
    useGetBalanceQuery(currency);

  const loading = domainsLoading || invoicesLoading || ticketsLoading;

  const totalDuePayment = (invoices?.items || [])
    .filter((inv: Invoice) => inv.status === "issued")
    .reduce((sum, inv) => sum + Number(inv.total_amount), 0);

  if (loading) {
    return (
      <div>
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t("client_dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {t("client_dashboard.subtitle")}
        </p>
      </div>
      {/* balance card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-4 md:gap-10">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              {t("client_dashboard.balance.title", "Balance")}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Link to={ROUTES.CLIENT.WALLET("add-fund")}>
              <Button variant="default" size="sm">
                Topup Balance
              </Button>
            </Link>
            <Link to={ROUTES.CLIENT.WALLET()}>
              <Button variant="outline" size="sm">
                Wallet
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {balanceLoading ? (
            <div className="text-muted-foreground text-sm">
              {t("common.loading", "Loading...")}
            </div>
          ) : balance ? (
            <div className="space-y-3">
              <div className="text-2xl font-bold">
                {formatBalance(balance.total_balance, balance.currency)}
              </div>
              <p className="text-xs text-muted-foreground">
                {t(
                  "client_dashboard.balance.total",
                  "Total balance (wallet + earnings)",
                )}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
                <span>
                  {t("client_dashboard.balance.wallet", "Wallet")}:{" "}
                  {formatBalance(balance.wallet_balance, balance.currency)}
                </span>
                <span>
                  {t(
                    "client_dashboard.balance.earnings_available",
                    "Earnings available",
                  )}
                  :{" "}
                  {formatBalance(balance.earnings_available, balance.currency)}
                </span>
                <span>
                  {t("client_dashboard.balance.total_earned", "Total earned")}:{" "}
                  {formatBalance(balance.total_earned, balance.currency)}
                </span>
                <span>
                  {t("client_dashboard.balance.total_withdrawn", "Withdrawn")}:{" "}
                  {formatBalance(balance.total_withdrawn, balance.currency)}
                </span>
                <span>
                  {t("client_dashboard.balance.pending", "Pending")}:{" "}
                  {formatBalance(balance.pending_balance, balance.currency)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {t("client_dashboard.balance.unavailable", "Balance unavailable")}
            </p>
          )}
        </CardContent>
      </Card>

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
                    <Link to={ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS}>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{domain.domain_name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {domain.expires_at
                              ? `${t(
                                  "client_dashboard.recent_domains.expires",
                                )}: ${new Date(
                                  domain.expires_at,
                                ).toLocaleDateString()}`
                              : t("client_dashboard.recent_domains.no_expiry")}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            getStatusColor(domain.status),
                          )}
                        >
                          {getStatusLabel(domain.status, t)}
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
                            variant="outline"
                            className={cn(
                              "capitalize",
                              getStatusColor(ticket.status),
                            )}
                          >
                            {getStatusLabel(ticket.status, t)}
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
                          ${invoice?.total_amount}
                        </p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            getStatusColor(invoice.status),
                          )}
                        >
                          {getStatusLabel(invoice.status, t)}
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
        <Link to={ROUTES.CLIENT.SUPPORT}>
          <Button variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            {t("client_dashboard.actions.create_ticket")}
          </Button>
        </Link>
        <Link to={ROUTES.CLIENT.ORDERS.INVOICES}>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            {t("client_dashboard.actions.view_all_invoices")}
          </Button>
        </Link>
        <Link to={ROUTES.CLIENT.MARKETPLACE.MY_LISTINGS}>
          <Button variant="outline">
            <Globe className="h-4 w-4 mr-2" />
            {t("client_dashboard.actions.manage_domains")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
