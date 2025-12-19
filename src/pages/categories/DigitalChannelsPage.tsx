import { Play, TrendingUp, Users, Award, Star, ArrowRight, CheckCircle, DollarSign, Youtube, Instagram, MessageCircle, Video, Camera, Music, Twitter, Briefcase, Gamepad2, Monitor, Sparkles, Laptop, Dumbbell, Plane, BookOpen, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DigitalChannelsPage = () => {
  const benefits = [
    "Audiencia real y verificada",
    "Métricas de engagement auditadas",
    "Contenido y estrategia incluidos",
    "Transferencia completa de cuentas",
    "Historial de monetización",
    "Soporte en la transición"
  ];

  const successCases = [
    {
      title: "Tech Review Channel",
      platform: "YouTube",
      subscribers: "485K",
      monthlyViews: "2.1M",
      revenue: "$8,500/mes",
      description: "Canal de reviews tecnológicos con alta engagement"
    },
    {
      title: "Fashion Lifestyle",
      platform: "Instagram",
      followers: "320K",
      monthlyViews: "5.8M",
      revenue: "$6,200/mes",
      description: "Cuenta de moda con colaboraciones premium"
    },
    {
      title: "Business Tips",
      platform: "TikTok",
      followers: "750K",
      monthlyViews: "12.5M",
      revenue: "$4,800/mes",
      description: "Contenido empresarial viral y educativo"
    }
  ];

  const metrics = [
    { label: "Canales Vendidos", value: "127+", icon: Play },
    { label: "Seguidores Promedio", value: "420K", icon: Users },
    { label: "Revenue Promedio", value: "$5,800", icon: DollarSign },
    { label: "Tasa de Éxito", value: "94%", icon: Award }
  ];

  const platforms = [
    {
      name: "YouTube",
      icon: Video,
      description: "Canales con monetización activa",
      count: "45+ disponibles",
      avgRevenue: "$7,200/mes",
      popular: true
    },
    {
      name: "Instagram",
      icon: Camera,
      description: "Cuentas con engagement alto",
      count: "38+ disponibles",
      avgRevenue: "$4,800/mes",
      popular: true
    },
    {
      name: "TikTok",
      icon: Music,
      description: "Perfiles virales con audiencia joven",
      count: "29+ disponibles",
      avgRevenue: "$3,500/mes",
      popular: true
    },
    {
      name: "Twitter/X",
      icon: Twitter,
      description: "Cuentas con autoridad en nichos",
      count: "22+ disponibles",
      avgRevenue: "$2,900/mes",
      popular: false
    },
    {
      name: "LinkedIn",
      icon: Briefcase,
      description: "Perfiles profesionales influyentes",
      count: "18+ disponibles",
      avgRevenue: "$4,200/mes",
      popular: false
    },
    {
      name: "Twitch",
      icon: Gamepad2,
      description: "Canales gaming con suscriptores",
      count: "15+ disponibles",
      avgRevenue: "$5,100/mes",
      popular: false
    }
  ];

  const niches = [
    { name: "Tecnología", engagement: "8.5%", icon: Monitor },
    { name: "Lifestyle", engagement: "6.8%", icon: Sparkles },
    { name: "Gaming", engagement: "12.3%", icon: Gamepad2 },
    { name: "Fitness", engagement: "9.1%", icon: Dumbbell },
    { name: "Finanzas", engagement: "7.2%", icon: DollarSign },
    { name: "Cocina", engagement: "10.4%", icon: ChefHat },
    { name: "Viajes", engagement: "8.9%", icon: Plane },
    { name: "Educación", engagement: "6.5%", icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-pink-50 via-background to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl mb-8 shadow-lg">
              <Play className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-roboto font-black text-foreground mb-6 tracking-tight">
              Canales Digitales Premium
            </h1>
            <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto leading-relaxed">
              Adquiere canales establecidos de YouTube, Instagram, TikTok y más. Audiencias reales, engagement verificado y monetización activa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-orange-500 hover:shadow-xl">
                <Play className="w-5 h-5 mr-2" />
                Explorar Canales
              </Button>
              <Button variant="outline" size="lg" className="border-pink-200 hover:bg-pink-50">
                <TrendingUp className="w-5 h-5 mr-2" />
                Ver Métricas
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50">
                <metric.icon className="w-8 h-8 text-pink-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Plataformas Disponibles
            </h2>
            <p className="text-lg text-muted-foreground">
              Canales verificados en las principales redes sociales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 cursor-pointer group relative">
                {platform.popular && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <platform.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-pink-500 transition-colors">
                    {platform.name}
                  </CardTitle>
                  <CardDescription>{platform.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <Badge variant="outline" className="border-pink-200 text-pink-700">
                    {platform.count}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Revenue promedio: <span className="font-semibold text-foreground">{platform.avgRevenue}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Niches Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Nichos con Mayor Engagement
            </h2>
            <p className="text-lg text-muted-foreground">
              Categorías de contenido con mejor rendimiento
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {niches.map((niche, index) => (
              <div key={index} className="text-center p-6 bg-background border border-border/50 rounded-xl hover:shadow-lg transition-all group">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <niche.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2 group-hover:text-pink-500 transition-colors">
                  {niche.name}
                </h3>
                <div className="text-sm text-muted-foreground">
                  Engagement: <span className="font-semibold text-green-600">{niche.engagement}</span>
                </div>
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
              ¿Por qué Comprar un Canal Digital?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Evita años de construcción orgánica y obtén audiencia establecida con ingresos inmediatos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-background border border-border/50 rounded-xl hover:shadow-lg transition-all">
                <CheckCircle className="w-6 h-6 text-pink-500 mt-1 shrink-0" />
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
              Canales Vendidos Exitosamente
            </h2>
            <p className="text-lg text-muted-foreground">
              Casos reales de transferencias exitosas de canales digitales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successCases.map((case_, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Play className="w-5 h-5 text-pink-500" />
                      <Badge variant="outline">{case_.platform}</Badge>
                    </div>
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
                      <span className="text-sm text-muted-foreground">Seguidores</span>
                      <span className="font-bold text-pink-600">{case_.subscribers || case_.followers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Views/mes</span>
                      <span className="font-semibold">{case_.monthlyViews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Ingresos</span>
                      <span className="text-lg font-bold text-primary">{case_.revenue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-pink-50 via-background to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
            ¿Listo para tu Canal Digital?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nuestro equipo de expertos en redes sociales te ayudará a encontrar el canal perfecto para tu marca.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-orange-500 hover:shadow-xl">
                <Play className="w-5 h-5 mr-2" />
                Ver Canales Disponibles
              </Button>
            </Link>
            <Link to="/services/valuations">
              <Button variant="outline" size="lg" className="border-pink-200 hover:bg-pink-50">
                <Users className="w-5 h-5 mr-2" />
                Consultar Especialista
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DigitalChannelsPage;