import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Search, Settings, ExternalLink, Smartphone, BarChart3, Users, Download } from "lucide-react";
import { useGetMarketplaceListingsQuery } from '@/store/api/marketplaceApi';
import { useTranslation } from 'react-i18next';
import { DomainsPageSkeleton } from "@/components/skeletons/DomainsPageSkeleton";
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber, getStatusColor, getMarketStatusLabel, timeFormat } from '@/lib/helperFun';

const ClientAppsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: appsData, isLoading } = useGetMarketplaceListingsQuery({ listing_type_id: 3 });

  // Filter apps based on search term
  const baseFilteredApps = appsData?.items?.filter(app =>
    app.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Filter by tab type
  const getFilteredAppsByTab = (tab: string) => {
    if (!baseFilteredApps.length) return [];

    switch (tab) {
      case 'active':
        return baseFilteredApps.filter(app => app.status === 'active');
      case 'all':
      default:
        return baseFilteredApps;
    }
  };

  // Get counts for each tab
  const allApps = appsData?.items || [];
  const activeCount = allApps.filter(a => a.status === 'active').length;

  // Reusable App Card Component
  const AppCard = ({ app }: { app: NonNullable<typeof appsData>['items'][number] }) => {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('w-3 h-3 rounded-full', getStatusColor(app.status))} />
              <div>
                <CardTitle className="text-xl">{app.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span>{t('apps.registered_by')} {app.seller.username}</span>
                  <Badge variant={app.listing_type.name === 'Premium' ? 'default' : 'secondary'}>
                    {app.listing_type.name}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                {t('apps.configure')}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* App Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">{t('apps.sections.app_info')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('apps.labels.status')}</span>
                  <span className="font-medium">{getMarketStatusLabel(app.status, t, 'apps')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('apps.labels.url')}</span>
                  <span className="font-medium truncate max-w-[200px]" title={app.website_url || '---'}>
                    {app.website_url || '---'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('apps.labels.platform')}</span>
                  <span className="font-medium">{app.website_technology || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('apps.labels.last_update')}</span>
                  <span className="font-medium">{timeFormat(app.updated_at, 'lll')}</span>
                </div>
              </div>
            </div>

            {/* Stats & Metrics */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">{t('apps.sections.stats')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('apps.labels.downloads')}</span>
                  <span className="font-medium">{formatNumber(app.website_traffic_monthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('apps.labels.active_users')}</span>
                  <span className="font-medium">{formatNumber(app.view_count)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('apps.labels.revenue_monthly')}</span>
                  <span className="font-medium">{formatCurrency(app.website_revenue_monthly)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('apps.labels.profit_monthly')}</span>
                  <span className="font-medium">{formatCurrency(app.website_profit_monthly)}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                {t('apps.actions.analytics')}
              </Button>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">{t('apps.sections.quick_actions')}</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('apps.actions.view_app')}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {t('apps.actions.analytics')}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  {t('apps.actions.configure')}
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-primary" />
            {t('apps.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('apps.subtitle')}
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Smartphone className="w-4 h-4 mr-2" />
          {t('apps.register_app')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={t('apps.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">{t('apps.tabs.all')} ({appsData?.pagination.total || 0})</TabsTrigger>
          <TabsTrigger value="active">{t('apps.tabs.active')} ({activeCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {getFilteredAppsByTab('all').length > 0 ? (
            <div className="grid gap-6">
              {getFilteredAppsByTab('all').map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('apps.empty_states.all.title')}</h3>
              <p className="text-muted-foreground">
                {searchTerm ? t('common.no_results') || 'No apps match your search' : t('apps.empty_states.all.description')}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {getFilteredAppsByTab('active').length > 0 ? (
            <div className="grid gap-6">
              {getFilteredAppsByTab('active').map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('apps.empty_states.active.title')}</h3>
              <p className="text-muted-foreground">
                {searchTerm ? t('common.no_results') || 'No active apps match your search' : t('apps.empty_states.active.description')}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientAppsPage;
