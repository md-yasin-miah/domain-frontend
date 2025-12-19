import { BookOpen, TrendingUp, Shield, DollarSign, Users, Target, ArrowRight, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Guides = () => {
  const categories = [
    {
      title: "Para Principiantes",
      description: "Fundamentos para empezar en activos digitales",
      icon: BookOpen,
      color: "bg-primary/10 text-primary",
      guides: 12
    },
    {
      title: "Valoración de Activos",
      description: "Aprende a evaluar dominios, sitios y apps",
      icon: TrendingUp,
      color: "bg-secondary/10 text-secondary",
      guides: 8
    },
    {
      title: "Seguridad y Escrow",
      description: "Protege tus inversiones y transacciones",
      icon: Shield,
      color: "bg-primary/15 text-primary",
      guides: 6
    },
    {
      title: "Estrategias de Inversión",
      description: "Maximiza tus retornos con estrategias probadas",
      icon: DollarSign,
      color: "bg-secondary/15 text-secondary",
      guides: 10
    }
  ];

  const featuredGuides = [
    {
      title: "Guía Completa: Cómo Valorar un Dominio Premium",
      description: "Aprende los factores clave que determinan el valor de un dominio: tráfico, SEO, brandabilidad y más.",
      category: "Valoración",
      readTime: "15 min",
      difficulty: "Intermedio",
      featured: true,
      author: "Carlos Martinez",
      views: "2.4K"
    },
    {
      title: "10 Errores Comunes al Comprar Sitios Web",
      description: "Evita estos errores costosos al adquirir sitios web con ingresos. Lista de verificación incluida.",
      category: "Principiantes",
      readTime: "12 min",
      difficulty: "Básico",
      featured: true,
      author: "Ana Rodriguez",
      views: "1.8K"
    },
    {
      title: "Análisis de Due Diligence para E-commerce",
      description: "Checklist completo para verificar métricas, inventario y sistemas antes de comprar una tienda online.",
      category: "E-commerce",
      readTime: "20 min",
      difficulty: "Avanzado",
      featured: true,
      author: "Miguel Torres",
      views: "1.2K"
    }
  ];

  const allGuides = [
    {
      title: "Fundamentos de SEO para Dominios",
      description: "Entiende cómo el SEO afecta el valor de dominios y sitios web.",
      category: "SEO",
      readTime: "8 min",
      difficulty: "Básico",
      author: "Laura Gomez",
      views: "950"
    },
    {
      title: "Evaluación de Apps Móviles: Métricas Clave",
      description: "KPIs esenciales para evaluar el potencial de una aplicación móvil.",
      category: "Apps Móviles",
      readTime: "14 min",
      difficulty: "Intermedio",
      author: "David Silva",
      views: "750"
    },
    {
      title: "Negociación Efectiva en Marketplace Digital",
      description: "Estrategias para conseguir mejores precios en tus transacciones.",
      category: "Negociación",
      readTime: "11 min",
      difficulty: "Intermedio",
      author: "Patricia Vega",
      views: "1.1K"
    },
    {
      title: "Transferencia Segura de Activos NFT",
      description: "Proceso paso a paso para transferir NFTs de forma segura.",
      category: "NFTs",
      readTime: "6 min",
      difficulty: "Básico",
      author: "Roberto Kim",
      views: "650"
    },
    {
      title: "Análisis Financiero de SaaS en Venta",
      description: "Cómo evaluar métricas SaaS: MRR, churn, LTV y más.",
      category: "SaaS",
      readTime: "18 min",
      difficulty: "Avanzado",
      author: "Elena Castro",
      views: "890"
    },
    {
      title: "Optimización Fiscal en Inversiones Digitales",
      description: "Estrategias legales para optimizar impuestos en compraventa de activos.",
      category: "Legal/Fiscal",
      readTime: "16 min",
      difficulty: "Avanzado",
      author: "Marco Fernandez",
      views: "540"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-success/10 text-success';
      case 'Intermedio': return 'bg-warning/10 text-warning';
      case 'Avanzado': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-8 shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-roboto font-black text-foreground mb-6 tracking-tight">
            Guías y Tutoriales
          </h1>
          <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto leading-relaxed mb-8">
            Aprende todo sobre activos digitales con nuestras guías especializadas. Desde principiantes hasta expertos, tenemos contenido para todos los niveles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl">
              <BookOpen className="w-5 h-5 mr-2" />
              Empezar a Aprender
            </Button>
            <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
              <Star className="w-5 h-5 mr-2" />
              Guías Destacadas
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Categorías de Aprendizaje
            </h2>
            <p className="text-lg text-muted-foreground">
              Encuentra guías organizadas por tema y nivel de experiencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={`/resources/guides/category/${category.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <category.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge className={category.color}>
                      {category.guides} guías
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Guías Destacadas
            </h2>
            <p className="text-lg text-muted-foreground">
              Nuestro contenido más popular y valorado por la comunidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredGuides.map((guide, index) => (
              <Link key={index} to={`/resources/guides/${guide.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`}>
                <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Destacado
                      </Badge>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{guide.views}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{guide.readTime}</span>
                        </div>
                        <Badge className={getDifficultyColor(guide.difficulty)}>
                          {guide.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Por {guide.author}
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

      {/* All Guides */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Todas las Guías
            </h2>
            <p className="text-lg text-muted-foreground">
              Explora nuestra biblioteca completa de contenido educativo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGuides.map((guide, index) => (
              <Link key={index} to={`/resources/guides/${guide.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`}>
                <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{guide.category}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{guide.views}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{guide.readTime}</span>
                        </div>
                        <Badge className={getDifficultyColor(guide.difficulty)}>
                          {guide.difficulty}
                        </Badge>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Por {guide.author}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
              <BookOpen className="w-5 h-5 mr-2" />
              Ver Más Guías
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
            ¿Necesitas Ayuda Personalizada?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Si no encuentras lo que buscas, nuestro equipo de expertos está aquí para ayudarte.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/user/soporte">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-xl">
                <Users className="w-5 h-5 mr-2" />
                Contactar Soporte
              </Button>
            </Link>
            <Link to="/services/valuations">
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5">
                <Target className="w-5 h-5 mr-2" />
                Consultoría Personalizada
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guides;