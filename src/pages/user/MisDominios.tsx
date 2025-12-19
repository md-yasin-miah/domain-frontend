import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Search, Calendar, Settings, RefreshCw, ExternalLink, AlertTriangle } from "lucide-react";

const MisDominios = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample domains data
  const domains = [
    {
      id: 1,
      name: "mitiendaonline.com",
      status: "Activo",
      expirationDate: "2025-03-15",
      registrar: "GoDaddy",
      autoRenewal: true,
      dnsRecords: 12,
      lastUpdate: "2024-01-15",
      type: "Premium"
    },
    {
      id: 2,
      name: "blogpersonal.net",
      status: "Activo",
      expirationDate: "2024-12-20",
      registrar: "Namecheap",
      autoRenewal: false,
      dnsRecords: 8,
      lastUpdate: "2024-01-10",
      type: "Estándar"
    },
    {
      id: 3,
      name: "proyectoweb.org",
      status: "Expirado",
      expirationDate: "2024-01-05",
      registrar: "Domain.com",
      autoRenewal: false,
      dnsRecords: 5,
      lastUpdate: "2023-12-30",
      type: "Estándar"
    }
  ];

  const filteredDomains = domains.filter(domain =>
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-green-500';
      case 'Expirado': return 'bg-red-500';
      case 'Pendiente': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
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
            <Globe className="w-8 h-8 text-primary" />
            Mis Dominios
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestiona todos tus dominios desde un solo lugar
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Globe className="w-4 h-4 mr-2" />
          Registrar Dominio
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar dominios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({domains.length})</TabsTrigger>
          <TabsTrigger value="active">Activos ({domains.filter(d => d.status === 'Activo').length})</TabsTrigger>
          <TabsTrigger value="expiring">Próximos a Expirar</TabsTrigger>
          <TabsTrigger value="expired">Expirados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6">
            {filteredDomains.map((domain) => {
              const daysUntilExpiration = getDaysUntilExpiration(domain.expirationDate);
              
              return (
                <Card key={domain.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(domain.status)}`} />
                        <div>
                          <CardTitle className="text-xl">{domain.name}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-1">
                            <span>Registrado con {domain.registrar}</span>
                            <Badge variant={domain.type === 'Premium' ? 'default' : 'secondary'}>
                              {domain.type}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {daysUntilExpiration <= 30 && daysUntilExpiration > 0 && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Expira en {daysUntilExpiration} días
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Configurar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Domain Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground">INFORMACIÓN DEL DOMINIO</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Estado:</span>
                            <span className="font-medium">{domain.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expira:</span>
                            <span className="font-medium">{domain.expirationDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Auto-renovación:</span>
                            <Badge variant={domain.autoRenewal ? 'default' : 'secondary'} className="text-xs">
                              {domain.autoRenewal ? 'Activada' : 'Desactivada'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* DNS Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground">DNS Y CONFIGURACIÓN</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Registros DNS:</span>
                            <span className="font-medium">{domain.dnsRecords}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Última actualización:</span>
                            <span className="font-medium">{domain.lastUpdate}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Actualizar DNS
                        </Button>
                      </div>

                      {/* Actions */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground">ACCIONES RÁPIDAS</h4>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver en registrar
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Calendar className="w-4 h-4 mr-2" />
                            Renovar dominio
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Settings className="w-4 h-4 mr-2" />
                            Configurar
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
            <h3 className="text-xl font-semibold mb-2">Dominios Activos</h3>
            <p className="text-muted-foreground">
              Todos tus dominios activos aparecerán aquí
            </p>
          </div>
        </TabsContent>

        <TabsContent value="expiring">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Próximos a Expirar</h3>
            <p className="text-muted-foreground">
              Dominios que expiran en los próximos 30 días
            </p>
          </div>
        </TabsContent>

        <TabsContent value="expired">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Dominios Expirados</h3>
            <p className="text-muted-foreground">
              Dominios que han expirado y necesitan renovación
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MisDominios;