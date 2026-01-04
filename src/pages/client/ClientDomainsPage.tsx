import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Search, Calendar, Settings, RefreshCw, ExternalLink, AlertTriangle, Server } from "lucide-react";
import { useGetMarketplaceListingsQuery } from '@/store/api/marketplaceApi';
import { useTranslation } from 'react-i18next';
import { DomainsPageSkeleton } from "@/components/skeletons/DomainsPageSkeleton";
import { cn } from '@/lib/utils';
import { getStatusColor, getStatusLabel, timeFormat } from '@/lib/helperfun';

const ClientDomainsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: domainsData, isLoading } = useGetMarketplaceListingsQuery({ listing_type_id: 1 });

  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter domains based on search term
  const baseFilteredDomains = domainsData?.items?.filter(domain =>
    domain.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Filter by tab type
  const getFilteredDomainsByTab = (tab: string) => {
    if (!baseFilteredDomains.length) return [];

    switch (tab) {
      case 'active':
        return baseFilteredDomains.filter(domain => domain.status === 'active');
      case 'expiring':
        return baseFilteredDomains.filter(domain => {
          if (!domain.expires_at) return false;
          const days = getDaysUntilExpiration(domain.expires_at);
          return days <= 30 && days > 0;
        });
      case 'expired':
        return baseFilteredDomains.filter(domain => {
          if (!domain.expires_at) return false;
          const days = getDaysUntilExpiration(domain.expires_at);
          return domain.status === 'expired' || days <= 0;
        });
      case 'all':
      default:
        return baseFilteredDomains;
    }
  };

  // Get counts for each tab
  const allDomains = domainsData?.items || [];
  const activeCount = allDomains.filter(d => d.status === 'active').length;
  const expiringCount = allDomains.filter(d => {
    if (!d.expires_at) return false;
    const days = getDaysUntilExpiration(d.expires_at);
    return days <= 30 && days > 0;
  }).length;
  const expiredCount = allDomains.filter(d => {
    if (!d.expires_at) return false;
    const days = getDaysUntilExpiration(d.expires_at);
    return d.status === 'expired' || days <= 0;
  }).length;

  // Reusable Domain Card Component
  const DomainCard = ({ domain }: { domain: NonNullable<typeof domainsData>['items'][number] }) => {
    const daysUntilExpiration = getDaysUntilExpiration(domain.expires_at);

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('w-3 h-3 rounded-full', getStatusColor(domain.status))} />
              <div>
                <CardTitle className="text-xl">{domain.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span>{t('domains.registered_by')} {domain.seller.username}</span>
                  <Badge variant={domain.listing_type.name === 'Premium' ? 'default' : 'secondary'}>
                    {domain.listing_type.name}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {daysUntilExpiration <= 30 && daysUntilExpiration > 0 && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {t('domains.expires_in')} {daysUntilExpiration} {t('domains.days')}
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                {t('domains.configure')}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Domain Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">{t('domains.sections.domain_info')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('domains.labels.status')}</span>
                  <span className="font-medium">{getStatusLabel(domain.status, t, 'domains')}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('domains.labels.expires')}</span>
                  <span className="font-medium">{domain.expires_at || '---'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('domains.labels.auto_renewal')}</span>
                  <Badge variant={domain?.is_auto_renew ? 'default' : 'secondary'} className="text-xs">
                    {domain?.is_auto_renew ? t('domains.auto_renewal.enabled') : t('domains.auto_renewal.disabled')}
                  </Badge>
                </div>
              </div>
            </div>

            {/* DNS Info */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">{t('domains.sections.dns_config')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('domains.labels.dns_records')}</span>
                  <span className="font-medium">{domain?.dns_records}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('domains.labels.last_update')}</span>
                  <span className="font-medium">{timeFormat(domain.updated_at, 'lll')}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('domains.actions.update_dns')}
              </Button>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground">{t('domains.sections.quick_actions')}</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('domains.actions.view_at_registrar')}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('domains.actions.renew_domain')}
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  {t('domains.actions.configure')}
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
            <Server className="w-8 h-8 text-primary" />
            {t('domains.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('domains.subtitle')}
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Server className="w-4 h-4 mr-2" />
          {t('domains.register_domain')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder={t('domains.search_placeholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{t('domains.tabs.all')} ({domainsData?.pagination.total || 0})</TabsTrigger>
          <TabsTrigger value="active">{t('domains.tabs.active')} ({activeCount})</TabsTrigger>
          <TabsTrigger value="expiring">{t('domains.tabs.expiring')} ({expiringCount})</TabsTrigger>
          <TabsTrigger value="expired">{t('domains.tabs.expired')} ({expiredCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {getFilteredDomainsByTab('all').length > 0 ? (
            <div className="grid gap-6">
              {getFilteredDomainsByTab('all').map((domain) => (
                <DomainCard key={domain.id} domain={domain} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('domains.empty_states.active.title')}</h3>
              <p className="text-muted-foreground">
                {searchTerm ? t('common.no_results') || 'No domains match your search' : t('domains.empty_states.active.description')}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {getFilteredDomainsByTab('active').length > 0 ? (
            <div className="grid gap-6">
              {getFilteredDomainsByTab('active').map((domain) => (
                <DomainCard key={domain.id} domain={domain} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('domains.empty_states.active.title')}</h3>
              <p className="text-muted-foreground">
                {searchTerm ? t('common.no_results') || 'No active domains match your search' : t('domains.empty_states.active.description')}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="expiring" className="mt-6">
          {getFilteredDomainsByTab('expiring').length > 0 ? (
            <div className="grid gap-6">
              {getFilteredDomainsByTab('expiring').map((domain) => (
                <DomainCard key={domain.id} domain={domain} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('domains.empty_states.expiring.title')}</h3>
              <p className="text-muted-foreground">
                {searchTerm ? t('common.no_results') || 'No expiring domains match your search' : t('domains.empty_states.expiring.description')}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired" className="mt-6">
          {getFilteredDomainsByTab('expired').length > 0 ? (
            <div className="grid gap-6">
              {getFilteredDomainsByTab('expired').map((domain) => (
                <DomainCard key={domain.id} domain={domain} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('domains.empty_states.expired.title')}</h3>
              <p className="text-muted-foreground">
                {searchTerm ? t('common.no_results') || 'No expired domains match your search' : t('domains.empty_states.expired.description')}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDomainsPage;