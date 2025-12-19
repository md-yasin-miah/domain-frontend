import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calculator, FileText, CheckCircle, Globe, Smartphone, Code, Package } from "lucide-react"

const Valuations = () => {
  const services = [
    {
      type: "Domains",
      icon: Globe,
      price: "$109 USD",
      description: "Complete evaluation of authority, SEO traffic and market potential",
      features: ["SEO Analysis", "Traffic Metrics", "Market Comparables", "Detailed Report"]
    },
    {
      type: "Websites",
      icon: Globe,
      price: "$325 USD",
      description: "Comprehensive valuation of revenue, traffic and digital assets",
      features: ["Financial Analysis", "Technical Audit", "Traffic Evaluation", "Due Diligence"]
    },
    {
      type: "Mobile Apps",
      icon: Smartphone,
      price: "$435 USD",
      description: "Evaluation of active users, revenue and source code",
      features: ["User Analysis", "Code Review", "Projections", "ASO Valuation"]
    },
    {
      type: "Software/SaaS",
      icon: Code,
      price: "$650 USD",
      description: "Complete valuation of MRR, churn rate and scalability",
      features: ["MRR Analysis", "SaaS Metrics", "Scalability", "Competitive Analysis"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            Valoraciones Profesionales
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Obtén una evaluación precisa y profesional de tu activo digital con nuestro equipo de expertos
          </p>
          <Badge className="bg-gradient-to-r from-primary to-secondary text-lg px-6 py-2">
            <CheckCircle className="w-5 h-5 mr-2" />
            Metodología certificada
          </Badge>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <Card key={service.type} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      {service.type}
                    </CardTitle>
                    <div className="text-3xl font-bold text-primary">{service.price}</div>
                  </div>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg">
                    <Calculator className="w-4 h-4 mr-2" />
                    Solicitar Valoración
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Section */}
        <section className="py-16 bg-muted/30 rounded-3xl">
          <div className="max-w-5xl mx-auto px-8">
            <h2 className="text-3xl font-black text-center text-foreground mb-12">
              Nuestro Proceso de Valoración
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Análisis Inicial</h3>
                <p className="text-muted-foreground">Recopilamos datos y métricas clave de tu activo digital</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Evaluación Experta</h3>
                <p className="text-muted-foreground">Nuestros especialistas analizan el potencial y riesgos</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Informe Final</h3>
                <p className="text-muted-foreground">Recibe un informe detallado con valoración y recomendaciones</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                ¿Necesitas una Valoración Personalizada?
              </h3>
              <p className="text-muted-foreground mb-6">
                Habla con nuestros expertos para obtener una evaluación detallada de tu activo
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input placeholder="URL de tu activo digital" className="flex-1" />
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Consulta Gratuita
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Valuations