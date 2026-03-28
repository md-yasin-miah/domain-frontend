import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
import {
  ChartLine,
  Users,
  List,
  ShoppingCart,
  DollarSign,
  Handshake,
  ShieldAlert,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useGetAdminOverviewQuery } from "@/store/api/analyticsApi";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS = [
  { value: 7, labelKey: "admin.analytics.period_7d" },
  { value: 30, labelKey: "admin.analytics.period_30d" },
  { value: 90, labelKey: "admin.analytics.period_90d" },
] as const;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export default function AdminAnalyticsPage() {
  const { t } = useTranslation();
  const [days, setDays] = useState(30);

  const { data, isLoading, error } = useGetAdminOverviewQuery({ days });

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-2" />
          <p className="font-medium">{t("common.error.title", "Error")}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t("common.error.description", "Something went wrong.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ChartLine className="h-7 w-7" />
            {t("admin.analytics.title", "Analytics")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t(
              "admin.analytics.description",
              "Platform overview and key metrics.",
            )}
          </p>
        </div>
        <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {t(opt.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("admin.analytics.total_users")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.total_users)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("admin.analytics.registered_users")}
                </p>
                <Link
                  to={ROUTES.ADMIN.USERS.LIST}
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  {t("admin.analytics.view_users")} →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("admin.analytics.total_listings")}
                </CardTitle>
                <List className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.total_listings)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.active_listings} {t("admin.analytics.active")}
                </p>
                <Link
                  to={ROUTES.ADMIN.LISTINGS_MANAGEMENT}
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  {t("admin.analytics.view_listings")} →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("admin.analytics.total_orders")}
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.total_orders)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.completed_orders} {t("admin.analytics.completed")}
                </p>
                <Link
                  to={ROUTES.ADMIN.ORDERS.LIST}
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  {t("admin.analytics.view_orders")} →
                </Link>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("admin.analytics.revenue")}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                  {formatCurrency(data.total_revenue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("admin.analytics.platform_fees_period", {
                    days: data.period_days,
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("admin.analytics.total_offers")}
                </CardTitle>
                <Handshake className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.total_offers)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("admin.analytics.all_offers")}
                </p>
                <Link
                  to={ROUTES.ADMIN.OFFERS}
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  {t("admin.analytics.view_offers")} →
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("admin.analytics.disputes")}
                </CardTitle>
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(data.total_disputes)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span
                    className={cn(
                      data.open_disputes > 0 &&
                        "text-amber-600 dark:text-amber-500 font-medium",
                    )}
                  >
                    {data.open_disputes} {t("admin.analytics.open")}
                  </span>
                </p>
                <Link
                  to={ROUTES.ADMIN.DISPUTES}
                  className="text-xs text-primary hover:underline mt-2 inline-block"
                >
                  {t("admin.analytics.view_disputes")} →
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t("admin.analytics.summary")}
              </CardTitle>
              <CardDescription>
                {t("admin.analytics.summary_description", {
                  days: data.period_days,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm md:grid-cols-2">
                <li className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">
                    {t("admin.analytics.total_users")}
                  </span>
                  <span className="font-medium">
                    {formatNumber(data.total_users)}
                  </span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">
                    {t("admin.analytics.active_listings")}
                  </span>
                  <span className="font-medium">
                    {formatNumber(data.active_listings)}
                  </span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">
                    {t("admin.analytics.completed_orders")}
                  </span>
                  <span className="font-medium">
                    {formatNumber(data.completed_orders)}
                  </span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">
                    {t("admin.analytics.revenue")}
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-500">
                    {formatCurrency(data.total_revenue)}
                  </span>
                </li>
                <li className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">
                    {t("admin.analytics.open_disputes")}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      data.open_disputes > 0 &&
                        "text-amber-600 dark:text-amber-500",
                    )}
                  >
                    {formatNumber(data.open_disputes)}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
