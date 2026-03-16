import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Eye,
  Calendar,
  Award,
  Globe,
  User,
  ExternalLink,
  Heart,
  Share2,
} from "lucide-react";
import { useGetMarketplaceListingBySlugQuery } from "@/store/api/marketplaceApi";
import { ROUTES } from "@/lib/routes";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatNumber } from "@/lib/helperFun";

export default function ListingDetailsByCategory() {
  const { slug, listingSlug } = useParams<{ slug: string; listingSlug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  console.log({slug, listingSlug})
  const { data: listing, isLoading, error } = useGetMarketplaceListingBySlugQuery(
    listingSlug,
    { skip: !slug || !listingSlug }
  );

  const price =
    listing && typeof listing.price === "string"
      ? parseFloat(listing.price)
      : listing?.price;
  const displayTitle =
    listing?.title ||
    listing?.domain_name ||
    listing?.slug ||
    (listing ? `#${listing.id}` : "");
  const categoryUrl = slug ? ROUTES.APP.CATEGORIES.BY_SLUG(slug) : ROUTES.APP.CATEGORIES.ROOT;

  if (!listingSlug) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-muted-foreground">{t("common.not_found", "Not found")}</p>
        <Button variant="link" asChild className="mt-2">
          <Link to={ROUTES.APP.CATEGORIES.ROOT}>{t("common.back")}</Link>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-destructive">
          {t("marketplace_domains.errors.load_failed", "Failed to load listing")}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(categoryUrl)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
      </div>
    );
  }

  if (isLoading || !listing) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="aspect-video md:col-span-2 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
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
    (listing.website_traffic_monthly != null && listing.website_traffic_monthly > 0) ||
    (listing.website_revenue_monthly != null &&
      Number(listing.website_revenue_monthly) > 0) ||
    (listing.website_profit_monthly != null &&
      Number(listing.website_profit_monthly) > 0) ||
    listing.website_technology;
  const images = [
    ...(listing.primary_image_url ? [listing.primary_image_url] : []),
    ...(listing.image_urls?.filter(Boolean) ?? []),
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 md:py-8 space-y-6">
      {/* Back + breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Button variant="ghost" size="sm" asChild>
          <Link to={categoryUrl} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back")}
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        {listing.listing_type?.name && (
          <>
            <Link
              to={categoryUrl}
              className="text-muted-foreground hover:text-foreground"
            >
              {listing.listing_type.name}
            </Link>
            <span className="text-muted-foreground">/</span>
          </>
        )}
        <span className="font-medium truncate max-w-[200px]">{displayTitle}</span>
      </div>

      {/* Hero: image + title + price */}
      <Card className="overflow-hidden border-2">
        {images.length > 0 && (
          <div className="aspect-video md:aspect-[21/9] bg-muted">
            <img
              src={images[0]}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {listing.listing_type?.name && (
              <Badge variant="outline">{listing.listing_type.name}</Badge>
            )}
            {listing.is_featured && (
              <Badge variant="default" className="gap-1">
                <Award className="h-3 w-3" />
                {t("marketplace_domains.labels.featured", "Featured")}
              </Badge>
            )}
            {listing.is_price_negotiable && (
              <Badge variant="secondary">
                {t("marketplace_domains.labels.negotiable", "Negotiable")}
              </Badge>
            )}
            {listing.domain_extension && (
              <Badge variant="secondary">{listing.domain_extension}</Badge>
            )}
          </div>
          <CardTitle className="text-2xl md:text-3xl">{displayTitle}</CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(price ?? listing.price)} {listing.currency || "USD"}
            </span>
            {listing.view_count != null && (
              <span className="flex items-center gap-1 text-sm">
                <Eye className="h-4 w-4" />
                {formatNumber(listing.view_count)} {t("marketplace_domains.labels.views", "views")}
              </span>
            )}
            {listing.favorite_count != null && listing.favorite_count > 0 && (
              <span className="flex items-center gap-1 text-sm">
                <Heart className="h-4 w-4" />
                {formatNumber(listing.favorite_count)} {t("common.favorites", "favorites")}
              </span>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Description */}
      {(listing.short_description || listing.description) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("marketplace_domains.labels.description", "Description")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {listing.short_description && (
              <p className="text-muted-foreground">{listing.short_description}</p>
            )}
            {listing.description && (
              <div className="whitespace-pre-wrap text-sm">{listing.description}</div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Domain details (only when any value present) */}
      {hasDomainInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("marketplace_domains.labels.domain_info", "Domain information")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {listing.domain_name && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("marketplace_domains.labels.domain", "Domain")}
                  </dt>
                  <dd className="font-medium">{listing.domain_name}</dd>
                </div>
              )}
              {listing.domain_extension && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("marketplace_domains.labels.extension", "Extension")}
                  </dt>
                  <dd className="font-medium">{listing.domain_extension}</dd>
                </div>
              )}
              {listing.domain_age_years != null && listing.domain_age_years > 0 && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("marketplace_domains.labels.age", "Age")}
                  </dt>
                  <dd className="font-medium">
                    {listing.domain_age_years} {t("common.years", "years")}
                  </dd>
                </div>
              )}
              {listing.domain_authority != null && listing.domain_authority > 0 && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("marketplace_domains.labels.domain_authority", "Domain authority")}
                  </dt>
                  <dd className="font-medium">{listing.domain_authority}</dd>
                </div>
              )}
              {listing.domain_backlinks != null && listing.domain_backlinks > 0 && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("marketplace_domains.labels.backlinks", "Backlinks")}
                  </dt>
                  <dd className="font-medium">{listing.domain_backlinks}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Website details (only when any value present) */}
      {hasWebsiteInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("marketplace_domains.labels.website_info", "Website information")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {listing.website_url && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("marketplace_domains.labels.website", "Website")}
                  </dt>
                  <dd className="font-medium break-all">
                    <a
                      href={listing.website_url.startsWith("http") ? listing.website_url : `https://${listing.website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
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
                      {t("marketplace_domains.labels.traffic", "Monthly traffic")}
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
                      {t("marketplace_domains.labels.revenue", "Monthly revenue")}
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
                      {t("marketplace_domains.labels.profit", "Monthly profit")}
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
                    {t("marketplace_domains.labels.technology", "Technology")}
                  </dt>
                  <dd className="font-medium">{listing.website_technology}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Expires at */}
      {listing.expires_at && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              {t("marketplace_domains.labels.expires", "Expires")}: {listing.expires_at}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seller */}
      {listing.seller && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("marketplace_domains.labels.seller", "Seller")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {(listing.seller as { name?: string }).name ||
                listing.seller.username ||
                t("marketplace_domains.labels.anonymous", "Anonymous")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4">
        <Button asChild>
          <Link to={ROUTES.APP.MARKETPLACE}>
            {t("marketplace_domains.actions.make_offer", "Make an offer")}
          </Link>
        </Button>
        {listing.public_url && (
          <Button variant="outline" asChild>
            <a
              href={listing.public_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              {t("marketplace_domains.actions.share", "Share")}
            </a>
          </Button>
        )}
        <Button variant="ghost" onClick={() => navigate(categoryUrl)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("marketplace_domains.actions.back_to_list", "Back to list")}
        </Button>
      </div>
    </div>
  );
}
