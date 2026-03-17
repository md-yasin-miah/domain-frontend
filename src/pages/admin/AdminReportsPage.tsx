import { useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  DollarSign,
  Users,
  List,
  ShoppingCart,
  CreditCard,
  Lock,
  Wallet,
  ShieldAlert,
  MessageSquare,
  Gavel,
  Receipt,
  Loader2,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  useGetReportOverviewQuery,
  useGetReportRevenueQuery,
  useGetReportUsersQuery,
  useGetReportListingsQuery,
  useGetReportOrdersQuery,
  useGetReportPaymentsQuery,
  useGetReportEscrowQuery,
  useGetReportWithdrawalsQuery,
  useGetReportDisputesQuery,
  useGetReportSupportQuery,
  useGetReportAuctionsQuery,
  useGetReportInvoicesQuery,
} from "@/store/api/reportsApi";

const REPORT_TYPES = [
  { key: "overview", path: ROUTES.ADMIN.REPORTS.OVERVIEW, icon: BarChart3 },
  { key: "revenue", path: ROUTES.ADMIN.REPORTS.REVENUE, icon: DollarSign },
  { key: "users", path: ROUTES.ADMIN.REPORTS.USERS, icon: Users },
  { key: "listings", path: ROUTES.ADMIN.REPORTS.LISTINGS, icon: List },
  { key: "orders", path: ROUTES.ADMIN.REPORTS.ORDERS, icon: ShoppingCart },
  { key: "payments", path: ROUTES.ADMIN.REPORTS.PAYMENTS, icon: CreditCard },
  { key: "escrow", path: ROUTES.ADMIN.REPORTS.ESCROW, icon: Lock },
  { key: "withdrawals", path: ROUTES.ADMIN.REPORTS.WITHDRAWALS, icon: Wallet },
  { key: "disputes", path: ROUTES.ADMIN.REPORTS.DISPUTES, icon: ShieldAlert },
  { key: "support", path: ROUTES.ADMIN.REPORTS.SUPPORT, icon: MessageSquare },
  { key: "auctions", path: ROUTES.ADMIN.REPORTS.AUCTIONS, icon: Gavel },
  { key: "invoices", path: ROUTES.ADMIN.REPORTS.INVOICES, icon: Receipt },
] as const;

type ReportType = (typeof REPORT_TYPES)[number]["key"];

const PERIOD_OPTIONS = [7, 14, 30, 90, 365];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export default function AdminReportsPage() {
  const { t } = useTranslation();
  const { reportType = "overview" } = useParams<{ reportType: string }>();
  const [days, setDays] = useState(30);

  const activeReport = REPORT_TYPES.find((r) => r.key === reportType) ?? REPORT_TYPES[0];
  const reportKey = activeReport.key as ReportType;

  const { data: overview, isLoading: loadingOverview } = useGetReportOverviewQuery(
    { days },
    { skip: reportKey !== "overview" }
  );
  const { data: revenue, isLoading: loadingRevenue } = useGetReportRevenueQuery(
    { days },
    { skip: reportKey !== "revenue" }
  );
  const { data: users, isLoading: loadingUsers } = useGetReportUsersQuery(
    { days },
    { skip: reportKey !== "users" }
  );
  const { data: listings, isLoading: loadingListings } = useGetReportListingsQuery(
    { days },
    { skip: reportKey !== "listings" }
  );
  const { data: orders, isLoading: loadingOrders } = useGetReportOrdersQuery(
    { days },
    { skip: reportKey !== "orders" }
  );
  const { data: payments, isLoading: loadingPayments } = useGetReportPaymentsQuery(
    { days },
    { skip: reportKey !== "payments" }
  );
  const { data: escrow, isLoading: loadingEscrow } = useGetReportEscrowQuery(undefined, {
    skip: reportKey !== "escrow",
  });
  const { data: withdrawals, isLoading: loadingWithdrawals } = useGetReportWithdrawalsQuery(
    { days },
    { skip: reportKey !== "withdrawals" }
  );
  const { data: disputes, isLoading: loadingDisputes } = useGetReportDisputesQuery(
    { days },
    { skip: reportKey !== "disputes" }
  );
  const { data: support, isLoading: loadingSupport } = useGetReportSupportQuery(
    { days },
    { skip: reportKey !== "support" }
  );
  const { data: auctions, isLoading: loadingAuctions } = useGetReportAuctionsQuery(
    { days },
    { skip: reportKey !== "auctions" }
  );
  const { data: invoices, isLoading: loadingInvoices } = useGetReportInvoicesQuery(
    { days },
    { skip: reportKey !== "invoices" }
  );

  const isLoading =
    loadingOverview ||
    loadingRevenue ||
    loadingUsers ||
    loadingListings ||
    loadingOrders ||
    loadingPayments ||
    loadingEscrow ||
    loadingWithdrawals ||
    loadingDisputes ||
    loadingSupport ||
    loadingAuctions ||
    loadingInvoices;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-7 w-7" />
            {t("admin.reports.title", "Reports")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("admin.reports.description", "Admin-only reports. Use the period selector for time-based data.")}
          </p>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((d) => (
              <SelectItem key={d} value={String(d)}>
                {d} days
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={reportKey}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {REPORT_TYPES.map((r) => (
            <TabsTrigger
              key={r.key}
              value={r.key}
              asChild
              className="data-[state=active]:bg-background"
            >
              <NavLink to={r.path} className="flex items-center gap-2">
                <r.icon className="h-4 w-4" />
                <span className="capitalize">{r.key}</span>
              </NavLink>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {reportKey === "overview" && overview && (
                <OverviewReport data={overview} formatCurrency={formatCurrency} formatNumber={formatNumber} />
              )}
              {reportKey === "revenue" && revenue && (
                <RevenueReport data={revenue} formatCurrency={formatCurrency} />
              )}
              {reportKey === "users" && users && (
                <UsersReport data={users} formatNumber={formatNumber} />
              )}
              {reportKey === "listings" && listings && (
                <ListingsReport data={listings} formatNumber={formatNumber} />
              )}
              {reportKey === "orders" && orders && (
                <OrdersReport data={orders} formatCurrency={formatCurrency} formatNumber={formatNumber} />
              )}
              {reportKey === "payments" && payments && (
                <PaymentsReport data={payments} formatCurrency={formatCurrency} formatNumber={formatNumber} />
              )}
              {reportKey === "escrow" && escrow && (
                <EscrowReport data={escrow} formatCurrency={formatCurrency} formatNumber={formatNumber} />
              )}
              {reportKey === "withdrawals" && withdrawals && (
                <WithdrawalsReport data={withdrawals} formatCurrency={formatCurrency} formatNumber={formatNumber} />
              )}
              {reportKey === "disputes" && disputes && (
                <DisputesReport data={disputes} formatNumber={formatNumber} />
              )}
              {reportKey === "support" && support && (
                <SupportReport data={support} formatNumber={formatNumber} />
              )}
              {reportKey === "auctions" && auctions && (
                <AuctionsReport data={auctions} formatNumber={formatNumber} />
              )}
              {reportKey === "invoices" && invoices && (
                <InvoicesReport data={invoices} formatCurrency={formatCurrency} formatNumber={formatNumber} />
              )}
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}

function OverviewReport({
  data,
  formatCurrency,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportOverview;
  formatCurrency: (n: number) => string;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <CardDescription>Total / new in period</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNumber(data.users.total)}</p>
            <p className="text-xs text-muted-foreground">+{formatNumber(data.users.new_in_period)} in period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Listings</CardTitle>
            <CardDescription>Total / active / new</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNumber(data.listings.total)}</p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(data.listings.active)} active, +{formatNumber(data.listings.new_in_period)} new
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <CardDescription>Total / completed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNumber(data.orders.total)}</p>
            <p className="text-xs text-muted-foreground">{formatNumber(data.orders.completed)} completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue (period)</CardTitle>
            <CardDescription>Platform fee / GMV</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(data.revenue.platform_fee_in_period)}</p>
            <p className="text-xs text-muted-foreground">GMV {formatCurrency(data.revenue.gmv_in_period)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Alerts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <span className="text-muted-foreground">Open disputes: <strong>{data.alerts.open_disputes}</strong></span>
          <span className="text-muted-foreground">Open support tickets: <strong>{data.alerts.open_support_tickets}</strong></span>
          <span className="text-muted-foreground">Pending withdrawals: <strong>{data.alerts.pending_withdrawals}</strong></span>
        </CardContent>
      </Card>
    </div>
  );
}

function RevenueReport({
  data,
  formatCurrency,
}: {
  data: import("@/store/api/reportsApi").ReportRevenue;
  formatCurrency: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total platform fee</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(data.total_platform_fee)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total GMV</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(data.total_gmv)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">By day</CardTitle>
          <CardDescription>Platform fee and GMV per day (last {data.period_days} days)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-right py-2">Platform fee</th>
                  <th className="text-right py-2">GMV</th>
                </tr>
              </thead>
              <tbody>
                {data.by_day.map((row) => (
                  <tr key={row.date} className="border-b">
                    <td className="py-2">{row.date}</td>
                    <td className="text-right">{formatCurrency(row.platform_fee)}</td>
                    <td className="text-right">{formatCurrency(row.gmv)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersReport({
  data,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportUsers;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Total users</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_users)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Active users</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(data.active_users)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">New in period</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(data.new_registrations_in_period)}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">By role</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {data.by_role.map((r) => (
              <li key={r.role} className="flex justify-between"><span>{r.role}</span><span>{formatNumber(r.count)}</span></li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Registrations by day</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Date</th><th className="text-right py-2">Count</th></tr></thead>
              <tbody>
                {data.registrations_by_day.map((row) => (
                  <tr key={row.date} className="border-b"><td className="py-2">{row.date}</td><td className="text-right">{row.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ListingsReport({
  data,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportListings;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Total listings</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_listings)}</p></CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">By status</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {data.by_status.map((s) => (
                <li key={s.status} className="flex justify-between"><span>{s.status}</span><span>{formatNumber(s.count)}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">By listing type</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {data.by_listing_type.map((t) => (
                <li key={t.listing_type} className="flex justify-between"><span>{t.listing_type}</span><span>{formatNumber(t.count)}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">New listings by day</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Date</th><th className="text-right py-2">Count</th></tr></thead>
              <tbody>
                {data.new_listings_by_day.map((row) => (
                  <tr key={row.date} className="border-b"><td className="py-2">{row.date}</td><td className="text-right">{row.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersReport({
  data,
  formatCurrency,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportOrders;
  formatCurrency: (n: number) => string;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Total orders</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_orders)}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">By status</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {data.by_status.map((s) => (
              <li key={s.status} className="flex justify-between"><span>{s.status}</span><span>{formatNumber(s.count)}</span></li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">All time</CardTitle></CardHeader>
          <CardContent>
            <p>GMV: {formatCurrency(data.all_time.gmv)}</p>
            <p>Platform fee: {formatCurrency(data.all_time.platform_fee)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">In period</CardTitle></CardHeader>
          <CardContent>
            <p>GMV: {formatCurrency(data.in_period.gmv)}</p>
            <p>Platform fee: {formatCurrency(data.in_period.platform_fee)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Orders by day</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Date</th><th className="text-right py-2">Count</th></tr></thead>
              <tbody>
                {data.orders_by_day.map((row) => (
                  <tr key={row.date} className="border-b"><td className="py-2">{row.date}</td><td className="text-right">{row.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentsReport({
  data,
  formatCurrency,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportPayments;
  formatCurrency: (n: number) => string;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Total payments</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_payments)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Total paid amount</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCurrency(data.total_paid_amount)}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">By status</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {data.by_status.map((s) => (
              <li key={s.status} className="flex justify-between"><span>{s.status}</span><span>{formatNumber(s.count)}</span></li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">By method</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {data.by_method.map((m) => (
              <li key={m.method} className="flex justify-between"><span>{m.method}</span><span>{formatNumber(m.count)}</span></li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Paid in period</CardTitle></CardHeader>
        <CardContent><p className="text-xl font-bold">{formatCurrency(data.paid_amount_in_period)}</p></CardContent>
      </Card>
    </div>
  );
}

function EscrowReport({
  data,
  formatCurrency,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportEscrow;
  formatCurrency: (n: number) => string;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Total escrows</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_escrows)}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">By status</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {data.by_status.map((s) => (
              <li key={s.status} className="flex justify-between"><span>{s.status}</span><span>{formatNumber(s.count)}</span></li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Amounts</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p>Pending held: {formatCurrency(data.amounts.pending_held)}</p>
          <p>Released to sellers: {formatCurrency(data.amounts.released_to_sellers)}</p>
          <p>Refunded to buyers: {formatCurrency(data.amounts.refunded_to_buyers)}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function WithdrawalsReport({
  data,
  formatCurrency,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportWithdrawals;
  formatCurrency: (n: number) => string;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Total withdrawals</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_withdrawals)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Pending amount</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCurrency(data.pending_amount)}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">By status</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {data.by_status.map((s) => (
              <li key={s.status} className="flex justify-between"><span>{s.status}</span><span>{formatNumber(s.count)}</span></li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Completed amount total</CardTitle></CardHeader>
        <CardContent><p className="text-xl font-bold">{formatCurrency(data.completed_amount_total)}</p></CardContent>
      </Card>
    </div>
  );
}

function DisputesReport({
  data,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportDisputes;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Total disputes</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_disputes)}</p></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">By status</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {data.by_status.map((s) => (
              <li key={s.status} className="flex justify-between"><span>{s.status}</span><span>{formatNumber(s.count)}</span></li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Disputes by day</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Date</th><th className="text-right py-2">Count</th></tr></thead>
              <tbody>
                {data.disputes_by_day.map((row) => (
                  <tr key={row.date} className="border-b"><td className="py-2">{row.date}</td><td className="text-right">{row.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SupportReport({
  data,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportSupport;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Total tickets</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_tickets)}</p></CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">By status</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {data.by_status.map((s) => (
                <li key={s.status} className="flex justify-between"><span>{s.status}</span><span>{formatNumber(s.count)}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">By priority</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {data.by_priority.map((p) => (
                <li key={p.priority} className="flex justify-between"><span>{p.priority}</span><span>{formatNumber(p.count)}</span></li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Tickets by day</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Date</th><th className="text-right py-2">Count</th></tr></thead>
              <tbody>
                {data.tickets_by_day.map((row) => (
                  <tr key={row.date} className="border-b"><td className="py-2">{row.date}</td><td className="text-right">{row.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AuctionsReport({
  data,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportAuctions;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Total auctions</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_auctions)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Active auctions</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(data.active_auctions)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">New in period</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(data.new_auctions_in_period)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Total bids</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_bids)}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Bids in period</CardTitle></CardHeader>
        <CardContent><p className="text-2xl font-bold">{formatNumber(data.bids_in_period)}</p></CardContent>
      </Card>
    </div>
  );
}

function InvoicesReport({
  data,
  formatCurrency,
  formatNumber,
}: {
  data: import("@/store/api/reportsApi").ReportInvoices;
  formatCurrency: (n: number) => string;
  formatNumber: (n: number) => string;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Total invoices</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(data.total_invoices)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-medium">Total paid amount</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCurrency(data.total_paid_amount)}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">By status</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {data.by_status.map((s) => (
              <li key={s.status} className="flex justify-between"><span>{s.status}</span><span>{formatNumber(s.count)}</span></li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Invoices by day</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">Date</th><th className="text-right py-2">Count</th></tr></thead>
              <tbody>
                {data.invoices_by_day.map((row) => (
                  <tr key={row.date} className="border-b"><td className="py-2">{row.date}</td><td className="text-right">{row.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
