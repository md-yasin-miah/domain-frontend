import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useAuth } from "@/store/hooks/useAuth";
import MakeOfferModal from "@/pages/client/marketplace/myListing/components/MakeOfferModal";
import { toast } from "sonner";

export default function ListingDetailsBySlug() {
  const { listingSlug } = useParams<{ listingSlug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [makeOfferModalOpen, setMakeOfferModalOpen] = useState(false);
  const { data: listing, isLoading, error } = useGetMarketplaceListingBySlugQuery(
    listingSlug,
    { skip: !listingSlug }
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
  const canMakeOffer = !user || (listing ? listing.seller_id !== user.id : true);

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

  if (!listingSlug) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-muted-foreground">{t("common.not_found")}</p>
        <Button variant="link" asChild className="mt-2">
          <Link to={ROUTES.APP.MARKETPLACE}>{t("common.back")}</Link>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-destructive">
          {t("marketplace_domains.errors.load_failed")}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
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
                {t("marketplace_domains.labels.featured")}
              </Badge>
            )}
            {listing.is_price_negotiable && (
              <Badge variant="secondary">
                {t("marketplace_domains.labels.negotiable")}
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
                {formatNumber(listing.view_count)} {t("marketplace_domains.labels.views")}
              </span>
            )}
            {listing.favorite_count != null && listing.favorite_count > 0 && (
              <span className="flex items-center gap-1 text-sm">
                <Heart className="h-4 w-4" />
                {formatNumber(listing.favorite_count)} {t("common.favorites")}
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
              {t("marketplace_domains.labels.description")}
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
                  <dd className="font-medium">{listing.domain_extension}</dd>
                </div>
              )}
              {listing.domain_age_years != null && listing.domain_age_years > 0 && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("marketplace_domains.labels.age")}
                  </dt>
                  <dd className="font-medium">
                    {listing.domain_age_years} {t("common.years")}
                  </dd>
                </div>
              )}
              {listing.domain_authority != null && listing.domain_authority > 0 && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("marketplace_domains.labels.domain_authority")}
                  </dt>
                  <dd className="font-medium">{listing.domain_authority}</dd>
                </div>
              )}
              {listing.domain_backlinks != null && listing.domain_backlinks > 0 && (
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    {t("marketplace_domains.labels.backlinks")}
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
              {t("marketplace_domains.labels.expires")}: {listing.expires_at}
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
              {t("marketplace_domains.labels.seller")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {(listing.seller as { name?: string }).name ||
                listing.seller.username ||
                t("marketplace_domains.labels.anonymous")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4">
        <Button onClick={handleMakeOffer} disabled={!canMakeOffer}>
          {!canMakeOffer
            ? t("offers.create.own_listing")
            : t("marketplace_domains.actions.make_offer")}
        </Button>
        {/* {listing.public_url && (
          <Button variant="outline" asChild>
            <a
              href={listing.public_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              {t("marketplace_domains.actions.share")}
            </a>
          </Button>
        )} */}
        <Button variant="ghost" onClick={() => navigate(ROUTES.APP.MARKETPLACE)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("marketplace_domains.actions.back_to_list")}
        </Button>
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
