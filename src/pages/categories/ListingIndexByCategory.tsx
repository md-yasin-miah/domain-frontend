import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Search, Filter, Globe, ArrowRight } from "lucide-react";
import MarketplaceListingCard from "@/components/marketplace/MarketplaceListingCard";
import {
  useMarketplaceListingsById,
  useIncrementViews,
} from "@/store/hooks/useMarketplace";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/routes";
import { useParams } from "react-router-dom";
import { useGetMarketplaceListingTypesQuery } from "@/store/api/marketplaceApi";

const ListingIndexByCategory = () => {
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

  return (
    <div className="md:p-6 lg:p-8 p-4 container mx-auto space-y-8">
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
          <div className="grid grid-cols-1 gap-6">
            {listings && listings.length > 0 ? (
              listings.map((listing: MarketplaceListing) => {
                const detailUrl = slug
                  ? ROUTES.APP.CATEGORIES.LISTING_DETAIL(slug, listing.slug)
                  : ROUTES.APP.MARKETPLACE;
                return (
                  <MarketplaceListingCard
                    key={listing.id}
                    listing={listing}
                    detailUrl={detailUrl}
                    onViewClick={incrementViews}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("marketplace.empty.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("marketplace.empty.description")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingIndexByCategory;
