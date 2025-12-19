import { Code, TrendingUp, Users, Award, Star, ArrowRight, CheckCircle, DollarSign, BarChart3, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SoftwareSaaSPage = () => {
  const benefits = [
    "Código fuente completo incluido",
    "Base de suscriptores existente",
    "Métricas MRR/ARR verificadas",
    "Documentación técnica completa",
    "Integraciones y APIs configuradas",
    "Soporte técnico en la transición"
  ];

  const successCases = [
    {
      title: "Project Management Tool",
      mrr: "$12,500/mes",
      users: "2,400+",
      growth: "+89%",
      description: "Herramienta de gestión de proyectos con integraciones Slack y Teams"
    },
    {
      title: "Analytics Dashboard",
      mrr: "$8,900/mes",
      users: "1,850+",
      growth: "+156%",
      description: "Dashboard de analytics con IA para e-commerce y marketing"
    },
    {
      title: "CRM Solution",
      mrr: "$15,200/mes",
      users: "950+",
      growth: "+67%",
      description: "CRM completo para pequeñas y medianas empresas"
    }
  ];

  const metrics = [
    { label: "SaaS Vendidos", value: "89+", icon: Code },
    { label: "MRR Promedio", value: "$9,200", icon: DollarSign },
    { label: "Múltiplo Promedio", value: "4.2x", icon: TrendingUp },
    { label: "Tasa de Éxito", value: "96%", icon: Award }
  ];

  const saasMetrics = [
    {
      name: "Monthly Recurring Revenue (MRR)",
      description: "Ingresos recurrentes mensuales verificados",
      importance: "Crítico"
    },
    {
      name: "Annual Recurring Revenue (ARR)",
      description: "Proyección anual de ingresos recurrentes",
      importance: "Alto"
    },
    {
      name: "Customer Churn Rate",
      description: "Tasa de cancelación de suscriptores",
      importance: "Crítico"
    },
    {
      name: "Customer Acquisition Cost (CAC)",
      description: "Costo de adquisición por cliente",
      importance: "Alto"
    },
    {
      name: "Lifetime Value (LTV)",
      description: "Valor de vida del cliente",
      importance: "Alto"
    },
    {
      name: "Monthly Active Users (MAU)",
      description: "Usuarios activos mensuales",
      importance: "Medio"
    }
  ];

  const techStack = [
    "React/Next.js", "Node.js", "Python/Django", "Ruby on Rails",
    "PostgreSQL", "MongoDB", "Redis", "AWS/GCP/Azure",
    "Docker", "Kubernetes", "Stripe/PayPal", "Sendgrid/Mailgun"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-50 via-background to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-8 shadow-lg">
              <Code className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-roboto font-black text-foreground mb-6 tracking-tight">
              Software y SaaS Premium
            </h1>
            <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto leading-relaxed">
              Adquiere aplicaciones web completas con suscriptores activos, código fuente y métricas SaaS verificadas. Inversión inteligente en el futuro del software.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-xl">
                <Code className="w-5 h-5 mr-2" />
                Explorar SaaS
              </Button>
              <Button variant="outline" size="lg" className="border-blue-200 hover:bg-blue-50">
                <BarChart3 className="w-5 h-5 mr-2" />
                Ver Métricas
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50">
                <metric.icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SaaS Metrics Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Métricas SaaS Verificadas
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Todos nuestros SaaS incluyen análisis completo de métricas clave para asegurar una inversión informada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saasMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <BarChart3 className="w-6 h-6 text-blue-500 mt-1" />
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      metric.importance === 'Crítico' ? 'bg-red-100 text-red-800' :
                      metric.importance === 'Alto' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {metric.importance}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{metric.name}</CardTitle>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              ¿Por qué Comprar Software SaaS?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Evita años de desarrollo y obtén un negocio SaaS rentable con usuarios pagando desde el día uno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-background border border-border/50 rounded-xl hover:shadow-lg transition-all">
                <CheckCircle className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
                <span className="text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Cases */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              SaaS Vendidos Exitosamente
            </h2>
            <p className="text-lg text-muted-foreground">
              Casos reales de transferencias exitosas de aplicaciones SaaS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successCases.map((case_, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Code className="w-6 h-6 text-blue-500" />
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
                      <span className="text-sm text-muted-foreground">MRR</span>
                      <span className="text-lg font-bold text-blue-600">{case_.mrr}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Usuarios</span>
                      <span className="font-semibold">{case_.users}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Crecimiento</span>
                      <span className="font-semibold text-green-600">{case_.growth}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Tecnologías Populares
            </h2>
            <p className="text-lg text-muted-foreground">
              Stack tecnológico más común en nuestros SaaS disponibles
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="px-6 py-3 bg-background border border-border/50 rounded-full hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="font-medium group-hover:text-blue-500 transition-colors">{tech}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-50 via-background to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
            ¿Listo para tu Próximo SaaS?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Nuestro equipo de expertos técnicos te ayudará a evaluar y adquirir el SaaS perfecto para tus objetivos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-xl">
                <Code className="w-5 h-5 mr-2" />
                Ver SaaS Disponibles
              </Button>
            </Link>
            <Link to="/services/valuations">
              <Button variant="outline" size="lg" className="border-blue-200 hover:bg-blue-50">
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

export default SoftwareSaaSPage;