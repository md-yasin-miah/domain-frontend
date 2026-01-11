import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  Search,
  Settings,
  RefreshCw,
  ExternalLink,
  Monitor,
  BarChart3,
} from "lucide-react";
import { useGetMarketplaceListingsQuery } from "@/store/api/marketplaceApi";
import { useTranslation } from "react-i18next";
import { DomainsPageSkeleton } from "@/components/skeletons/DomainsPageSkeleton";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  formatNumber,
  getStatusColor,
  getMarketStatusLabel,
  timeFormat,
} from "@/lib/helperFun";
import { Link } from "react-router-dom";

const ClientWebsitesPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: websitesData, isLoading } = useGetMarketplaceListingsQuery({
    listing_type_id: 2,
  });

  // Filter websites based on search term
  const baseFilteredWebsites =
    websitesData?.items?.filter((website) =>
      website.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Filter by tab type
  const getFilteredWebsitesByTab = (tab: string) => {
    if (!baseFilteredWebsites.length) return [];

    switch (tab) {
      case "active":
        return baseFilteredWebsites.filter(
          (website) => website.status === "active"
        );
      case "all":
      default:
        return baseFilteredWebsites;
    }
  };

  // Get counts for each tab
  const allWebsites = websitesData?.items || [];
  const activeCount = allWebsites.filter((w) => w.status === "active").length;

  // Reusable Website Card Component
  const WebsiteCard = ({
    website,
  }: {
    website: NonNullable<typeof websitesData>["items"][number];
  }) => {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  getStatusColor(website.status)
                )}
              />
              <div>
                <CardTitle className="text-xl">{website.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span>
                    {t("websites.registered_by")} {website.seller.username}
                  </span>
                  <Badge
                    variant={
                      website.listing_type.name === "Premium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {website.listing_type.name}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                {t("websites.configure")}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Website Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">
                {t("websites.sections.website_info")}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t("websites.labels.status")}</span>
                  <span className="font-medium">
                    {getMarketStatusLabel(website.status, t, "websites")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("websites.labels.url")}</span>
                  <span
                    className="font-medium truncate max-w-[200px]"
                    title={website.website_url || "---"}
                  >
                    {website.website_url || "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("websites.labels.technology")}</span>
                  <span className="font-medium">
                    {website.website_technology || "---"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("websites.labels.last_update")}</span>
                  <span className="font-medium">
                    {timeFormat(website.updated_at, "lll")}
                  </span>
                </div>
              </div>
            </div>

            {/* Traffic & Stats */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">
                {t("websites.sections.traffic_stats")}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t("websites.labels.traffic_monthly")}</span>
                  <span className="font-medium">
                    {formatNumber(website.website_traffic_monthly)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("websites.labels.revenue_monthly")}</span>
                  <span className="font-medium">
                    {formatCurrency(website.website_revenue_monthly)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("websites.labels.profit_monthly")}</span>
                  <span className="font-medium">
                    {formatCurrency(website.website_profit_monthly)}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                {t("websites.actions.analytics")}
              </Button>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">
                {t("websites.sections.quick_actions")}
              </h4>
              <div className="space-y-2">
                <Link to={website.website_url} target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("websites.actions.view_website")}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {t("websites.actions.analytics")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t("websites.actions.configure")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Show skeleton while loading
  if (isLoading) {
    return <DomainsPageSkeleton />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Monitor className="w-8 h-8 text-primary" />
            {t("websites.title")}
          </h1>
          <p className="text-muted-foreground mt-2">{t("websites.subtitle")}</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Monitor className="w-4 h-4 mr-2" />
          {t("websites.register_website")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={t("websites.search_placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            {t("websites.tabs.all")} ({websitesData?.pagination.total || 0})
          </TabsTrigger>
          <TabsTrigger value="active">
            {t("websites.tabs.active")} ({activeCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {getFilteredWebsitesByTab("all").length > 0 ? (
            <div className="grid gap-6">
              {getFilteredWebsitesByTab("all").map((website) => (
                <WebsiteCard key={website.id} website={website} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("websites.empty_states.all.title")}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? t("common.no_results") || "No websites match your search"
                  : t("websites.empty_states.all.description")}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {getFilteredWebsitesByTab("active").length > 0 ? (
            <div className="grid gap-6">
              {getFilteredWebsitesByTab("active").map((website) => (
                <WebsiteCard key={website.id} website={website} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {t("websites.empty_states.active.title")}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? t("common.no_results") ||
                    "No active websites match your search"
                  : t("websites.empty_states.active.description")}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientWebsitesPage;
