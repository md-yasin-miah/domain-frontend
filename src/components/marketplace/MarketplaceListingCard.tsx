import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Award, MapPin } from "lucide-react";

export interface MarketplaceListingCardProps {
  listing: MarketplaceListing;
  detailUrl: string;
  onViewClick?: (listingId: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (listingId: number) => void;
}

const MarketplaceListingCard: React.FC<MarketplaceListingCardProps> = ({
  listing,
  detailUrl,
  onViewClick,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { t } = useTranslation();
  const listingData = listing as MarketplaceListing & Record<string, unknown>;

  const price =
    typeof listing.price === "string"
      ? parseFloat(listing.price)
      : listing.price;
  const displayTitle =
    listing.title || listing.domain_name || listing.slug || "#" + listing.id;

  const handleCardClick = () => {
    onViewClick?.(listing.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(listing.id);
  };

  const location =
    typeof listingData.country === "string" && listingData.country.trim()
      ? listingData.country
      : t("common.not_available", "N/A");

  const industry =
    typeof listingData.industry === "object" &&
    listingData.industry !== null &&
    "name" in listingData.industry &&
    typeof (listingData.industry as { name?: string }).name === "string"
      ? (listingData.industry as { name: string }).name
      : typeof listingData.industry === "string"
        ? listingData.industry
        : t("common.not_available", "N/A");

  const monetization =
    typeof listingData.monetization === "string" &&
    listingData.monetization.trim()
      ? listingData.monetization
      : t("common.not_available", "N/A");

  const netProfit =
    (typeof listingData.website_profit_monthly === "number" &&
      listingData.website_profit_monthly > 0 &&
      listingData.website_profit_monthly.toLocaleString()) ||
    (typeof listingData.website_profit_monthly === "string" &&
      listingData.website_profit_monthly) ||
    t("common.not_available", "N/A");
  const fallbackImage =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'>
        <defs>
          <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='#f3f4f6'/>
            <stop offset='100%' stop-color='#e5e7eb'/>
          </linearGradient>
        </defs>
        <rect width='800' height='400' fill='url(#g)'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b7280' font-family='Arial, sans-serif' font-size='28'>
          No Image Available
        </text>
      </svg>`,
    );

  const stats = [
    {
      label: t("marketplace_domains.labels.domain", "Type"),
      value: listing.listing_type?.name || t("common.not_available", "N/A"),
    },
    {
      label: t("marketplace_domains.labels.industry", "Industry"),
      value: industry,
    },
    {
      label: t("marketplace_domains.labels.monetization", "Monetization"),
      value: monetization,
    },
    {
      label: t("marketplace_domains.labels.age", "Site Age"),
      value:
        listing.domain_age_years != null && listing.domain_age_years > 0
          ? `${listing.domain_age_years} ${t("common.years", "years")}`
          : t("common.not_available", "N/A"),
    },
    {
      label: t("marketplace_domains.labels.profit", "Net Profit"),
      value: netProfit,
    },
  ];

  return (
    <Card
      className="group cursor-pointer rounded-xl border bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="grid gap-4 lg:grid-cols-[260px_1fr_270px] justify-center">
        <div className="space-y-2">
          <div className="h-40 w-full overflow-hidden rounded-md bg-muted">
            <img
              src={listing.primary_image_url || fallbackImage}
              alt={displayTitle}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackImage;
              }}
            />
          </div>
          {(listing.is_featured || listing.is_price_negotiable) && (
            <div className="flex flex-wrap gap-2 text-xs">
              {listing.is_featured && (
                <Badge
                  variant="secondary"
                  className="bg-amber-50 text-amber-700"
                >
                  <Award className="mr-1 h-3 w-3" />
                  {t("marketplace_domains.labels.featured", "Featured")}
                </Badge>
              )}
              {listing.is_price_negotiable && (
                <Badge
                  variant="secondary"
                  className="bg-violet-50 text-violet-700"
                >
                  {t("marketplace_domains.labels.negotiable", "Negotiable")}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-3">
          <CardTitle className="truncate text-2xl font-semibold text-primary transition-colors group-hover:text-primary/90">
            {displayTitle}
          </CardTitle>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </p>
          {listing.short_description && (
            <p className="line-clamp-2 text-sm text-foreground/90">
              {listing.short_description}
            </p>
          )}

          <div className="flex flex-wrap gap-5 pt-1 text-sm">
            {stats.map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
                <p className="truncate font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 lg:items-end">
          <div className="text-left lg:text-right">
            <p className="text-sm text-muted-foreground">
              {t("marketplace_domains.labels.asking_price", "Asking Price")}
            </p>
            <p className="text-3xl font-bold leading-tight text-foreground">
              {(listing.currency || "USD") + " "}
              {Number.isFinite(price) ? price.toLocaleString() : listing.price}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full min-w-[120px]"
              onClick={handleToggleFavorite}
            >
              <Eye className="mr-2 h-4 w-4" />
              {isFavorite
                ? t("marketplace_domains.actions.watching", "Watching")
                : t("marketplace_domains.actions.watch", "Watch")}
            </Button>
            <Link to={detailUrl} onClick={(e) => e.stopPropagation()}>
              <Button className="w-full min-w-[140px]">
                {t("marketplace_domains.actions.view_listing", "View Listing")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MarketplaceListingCard;
