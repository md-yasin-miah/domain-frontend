import { Gem, TrendingUp, Shield, Award, Star, ArrowRight, CheckCircle, DollarSign, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NFTsPage = () => {
  const benefits = [
    "Colecciones verificadas en blockchain",
    "Historial de transacciones transparente",
    "Autenticidad garantizada",
    "Potencial de apreciación alto",
    "Liquidez en mercados globales",
    "Transferencia inmediata y segura"
  ];

  const successCases = [
    {
      title: "Art Collection Genesis",
      value: "15.8 ETH",
      growth: "+340%",
      description: "Colección de arte digital con utilidad en metaverso"
    },
    {
      title: "GameFi Warriors",
      value: "8.2 ETH",
      growth: "+180%",
      description: "NFTs con utilidad en múltiples juegos blockchain"
    },
    {
      title: "Music Royalties NFT",
      value: "12.5 ETH",
      growth: "+220%",
      description: "NFTs con derechos de regalías musicales"
    }
  ];

  const metrics = [
    { label: "NFTs Vendidos", value: "1,240+", icon: Gem },
    { label: "Valor Promedio", value: "2.5 ETH", icon: DollarSign },
    { label: "ROI Promedio", value: "187%", icon: TrendingUp },
    { label: "Verificación", value: "100%", icon: Shield }
  ];

  const categories = [
    { name: "Arte Digital", count: "340+", icon: Palette },
    { name: "Coleccionables", count: "280+", icon: Star },
    { name: "GameFi", count: "190+", icon: Award },
    { name: "Música & Audio", count: "120+", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-blue-50">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-purple-500/10 via-background to-blue-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-8 shadow-lg">
              <Gem className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-roboto font-black text-foreground mb-6 tracking-tight">
              NFTs & Activos Blockchain
            </h1>
            <p className="text-xl text-muted-foreground font-roboto max-w-3xl mx-auto leading-relaxed">
              Invierte en activos digitales únicos verificados en blockchain. Colecciones premium, arte digital y NFTs con utilidad real en el ecosistema Web3.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-xl">
                <Gem className="w-5 h-5 mr-2" />
                Explorar NFTs
              </Button>
              <Button variant="outline" size="lg" className="border-purple-200 hover:bg-purple-50">
                <Shield className="w-5 h-5 mr-2" />
                Verificar Autenticidad
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50">
                <metric.icon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
              Categorías Principales
            </h2>
            <p className="text-lg text-muted-foreground">
              Diversas categorías de NFTs verificadas y con potencial de crecimiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50 cursor-pointer group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <category.icon className="w-8 h-8 text-purple-500" />
                  </div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.count} disponibles</CardDescription>
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
              Ventajas de Invertir en NFTs
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Los NFTs representan una nueva clase de activos con características únicas y potencial de crecimiento significativo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-background border border-border/50 rounded-xl hover:shadow-lg transition-all">
                <CheckCircle className="w-6 h-6 text-purple-500 mt-1 shrink-0" />
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
              NFTs Destacados Vendidos
            </h2>
            <p className="text-lg text-muted-foreground">
              Colecciones premium transferidas exitosamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successCases.map((case_, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Gem className="w-6 h-6 text-purple-500" />
                    <span className="text-sm font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      Vendido
                    </span>
                  </div>
                  <CardTitle className="text-xl">{case_.title}</CardTitle>
                  <CardDescription>{case_.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">{case_.value}</div>
                      <div className="text-sm text-muted-foreground">Valor de venta</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">{case_.growth}</div>
                      <div className="text-sm text-muted-foreground">Apreciación</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-500/10 via-background to-blue-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-roboto font-bold text-foreground mb-6">
            Únete al Futuro Digital
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comienza tu inversión en NFTs con colecciones verificadas y asesoramiento especializado en blockchain.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-xl">
                <Gem className="w-5 h-5 mr-2" />
                Ver Colecciones NFT
              </Button>
            </Link>
            <Link to="/services/valuations">
              <Button variant="outline" size="lg" className="border-purple-200 hover:bg-purple-50">
                <Shield className="w-5 h-5 mr-2" />
                Consultar Especialista
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NFTsPage;