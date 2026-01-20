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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

const Marketplace = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // Categories with comprehensive data
  const categories = [
    {
      id: "dominios",
      name: t("categories.domains"),
      icon: Globe,
      count: 247,
      path: ROUTES.APP.CATEGORIES.DOMAINS.ROOT,
    },
    {
      id: "sitios",
      name: t("categories.websites"),
      icon: Globe,
      count: 89,
      path: ROUTES.APP.CATEGORIES.WEBSITES,
    },
    {
      id: "apps",
      name: t("categories.mobile_apps"),
      icon: Smartphone,
      count: 34,
      path: ROUTES.APP.CATEGORIES.APPS,
    },
    {
      id: "fba",
      name: t("categories.fba_stores"),
      icon: Package,
      count: 12,
      path: ROUTES.APP.CATEGORIES.FBA_STORES,
    },
    {
      id: "ecommerce",
      name: t("categories.ecommerce"),
      icon: ShoppingCart,
      count: 56,
      path: ROUTES.APP.CATEGORIES.E_COMMERCE,
    },
    {
      id: "saas",
      name: t("categories.software_saas"),
      icon: Code,
      count: 23,
      path: ROUTES.APP.CATEGORIES.SOFTWARE_SAAS,
    },
    {
      id: "databases",
      name: "Bases de Datos",
      icon: Database,
      count: 18,
      path: ROUTES.APP.CATEGORIES.DATABASES,
    },
    {
      id: "channels",
      name: "Canales Digitales",
      icon: Play,
      count: 31,
      path: ROUTES.APP.CATEGORIES.DIGITAL_CHANNELS,
    },
    {
      id: "nfts",
      name: "NFTs",
      icon: Gem,
      count: 42,
      path: ROUTES.APP.CATEGORIES.NFTs,
    },
  ];

  const featuredListings = [
    {
      id: 1,
      title: "tecnologia.com",
      type: "Dominio",
      price: "$2,500",
      traffic: "15K/mes",
      category: "Tecnología",
      verified: true,
      featured: true,
    },
    {
      id: 2,
      title: "E-commerce Dropshipping",
      type: "Sitio Web",
      price: "$8,900",
      traffic: "45K/mes",
      category: "Comercio",
      verified: true,
      featured: true,
    },
    {
      id: 3,
      title: "App de Fitness iOS",
      type: "App",
      price: "$12,000",
      traffic: "2K descargas/mes",
      category: "Salud",
      verified: true,
      featured: false,
    },
    {
      id: 4,
      title: "Tienda Amazon FBA",
      type: "FBA",
      price: "$25,000",
      traffic: "$8K/month revenue",
      category: "Hogar",
      verified: true,
      featured: true,
    },
    {
      id: 5,
      title: "SaaS de Contabilidad",
      type: "Software",
      price: "$45,000",
      traffic: "500 usuarios activos",
      category: "Finanzas",
      verified: true,
      featured: false,
    },
    {
      id: 6,
      title: "Canal YouTube Gaming",
      type: "Canal Digital",
      price: "$15,000",
      traffic: "100K suscriptores",
      category: "Gaming",
      verified: true,
      featured: true,
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Registro y Verificación",
      description:
        "Crea tu cuenta gratuita y completa la verificación de identidad",
      icon: CheckCircle,
    },
    {
      step: 2,
      title: "Explora y Analiza",
      description: "Navega por activos verificados con métricas transparentes",
      icon: TrendingUp,
    },
    {
      step: 3,
      title: "Compra Segura",
      description: "Escrow protegido durante toda la transacción",
      icon: Shield,
    },
    {
      step: 4,
      title: "Transferencia Completa",
      description: "Recibe todos los activos y documentación legal",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            Marketplace de Activos Digitales
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Descubre, evalúa y adquiere activos digitales verificados con
            transparencia total.
            {t("marketplace.from_premium")}
          </p>

          {/* Advanced Search */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, tipo, categoría..."
                  className="pl-12 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-12 min-w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="h-12 min-w-[160px]">
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los precios</SelectItem>
                  <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                  <SelectItem value="1000-10000">$1,000 - $10,000</SelectItem>
                  <SelectItem value="10000-50000">$10,000 - $50,000</SelectItem>
                  <SelectItem value="50000+">$50,000+</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:shadow-lg">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">$2.4M+</div>
              <div className="text-sm text-muted-foreground">Transacciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">500+</div>
              <div className="text-sm text-muted-foreground">
                Activos Vendidos
              </div>
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

      {/* Categories Overview */}
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
              <Link to={category.path}>
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
                      {category.count} activos
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Ver todos
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
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
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2"
            >
              Ver todos los activos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="featured">Destacados</TabsTrigger>
              <TabsTrigger value="newest">Más Recientes</TabsTrigger>
              <TabsTrigger value="trending">Tendencias</TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredListings
                  .filter((listing) => listing.featured)
                  .map((listing) => (
                    <Card
                      key={listing.id}
                      className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {listing.title}
                          </CardTitle>
                          <div className="flex gap-2">
                            {listing.verified && (
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                              >
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
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{listing.type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            •
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {listing.category}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Precio:
                            </span>
                            <span className="text-xl font-bold text-primary">
                              {listing.price}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Tráfico/Métricas:
                            </span>
                            <span className="text-sm font-medium">
                              {listing.traffic}
                            </span>
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
                            <Button variant="outline" size="icon">
                              <Users className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="newest">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredListings
                  .slice()
                  .reverse()
                  .map((listing) => (
                    <Card
                      key={listing.id}
                      className="group hover:shadow-xl transition-all duration-300"
                    >
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {listing.title}
                        </CardTitle>
                        <CardDescription>{listing.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Precio:
                            </span>
                            <span className="font-semibold text-primary">
                              {listing.price}
                            </span>
                          </div>
                          <Button asChild className="w-full">
                            <Link to={`/marketplace/listing/${listing.id}`}>
                              Ver Detalles
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="trending">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredListings
                  .filter(
                    (listing) =>
                      listing.type === "Software" || listing.type === "App"
                  )
                  .map((listing) => (
                    <Card
                      key={listing.id}
                      className="group hover:shadow-xl transition-all duration-300"
                    >
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {listing.title}
                        </CardTitle>
                        <CardDescription>{listing.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Precio:
                            </span>
                            <span className="font-semibold text-primary">
                              {listing.price}
                            </span>
                          </div>
                          <Button asChild className="w-full">
                            <Link to={`/marketplace/listing/${listing.id}`}>
                              Ver Detalles
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
              Cómo Funciona Nuestro Marketplace
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Proceso simple, seguro y transparente para comprar y vender
              activos digitales con total confianza
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
              Comenzar Ahora
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-6">
            ¿Listo para Encontrar tu Próximo Activo Digital?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a miles de inversores que ya están construyendo su portafolio
            de activos digitales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl"
            >
              Explorar Activos
            </Button>
            <Button size="lg" variant="outline">
              Vender mis Activos
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
