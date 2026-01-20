import {
  Card,
  CardContent,
  CardDescription,
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
  useMarketplaceDomains,
  useMarketplaceStats,
  useIncrementViews,
} from "@/store/hooks/useMarketplace";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/lib/routes";
import { Link } from "react-router-dom";

const DomainsPage = () => {
  const { t } = useTranslation();
  const { data: domains, isLoading: domainsLoading } = useMarketplaceDomains();
  const { data: stats } = useMarketplaceStats();
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

        {domainsLoading ? (
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
            {domains && domains.length > 0 ? (
              domains.map((domain) => {
                const domainData = (domain.domain_data as Record<string, unknown>) || {};
                const displayDomain =
                  domain.title ||
                  (typeof domainData.domain === "string" ? domainData.domain : "") ||
                  "domain.com";
                const extension =
                  (typeof domainData.extension === "string"
                    ? domainData.extension
                    : "") ||
                  displayDomain.split(".").pop() ||
                  ".com";
                const registrar =
                  (typeof domainData.registrar === "string"
                    ? domainData.registrar
                    : "") || t("marketplace_domains.labels.unknown");
                const expires =
                  (typeof domainData.expires === "string" ? domainData.expires : "") ||
                  "2025-12-31";
                const length = displayDomain.length;

                return (
                  <Card
                    key={domain.id}
                    className="hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/20 cursor-pointer"
                    onClick={() => incrementViews(domain.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {displayDomain}
                            {domain.is_premium && (
                              <Award className="inline h-4 w-4 text-yellow-500 ml-2" />
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">
                              {domain.marketplace_categories?.name ||
                                t("marketplace_domains.labels.no_category")}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {extension}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">
                          ${domain.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="h-4 w-4" />
                          {domain.views_count}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            {t("marketplace_domains.labels.length")}:
                          </span>
                          <p className="font-medium">
                            {t("marketplace_domains.labels.length_value", {
                              count: length,
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("marketplace_domains.labels.registrar")}:
                          </span>
                          <p className="font-medium">{registrar}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {t("marketplace_domains.labels.expires")}: {expires}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link to={ROUTES.APP.CATEGORIES.DOMAINS.DETAILS(domain.id)}>
                          <Button className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground">
                            {t("marketplace_domains.actions.view_details")}
                          </Button>
                        </Link>
                        <Button variant="outline" className="flex-1">
                          {t("marketplace_domains.actions.make_offer")}
                        </Button>
                      </div>
                    </CardContent>
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

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-8 border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {stats?.domains.toLocaleString() || "0"}
            </div>
            <div className="text-muted-foreground">
              {t("marketplace_domains.stats.domains_available")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">$1.2M</div>
            <div className="text-muted-foreground">
              {t("marketplace_domains.stats.in_transactions")}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">15,432</div>
            <div className="text-muted-foreground">
              {t("marketplace_domains.stats.active_users")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainsPage;
