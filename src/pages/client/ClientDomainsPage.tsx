import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Search, Calendar, Settings, RefreshCw, ExternalLink, AlertTriangle, Server } from "lucide-react";
import { useGetMarketplaceListingsQuery } from '@/store/api/marketplaceApi';
import { useTranslation } from 'react-i18next';

const ClientDomainsPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: domainsData } = useGetMarketplaceListingsQuery({ status: 'active', listing_type_id: 1 });

  const filteredDomains = domainsData?.items?.filter(domain =>
    domain.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'Activo': return 'bg-green-500';
      case 'expired':
      case 'Expirado': return 'bg-red-500';
      case 'pending':
      case 'Pendiente': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'active': t('domains.status.active'),
      'expired': t('domains.status.expired'),
      'pending': t('domains.status.pending'),
    };
    return statusMap[status] || status;
  };

  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
          <TabsTrigger value="all">{t('domains.tabs.all')} ({domainsData?.pagination.total})</TabsTrigger>
          <TabsTrigger value="active">{t('domains.tabs.active')} ({domainsData?.items.filter(d => d.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="expiring">{t('domains.tabs.expiring')}</TabsTrigger>
          <TabsTrigger value="expired">{t('domains.tabs.expired')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6">
            {filteredDomains?.map((domain) => {
              const daysUntilExpiration = getDaysUntilExpiration(domain.expires_at);

              return (
                <Card key={domain.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(domain.status)}`} />
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
                            <span className="font-medium">{getStatusLabel(domain.status)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('domains.labels.expires')}</span>
                            <span className="font-medium">{domain.expires_at}</span>
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
                            <span className="font-medium">{domain.updated_at}</span>
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
            })}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('domains.empty_states.active.title')}</h3>
            <p className="text-muted-foreground">
              {t('domains.empty_states.active.description')}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="expiring">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('domains.empty_states.expiring.title')}</h3>
            <p className="text-muted-foreground">
              {t('domains.empty_states.expiring.description')}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="expired">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('domains.empty_states.expired.title')}</h3>
            <p className="text-muted-foreground">
              {t('domains.empty_states.expired.description')}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDomainsPage;