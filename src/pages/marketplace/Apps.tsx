import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Smartphone, Download, Star, DollarSign } from "lucide-react";

const Apps = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const featuredApps = [
    {
      id: 1,
      name: "FitTracker Pro",
      category: "Health & Fitness",
      platform: "iOS/Android",
      downloads: "150K+",
      rating: 4.8,
      price: "$25,000",
      revenue: "$5,000/mes",
      description: "Aplicación de seguimiento de fitness con 150K usuarios activos"
    },
    {
      id: 2,
      name: "TaskMaster",
      category: "Productivity",
      platform: "iOS/Android",
      downloads: "75K+",
      rating: 4.6,
      price: "$18,000",
      revenue: "$3,200/mes",
      description: "App de gestión de tareas con funciones avanzadas de colaboración"
    },
    {
      id: 3,
      name: "CryptoWallet Mini",
      category: "Finance",
      platform: "iOS",
      downloads: "200K+",
      rating: 4.9,
      price: "$45,000",
      revenue: "$8,500/mes",
      description: "Wallet segura para criptomonedas con interfaz intuitiva"
    },
    {
      id: 4,
      name: "Recipe Finder",
      category: "Food & Drink",
      platform: "Android",
      downloads: "90K+",
      rating: 4.5,
      price: "$15,000",
      revenue: "$2,800/mes",
      description: "Buscador de recetas con IA y lista de compras inteligente"
    }
  ];

  const filteredApps = featuredApps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t('nav.apps')}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Aplicaciones móviles con base de usuarios establecida y flujo de ingresos comprobado
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar apps por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">Apps Disponibles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Download className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">2.5M+</div>
            <div className="text-sm text-muted-foreground">Descargas Totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">4.7</div>
            <div className="text-sm text-muted-foreground">Rating Promedio</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">$25K</div>
            <div className="text-sm text-muted-foreground">Precio Promedio</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Apps */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Apps Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <Card key={app.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {app.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{app.price}</div>
                    <div className="text-sm text-muted-foreground">{app.revenue}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{app.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Smartphone className="h-4 w-4" />
                      {app.platform}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {app.downloads}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{app.rating}</span>
                  </div>
                  
                  <Button className="w-full mt-4">
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Apps;