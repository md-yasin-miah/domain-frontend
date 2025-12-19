import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Save, Eye, AlertTriangle, Search, ExternalLink } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { mockData, mockAuth } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

interface SEORoute {
  id?: string;
  route: string;
  title: string;
  description: string;
  keywords: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  indexable: boolean;
  canonical_url?: string;
}

const DEFAULT_ROUTES = [
  { route: '/', name: 'Inicio', category: 'Principal' },
  { route: '/marketplace', name: 'Marketplace', category: 'Marketplace' },
  { route: '/marketplace/dominios', name: 'Dominios', category: 'Marketplace' },
  { route: '/marketplace/sitios', name: 'Sitios Web', category: 'Marketplace' },
  { route: '/marketplace/apps', name: 'Aplicaciones', category: 'Marketplace' },
  { route: '/marketplace/fba', name: 'Amazon FBA', category: 'Marketplace' },
  { route: '/services/valuations', name: 'Valuaciones', category: 'Servicios' },
  { route: '/services/trends', name: 'Market Trends', category: 'Servicios' },
  { route: '/services/brokers', name: 'Brokers', category: 'Servicios' },
  { route: '/resources/guides', name: 'Guías', category: 'Recursos' },
  { route: '/resources/blog', name: 'Blog', category: 'Recursos' }
];

export default function SEOSettings() {
  const [seoRoutes, setSeoRoutes] = useState<SEORoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>('/');
  const [currentRoute, setCurrentRoute] = useState<SEORoute | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSEORoutes = async () => {
    try {
      setLoading(true);
      // Mock SEO routes data for now
      const mockData: SEORoute[] = [
        {
          id: '1',
          route: '/',
          title: 'Adominioz - Marketplace de Activos Digitales',
          description: 'Compra y vende dominios, sitios web, aplicaciones y más en el marketplace líder de activos digitales.',
          keywords: 'dominios, sitios web, marketplace, activos digitales',
          indexable: true
        },
        {
          id: '2',
          route: '/marketplace',
          title: 'Marketplace - Adominioz',
          description: 'Explora miles de activos digitales en venta: dominios premium, sitios web establecidos, aplicaciones móviles y más.',
          keywords: 'marketplace, comprar dominios, vender sitios web',
          indexable: true
        }
      ];
      
      setSeoRoutes(mockData);
      
      // Set current route data
      const routeData = mockData.find(r => r.route === selectedRoute);
      if (!routeData) {
        const defaultRoute = DEFAULT_ROUTES.find(r => r.route === selectedRoute);
        setCurrentRoute({
          route: selectedRoute,
          title: `${defaultRoute?.name || 'Página'} | ADOMINIOZ`,
          description: '',
          keywords: '',
          indexable: true
        });
      } else {
        setCurrentRoute(routeData);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las configuraciones SEO",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentRoute) return;

    try {
      setLoading(true);
      
      // Mock save functionality for now
      const updatedRoutes = seoRoutes.some(r => r.route === currentRoute.route)
        ? seoRoutes.map(r => r.route === currentRoute.route ? currentRoute : r)
        : [...seoRoutes, currentRoute];
      
      setSeoRoutes(updatedRoutes);
      setHasChanges(false);
      
      toast({
        title: "Éxito",
        description: "Configuración SEO guardada correctamente"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración SEO",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRouteChange = (route: string) => {
    setSelectedRoute(route);
    const routeData = seoRoutes.find(r => r.route === route);
    
    if (!routeData) {
      const defaultRoute = DEFAULT_ROUTES.find(r => r.route === route);
      setCurrentRoute({
        route,
        title: `${defaultRoute?.name || 'Página'} | ADOMINIOZ`,
        description: '',
        keywords: '',
        indexable: true
      });
    } else {
      setCurrentRoute(routeData);
    }
    setHasChanges(false);
  };

  const handleFieldChange = (field: keyof SEORoute, value: any) => {
    if (!currentRoute) return;
    
    setCurrentRoute(prev => prev ? { ...prev, [field]: value } : null);
    setHasChanges(true);
  };

  const generatePreview = () => {
    if (!currentRoute) return null;

    return (
      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Vista Previa Google</h3>
          <div className="space-y-1">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">
              {currentRoute.title || 'Título de la página'}
            </div>
            <div className="text-green-700 text-sm">
              adominioz.com{currentRoute.route}
            </div>
            <div className="text-gray-600 text-sm leading-relaxed">
              {currentRoute.description || 'Descripción de la página...'}
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-slate-800 text-white">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Vista Previa Facebook/LinkedIn</h3>
          <div className="flex gap-3">
            <div className="w-20 h-20 bg-slate-600 rounded flex items-center justify-center">
              <Globe className="h-8 w-8 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">
                {currentRoute.og_title || currentRoute.title || 'Título de la página'}
              </div>
              <div className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentRoute.og_description || currentRoute.description || 'Descripción de la página...'}
              </div>
              <div className="text-xs text-slate-400 mt-2">
                adominioz.com
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchSEORoutes();
  }, [selectedRoute]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración SEO y Meta Tags</h1>
          <p className="text-muted-foreground">Optimiza el SEO para cada sección de la plataforma</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Cambios sin guardar
            </Badge>
          )}
          <Badge variant="secondary">SEO Manager</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              Seleccionar Página
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                DEFAULT_ROUTES.reduce((acc, route) => {
                  if (!acc[route.category]) acc[route.category] = [];
                  acc[route.category].push(route);
                  return acc;
                }, {} as Record<string, typeof DEFAULT_ROUTES>)
              ).map(([category, routes]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
                  <div className="space-y-1">
                    {routes.map(route => (
                      <button
                        key={route.route}
                        onClick={() => handleRouteChange(route.route)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedRoute === route.route
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{route.name}</span>
                          {seoRoutes.find(r => r.route === route.route) && (
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                        </div>
                        <div className="text-xs opacity-70">{route.route}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SEO Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              Configuración SEO
              <Badge variant="outline">{selectedRoute}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentRoute ? (
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="basic">Básico</TabsTrigger>
                  <TabsTrigger value="social">Redes Sociales</TabsTrigger>
                  <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                  <TabsTrigger value="preview">Vista Previa</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título SEO</Label>
                    <Input
                      id="title"
                      value={currentRoute.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      placeholder="Título optimizado para SEO (máx. 60 caracteres)"
                      maxLength={60}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {currentRoute.title.length}/60 caracteres
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Meta Descripción</Label>
                    <Textarea
                      id="description"
                      value={currentRoute.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      placeholder="Descripción que aparecerá en los resultados de búsqueda (máx. 160 caracteres)"
                      maxLength={160}
                      rows={3}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {currentRoute.description.length}/160 caracteres
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Palabras Clave</Label>
                    <Input
                      id="keywords"
                      value={currentRoute.keywords}
                      onChange={(e) => handleFieldChange('keywords', e.target.value)}
                      placeholder="palabra1, palabra2, palabra3"
                    />
                    <div className="text-xs text-muted-foreground">
                      Separa las palabras clave con comas
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="indexable">Indexable por buscadores</Label>
                    <Switch
                      id="indexable"
                      checked={currentRoute.indexable}
                      onCheckedChange={(checked) => handleFieldChange('indexable', checked)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <h3 className="font-medium">Open Graph (Facebook, LinkedIn)</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="og-title">Título OG</Label>
                    <Input
                      id="og-title"
                      value={currentRoute.og_title || ''}
                      onChange={(e) => handleFieldChange('og_title', e.target.value)}
                      placeholder="Título para redes sociales (si es diferente al SEO)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og-description">Descripción OG</Label>
                    <Textarea
                      id="og-description"
                      value={currentRoute.og_description || ''}
                      onChange={(e) => handleFieldChange('og_description', e.target.value)}
                      placeholder="Descripción para redes sociales"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og-image">Imagen OG (URL)</Label>
                    <Input
                      id="og-image"
                      value={currentRoute.og_image || ''}
                      onChange={(e) => handleFieldChange('og_image', e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg (1200x630px recomendado)"
                    />
                  </div>

                  <hr className="my-4" />

                  <h3 className="font-medium">Twitter Cards</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter-title">Título Twitter</Label>
                    <Input
                      id="twitter-title"
                      value={currentRoute.twitter_title || ''}
                      onChange={(e) => handleFieldChange('twitter_title', e.target.value)}
                      placeholder="Título para Twitter (si es diferente al OG)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter-description">Descripción Twitter</Label>
                    <Textarea
                      id="twitter-description"
                      value={currentRoute.twitter_description || ''}
                      onChange={(e) => handleFieldChange('twitter_description', e.target.value)}
                      placeholder="Descripción para Twitter"
                      rows={2}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="canonical">URL Canónica</Label>
                    <Input
                      id="canonical"
                      value={currentRoute.canonical_url || ''}
                      onChange={(e) => handleFieldChange('canonical_url', e.target.value)}
                      placeholder="https://adominioz.com/ruta-canonica (opcional)"
                    />
                    <div className="text-xs text-muted-foreground">
                      Usar solo si esta página tiene contenido duplicado en otra URL
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Robots Meta Tag</h4>
                    <div className="text-sm text-muted-foreground">
                      {currentRoute.indexable ? (
                        <span className="text-green-600">index, follow</span>
                      ) : (
                        <span className="text-red-600">noindex, nofollow</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Controlado por el switch "Indexable por buscadores"
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h4 className="font-medium mb-2 text-blue-800">Herramientas de Validación</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={`https://developers.facebook.com/tools/debug/?q=https://adominioz.com${currentRoute.route}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Validar Facebook OG
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={`https://cards-dev.twitter.com/validator`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Validar Twitter Cards
                        </a>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">Vista Previa</h3>
                    </div>
                    {generatePreview()}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Selecciona una ruta para configurar su SEO
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Actions */}
      {currentRoute && (
        <div className="flex gap-4">
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setCurrentRoute(seoRoutes.find(r => r.route === selectedRoute) || null);
              setHasChanges(false);
            }}
            disabled={!hasChanges}
          >
            Descartar Cambios
          </Button>
        </div>
      )}
    </div>
  );
}