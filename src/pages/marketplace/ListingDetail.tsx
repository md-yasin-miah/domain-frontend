import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Globe, TrendingUp, Users, MessageSquare, Heart, Share2, ShieldCheck } from 'lucide-react';

const ListingDetail = () => {
  const { id } = useParams();
  
  // Datos de ejemplo para el listing
  const listing = {
    id: id || "1",
    title: "tecnologia.com",
    type: "Dominio Premium",
    price: "$2,500",
    category: "Tecnología",
    traffic: "15K visits/month",
    description: "Dominio premium con alta autoridad en el sector tecnológico. Incluye tráfico orgánico establecido y métricas SEO verificadas.",
    verified: true,
    featured: true,
    seller: "TechDomains Pro",
    sellerRating: 4.9,
    metrics: {
      monthlyVisits: "15,247",
      domainAge: "8 años",
      backlinks: "2,340",
      domainAuthority: "65"
    },
    images: ["/placeholder-domain.jpg"],
    details: {
      revenue: "No aplicable",
      expenses: "Renovación anual: $15",
      netProfit: "N/A",
      traffic: "Tráfico orgánico establecido"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link 
            to="/marketplace" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Marketplace
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{listing.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">{listing.title}</CardTitle>
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
                    <p className="text-lg text-primary font-bold">{listing.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-base">
                  {listing.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas y Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{listing.metrics.monthlyVisits}</div>
                    <div className="text-xs text-muted-foreground">Visitas mensuales</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{listing.metrics.domainAge}</div>
                    <div className="text-xs text-muted-foreground">Antigüedad</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{listing.metrics.backlinks}</div>
                    <div className="text-xs text-muted-foreground">Backlinks</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">{listing.metrics.domainAuthority}</div>
                    <div className="text-xs text-muted-foreground">Domain Authority</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles Financieros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ingresos mensuales:</span>
                    <span className="font-medium">{listing.details.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gastos mensuales:</span>
                    <span className="font-medium">{listing.details.expenses}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="text-muted-foreground">Beneficio neto:</span>
                    <span className="font-bold text-primary">{listing.details.netProfit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary mb-2">{listing.price}</div>
                  <p className="text-sm text-muted-foreground">Precio fijo</p>
                </div>
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                    Comprar Ahora
                  </Button>
                  <Button variant="outline" className="w-full">
                    Hacer Oferta
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contactar Vendedor
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{listing.seller}</div>
                    <div className="text-sm text-muted-foreground">
                      ⭐ {listing.sellerRating} • Verificado
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Ver Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  Transacción Segura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Escrow protegido
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Verificación de activos
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Soporte 24/7
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;