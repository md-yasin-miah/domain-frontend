import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import MarketplaceListingCard from "@/components/marketplace/MarketplaceListingCard";
import {
  useMarketplaceListingsById,
  useIncrementViews,
} from "@/store/hooks/useMarketplace";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/routes";
import { useParams } from "react-router-dom";
import { useGetMarketplaceListingTypesQuery } from "@/store/api/marketplaceApi";
import ListingFilters, {
  type ListingFiltersValue,
} from "../component/ListingFilters";
import { applyMarketplaceListingFilters } from "@/lib/marketplaceListingFilters";
import { useMemo, useState } from "react";

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

  const [filters, setFilters] = useState<ListingFiltersValue>({});

  const filteredListings = useMemo(() => {
    return applyMarketplaceListingFilters(listings ?? [], filters);
  }, [listings, filters]);

  const noFilterMatches =
    (listings?.length ?? 0) > 0 && filteredListings.length === 0;

  return (
    <div className="md:p-6 lg:p-8 p-4 container mx-auto space-y-8">
      {/* Featured Domains */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            {t("marketplace_domains.featured.title")}
          </h2>
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
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <ListingFilters onFiltersChange={setFilters} />
            </div>
            <div className="space-y-6 col-span-10">
              {filteredListings.length > 0 ? (
                filteredListings.map((listing: MarketplaceListing) => {
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
                    {noFilterMatches
                      ? t("marketplace.empty.no_matches_title", {
                          defaultValue: "No listings match your filters",
                        })
                      : t("marketplace.empty.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {noFilterMatches
                      ? t("marketplace.empty.no_matches_description", {
                          defaultValue:
                            "Try clearing or relaxing filters to see more results.",
                        })
                      : t("marketplace.empty.description")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingIndexByCategory;
