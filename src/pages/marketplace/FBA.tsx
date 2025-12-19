import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, TrendingUp, Star } from "lucide-react";

const FBA = () => {
  const featuredFBA = [
    {
      id: 1,
      name: "Health Supplements Store",
      category: "Salud y Bienestar",
      monthlyRevenue: "$18,500",
      profitMargin: "35%",
      asinCount: 15,
      price: "$185,000",
      rating: 4.9,
      description: "Marca establecida de suplementos con reviews excepcionales"
    },
    {
      id: 2,
      name: "Kitchen Gadgets Brand",
      category: "Hogar y Cocina",
      monthlyRevenue: "$12,300",
      profitMargin: "42%",
      asinCount: 8,
      price: "$125,000",
      rating: 4.7,
      description: "Productos de cocina innovadores con alta demanda"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Negocios Amazon FBA</h1>
        <p className="text-muted-foreground text-lg">
          Adquiere negocios FBA establecidos con inventario y métricas verificadas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredFBA.map((fba) => (
          <Card key={fba.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {fba.name}
                    <Package className="h-5 w-5 text-primary" />
                  </CardTitle>
                  <Badge variant="outline">{fba.category}</Badge>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{fba.price}</div>
                  <div className="text-sm text-green-600">{fba.monthlyRevenue}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{fba.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Margen:</span>
                  <p className="font-medium text-green-600">{fba.profitMargin}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">ASINs:</span>
                  <p className="font-medium">{fba.asinCount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{fba.rating}</span>
              </div>
              <Button className="w-full">Ver Métricas</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FBA;