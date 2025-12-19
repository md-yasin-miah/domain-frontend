import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Star, MessageCircle, TrendingUp, Award, CheckCircle, Globe, Smartphone, Code, Package } from "lucide-react"

const Brokers = () => {
  const brokers = [
    {
      id: 1,
      name: "María González",
      specialization: "Dominios Premium",
      icon: Globe,
      rating: 4.9,
      deals: 156,
      totalValue: "$2.6M USD",
      description: "Specialist in .com and .io domains with over 8 years of experience in the global digital market.",
      achievements: ["Top Broker 2023", "Especialista SEO", "+150 Transacciones"],
      avatar: "MG"
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      specialization: "SaaS & Software",
      icon: Code,
      rating: 4.8,
      deals: 89,
      totalValue: "$5.7M USD",
      description: "Expert in SaaS valuation and sales focused on tech startups.",
      achievements: ["Tech Certified", "SaaS Expert", "$5M+ Sold"],
      avatar: "CR"
    },
    {
      id: 3,
      name: "Ana Moreno",
      specialization: "E-commerce & FBA",
      icon: Package,
      rating: 4.9,
      deals: 67,
      totalValue: "€1.8M",
      description: "Asesora especializada en tiendas online y negocios Amazon FBA con track record comprobado.",
      achievements: ["Amazon Expert", "E-comm Pro", "Top Sales 2023"],
      avatar: "AM"
    },
    {
      id: 4,
      name: "David López",
      specialization: "Apps Móviles",
      icon: Smartphone,
      rating: 4.7,
      deals: 43,
      totalValue: "€980K",
      description: "Desarrollador y broker especializado en aplicaciones móviles iOS y Android rentables.",
      achievements: ["iOS/Android Dev", "App Store Pro", "Mobile Expert"],
      avatar: "DL"
    }
  ]

  const services = [
    {
      title: "Consultoría Personalizada",
      description: "Análisis profundo de tu activo con recomendaciones estratégicas",
      price: "€199",
      features: ["Evaluación completa", "Plan de optimización", "Estrategia de venta", "Soporte 30 días"]
    },
    {
      title: "Gestión de Venta",
      description: "Nuestros brokers se encargan de todo el proceso de venta",
      price: "5% comisión",
      features: ["Marketing del activo", "Negociación profesional", "Gestión legal", "Escrow incluido"]
    },
    {
      title: "Due Diligence",
      description: "Auditoría completa antes de comprar o vender un activo",
      price: "€299",
      features: ["Auditoría técnica", "Verificación financiera", "Análisis legal", "Informe detallado"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            Red de Brokers Especialistas
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Conecta con expertos certificados que te ayudarán a maximizar el valor de tus activos digitales
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-lg px-6 py-2">
              <Users className="w-5 h-5 mr-2" />
              +50 Brokers Certificados
            </Badge>
            <Badge variant="outline" className="text-lg px-6 py-2">
              <TrendingUp className="w-5 h-5 mr-2" />
              $13M+ USD Transacted
            </Badge>
          </div>
        </div>

        {/* Featured Brokers */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-foreground mb-8">Brokers Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brokers.map((broker) => (
              <Card key={broker.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <Avatar className="w-20 h-20 border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                      <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary/20 to-secondary/20">
                        {broker.avatar}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {broker.name}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <broker.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{broker.specialization}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-bold">{broker.rating}</span>
                    </div>
                    <div className="text-muted-foreground">•</div>
                    <div className="text-muted-foreground">{broker.deals} deals</div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    {broker.description}
                  </p>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary mb-1">{broker.totalValue}</div>
                    <div className="text-xs text-muted-foreground">Total transaccionado</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 justify-center">
                    {broker.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contactar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-16 py-16 bg-muted/30 rounded-3xl">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-3xl font-black text-foreground mb-8 text-center">Servicios Profesionales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                      <Button className="w-full mt-4 bg-gradient-to-r from-primary to-secondary">
                        Solicitar Servicio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-black text-foreground mb-8 text-center">Cómo Trabajamos</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Consulta Inicial</h3>
              <p className="text-muted-foreground">Habla con un broker especializado en tu tipo de activo</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Estrategia</h3>
              <p className="text-muted-foreground">Desarrollamos un plan personalizado para tu objetivo</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Ejecución</h3>
              <p className="text-muted-foreground">Gestionamos todo el proceso con transparencia total</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">4. Cierre Exitoso</h3>
              <p className="text-muted-foreground">Completamos la transacción de forma segura</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                ¿Listo para Trabajar con un Experto?
              </h3>
              <p className="text-muted-foreground mb-6">
                Nuestros brokers están listos para ayudarte a maximizar el valor de tus activos digitales
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-primary to-secondary flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Hablar con un Broker
                </Button>
                <Button variant="outline">
                  Ver Todos los Brokers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Brokers