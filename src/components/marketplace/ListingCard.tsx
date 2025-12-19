import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Heart, 
  Share2, 
  Star,
  TrendingUp,
  Eye,
  Calendar,
  DollarSign
} from "lucide-react";
import { Link } from 'react-router-dom';

interface ListingCardProps {
  listing: {
    id: number;
    title: string;
    type: string;
    price: number;
    traffic: string;
    category: string;
    verified: boolean;
    featured: boolean;
    rating: number;
    reviews: number;
    seller: string;
    tags: string[];
    createdAt: string;
    metrics: any;
    description: string;
  };
  isFavorite: boolean;
  onToggleFavorite: () => void;
  showMetrics?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  isFavorite, 
  onToggleFavorite, 
  showMetrics = true,
  variant = 'default'
}) => {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getMetricForType = (type: string, metrics: any) => {
    switch (type) {
      case 'Dominio':
        return [
          { label: 'Domain Authority', value: metrics.domainAuthority || 'N/A', icon: TrendingUp },
          { label: 'Backlinks', value: metrics.backlinks?.toLocaleString() || 'N/A', icon: Eye },
          { label: 'Age', value: `${metrics.domainAge || 0} años`, icon: Calendar }
        ];
      case 'Sitio Web':
        return [
          { label: 'Revenue/mes', value: `$${metrics.monthlyRevenue?.toLocaleString() || 0}`, icon: DollarSign },
          { label: 'Conversion', value: `${metrics.conversionRate || 0}%`, icon: TrendingUp },
          { label: 'Products', value: metrics.products?.toLocaleString() || 'N/A', icon: Eye }
        ];
      case 'App':
        return [
          { label: 'Users Activos', value: metrics.activeUsers?.toLocaleString() || 'N/A', icon: Eye },
          { label: 'Revenue/mes', value: `$${metrics.monthlyRevenue?.toLocaleString() || 0}`, icon: DollarSign },
          { label: 'App Store', value: `${metrics.appStoreRating || 0}⭐`, icon: Star }
        ];
      case 'Software':
        return [
          { label: 'MRR', value: `$${metrics.mrr?.toLocaleString() || 0}`, icon: DollarSign },
          { label: 'Churn Rate', value: `${metrics.churnRate || 0}%`, icon: TrendingUp },
          { label: 'LTV', value: `$${metrics.ltv?.toLocaleString() || 0}`, icon: Eye }
        ];
      case 'Canal Digital':
        return [
          { label: 'Subscribers', value: metrics.subscribers?.toLocaleString() || 'N/A', icon: Eye },
          { label: 'Avg Views', value: metrics.avgViews?.toLocaleString() || 'N/A', icon: TrendingUp },
          { label: 'Earnings/mes', value: `$${metrics.monthlyEarnings?.toLocaleString() || 0}`, icon: DollarSign }
        ];
      case 'FBA':
        return [
          { label: 'Revenue/mes', value: `$${metrics.monthlyRevenue?.toLocaleString() || 0}`, icon: DollarSign },
          { label: 'Profit Margin', value: `${metrics.profitMargin || 0}%`, icon: TrendingUp },
          { label: 'ASINs', value: metrics.asinCount?.toLocaleString() || 'N/A', icon: Eye }
        ];
      default:
        return [];
    }
  };

  const relevantMetrics = getMetricForType(listing.type, listing.metrics);

  if (variant === 'compact') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border hover:border-primary/20">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
              {listing.title}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="h-6 w-6 shrink-0"
            >
              <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
          
          <div className="flex items-center gap-1 mb-2">
            <Badge variant="outline" className="text-xs">{listing.type}</Badge>
            {listing.featured && (
              <Badge className="text-xs bg-gradient-to-r from-primary to-secondary">★</Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-primary">{formatPrice(listing.price)}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs">{listing.rating}</span>
            </div>
          </div>
          
          <Button asChild size="sm" className="w-full text-xs">
            <Link to={`/marketplace/listing/${listing.id}`}>
              Ver Detalles
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {listing.title}
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className="h-8 w-8"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <CardDescription className="text-sm leading-relaxed mb-4">
            {listing.description}
          </CardDescription>
          
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
          
          <div className="flex items-center gap-4 text-sm">
            <Badge variant="secondary">{listing.category}</Badge>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{listing.rating}</span>
              <span className="text-muted-foreground">({listing.reviews})</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(listing.price)}
              </span>
              <span className="text-sm text-muted-foreground">{listing.traffic}</span>
            </div>
            
            {showMetrics && relevantMetrics.length > 0 && (
              <div className="grid grid-cols-3 gap-2 p-3 bg-muted/20 rounded-lg">
                {relevantMetrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <metric.icon className="w-3 h-3 text-primary" />
                    </div>
                    <div className="text-xs font-medium">{metric.value}</div>
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              Por: <span className="font-medium text-foreground">{listing.seller}</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {listing.tags.slice(0, 4).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                asChild 
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
              >
                <Link to={`/marketplace/listing/${listing.id}`}>
                  Ver Detalles
                </Link>
              </Button>
              <Button variant="outline" className="flex-1">
                Hacer Oferta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Variante por defecto
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {listing.title}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="h-8 w-8"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
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
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{listing.category}</Badge>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{listing.rating}</span>
            <span className="text-xs text-muted-foreground">({listing.reviews})</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-primary">
              {formatPrice(listing.price)}
            </span>
            <span className="text-sm text-muted-foreground">{listing.traffic}</span>
          </div>
          
          {showMetrics && relevantMetrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 text-xs">
              {relevantMetrics.slice(0, 3).map((metric, index) => (
                <div key={index} className="text-center p-2 bg-muted/20 rounded">
                  <div className="font-medium">{metric.value}</div>
                  <div className="text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            Por: <span className="font-medium text-foreground">{listing.seller}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {listing.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              asChild 
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
            >
              <Link to={`/marketplace/listing/${listing.id}`}>
                Ver Detalles
              </Link>
            </Button>
            <Button variant="outline" className="flex-1">
              Hacer Oferta
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;