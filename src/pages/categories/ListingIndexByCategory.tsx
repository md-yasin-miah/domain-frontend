import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import {
  Search,
  Filter,
  Globe,
  Eye,
  Calendar,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle,
} from "lucide-react";
import {
  useMarketplaceListingsById,
  useIncrementViews,
} from "@/store/hooks/useMarketplace";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/routes";
import { Link, useParams } from "react-router-dom";
import { useGetMarketplaceListingTypesQuery } from "@/store/api/marketplaceApi";

const DomainsPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { data: listingTypes } = useGetMarketplaceListingTypesQuery(
    { is_active: true },
    {
      skip: !slug,
    },
  );
  const listing_type_id = listingTypes?.find(
    (type: MarketplaceListingType) => type.slug === slug,
  )?.id;
  const { data: listings, isLoading: listingsLoading } =
    useMarketplaceListingsById(listing_type_id);
  const incrementViews = useIncrementViews();

  const categories = [
    { key: "technology", count: 47, color: "bg-primary" },
    { key: "business", count: 89, color: "bg-primary/80" },
    { key: "finance", count: 34, color: "bg-secondary" },
    { key: "health", count: 23, color: "bg-primary/90" },
    { key: "education", count: 56, color: "bg-secondary/80" },
    { key: "entertainment", count: 78, color: "bg-primary/70" },
  ];

  return (
    <div className="md:p-6 lg:p-8 p-4 container mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 border">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t("marketplace_domains.hero.title")}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {t("marketplace_domains.hero.subtitle")}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {t("marketplace_domains.hero.bullets.secure_transfer")}
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              {t("marketplace_domains.hero.bullets.verified_domains")}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              {t("marketplace_domains.hero.bullets.real_valuations")}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("marketplace_domains.search.placeholder")}
              className="pl-10 h-12"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Filter className="h-4 w-4" />
              {t("common.filter")}
            </Button>
            <Button className="h-12 px-8">{t("common.search")}</Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          >
            .com
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          >
            .com
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          >
            {t("marketplace_domains.quick_filters.under_5000")}
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          >
            {t("marketplace_domains.quick_filters.premium")}
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
          >
            {t("marketplace_domains.quick_filters.short")}
          </Badge>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          {t("marketplace_domains.categories.title")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card
              key={category.key}
              className="hover:shadow-md transition-shadow cursor-pointer group"
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-medium text-sm">
                  {t(`marketplace_domains.categories.items.${category.key}`)}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("marketplace_domains.categories.count", {
                    count: category.count,
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Domains */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {t("marketplace_domains.featured.title")}
          </h2>
          <Button variant="outline" className="flex items-center gap-2">
            {t("marketplace_domains.featured.view_all")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {listingsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-2">
                <CardHeader className="pb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings && listings.length > 0 ? (
              listings.map((listing: MarketplaceListing) => {
                const price =
                  typeof listing.price === "string"
                    ? parseFloat(listing.price)
                    : listing.price;
                const displayTitle =
                  listing.title ||
                  listing.domain_name ||
                  listing.slug ||
                  "#" + listing.id;
                const detailUrl = slug
                  ? ROUTES.APP.CATEGORIES.LISTING_DETAIL(slug, listing.slug)
                  : ROUTES.APP.MARKETPLACE;

                return (
                  <Card
                    key={listing.id}
                    className="hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/20 cursor-pointer flex flex-col justify-between"
                    onClick={() => incrementViews(listing.id)}
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
                            <div className="flex flex-wrap items-center gap-1 w-fit gap-2 mt-2">
                              {listing.listing_type?.name && (
                                <Badge variant="outline">
                                  {listing.listing_type.name}
                                </Badge>
                              )}
                              {listing.domain_extension && (
                                <Badge variant="secondary" className="text-xs">
                                  {listing.domain_extension}
                                </Badge>
                              )}
                              {listing.is_price_negotiable && (
                                <Badge variant="secondary">
                                  {t(
                                    "marketplace_domains.labels.negotiable",
                                    "Negotiable",
                                  )}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-primary">
                            {listing.currency || "USD"}{" "}
                            {Number.isFinite(price)
                              ? price.toLocaleString()
                              : listing.price}
                          </span>
                          {(listing.view_count != null ||
                            listing.favorite_count != null) && (
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
                                {t(
                                  "marketplace_domains.labels.domain",
                                  "Domain",
                                )}
                                :
                              </span>
                              <p className="font-medium">
                                {listing.domain_name}
                              </p>
                            </div>
                          )}
                          {listing.domain_age_years != null &&
                            listing.domain_age_years > 0 && (
                              <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                                <span className="text-muted-foreground">
                                  {t("marketplace_domains.labels.age", "Age")}:
                                </span>
                                <p className="font-medium">
                                  {listing.domain_age_years}{" "}
                                  {t("common.years", "yrs")}
                                </p>
                              </div>
                            )}
                          {listing.domain_authority != null &&
                            listing.domain_authority > 0 && (
                              <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                                <span className="text-muted-foreground">
                                  {t(
                                    "marketplace_domains.labels.domain_authority",
                                    "DA",
                                  )}
                                  :
                                </span>
                                <p className="font-medium">
                                  {listing.domain_authority}
                                </p>
                              </div>
                            )}
                          {listing.domain_backlinks != null &&
                            listing.domain_backlinks > 0 && (
                              <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                                <span className="text-muted-foreground">
                                  {t(
                                    "marketplace_domains.labels.backlinks",
                                    "Backlinks",
                                  )}
                                  :
                                </span>
                                <p className="font-medium">
                                  {listing.domain_backlinks}
                                </p>
                              </div>
                            )}
                          {listing.website_traffic_monthly != null &&
                            listing.website_traffic_monthly > 0 && (
                              <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3 ">
                                <span className="text-muted-foreground">
                                  {t(
                                    "marketplace_domains.labels.traffic",
                                    "Traffic",
                                  )}
                                  :
                                </span>
                                <p className="font-medium">
                                  {listing.website_traffic_monthly.toLocaleString()}
                                  /mo
                                </p>
                              </div>
                            )}
                          {listing.website_url && (
                            <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                              <span className="text-muted-foreground">
                                {t(
                                  "marketplace_domains.labels.website",
                                  "Website",
                                )}
                                :
                              </span>
                              <p className="font-medium truncate">
                                {listing.website_url}
                              </p>
                            </div>
                          )}
                          {listing.website_revenue_monthly != null &&
                            Number(listing.website_revenue_monthly) > 0 && (
                              <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                                <span className="text-muted-foreground">
                                  {t(
                                    "marketplace_domains.labels.revenue",
                                    "Revenue",
                                  )}
                                  :
                                </span>
                                <p className="font-medium">
                                  {typeof listing.website_revenue_monthly ===
                                  "string"
                                    ? listing.website_revenue_monthly
                                    : listing.website_revenue_monthly.toLocaleString()}
                                  /mo
                                </p>
                              </div>
                            )}
                          {listing.website_technology && (
                            <div className="flex flex-wrap items-center gap-1 w-fit border rounded-md px-3">
                              <span className="text-muted-foreground">
                                {t(
                                  "marketplace_domains.labels.technology",
                                  "Tech",
                                )}
                                :
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
                            {t("marketplace_domains.labels.expires", "Expires")}
                            : {listing.expires_at}
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
                        <Link to={detailUrl}>
                          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                            {t("marketplace_domains.actions.view_details")}
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full">
                          {t("marketplace_domains.actions.make_offer")}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("marketplace_domains.empty.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("marketplace_domains.empty.description")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainsPage;
