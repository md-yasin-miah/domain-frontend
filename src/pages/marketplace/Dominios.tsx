import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Globe, Eye, Calendar, ArrowRight, TrendingUp, Award, CheckCircle } from "lucide-react"
import { useMarketplaceDomains, useMarketplaceStats, useIncrementViews } from "@/hooks/useMarketplace"
import { Skeleton } from "@/components/ui/skeleton"

const DominiosPage = () => {
  const { data: domains, isLoading: domainsLoading } = useMarketplaceDomains();
  const { data: stats } = useMarketplaceStats();
  const incrementViews = useIncrementViews();

  const featuredDomains = [
    {
      id: 1,
      domain: "tecnologia.com",
      price: "$2,500",
      views: "1,234",
      category: "Tecnología",
      extension: ".com",
      length: 10,
      registrar: "GoDaddy",
      expires: "2025-12-15",
      premium: true
    },
    {
      id: 2,
      domain: "marketing-online.com",
      price: "$4,800",
      views: "856",
      category: "Marketing",
      extension: ".com",
      length: 16,
      registrar: "Namecheap",
      expires: "2026-03-22",
      premium: true
    },
    {
      id: 3,
      domain: "consultoria.io",
      price: "$1,200",
      views: "432",
      category: "Servicios",
      extension: ".io",
      length: 11,
      registrar: "1&1",
      expires: "2025-08-10",
      premium: false
    },
    {
      id: 4,
      domain: "ecommerce-shop.net",
      price: "$3,200",
      views: "678",
      category: "Comercio",
      extension: ".net",
      length: 14,
      registrar: "GoDaddy",
      expires: "2026-01-05",
      premium: false
    },
    {
      id: 5,
      domain: "inversiones.com",
      price: "$15,000",
      views: "2,145",
      category: "Finanzas",
      extension: ".com",
      length: 11,
      registrar: "Namecheap",
      expires: "2027-06-30",
      premium: true
    },
    {
      id: 6,
      domain: "salud-digital.org",
      price: "$2,800",
      views: "543",
      category: "Salud",
      extension: ".org",
      length: 13,
      registrar: "Register.com",
      expires: "2025-11-18",
      premium: false
    }
  ]

  const categories = [
    { name: "Tecnología", count: 47, color: "bg-primary" },
    { name: "Negocios", count: 89, color: "bg-primary/80" },
    { name: "Finanzas", count: 34, color: "bg-secondary" },
    { name: "Salud", count: 23, color: "bg-primary/90" },
    { name: "Educación", count: 56, color: "bg-secondary/80" },
    { name: "Entretenimiento", count: 78, color: "bg-primary/70" }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 border">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Dominios Premium en Español
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Descubre dominios .com, .io y otras extensiones premium para tu negocio. 
            Amplia selección de dominios verificados con precios competitivos en el mercado global.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Transferencia segura
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              Dominios verificados
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Valoraciones reales
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar dominios... ej: tecnologia, marketing, finanzas" 
              className="pl-10 h-12"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button className="h-12 px-8">Buscar</Button>
          </div>
        </div>
        
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            .com
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            .com
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Menos de $5,000
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Premium
          </Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
            Cortos (≤ 10 letras)
          </Badge>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Explorar por Categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 ${category.color} rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.count} dominios</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Domains */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Dominios Destacados</h2>
          <Button variant="outline" className="flex items-center gap-2">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        {domainsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-2">
                <CardHeader className="pb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(domains && domains.length > 0) ? domains.map((domain) => {
              const domainData = domain.domain_data as any || {};
              const displayDomain = domain.title || domainData.domain || "domain.com";
              const extension = domainData.extension || displayDomain.split('.').pop() || ".com";
              const registrar = domainData.registrar || "Unknown";
              const expires = domainData.expires || "2025-12-31";
              const length = displayDomain.length;

              return (
                <Card 
                  key={domain.id} 
                  className="hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/20 cursor-pointer"
                  onClick={() => incrementViews(domain.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {displayDomain}
                          {domain.is_premium && (
                            <Award className="inline h-4 w-4 text-yellow-500 ml-2" />
                          )}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">
                            {domain.marketplace_categories?.name || "Sin categoría"}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {extension}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">
                        ${domain.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {domain.views_count}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Longitud:</span>
                        <p className="font-medium">{length} caracteres</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Registrar:</span>
                        <p className="font-medium">{registrar}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Expira: {expires}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground">
                        Ver Detalles
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Hacer Oferta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            }) : (
              <div className="col-span-full text-center py-12">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay dominios disponibles</h3>
                <p className="text-muted-foreground">Vuelve pronto para ver nuevos dominios premium.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-8 border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {stats?.domains.toLocaleString() || '0'}
            </div>
            <div className="text-muted-foreground">Dominios disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">$1.2M</div>
            <div className="text-muted-foreground">En transacciones</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">15,432</div>
            <div className="text-muted-foreground">Usuarios activos</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DominiosPage