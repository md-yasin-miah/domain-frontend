import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Award, Calendar, Heart } from "lucide-react";

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

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/20 cursor-pointer flex flex-col justify-between"
      onClick={handleCardClick}
    >
      <div>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {displayTitle}
                {listing.is_featured && (
                  <Award className="inline h-4 w-4 text-yellow-500 ml-2" />
                )}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 w-fit mt-2">
                {listing.listing_type?.name && (
                  <Badge variant="outline">{listing.listing_type.name}</Badge>
                )}
                {listing.domain_extension && (
                  <Badge variant="secondary" className="text-xs">
                    {listing.domain_extension}
                  </Badge>
                )}
                {listing.is_price_negotiable && (
                  <Badge variant="secondary">
                    {t("marketplace_domains.labels.negotiable", "Negotiable")}
                  </Badge>
                )}
              </div>
            </div>
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleToggleFavorite}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">
              {listing.currency || "USD"}{" "}
              {Number.isFinite(price) ? price.toLocaleString() : listing.price}
            </span>
            {(listing.view_count != null || listing.favorite_count != null) && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {listing.view_count != null && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {listing.view_count}
                  </span>
                )}
                {listing.favorite_count != null &&
                  listing.favorite_count > 0 && (
                    <span>
                      {listing.favorite_count}{" "}
                      {t("common.favorites", "favorites")}
                    </span>
                  )}
              </div>
            )}
          </div>

          {listing.short_description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {listing.short_description}
            </p>
          )}

          <div className="flex flex-wrap gap-x-1 gap-y-2 text-sm">
            {listing.domain_name && (
              <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                <span className="text-muted-foreground">
                  {t("marketplace_domains.labels.domain", "Domain")}:
                </span>
                <p className="font-medium">{listing.domain_name}</p>
              </div>
            )}
            {listing.domain_age_years != null &&
              listing.domain_age_years > 0 && (
                <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                  <span className="text-muted-foreground">
                    {t("marketplace_domains.labels.age", "Age")}:
                  </span>
                  <p className="font-medium">
                    {listing.domain_age_years} {t("common.years", "yrs")}
                  </p>
                </div>
              )}
            {listing.domain_authority != null &&
              listing.domain_authority > 0 && (
                <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                  <span className="text-muted-foreground">
                    {t("marketplace_domains.labels.domain_authority", "DA")}:
                  </span>
                  <p className="font-medium">{listing.domain_authority}</p>
                </div>
              )}
            {listing.domain_backlinks != null &&
              listing.domain_backlinks > 0 && (
                <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                  <span className="text-muted-foreground">
                    {t("marketplace_domains.labels.backlinks", "Backlinks")}:
                  </span>
                  <p className="font-medium">{listing.domain_backlinks}</p>
                </div>
              )}
            {listing.website_traffic_monthly != null &&
              listing.website_traffic_monthly > 0 && (
                <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                  <span className="text-muted-foreground">
                    {t("marketplace_domains.labels.traffic", "Traffic")}:
                  </span>
                  <p className="font-medium">
                    {listing.website_traffic_monthly.toLocaleString()}/mo
                  </p>
                </div>
              )}
            {listing.website_url && (
              <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                <span className="text-muted-foreground">
                  {t("marketplace_domains.labels.website", "Website")}:
                </span>
                <p className="font-medium truncate">{listing.website_url}</p>
              </div>
            )}
            {listing.website_revenue_monthly != null &&
              Number(listing.website_revenue_monthly) > 0 && (
                <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                  <span className="text-muted-foreground">
                    {t("marketplace_domains.labels.revenue", "Revenue")}:
                  </span>
                  <p className="font-medium">
                    {typeof listing.website_revenue_monthly === "string"
                      ? listing.website_revenue_monthly
                      : listing.website_revenue_monthly.toLocaleString()}
                    /mo
                  </p>
                </div>
              )}
            {listing.website_technology && (
              <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                <span className="text-muted-foreground">
                  {t("marketplace_domains.labels.technology", "Tech")}:
                </span>
                <p className="font-medium truncate">
                  {listing.website_technology}
                </p>
              </div>
            )}
          </div>

          {listing.expires_at && (
            <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
              <Calendar className="h-4 w-4 shrink-0" />
              {t("marketplace_domains.labels.expires", "Expires")}:{" "}
              {listing.expires_at}
            </div>
          )}

          {listing.seller?.name && (
            <p className="text-sm text-muted-foreground">
              {t("marketplace_domains.labels.seller", "Seller")}:{" "}
              {listing.seller.name}
            </p>
          )}
        </CardContent>
      </div>
      <CardFooter>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Link to={detailUrl} onClick={(e) => e.stopPropagation()}>
            <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
              {t("marketplace_domains.actions.view_details")}
            </Button>
          </Link>
          <Link
            to={detailUrl + "?openOffer=true"}
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="outline" className="w-full">
              {t("marketplace_domains.actions.make_offer")}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MarketplaceListingCard;
