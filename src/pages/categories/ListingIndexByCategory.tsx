import { Card } from "@/components/ui/card";
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
          <h2 className="text-2xl font-semibold">Featured {slug}</h2>
        </div>

        {listingsLoading ? (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-2">
              <div className="space-y-4 rounded-lg border bg-card p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <div className="h-px w-full bg-border" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="h-px w-full bg-border" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-4 rounded-sm" />
                    </div>
                    <div className="space-y-2 pl-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                    {i < 3 && <div className="h-px w-full bg-border" />}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12 space-y-6 lg:col-span-10">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="rounded-xl border bg-card p-4">
                  <div className="grid gap-4 lg:grid-cols-[260px_1fr_270px]">
                    <div className="space-y-2">
                      <Skeleton className="h-40 w-full rounded-md" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                      </div>
                    </div>
                    <div className="min-w-0 space-y-3">
                      <Skeleton className="h-8 w-4/5 max-w-md" />
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-11/12" />
                      <div className="flex flex-wrap gap-4 pt-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} className="space-y-1.5">
                            <Skeleton className="h-3 w-14" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between gap-4 lg:items-end">
                      <div className="w-full space-y-2 lg:w-auto lg:text-right">
                        <Skeleton className="h-3 w-28 lg:ml-auto" />
                        <Skeleton className="h-10 w-40 lg:ml-auto" />
                      </div>
                      <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                        <Skeleton className="h-10 w-full min-w-[120px] sm:flex-1" />
                        <Skeleton className="h-10 w-full min-w-[140px] sm:flex-1" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
