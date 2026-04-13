import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Smartphone,
  Package,
  TrendingUp,
  Code,
  Database,
  Play,
  Gem,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  Shield,
  Award,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Link } from "react-router-dom";
import {
  useGetMarketplaceListingTypesQuery,
  useGetMarketplaceListingsQuery,
} from "@/store/api/marketplaceApi";
import { ROUTES } from "@/lib/routes";
import MarketplaceListingCard from "@/components/marketplace/MarketplaceListingCard";
import { useIncrementViews } from "@/store/hooks/useMarketplace";
import { Input } from "@/components/ui/input";

const LISTING_TYPE_ICONS: Record<string, typeof Globe> = {
  domain: Globe,
  website: Globe,
  app: Smartphone,
  fba: Package,
  ecommerce: ShoppingCart,
  saas: Code,
  software: Code,
  database: Database,
  channel: Play,
  nft: Gem,
};

function getPriceRangeParams(value: string): {
  min_price?: number;
  max_price?: number;
} {
  switch (value) {
    case "0-1000":
      return { min_price: 0, max_price: 1000 };
    case "1000-10000":
      return { min_price: 1000, max_price: 10000 };
    case "10000-50000":
      return { min_price: 10000, max_price: 50000 };
    case "50000+":
      return { min_price: 50000 };
    default:
      return {};
  }
}

const Marketplace = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [listingsTab, setListingsTab] = useState<
    "featured" | "newest" | "trending"
  >("featured");

  const baseFilters = useMemo(() => {
    const price = getPriceRangeParams(priceRange);
    return {
      search: debouncedSearchQuery.trim() || undefined,
      listing_type_id:
        selectedCategory === "all" ? undefined : Number(selectedCategory),
      ...price,
      skip: 0,
      limit: 12,
    };
  }, [debouncedSearchQuery, selectedCategory, priceRange]);

  const hasAdvancedSearch =
    debouncedSearchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    priceRange !== "all";

  const { data: listingTypes = [], isLoading: typesLoading } =
    useGetMarketplaceListingTypesQuery(undefined, { skip: false });

  const { data: featuredData, isLoading: featuredLoading } =
    useGetMarketplaceListingsQuery({
      ...baseFilters,
      limit: 6,
      is_featured: true,
    });

  const { data: newestData, isLoading: newestLoading } =
    useGetMarketplaceListingsQuery({
      ...baseFilters,
      sort_by: "created_at",
      sort_order: "desc",
    });

  const { data: trendingData, isLoading: trendingLoading } =
    useGetMarketplaceListingsQuery({
      ...baseFilters,
      sort_by: "view_count",
      sort_order: "desc",
    });

  const featuredListings = useMemo(() => {
    const raw = featuredData?.items ?? featuredData;
    return Array.isArray(raw) ? raw : [];
  }, [featuredData]);

  const newestListings = useMemo(() => {
    const raw = newestData?.items ?? newestData;
    return Array.isArray(raw) ? raw : [];
  }, [newestData]);

  const trendingListings = useMemo(() => {
    const raw = trendingData?.items ?? trendingData;
    return Array.isArray(raw) ? raw : [];
  }, [trendingData]);

  const categories = useMemo(
    () =>
      listingTypes
        .filter((t) => t.is_active)
        .map((type) => ({
          id: String(type.id),
          name: type.name,
          slug: type.slug,
          icon: LISTING_TYPE_ICONS[type.slug?.toLowerCase() ?? ""] ?? Package,
        })),
    [listingTypes],
  );

  const incrementViews = useIncrementViews();

  const listingsLoading =
    listingsTab === "featured"
      ? featuredLoading
      : listingsTab === "newest"
        ? newestLoading
        : trendingLoading;
  const listingsByTab =
    listingsTab === "featured"
      ? featuredListings
      : listingsTab === "newest"
        ? newestListings
        : trendingListings;
  console.log({ listingsByTab });
  const howItWorks = [
    {
      step: 1,
      title: t("marketplace.how_it_works.step1.title"),
      description: t("marketplace.how_it_works.step1.description"),
      icon: CheckCircle,
    },
    {
      step: 2,
      title: t("marketplace.how_it_works.step2.title"),
      description: t("marketplace.how_it_works.step2.description"),
      icon: TrendingUp,
    },
    {
      step: 3,
      title: t("marketplace.how_it_works.step3.title"),
      description: t("marketplace.how_it_works.step3.description"),
      icon: Shield,
    },
    {
      step: 4,
      title: t("marketplace.how_it_works.step4.title"),
      description: t("marketplace.how_it_works.step4.description"),
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            {t("marketplace.title")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("marketplace.description")}
          </p>

          {/* Advanced Search */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50">
              <div className="col-span-12 md:col-span-6 relative">
                <Input
                  placeholder={t("marketplace.search.placeholder")}
                  className="w-full h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-0 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer w-10 h-full hover:bg-primary/10 rounded-md p-2.5 transition-all hover:text-primary" />
              </div>
              <div className="col-span-12 md:col-span-3">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-12 min-w-[180px]">
                    <SelectValue
                      placeholder={t("marketplace.filters.category")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("marketplace.filters.all_categories")}
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-12 md:col-span-3">
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-12 min-w-[160px]">
                    <SelectValue placeholder={t("marketplace.filters.price")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("marketplace.filters.all_prices")}
                    </SelectItem>
                    <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                    <SelectItem value="1000-10000">$1,000 - $10,000</SelectItem>
                    <SelectItem value="10000-50000">
                      $10,000 - $50,000
                    </SelectItem>
                    <SelectItem value="50000+">$50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">$2.4M+</div>
              <div className="text-sm text-muted-foreground">
                {t("marketplace.trust.transactions")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">
                {t("marketplace.trust.assets_sold")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">98%</div>
              <div className="text-sm text-muted-foreground">
                {t("marketplace.trust.satisfaction")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">
                {t("marketplace.trust.support")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                {t("marketplace.featured.title")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t("marketplace.featured.description")}
              </p>
            </div>
          </div>

          {hasAdvancedSearch ? (
            (() => {
              const empty = (
                <div className="text-center py-16 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    {t("marketplace.empty.title")}
                  </p>
                  <p className="text-sm mt-1">
                    {t("marketplace.empty.description")}
                  </p>
                </div>
              );
              const skeleton = (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-6 bg-muted rounded w-2/3 mb-2" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="h-5 bg-muted rounded w-full" />
                        <div className="h-10 bg-muted rounded w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
              return (
                <div className="space-y-8">
                  {newestLoading ? (
                    skeleton
                  ) : newestListings.length === 0 ? (
                    empty
                  ) : (
                    <div className="grid grid-cols-1 gap-8">
                      {newestListings.map((listing: MarketplaceListing) => (
                        <MarketplaceListingCard
                          key={listing.id}
                          listing={listing}
                          detailUrl={ROUTES.APP.LISTING_DETAIL(listing.slug)}
                          onViewClick={incrementViews}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <Tabs
              value={listingsTab}
              onValueChange={(v) =>
                setListingsTab(v as "featured" | "newest" | "trending")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="featured" className="capitalize">
                  {t("marketplace.tabs.featured")}
                </TabsTrigger>
                <TabsTrigger value="newest" className="capitalize">
                  {t("marketplace.tabs.newest")}
                </TabsTrigger>
                <TabsTrigger value="trending" className="capitalize">
                  {t("marketplace.tabs.trending")}
                </TabsTrigger>
              </TabsList>

              {(() => {
                const loading = listingsLoading;
                const list = listingsByTab;
                const empty = (
                  <div className="text-center py-16 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                      {t("marketplace.empty.title")}
                    </p>
                    <p className="text-sm mt-1">
                      {t("marketplace.empty.description")}
                    </p>
                  </div>
                );
                const grid = (
                  <div className="grid grid-cols-1 gap-8">
                    {list.map((listing: MarketplaceListing) => (
                      <MarketplaceListingCard
                        key={listing.id}
                        listing={listing}
                        detailUrl={ROUTES.APP.LISTING_DETAIL(listing.slug)}
                        onViewClick={incrementViews}
                      />
                    ))}
                  </div>
                );
                const skeleton = (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-6 bg-muted rounded w-2/3 mb-2" />
                          <div className="h-4 bg-muted rounded w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="h-5 bg-muted rounded w-full" />
                          <div className="h-10 bg-muted rounded w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                );
                return (
                  <>
                    <TabsContent value="featured" className="space-y-8">
                      {listingsTab === "featured" && featuredLoading
                        ? skeleton
                        : listingsTab === "featured" &&
                            featuredListings.length === 0
                          ? empty
                          : grid}
                    </TabsContent>
                    <TabsContent value="newest" className="space-y-8">
                      {listingsTab === "newest" && newestLoading
                        ? skeleton
                        : listingsTab === "newest" &&
                            newestListings.length === 0
                          ? empty
                          : grid}
                    </TabsContent>
                    <TabsContent value="trending" className="space-y-8">
                      {listingsTab === "trending" && trendingLoading
                        ? skeleton
                        : listingsTab === "trending" &&
                            trendingListings.length === 0
                          ? empty
                          : grid}
                    </TabsContent>
                  </>
                );
              })()}
            </Tabs>
          )}
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t("marketplace.categories.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("marketplace.categories.description")}
            </p>
          </div>

          {typesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-16 w-16 rounded-2xl bg-muted mb-6" />
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link to={ROUTES.APP.CATEGORIES.BY_SLUG(category.slug)}>
                  <Card
                    key={category.id}
                    className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20 cursor-pointer"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <category.icon className="w-8 h-8 text-primary" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {t("marketplace.categories.view_category")}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {t("marketplace.categories.view_all")}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              {t("marketplace.how_it_works.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t("marketplace.how_it_works.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl px-8 py-4"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {t("marketplace.how_it_works.cta")}
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6">
            {t("marketplace.cta.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("marketplace.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl"
            >
              {t("marketplace.cta.explore_assets")}
            </Button>
            <Button size="lg" variant="outline">
              {t("marketplace.cta.sell_assets")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
