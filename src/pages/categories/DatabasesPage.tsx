import { Database, TrendingUp, Shield, Award, Star, ArrowRight, CheckCircle, DollarSign, BarChart3, Search, ShoppingCart, Home, Building, Smartphone, TrendingUp as TrendingUpIcon, Stethoscope, GraduationCap, Truck, FileText, Clipboard, Settings, FileX, BarChart, Link } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DatabasesPage = () => {
  const benefits = [
    "Datos estructurados y limpios",
    "Documentación completa incluida",
    "Formatos múltiples (CSV, JSON, SQL)",
    "Licencias comerciales claras",
    "Actualizaciones periódicas",
    "Soporte técnico especializado"
  ];

  const successCases = [
    {
      title: "E-commerce Products DB",
      records: "2.5M+",
      categories: "850+",
      value: "$4,500",
      description: "Base de datos completa de productos de e-commerce con precios y especificaciones"
    },
    {
      title: "Real Estate Listings",
      records: "1.8M+",
      categories: "120+",
      value: "$6,200",
      description: "Dataset inmobiliario con ubicaciones, precios históricos y características"
    },
    {
      title: "Financial Markets Data",
      records: "5.2M+",
      categories: "50+",
      value: "$8,900",
      description: "Datos históricos de mercados financieros y criptomonedas"
    }
  ];

  const metrics = [
    { label: "Datasets Vendidos", value: "156+", icon: Database },
    { label: "Valor Promedio", value: "$3,800", icon: DollarSign },
    { label: "Registros Totales", value: "50M+", icon: BarChart3 },
    { label: "Calidad Verificada", value: "100%", icon: Award }
  ];

  const dataCategories = [
    {
      name: "E-commerce",
      description: "Productos, precios, reviews",
      count: "45+ datasets",
      icon: ShoppingCart,
      popular: true
    },
    {
      name: "Inmobiliario",
      description: "Propiedades, precios, ubicaciones",
      count: "28+ datasets",
      icon: Home,
      popular: true
    },
    {
      name: "Financiero",
      description: "Acciones, forex, crypto",
      count: "22+ datasets",
      icon: DollarSign,
      popular: true
    },
    {
      name: "Social Media",
      description: "Posts, engagement, trends",
      count: "18+ datasets",
      icon: Smartphone,
      popular: false
    },
    {
      name: "Marketing",
      description: "Leads, campaigns, conversiones",
      count: "15+ datasets",
      icon: TrendingUpIcon,
      popular: false
    },
    {
      name: "Salud",
      description: "Investigación médica, stats",
      count: "12+ datasets",
      icon: Stethoscope,
      popular: false
    },
    {
      name: "Educación",
      description: "Instituciones, cursos, estudiantes",
      count: "10+ datasets",
      icon: GraduationCap,
      popular: false
    },
    {
      name: "Transporte",
      description: "Rutas, tráfico, logística",
      count: "8+ datasets",
      icon: Truck,
      popular: false
    }
  ];

  const formats = [
    { name: "CSV", description: "Comma-separated values", icon: FileText },
    { name: "JSON", description: "JavaScript Object Notation", icon: Clipboard },
    { name: "SQL", description: "Database dump files", icon: Settings },
    { name: "XML", description: "Extensible Markup Language", icon: FileX },
    { name: "Parquet", description: "Columnar storage format", icon: BarChart },
    { name: "API", description: "Real-time access endpoints", icon: Link }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-cyan-50 via-background to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mb-8 shadow-lg">
              <Database className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-roboto font-black text-foreground mb-6 tracking-tight">
              Bases de Datos Premium
            </h1>
            <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto leading-relaxed">
              Accede a datasets estructurados y verificados para impulsar tu negocio. Datos limpios, documentados y listos para usar en tus proyectos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-xl">
                <Database className="w-5 h-5 mr-2" />
                Explorar Datasets
              </Button>
              <Button variant="outline" size="lg" className="border-cyan-200 hover:bg-cyan-50">
                <Search className="w-5 h-5 mr-2" />
                Buscar Datos Específicos
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50">
                <metric.icon className="w-8 h-8 text-cyan-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Categories */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Categorías de Datos
            </h2>
            <p className="text-lg text-muted-foreground">
              Encuentra datasets especializados para tu industria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dataCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 cursor-pointer group relative">
                {category.popular && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-cyan-500 transition-colors">
                    {category.name}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="outline" className="border-cyan-200 text-cyan-700">
                    {category.count}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formats Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Formatos Disponibles
            </h2>
            <p className="text-lg text-muted-foreground">
              Recibe tus datos en el formato que mejor se adapte a tu proyecto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formats.map((format, index) => (
              <div key={index} className="flex items-center space-x-4 p-6 bg-background border border-border/50 rounded-xl hover:shadow-lg transition-all group">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <format.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground group-hover:text-cyan-500 transition-colors">
                    {format.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{format.description}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-cyan-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              ¿Por qué Comprar Datasets Premium?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Ahorra meses de trabajo de recolección y limpieza de datos. Obtén información de calidad empresarial inmediatamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-background border border-border/50 rounded-xl hover:shadow-lg transition-all">
                <CheckCircle className="w-6 h-6 text-cyan-500 mt-1 shrink-0" />
                <span className="text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Cases */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Datasets Vendidos Recientemente
            </h2>
            <p className="text-lg text-muted-foreground">
              Casos reales de datasets transferidos exitosamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successCases.map((case_, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Database className="w-6 h-6 text-cyan-500" />
                    <span className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      Vendido
                    </span>
                  </div>
                  <CardTitle className="text-xl">{case_.title}</CardTitle>
                  <CardDescription>{case_.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Registros</span>
                      <span className="font-bold text-cyan-600">{case_.records}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Categorías</span>
                      <span className="font-semibold">{case_.categories}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Valor</span>
                      <span className="text-lg font-bold text-primary">{case_.value}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-cyan-50 via-background to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
            ¿Necesitas Datos Específicos?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nuestro equipo puede ayudarte a encontrar o crear el dataset perfecto para tu proyecto.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink to="/marketplace">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-xl">
                <Database className="w-5 h-5 mr-2" />
                Ver Datasets Disponibles
              </Button>
            </RouterLink>
            <RouterLink to="/services/valuations">
              <Button variant="outline" size="lg" className="border-cyan-200 hover:bg-cyan-50">
                <Search className="w-5 h-5 mr-2" />
                Solicitar Dataset Personalizado
              </Button>
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DatabasesPage;