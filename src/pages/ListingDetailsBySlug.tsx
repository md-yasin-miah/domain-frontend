import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Eye,
  Calendar,
  Award,
  Globe,
  User,
  ExternalLink,
  Heart,
  Info,
  ChevronDown,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { useGetMarketplaceListingBySlugQuery } from "@/store/api/marketplaceApi";
import { ROUTES } from "@/lib/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/helperFun";
import { useAuth } from "@/store/hooks/useAuth";
import MakeOfferModal from "@/pages/client/marketplace/myListing/components/MakeOfferModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "AUD", "CAD", "JPY"] as const;

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const n = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="mb-4 mr-8 min-w-[6.5rem] shrink-0 last:mr-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-lg font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}

export default function ListingDetailsBySlug() {
  const { listingSlug } = useParams<{ listingSlug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [makeOfferModalOpen, setMakeOfferModalOpen] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<string>("USD");
  const {
    data: listing,
    isLoading,
    error,
  } = useGetMarketplaceListingBySlugQuery(listingSlug, { skip: !listingSlug });

  useEffect(() => {
    if (listing?.currency) setDisplayCurrency(String(listing.currency));
  }, [listing?.currency]);

  const displayTitle =
    listing?.title ||
    listing?.domain_name ||
    listing?.slug ||
    (listing ? `#${listing.id}` : "");
  const canMakeOffer =
    !user || (listing ? listing.seller_id !== user.id : true);

  const listingData = listing
    ? (listing as MarketplaceListing & Record<string, unknown>)
    : null;
  const location =
    listingData &&
    typeof listingData.country === "string" &&
    listingData.country.trim()
      ? listingData.country
      : null;

  const monthlyProfit = listing
    ? toNumber(listing.website_profit_monthly)
    : null;
  const monthlyRevenue = listing
    ? toNumber(listing.website_revenue_monthly)
    : null;
  const numericPrice = listing ? toNumber(listing.price) : null;

  const annualProfit =
    monthlyProfit != null && monthlyProfit > 0 ? monthlyProfit * 12 : null;
  const annualRevenue =
    monthlyRevenue != null && monthlyRevenue > 0 ? monthlyRevenue * 12 : null;

  const profitMultiple =
    numericPrice != null &&
    numericPrice > 0 &&
    annualProfit != null &&
    annualProfit > 0
      ? numericPrice / annualProfit
      : null;
  const revenueMultiple =
    numericPrice != null &&
    numericPrice > 0 &&
    annualRevenue != null &&
    annualRevenue > 0
      ? numericPrice / annualRevenue
      : null;
  const profitMarginPct =
    monthlyRevenue != null &&
    monthlyRevenue > 0 &&
    monthlyProfit != null &&
    monthlyProfit >= 0
      ? (monthlyProfit / monthlyRevenue) * 100
      : null;

  useEffect(() => {
    const shouldOpenOffer = searchParams.get("openOffer") === "true";
    if (!shouldOpenOffer) return;
    if (!listing) return;

    if (!user) {
      const returnUrl = `${window.location.pathname}?openOffer=true`;
      navigate(
        `${ROUTES.AUTH.INDEX}?tab=login&returnUrl=${encodeURIComponent(returnUrl)}`,
        { replace: true },
      );
      return;
    }

    if (listing.seller_id === user.id) return;

    setMakeOfferModalOpen(true);
    const next = new URLSearchParams(searchParams);
    next.delete("openOffer");
    setSearchParams(next, { replace: true });
  }, [searchParams, listing, user, navigate, setSearchParams]);

  const handleMakeOffer = () => {
    if (!user) {
      const returnUrl = `${window.location.pathname}?openOffer=true`;
      navigate(
        `${ROUTES.AUTH.INDEX}?tab=login&returnUrl=${encodeURIComponent(returnUrl)}`,
      );
      return;
    }

    if (!canMakeOffer) {
      toast.error(t("offers.create.own_listing"));
      return;
    }
    setMakeOfferModalOpen(true);
  };

  const images = useMemo(() => {
    if (!listing) return [];
    return [
      ...(listing.primary_image_url ? [listing.primary_image_url] : []),
      ...(listing.image_urls?.filter(Boolean) ?? []),
    ];
  }, [listing]);

  if (!listingSlug) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <p className="text-muted-foreground">{t("common.not_found")}</p>
        <Button variant="link" asChild className="mt-2">
          <Link to={ROUTES.APP.MARKETPLACE}>{t("common.back")}</Link>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <p className="text-destructive">
          {t("marketplace_domains.errors.load_failed")}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>
      </div>
    );
  }

  if (isLoading || !listing) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
        <Skeleton className="mb-6 h-5 w-40" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-44" />
            </div>
            <Skeleton className="h-10 max-w-3xl" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-24 rounded-full" />
              ))}
            </div>
            <div className="flex flex-wrap gap-6 border-y border-border py-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-28" />
                </div>
              ))}
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-4">
            <div className="rounded-lg border bg-card p-4 shadow-sm lg:sticky lg:top-24">
              <Skeleton className="aspect-video w-full rounded-md" />
              <Separator className="my-6" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-10 w-48" />
              <Skeleton className="mt-6 h-11 w-full" />
              <Skeleton className="mt-3 h-11 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasDomainInfo =
    listing.domain_name ||
    listing.domain_extension ||
    (listing.domain_age_years != null && listing.domain_age_years > 0) ||
    (listing.domain_authority != null && listing.domain_authority > 0) ||
    (listing.domain_backlinks != null && listing.domain_backlinks > 0);
  const hasWebsiteInfo =
    listing.website_url ||
    (listing.website_traffic_monthly != null &&
      listing.website_traffic_monthly > 0) ||
    (listing.website_revenue_monthly != null &&
      Number(listing.website_revenue_monthly) > 0) ||
    (listing.website_profit_monthly != null &&
      Number(listing.website_profit_monthly) > 0) ||
    listing.website_technology;

  const sellerEmail =
    listing.seller &&
    typeof (listing.seller as { email?: string }).email === "string"
      ? (listing.seller as { email: string }).email
      : null;
  const sellerName =
    (listing.seller as { name?: string })?.name ||
    listing.seller?.username ||
    t("marketplace_domains.labels.anonymous");

  const heroImage = images[0];
  const priceLabel = t(
    "marketplace_domains.labels.asking_price_classified",
    "Asking price",
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("marketplace_domains.actions.back_to_list")}
        </Button>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {listing.view_count != null && (
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {formatNumber(listing.view_count)}{" "}
              {t("marketplace_domains.labels.views")}
            </span>
          )}
          {listing.favorite_count != null && listing.favorite_count > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {formatNumber(listing.favorite_count)} {t("common.favorites")}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Main column */}
        <div className="min-w-0 space-y-8 lg:col-span-8">
          <div>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
              {listing.listing_type?.name && (
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {listing.listing_type.name}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-start gap-3">
              <h1 className="mb-0 min-w-0 flex-1 text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
                {displayTitle}
              </h1>
              {listing.status === "active" && (
                <div className="mt-1 flex shrink-0 items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    {t(
                      "marketplace_domains.labels.verified_listing",
                      "Verified listing",
                    )}
                  </span>
                </div>
              )}
            </div>

            {listing.short_description && (
              <p className="mt-3 text-base text-muted-foreground">
                {listing.short_description}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {listing.listing_type?.name && (
                <Badge
                  variant="outline"
                  className="rounded-full border-border px-2.5 py-0.5 font-semibold"
                >
                  {listing.listing_type.name}
                </Badge>
              )}
              {listing.domain_extension && (
                <Badge
                  variant="outline"
                  className="rounded-full border-border px-2.5 py-0.5 font-semibold"
                >
                  {listing.domain_extension}
                </Badge>
              )}
              {listing.is_featured && (
                <Badge className="gap-1 rounded-full px-2.5 py-0.5">
                  <Award className="h-3 w-3" />
                  {t("marketplace_domains.labels.featured")}
                </Badge>
              )}
              {listing.is_price_negotiable && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5 font-semibold"
                >
                  {t("marketplace_domains.labels.negotiable")}
                </Badge>
              )}
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full px-2.5 py-0.5 font-semibold capitalize",
                )}
              >
                {listing.status}
              </Badge>
            </div>
          </div>

          {/* Key metrics strip (Flippa-style) */}
          <div
            className="flex flex-wrap border-y border-border py-2"
            id="properties-summary"
          >
            <SummaryItem
              label={t(
                "marketplace_domains.labels.business_location",
                "Business location",
              )}
              value={location}
            />
            <SummaryItem
              label={t("marketplace_domains.labels.age", "Site age")}
              value={
                listing.domain_age_years != null && listing.domain_age_years > 0
                  ? `${listing.domain_age_years} ${t("common.years", "years")}`
                  : null
              }
            />
            <SummaryItem
              label={t(
                "marketplace_domains.labels.monthly_profit",
                "Monthly profit",
              )}
              value={
                monthlyProfit != null && monthlyProfit > 0
                  ? `${listing.currency || displayCurrency} ${formatCurrency(monthlyProfit).replace(/^\$/, "")} /${t("marketplace_domains.labels.mo", "mo")}`
                  : null
              }
            />
            <SummaryItem
              label={t(
                "marketplace_domains.labels.profit_margin",
                "Profit margin",
              )}
              value={
                profitMarginPct != null
                  ? `${profitMarginPct.toFixed(0)}%`
                  : null
              }
            />
            <SummaryItem
              label={t("marketplace_domains.labels.page_views", "Page views")}
              value={
                listing.website_traffic_monthly != null &&
                listing.website_traffic_monthly > 0
                  ? `${listing.website_traffic_monthly.toLocaleString()} ${t("marketplace_domains.labels.per_month", "p/mo")}`
                  : null
              }
            />
            <SummaryItem
              label={t(
                "marketplace_domains.labels.profit_multiple",
                "Profit multiple",
              )}
              value={
                profitMultiple != null ? `${profitMultiple.toFixed(1)}x` : null
              }
            />
            <SummaryItem
              label={t(
                "marketplace_domains.labels.revenue_multiple",
                "Revenue multiple",
              )}
              value={
                revenueMultiple != null
                  ? `${revenueMultiple.toFixed(1)}x`
                  : null
              }
            />
          </div>

          {/* Mobile / tablet: hero + price preview */}
          <div className="overflow-hidden rounded-lg border bg-card shadow-sm lg:hidden">
            {heroImage && (
              <div className="aspect-video bg-muted">
                <img
                  src={heroImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <p className="text-sm text-muted-foreground">{priceLabel}</p>
              <p className="mt-2 font-mono text-2xl font-semibold">
                {(listing.currency || displayCurrency) +
                  " " +
                  (numericPrice != null && Number.isFinite(numericPrice)
                    ? numericPrice.toLocaleString()
                    : String(listing.price))}
              </p>
              <Separator className="my-4" />
              <Button
                className="w-full"
                onClick={handleMakeOffer}
                disabled={!canMakeOffer}
              >
                {!canMakeOffer
                  ? t("offers.create.own_listing")
                  : t("marketplace_domains.actions.make_offer")}
              </Button>
            </div>
          </div>

          {/* About + details */}
          {(listing.short_description || listing.description) && (
            <Collapsible
              defaultOpen
              className="rounded-lg border bg-card shadow-sm"
            >
              <CollapsibleTrigger className="group flex w-full items-center justify-between p-5 text-left hover:bg-muted/40">
                <span className="text-lg font-semibold">
                  {t(
                    "marketplace_domains.labels.about_business",
                    "About the business",
                  )}
                </span>
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <Separator />
              <CollapsibleContent className="px-5 pb-5 pt-4">
                {listing.short_description && (
                  <p className="mb-3 text-muted-foreground">
                    {listing.short_description}
                  </p>
                )}
                {listing.description && (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {listing.description}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {hasDomainInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5" />
                  {t("marketplace_domains.labels.domain_info")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {listing.domain_name && (
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        {t("marketplace_domains.labels.domain")}
                      </dt>
                      <dd className="font-medium">{listing.domain_name}</dd>
                    </div>
                  )}
                  {listing.domain_extension && (
                    <div>
                      <dt className="text-xs font-medium text-muted-foreground">
                        {t("marketplace_domains.labels.extension")}
                      </dt>
                      <dd className="font-medium">
                        {listing.domain_extension}
                      </dd>
                    </div>
                  )}
                  {listing.domain_age_years != null &&
                    listing.domain_age_years > 0 && (
                      <div>
                        <dt className="text-xs font-medium text-muted-foreground">
                          {t("marketplace_domains.labels.age")}
                        </dt>
                        <dd className="font-medium">
                          {listing.domain_age_years} {t("common.years")}
                        </dd>
                      </div>
                    )}
                  {listing.domain_authority != null &&
                    listing.domain_authority > 0 && (
                      <div>
                        <dt className="text-xs font-medium text-muted-foreground">
                          {t("marketplace_domains.labels.domain_authority")}
                        </dt>
                        <dd className="font-medium">
                          {listing.domain_authority}
                        </dd>
                      </div>
                    )}
                  {listing.domain_backlinks != null &&
                    listing.domain_backlinks > 0 && (
                      <div>
                        <dt className="text-xs font-medium text-muted-foreground">
                          {t("marketplace_domains.labels.backlinks")}
                        </dt>
                        <dd className="font-medium">
                          {listing.domain_backlinks}
                        </dd>
                      </div>
                    )}
                </dl>
              </CardContent>
            </Card>
          )}

          {hasWebsiteInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5" />
                  {t("marketplace_domains.labels.website_info")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 sm:grid-cols-2">
                  {listing.website_url && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium text-muted-foreground">
                        {t("marketplace_domains.labels.website")}
                      </dt>
                      <dd className="break-all font-medium">
                        <a
                          href={
                            listing.website_url.startsWith("http")
                              ? listing.website_url
                              : `https://${listing.website_url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          {listing.website_url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </dd>
                    </div>
                  )}
                  {listing.website_traffic_monthly != null &&
                    listing.website_traffic_monthly > 0 && (
                      <div>
                        <dt className="text-xs font-medium text-muted-foreground">
                          {t("marketplace_domains.labels.traffic")}
                        </dt>
                        <dd className="font-medium">
                          {listing.website_traffic_monthly.toLocaleString()}
                        </dd>
                      </div>
                    )}
                  {listing.website_revenue_monthly != null &&
                    Number(listing.website_revenue_monthly) > 0 && (
                      <div>
                        <dt className="text-xs font-medium text-muted-foreground">
                          {t("marketplace_domains.labels.revenue")}
                        </dt>
                        <dd className="font-medium">
                          {typeof listing.website_revenue_monthly === "string"
                            ? listing.website_revenue_monthly
                            : listing.website_revenue_monthly.toLocaleString()}
                        </dd>
                      </div>
                    )}
                  {listing.website_profit_monthly != null &&
                    Number(listing.website_profit_monthly) > 0 && (
                      <div>
                        <dt className="text-xs font-medium text-muted-foreground">
                          {t("marketplace_domains.labels.profit")}
                        </dt>
                        <dd className="font-medium">
                          {typeof listing.website_profit_monthly === "string"
                            ? listing.website_profit_monthly
                            : listing.website_profit_monthly.toLocaleString()}
                        </dd>
                      </div>
                    )}
                  {listing.website_technology && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium text-muted-foreground">
                        {t("marketplace_domains.labels.technology")}
                      </dt>
                      <dd className="font-medium">
                        {listing.website_technology}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {listing.expires_at && (
            <Card>
              <CardContent className="flex items-center gap-2 pt-6 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                {t("marketplace_domains.labels.expires")}: {listing.expires_at}
              </CardContent>
            </Card>
          )}

          <div className="flex flex-wrap gap-3 lg:hidden">
            {sellerEmail && (
              <Button variant="outline" className="flex-1" asChild>
                <a href={`mailto:${sellerEmail}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  {t(
                    "marketplace_domains.actions.contact_seller",
                    "Contact seller",
                  )}
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                toast.message(
                  t("marketplace_domains.watch_soon", "Watchlist coming soon"),
                )
              }
            >
              <Eye className="mr-2 h-4 w-4" />
              {t("marketplace_domains.actions.watch", "Watch")}
            </Button>
          </div>
        </div>

        {/* Sidebar (Flippa bid box) */}
        <aside className="lg:col-span-4">
          <div className="space-y-6 lg:sticky lg:top-24">
            <div className="hidden overflow-hidden rounded-lg border bg-card shadow-md lg:block">
              {heroImage && (
                <div className="aspect-video bg-muted">
                  <img
                    src={heroImage}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="bg-card p-6 md:p-8">
                <p className="text-sm text-muted-foreground">{priceLabel}</p>
                <h2 className="mt-2.5 font-mono text-xl font-semibold tracking-tight md:text-2xl">
                  {(listing.currency || displayCurrency) +
                    " " +
                    (numericPrice != null && Number.isFinite(numericPrice)
                      ? numericPrice.toLocaleString()
                      : String(listing.price))}
                </h2>
                <Separator className="my-4" />
                <div className="space-y-3">
                  {sellerEmail && (
                    <Button className="w-full" variant="default" asChild>
                      <a href={`mailto:${sellerEmail}`}>
                        {t(
                          "marketplace_domains.actions.contact_seller",
                          "Contact seller",
                        )}
                      </a>
                    </Button>
                  )}
                  <Button
                    className="w-full"
                    onClick={handleMakeOffer}
                    disabled={!canMakeOffer}
                    variant={sellerEmail ? "outline" : "default"}
                  >
                    {!canMakeOffer
                      ? t("offers.create.own_listing")
                      : t("marketplace_domains.actions.make_offer")}
                  </Button>
                </div>
              </div>
            </div>

            {listing.seller && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4" />
                    {t("marketplace_domains.labels.seller")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                      {sellerName.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{sellerName}</p>
                      {location && (
                        <p className="text-sm text-muted-foreground">
                          {location}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => navigate(ROUTES.APP.MARKETPLACE)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("marketplace_domains.actions.back_to_list")}
            </Button>
          </div>
        </aside>
      </div>

      <MakeOfferModal
        open={makeOfferModalOpen}
        onOpenChange={setMakeOfferModalOpen}
        listing={listing}
        onSuccess={() => setMakeOfferModalOpen(false)}
      />
    </div>
  );
}
