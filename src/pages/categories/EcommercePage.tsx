import { ShoppingBag, TrendingUp, Users, Award, Star, ArrowRight, CheckCircle, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const EcommercePage = () => {
  const benefits = [
    "Inventario y sistemas establecidos",
    "Base de clientes existente",
    "Métricas de rendimiento verificadas",
    "Canales de marketing activos",
    "Proveedores y logística configurada",
    "Transferencia completa de activos"
  ];

  const successCases = [
    {
      title: "TechGadgets Store",
      revenue: "$45,000/mes",
      growth: "+127%",
      description: "E-commerce de gadgets tecnológicos con 15,000 clientes activos"
    },
    {
      title: "Fashion Boutique",
      revenue: "$32,000/mes",
      growth: "+89%",
      description: "Tienda de moda online con marca establecida y alta conversión"
    },
    {
      title: "Home & Garden",
      revenue: "$28,000/mes",
      growth: "+156%",
      description: "Marketplace de artículos para el hogar con excelente reputación"
    }
  ];

  const metrics = [
    { label: "Tiendas Vendidas", value: "240+", icon: ShoppingBag },
    { label: "Valor Promedio", value: "$8,500", icon: DollarSign },
    { label: "ROI Promedio", value: "3.2x", icon: TrendingUp },
    { label: "Éxito de Transferencia", value: "98%", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-8 shadow-lg">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-roboto font-black text-foreground mb-6 tracking-tight">
              Tiendas E-commerce Rentables
            </h1>
            <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto leading-relaxed">
              Adquiere negocios online completos con sistemas establecidos, inventario incluido y flujo de ingresos comprobado. Inversión inteligente en el futuro del comercio digital.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Explorar Tiendas
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                <TrendingUp className="w-5 h-5 mr-2" />
                Ver Análisis de Mercado
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50">
                <metric.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
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
              ¿Por qué Comprar una Tienda E-commerce?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Evita los años de construcción y optimización. Obtén un negocio rentable desde el día uno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-background border border-border/50 rounded-xl hover:shadow-lg transition-all">
                <CheckCircle className="w-6 h-6 text-primary mt-1 shrink-0" />
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
              Casos de Éxito Recientes
            </h2>
            <p className="text-lg text-muted-foreground">
              Tiendas vendidas exitosamente en nuestra plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successCases.map((case_, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Star className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Vendido
                    </span>
                  </div>
                  <CardTitle className="text-xl">{case_.title}</CardTitle>
                  <CardDescription>{case_.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">{case_.revenue}</div>
                      <div className="text-sm text-muted-foreground">Ingresos mensuales</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">{case_.growth}</div>
                      <div className="text-sm text-muted-foreground">Crecimiento anual</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
            ¿Listo para tu Próximo Negocio?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nuestro equipo de expertos te ayudará a encontrar la tienda e-commerce perfecta para tus objetivos de inversión.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Ver Tiendas Disponibles
              </Button>
            </Link>
            <Link to="/services/valuations">
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                <Users className="w-5 h-5 mr-2" />
                Hablar con un Asesor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcommercePage;