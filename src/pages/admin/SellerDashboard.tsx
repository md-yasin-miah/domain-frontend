import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  Plus,
  Eye,
  MessageSquare,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Star,
  Heart,
  Gavel,
  CreditCard,
  Bitcoin,
  Wallet,
  Building,
  Edit,
  Trash2
} from "lucide-react"

const SellerDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  // Mock data - En producción vendría de Supabase
  const stats = {
    totalRevenue: 24680,
    activeListings: 12,
    totalViews: 5420,
    pendingOffers: 8,
    conversionRate: 4.2,
    avgPrice: 3500
  }

  const transactions = [
    {
      id: "TRX001",
      asset: "marketing-pro.com",
      buyer: "juan.garcia@email.com",
      amount: 2500,
      currency: "EUR",
      method: "Bitcoin",
      status: "Completada",
      date: "2024-01-15",
      fees: 125
    },
    {
      id: "TRX002", 
      asset: "App de Fitness Premium",
      buyer: "maria.lopez@email.com",
      amount: 8500,
      currency: "EUR",
      method: "Stripe",
      status: "Pendiente",
      date: "2024-01-14",
      fees: 425
    },
    {
      id: "TRX003",
      asset: "ecommerce-vintage.com",
      buyer: "carlos.silva@email.com", 
      amount: 5200,
      currency: "EUR",
      method: "PayPal",
      status: "En Escrow",
      date: "2024-01-12",
      fees: 260
    }
  ]

  const listings = [
    {
      id: 1,
      title: "marketing-digital.com",
      type: "Dominio",
      price: 1200,
      status: "Activo",
      views: 145,
      favorites: 23,
      offers: 3,
      created: "2024-01-10"
    },
    {
      id: 2,
      title: "Blog de Recetas Premium",
      type: "Sitio Web",
      price: 3500,
      status: "Borrador",
      views: 0,
      favorites: 0,
      offers: 0,
      created: "2024-01-15"
    },
    {
      id: 3,
      title: "App Gestión Inventario",
      type: "Software",
      price: 12000,
      status: "Activo",
      views: 89,
      favorites: 15,
      offers: 2,
      created: "2024-01-08"
    }
  ]

  const offers = [
    {
      id: 1,
      asset: "marketing-digital.com",
      buyer: "juan.garcia@email.com",
      amount: 1000,
      originalPrice: 1200,
      message: "Interesado en compra inmediata. Tengo experiencia en dominios.",
      status: "Pendiente",
      date: "2024-01-15 14:30"
    },
    {
      id: 2,
      asset: "App Gestión Inventario", 
      buyer: "tech.startup@company.com",
      amount: 10500,
      originalPrice: 12000,
      message: "Oferta seria para integrar en nuestra suite empresarial.",
      status: "Negociando",
      date: "2024-01-14 09:15"
    }
  ]

  const paymentMethods = [
    { method: "Stripe", status: "Activo", fees: "5%", icon: CreditCard },
    { method: "Bitcoin", status: "Activo", fees: "2%", icon: Bitcoin },
    { method: "PayPal", status: "Activo", fees: "5.5%", icon: Wallet },
    { method: "Banco", status: "Pendiente", fees: "3%", icon: Building }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      "Completada": "default",
      "Pendiente": "secondary", 
      "En Escrow": "outline",
      "Activo": "default",
      "Borrador": "secondary",
      "Negociando": "outline"
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Vendedor</h1>
          <p className="text-muted-foreground">Gestiona tus ventas y activos digitales</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">90 días</SelectItem>
              <SelectItem value="1y">1 año</SelectItem>
            </SelectContent>
          </Select>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Listado
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listados Activos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2 este mes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizaciones</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.3%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ofertas Pendientes</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOffers}</div>
            <div className="flex items-center text-xs text-orange-600">
              <Clock className="h-3 w-3 mr-1" />
              3 nuevas hoy
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +0.8%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.avgPrice.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -2.1%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          <TabsTrigger value="listings">Mis Listados</TabsTrigger>
          <TabsTrigger value="offers">Ofertas</TabsTrigger>
          <TabsTrigger value="payments">Métodos de Pago</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
              <CardDescription>Todas las ventas y pagos recibidos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Transacción</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Comprador</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Comisión</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono">{tx.id}</TableCell>
                      <TableCell className="font-medium">{tx.asset}</TableCell>
                      <TableCell>{tx.buyer}</TableCell>
                      <TableCell className="font-semibold">€{tx.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.method}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell className="text-muted-foreground">€{tx.fees}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>Mis Listados</CardTitle>
              <CardDescription>Gestiona tus activos digitales en venta</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Vistas</TableHead>
                    <TableHead>Favoritos</TableHead>
                    <TableHead>Ofertas</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">{listing.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{listing.type}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">€{listing.price.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(listing.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {listing.views}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {listing.favorites}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Gavel className="h-3 w-3" />
                          {listing.offers}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>Ofertas Recibidas</CardTitle>
              <CardDescription>Gestiona las ofertas de tus compradores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {offers.map((offer) => (
                <Card key={offer.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{offer.asset}</h4>
                          {getStatusBadge(offer.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>De: {offer.buyer}</span>
                          <span>{offer.date}</span>
                        </div>
                        <p className="text-sm">{offer.message}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-2xl font-bold text-primary">€{offer.amount.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Precio: €{offer.originalPrice.toLocaleString()}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Contraoferta</Button>
                          <Button size="sm">Aceptar</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago y Cobro</CardTitle>
              <CardDescription>Configura cómo recibir tus pagos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((payment, index) => {
                  const Icon = payment.icon
                  return (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-8 w-8 text-primary" />
                          <div>
                            <h4 className="font-medium">{payment.method}</h4>
                            <p className="text-sm text-muted-foreground">Comisión: {payment.fees}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(payment.status)}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
              
              <div className="mt-6">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Nuevo Método de Pago
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SellerDashboard