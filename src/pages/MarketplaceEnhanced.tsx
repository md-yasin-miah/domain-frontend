import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  Filter, 
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
  Users, 
  Award,
  Heart,
  Share2,
  SlidersHorizontal,
  X,
  Star
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Marketplace = () => {
  const { t } = useTranslation();
  
  // Estado de búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [activeTab, setActiveTab] = useState("featured");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Datos expandidos de listings
  const allListings = [
    {
      id: 1,
      title: "tecnologia.com",
      type: "Dominio",
      price: 2500,
      traffic: "15K/mes",
      category: "Tecnología",
      verified: true,
      featured: true,
      rating: 4.8,
      reviews: 23,
      seller: "TechDomains Pro",
      tags: ["premium", "tech", "authority"],
      createdAt: "2024-01-15",
      metrics: {
        monthlyVisits: 15000,
        domainAge: 8,
        backlinks: 2340
      }
    },
    {
      id: 2,
      title: "E-commerce Store Complete",
      type: "Sitio Web",
      price: 8900,
      traffic: "45K/mes",
      category: "Comercio",
      verified: true,
      featured: true,
      rating: 4.9,
      reviews: 42,
      seller: "EcomPro Solutions",
      tags: ["dropshipping", "profitable", "automated"],
      createdAt: "2024-01-10",
      metrics: {
        monthlyVisits: 45000,
        monthlyRevenue: 3200,
        conversionRate: 2.8
      }
    },
    {
      id: 3,
      title: "Fitness Tracker iOS App",
      type: "App",
      price: 12000,
      traffic: "2K downloads/mes",
      category: "Salud",
      verified: true,
      featured: false,
      rating: 4.6,
      reviews: 18,
      seller: "MobileApps LLC",
      tags: ["ios", "health", "fitness"],
      createdAt: "2024-01-08",
      metrics: {
        activeUsers: 8500,
        monthlyDownloads: 2000,
        rating: 4.5
      }
    },
    {
      id: 4,
      title: "Amazon FBA Supplement Store",
      type: "FBA",
      price: 25000,
      traffic: "$8K revenue/mes",
      category: "Hogar",
      verified: true,
      featured: true,
      rating: 4.7,
      reviews: 31,
      seller: "FBA Masters",
      tags: ["amazon", "supplements", "profitable"],
      createdAt: "2024-01-05",
      metrics: {
        monthlyRevenue: 8000,
        profitMargin: 35,
        inventory: 12000
      }
    },
    {
      id: 5,
      title: "SaaS Accounting Platform",
      type: "Software",
      price: 45000,
      traffic: "500 usuarios activos",
      category: "Finanzas",
      verified: true,
      featured: false,
      rating: 4.9,
      reviews: 67,
      seller: "SaaS Innovations",
      tags: ["saas", "accounting", "b2b"],
      createdAt: "2024-01-01",
      metrics: {
        mrr: 4200,
        churnRate: 2.1,
        ltv: 15000
      }
    },
    {
      id: 6,
      title: "YouTube Gaming Channel",
      type: "Canal Digital",
      price: 15000,
      traffic: "100K subscribers",
      category: "Gaming",
      verified: true,
      featured: true,
      rating: 4.4,
      reviews: 29,
      seller: "Content Creator Pro",
      tags: ["youtube", "gaming", "monetized"],
      createdAt: "2023-12-28",
      metrics: {
        subscribers: 100000,
        avgViews: 25000,
        monthlyEarnings: 2800
      }
    }
  ];

  // Categorías con datos actualizados
  const categories = [
    { id: "dominios", name: "Dominios", icon: Globe, count: 247, path: "/marketplace/dominios" },
    { id: "sitios", name: "Sitios Web", icon: Globe, count: 89, path: "/marketplace/sitios" },
    { id: "apps", name: "Apps Móviles", icon: Smartphone, count: 34, path: "/marketplace/apps" },
    { id: "fba", name: "Tiendas FBA", icon: Package, count: 12, path: "/marketplace/fba" },
    { id: "ecommerce", name: "Ecommerce", icon: ShoppingCart, count: 56, path: "/categories/ecommerce" },
    { id: "saas", name: "Software/SaaS", icon: Code, count: 23, path: "/categories/software-saas" },
    { id: "databases", name: "Bases de Datos", icon: Database, count: 18, path: "/categories/databases" },
    { id: "channels", name: "Canales Digitales", icon: Play, count: 31, path: "/categories/digital-channels" },
    { id: "nfts", name: "NFTs", icon: Gem, count: 42, path: "/categories/nfts" },
  ];

  // Función de filtrado avanzado
  const filteredListings = useMemo(() => {
    let filtered = allListings;

    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filtro por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(listing => 
        listing.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filtro por tipo
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(listing => 
        selectedTypes.includes(listing.type)
      );
    }

    // Filtro por precio
    filtered = filtered.filter(listing => 
      listing.price >= priceRange[0] && listing.price <= priceRange[1]
    );

    // Ordenamiento
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedTypes, priceRange, sortBy]);

  // Función para toggle favoritos
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTypes([]);
    setPriceRange([0, 100000]);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section Mejorado */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            Marketplace de Activos Digitales
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Descubre, evalúa y adquiere activos digitales verificados con transparencia total. 
            Desde dominios premium hasta negocios completos en línea.
          </p>
          
          {/* Búsqueda Avanzada */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nombre, categoría, tags..." 
                  className="pl-12 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 min-w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent className="bg-background/98 backdrop-blur-xl border shadow-xl rounded-xl z-50">
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtros Avanzados - Mobile */}
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-12 md:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Filtros Avanzados</SheetTitle>
                    <SheetDescription>
                      Refina tu búsqueda con filtros específicos
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Contenido de filtros móvil aquí */}
                    <AdvancedFiltersContent 
                      selectedTypes={selectedTypes}
                      setSelectedTypes={setSelectedTypes}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                    />
                    <Button onClick={() => setShowFilters(false)} className="w-full">
                      Aplicar Filtros
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button 
                variant="outline" 
                className="h-12 hidden md:flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros Avanzados
              </Button>
              
              <Button className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:shadow-lg">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>

          {/* Indicadores de Confianza */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">$2.4M+</div>
              <div className="text-sm text-muted-foreground">Transacciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Activos Vendidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Soporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros Avanzados Desktop */}
      {showFilters && (
        <section className="hidden md:block py-6 px-6 bg-muted/30 border-y">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filtros Avanzados</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpiar Filtros
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <AdvancedFiltersContent 
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </section>
      )}

      {/* Explorar por Categorías */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Explora por Categorías
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encuentra el activo digital perfecto para tu portafolio o negocio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20 cursor-pointer"
                onClick={() => window.location.href = category.path}
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <category.icon className="w-8 h-8 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.count} activos
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ver todos</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Principales */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                Activos Destacados
              </h2>
              <p className="text-lg text-muted-foreground">
                Selección curada de activos premium con métricas verificadas
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-background/98 backdrop-blur-xl border shadow-xl rounded-xl z-50">
                  <SelectItem value="featured">Destacados</SelectItem>
                  <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="newest">Más Recientes</SelectItem>
                  <SelectItem value="rating">Mejor Calificados</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-sm">
                {filteredListings.length} resultados
              </Badge>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="featured">Destacados</TabsTrigger>
              <TabsTrigger value="newest">Más Recientes</TabsTrigger>
              <TabsTrigger value="trending">Tendencias</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredListings.map((listing) => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    isFavorite={favorites.includes(listing.id)}
                    onToggleFavorite={() => toggleFavorite(listing.id)}
                  />
                ))}
              </div>
              
              {filteredListings.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
                  <p className="text-muted-foreground mb-4">
                    Intenta ajustar tus filtros o términos de búsqueda
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar Filtros
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Cómo Funciona */}
      <HowItWorksSection />

      {/* CTA Final */}
      <CTASection />
    </div>
  );
};

// Componente de Filtros Avanzados
const AdvancedFiltersContent = ({ selectedTypes, setSelectedTypes, priceRange, setPriceRange, sortBy, setSortBy }: any) => {
  const types = ["Dominio", "Sitio Web", "App", "FBA", "Software", "Canal Digital"];
  
  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev: string[]) => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Tipo de Activo */}
      <div className="space-y-3">
        <h4 className="font-medium">Tipo de Activo</h4>
        <div className="space-y-2">
          {types.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => handleTypeToggle(type)}
              />
              <label htmlFor={type} className="text-sm cursor-pointer">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rango de Precio */}
      <div className="space-y-3">
        <h4 className="font-medium">Rango de Precio</h4>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100000}
            min={0}
            step={500}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Ordenar Por */}
      <div className="space-y-3">
        <h4 className="font-medium">Ordenar Por</h4>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background/98 backdrop-blur-xl border shadow-xl rounded-xl z-50">
            <SelectItem value="featured">Destacados</SelectItem>
            <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="newest">Más Recientes</SelectItem>
            <SelectItem value="rating">Mejor Calificados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtros Adicionales */}
      <div className="space-y-3">
        <h4 className="font-medium">Características</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="verified" />
            <label htmlFor="verified" className="text-sm cursor-pointer">Verificado</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="featured" />
            <label htmlFor="featured" className="text-sm cursor-pointer">Destacado</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="premium" />
            <label htmlFor="premium" className="text-sm cursor-pointer">Premium</label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de Tarjeta de Listing Mejorado
const ListingCard = ({ listing, isFavorite, onToggleFavorite }: any) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {listing.title}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="h-8 w-8"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{listing.type}</Badge>
          {listing.verified && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verificado
            </Badge>
          )}
          {listing.featured && (
            <Badge className="bg-gradient-to-r from-primary to-secondary">
              Destacado
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{listing.category}</Badge>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{listing.rating}</span>
            <span className="text-xs text-muted-foreground">({listing.reviews})</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-primary">
              ${listing.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">{listing.traffic}</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Por: <span className="font-medium text-foreground">{listing.seller}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {listing.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              asChild 
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
            >
              <Link to={`/marketplace/listing/${listing.id}`}>
                Ver Detalles
              </Link>
            </Button>
            <Button variant="outline" className="flex-1">
              Hacer Oferta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sección Cómo Funciona
const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      title: "Registro y Verificación",
      description: "Crea tu cuenta gratuita y completa la verificación de identidad",
      icon: CheckCircle
    },
    {
      step: 2,
      title: "Explora y Analiza",
      description: "Navega por activos verificados con métricas transparentes",
      icon: TrendingUp
    },
    {
      step: 3,
      title: "Compra Segura",
      description: "Escrow protegido durante toda la transacción",
      icon: Shield
    },
    {
      step: 4,
      title: "Transferencia Completa",
      description: "Recibe todos los activos y documentación legal",
      icon: Award
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Cómo Funciona Nuestro Marketplace
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Proceso simple, seguro y transparente para comprar y vender activos digitales
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item) => (
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
      </div>
    </section>
  );
};

// Sección CTA
const CTASection = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
          ¿Listo para Empezar?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          Únete a miles de emprendedores que ya están invirtiendo en activos digitales
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            size="lg" 
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl px-8 py-4 text-lg"
          >
            <Link to="/auth">
              Explorar Activos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="border-2 px-8 py-4 text-lg"
          >
            <Link to="/auth">
              Vender Mis Activos
              <Users className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;