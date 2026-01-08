import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Globe,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Award,
} from "lucide-react";

const WebsitesPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const featuredSites = [
    {
      id: 1,
      name: "TechBlog Premium",
      category: "Blog Tecnología",
      visitors: "120K/mes",
      revenue: "$4,500/mes",
      domain: "techinsights.com",
      price: "$45,000",
      rating: 4.9,
      age: "5 años",
      description: "Blog de tecnología con audiencia técnica especializada",
    },
    {
      id: 2,
      name: "E-commerce Fashion",
      category: "Tienda Online",
      visitors: "85K/mes",
      revenue: "$12,000/mes",
      domain: "fashionhub.com",
      price: "$120,000",
      rating: 4.8,
      age: "3 años",
      description:
        "Tienda de moda online con inventario y proveedores establecidos",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Sitios Web Monetizados</h1>
        <p className="text-muted-foreground text-lg">
          Adquiere sitios web establecidos con tráfico e ingresos verificados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredSites.map((site) => (
          <Card key={site.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{site.name}</CardTitle>
                  <Badge variant="outline">{site.category}</Badge>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{site.price}</div>
                  <div className="text-sm text-green-600">{site.revenue}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {site.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Visitantes:</span>
                  <p className="font-medium">{site.visitors}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Antigüedad:</span>
                  <p className="font-medium">{site.age}</p>
                </div>
              </div>
              <Button className="w-full">Ver Detalles</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebsitesPage;
