import React, { useState, useCallback } from "react";
import {
  Search,
  Loader2,
  TrendingUp,
  BarChart3,
  Globe,
  Sparkles,
  Calendar,
  Server,
  Pin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLazyGetAutoValuationQuery } from "@/store/api/valuationsApi";
import { useAuth } from "@/store/hooks/useAuth";
import { formatCurrency, formatNumber } from "@/lib/helperFun";
import moment from "moment";
import { ROUTES } from "@/lib/routes";
import AiAgentLoadingScreen from "@/components/valuations/AiAgentLoadingScreen";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const normalizeDomain = (value: string): string => {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .split("/")[0] || ""
  );
};

const AppValuationsIndex = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [domainInput, setDomainInput] = useState("");
  const [trigger, { data, isFetching, isSuccess, error }] =
    useLazyGetAutoValuationQuery();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const domain = normalizeDomain(domainInput);
      if (!domain || !domain.includes(".")) return;
      trigger({ domain });
    },
    [domainInput, trigger],
  );

  const domainValid = normalizeDomain(domainInput).includes(".");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Hero search */}
      <section className="relative overflow-hidden px-4 pt-8 pb-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span>{t("valuations.badge")}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("valuations.hero_title")}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            {t("valuations.hero_subtitle")}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <div>
              <div className="relative flex-1 max-w-md mx-auto sm:mx-0 w-full">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="example.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="pl-10 h-12 text-base bg-background/80 border-primary/20 focus-visible:ring-primary"
                  disabled={isFetching}
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Pin className="h-3.5 w-3.5 text-red-500" />
                <p className="text-xs text-muted-foreground text-center sm:text-left sm:max-w-md sm:mx-0 mx-auto">
                  {isAuthenticated
                    ? t("valuations.note.authenticated")
                    : t("valuations.note.guest")}
                </p>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 px-6 sm:shrink-0"
              disabled={!domainValid || isFetching}
            >
              {isFetching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("valuations.analyzing")}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  {t("valuations.cta_get_valuation")}
                </>
              )}
            </Button>
          </form>

          {error && !isFetching && (
            <div className="flex justify-center">
              <Alert
                variant="destructive"
                className="mt-6 text-left max-w-md mx-auto sm:mx-0"
              >
                <AlertTitle>
                  {t("valuations.error.title")}
                </AlertTitle>
                <AlertDescription>
                  {"status" in error && error.status === 429
                    ? t("valuations.error.rate_limit")
                    : "data" in error &&
                        typeof error.data === "object" &&
                        error.data &&
                        "detail" in error.data
                      ? String((error.data as { detail?: string }).detail)
                      : t("valuations.error.generic")}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </section>

      {/* Loading skeleton */}
      {isFetching && (
        <AiAgentLoadingScreen domain={normalizeDomain(domainInput)} />
      )}

      {/* Results */}
      {isSuccess && data && !isFetching && (
        <ValuationResults data={data} isAuthenticated={isAuthenticated} />
      )}
    </div>
  );
};

function ValuationResults({
  data,
  isAuthenticated,
}: {
  data: AutoValuationResponse;
  isAuthenticated: boolean;
}) {
  const { t } = useTranslation();
  const currency = data.currency || "USD";
  const sellFlowPath = `${ROUTES.CLIENT.MARKETPLACE.PRODUCTS_VERIFICATION}?from_valuation=1&product_type=domain&domain_name=${encodeURIComponent(
    data.domain_name ?? "",
  )}&domain_extension=${encodeURIComponent(
    data.domain_extension ? `.${data.domain_extension}` : "",
  )}&prefill_title=${encodeURIComponent(
    data.domain ?? "",
  )}&prefill_price=${encodeURIComponent(
    String(Math.round(data.estimated_value ?? 0)),
  )}`;
  const sellHref = isAuthenticated
    ? sellFlowPath
    : `${ROUTES.AUTH.INDEX}?returnUrl=${encodeURIComponent(sellFlowPath)}`;
  const hasAnyMetric =
    data.domain_length_score != null ||
    data.domain_age_years != null ||
    data.domain_authority_score != null ||
    data.backlinks_count != null ||
    data.monthly_traffic != null ||
    data.monthly_revenue != null;
  const hasDomainInfo =
    data.domain_info &&
    Object.values(data.domain_info).some(
      (v) => v != null && (Array.isArray(v) ? v.length > 0 : true),
    );
  const hasValuationData =
    data.valuation_data && Object.keys(data.valuation_data).length > 0;

  return (
    <div className="px-4 pb-16 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Main estimate card — domain, domain_name, domain_extension, estimated_value, min/max, currency, market_rank, comparable_sales_count, valuation_id, calculated_at */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            {data.calculated_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {moment(data.calculated_at).format("lll")}
              </span>
            )}
            <Link to={sellHref}>
              <Button size="sm" variant="outline">
                {isAuthenticated
                  ? t("valuations.sell_cta.auth")
                  : t("valuations.sell_cta.guest")}
              </Button>
            </Link>
          </div>
          <CardDescription>
            {t("valuations.estimated_value")}
          </CardDescription>
          <CardTitle className="text-4xl sm:text-5xl font-bold text-foreground">
            {formatCurrency(data.estimated_value)}{" "}
            <span className="text-lg font-normal text-muted-foreground">
              {currency}
            </span>
          </CardTitle>
          <p className="text-muted-foreground">
            {t("valuations.range")}: {formatCurrency(data.min_estimate)} –{" "}
            {formatCurrency(data.max_estimate)} {currency}
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge
            variant="secondary"
            className="text-sm"
            title={`Name: ${data.domain_name} · Extension: ${data.domain_extension}`}
          >
            {data.domain}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {t("valuations.name")}:{" "}
            <strong className="text-foreground">{data.domain_name}</strong> ·
            {t("valuations.ext")}:{" "}
            <strong className="text-foreground">
              .{data.domain_extension}
            </strong>
          </span>
          {data.market_rank && (
            <Badge
              variant={
                data.market_rank.tier === "premium" ? "default" : "outline"
              }
              className="capitalize"
              title={`Rank ${data.market_rank.rank} of ${data.market_rank.total_count}`}
            >
              {data.market_rank.tier.replace("-", " ")} · Top{" "}
              {data.market_rank.percentile}% (rank {data.market_rank.rank}/
              {data.market_rank.total_count})
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {t("valuations.based_on")} {data.comparable_sales_count}{" "}
            {t("valuations.comparable_sale")}
            {data.comparable_sales_count !== 1 ? "s" : ""}
          </span>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Scores & metrics — domain_length_score, domain_age_years, domain_authority_score, backlinks_count, monthly_traffic, monthly_revenue */}
        {hasAnyMetric && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                {t("valuations.scores_metrics")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {data.domain_length_score != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.length_score")}:
                  </span>{" "}
                  {data.domain_length_score}/100
                </p>
              )}
              {data.domain_age_years != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.age")}:
                  </span>{" "}
                  {data.domain_age_years} year
                  {data.domain_age_years !== 1 ? "s" : ""}
                </p>
              )}
              {data.domain_authority_score != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.domain_authority")}:
                  </span>{" "}
                  {data.domain_authority_score}
                </p>
              )}
              {data.backlinks_count != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.backlinks")}:
                  </span>{" "}
                  {formatNumber(data.backlinks_count)}
                </p>
              )}
              {data.monthly_traffic != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.monthly_traffic")}:
                  </span>{" "}
                  {formatNumber(data.monthly_traffic)}
                </p>
              )}
              {data.monthly_revenue != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.monthly_revenue")}:
                  </span>{" "}
                  {formatCurrency(Number(data.monthly_revenue))} {currency}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Market trend — trend_key, average_sale_price, median_sale_price, price_change_percentage, total_sales_count, period_end, currency */}
        {data.market_trend && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {t("valuations.market_trend")} ·{" "}
                {data.market_trend.trend_key}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">
                  {t("valuations.avg_sale")}:
                </span>{" "}
                {formatCurrency(data.market_trend.average_sale_price)}{" "}
                {data.market_trend.currency}
              </p>
              <p>
                <span className="text-muted-foreground">
                  {t("valuations.median")}:
                </span>{" "}
                {formatCurrency(data.market_trend.median_sale_price)}{" "}
                {data.market_trend.currency}
              </p>
              {data.market_trend.total_sales_count != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.total_sales_period")}:
                  </span>{" "}
                  {data.market_trend.total_sales_count}
                </p>
              )}
              {data.market_trend.period_end && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.period_end")}:
                  </span>{" "}
                  {moment(data.market_trend.period_end).format("lll")}
                </p>
              )}
              {data.market_trend.price_change_percentage != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.price_change")}:
                  </span>{" "}
                  <span
                    className={
                      data.market_trend.price_change_percentage >= 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {data.market_trend.price_change_percentage >= 0 ? "+" : ""}
                    {Number(data.market_trend.price_change_percentage).toFixed(
                      1,
                    )}
                    %
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Domain info — all DomainInfo: domain_age_years, creation_date, expiration_date, registrar, name_servers, updated_date, page_links_count */}
        {hasDomainInfo && data.domain_info && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                {t("valuations.domain_info")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {data.domain_info.domain_age_years != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.whois_age")}:
                  </span>{" "}
                  {data.domain_info.domain_age_years} year
                  {data.domain_info.domain_age_years !== 1 ? "s" : ""}
                </p>
              )}
              {data.domain_info.creation_date != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.created")}:
                  </span>{" "}
                  {moment(data.domain_info.creation_date).format("lll")}
                </p>
              )}
              {data.domain_info.expiration_date != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.expires")}:
                  </span>{" "}
                  {moment(data.domain_info.expiration_date).format("lll")}
                </p>
              )}
              {data.domain_info.updated_date != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.updated")}:
                  </span>{" "}
                  {moment(data.domain_info.updated_date).format("lll")}
                </p>
              )}
              {data.domain_info.registrar != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.registrar")}:
                  </span>{" "}
                  {data.domain_info.registrar}
                </p>
              )}
              {data.domain_info.page_links_count != null && (
                <p>
                  <span className="text-muted-foreground">
                    {t("valuations.page_links")}:
                  </span>{" "}
                  {data.domain_info.page_links_count}
                </p>
              )}
              {data.domain_info.name_servers != null &&
                data.domain_info.name_servers.length > 0 && (
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Server className="h-3.5 w-3.5" />
                      {t("valuations.name_servers")}:
                    </span>
                    <ul className="mt-1 list-inside list-disc text-muted-foreground">
                      {data.domain_info.name_servers.map((ns, i) => (
                        <li key={i} className="font-mono text-xs break-all">
                          {ns}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI valuation_data — raw key/value when present */}
      {hasValuationData && data.valuation_data && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {t("valuations.ai_data")}
            </CardTitle>
            <CardDescription>
              {t("valuations.ai_data_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {Object.entries(data.valuation_data).map(([key, value]) => (
                <div key={key} className="rounded border bg-muted/30 px-3 py-2">
                  <dt className="text-muted-foreground font-medium capitalize">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="mt-0.5 break-words">
                    {value === null || value === undefined
                      ? "—"
                      : typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Recent comparable sales — domain_name, domain_extension, sale_price, sale_date, currency */}
      {data.recent_comparable_sales &&
        data.recent_comparable_sales.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {t("valuations.recent_comparable_sales")}
              </CardTitle>
              <CardDescription>
                {t("valuations.recent_comparable_sales_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">
                        {t("valuations.table_domain")}
                      </th>
                      <th className="pb-3 pr-4 font-medium text-right">
                        {t("valuations.table_price")}
                      </th>
                      <th className="pb-3 font-medium">
                        {t("valuations.table_date")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_comparable_sales.map((sale, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium">
                          {sale.domain_name}.{sale.domain_extension}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          {formatCurrency(Number(sale.sale_price))}{" "}
                          {sale.currency}
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {sale.sale_date
                            ? moment(sale.sale_date).format("lll")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

export default AppValuationsIndex;
