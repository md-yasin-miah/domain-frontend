import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Heart, 
  Search,
  Eye,
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Gavel,
  CreditCard,
  Bitcoin,
  Wallet,
  Building,
  Edit,
  Trash2,
  Filter,
  ExternalLink,
  Shield
} from "lucide-react"

const BuyerDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  // Mock data - En producción vendría de Supabase
  const stats = {
    totalPurchases: 8,
    totalSpent: 15680,
    activeBids: 5,
    favorites: 23,
    avgPrice: 1960,
    savings: 2340
  }

  const purchases = [
    {
      id: "PUR001",
      asset: "marketing-pro.com",
      seller: "Digital Assets Pro",
      amount: 2500,
      method: "Bitcoin",
      status: "Completada",
      date: "2024-01-15",
      rating: 5
    },
    {
      id: "PUR002", 
      asset: "ecommerce-starter.com",
      seller: "WebShop Masters",
      amount: 5200,
      method: "Stripe",
      status: "En Transferencia",
      date: "2024-01-12",
      rating: null
    },
    {
      id: "PUR003",
      asset: "App Fitness Tracker",
      seller: "MobileDevs Inc",
      amount: 8500,
      method: "PayPal",
      status: "En Escrow",
      date: "2024-01-10",
      rating: null
    }
  ]

  const activeBids = [
    {
      id: 1,
      asset: "luxury-brands.com",
      currentBid: 3500,
      myBid: 3200,
      timeLeft: "2d 14h",
      status: "Superado",
      seller: "Premium Domains"
    },
    {
      id: 2,
      asset: "SaaS Analytics Tool",
      currentBid: 12000,
      myBid: 12000,
      timeLeft: "5h 23m",
      status: "Ganando",
      seller: "TechStartup Solutions"
    },
    {
      id: 3,
      asset: "blog-recetas-premium.com",
      currentBid: 1800,
      myBid: 1600,
      timeLeft: "1d 8h",
      status: "Superado",
      seller: "Content Creators"
    }
  ]

  const favorites = [
    {
      id: 1,
      title: "fashion-store.com",
      type: "E-commerce",
      price: 8500,
      traffic: "25K/mes",
      seller: "Fashion Empire",
      added: "2024-01-10"
    },
    {
      id: 2,
      title: "AI Content Generator",
      type: "SaaS",
      price: 45000,
      traffic: "1K usuarios",
      seller: "AI Innovations",
      added: "2024-01-08"
    },
    {
      id: 3,
      title: "crypto-news.com",
      type: "Dominio",
      price: 3200,
      traffic: "N/A",
      seller: "Domain Vault",
      added: "2024-01-05"
    }
  ]

  const paymentMethods = [
    { method: "Tarjeta ****1234", status: "Principal", type: "Visa", icon: CreditCard },
    { method: "PayPal", status: "Verificado", type: "PayPal", icon: Wallet },
    { method: "Bitcoin Wallet", status: "Conectado", type: "BTC", icon: Bitcoin },
    { method: "Cuenta Bancaria", status: "Pendiente", type: "IBAN", icon: Building }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      "Completada": "default",
      "En Transferencia": "secondary", 
      "En Escrow": "outline",
      "Ganando": "default",
      "Superado": "destructive",
      "Principal": "default",
      "Verificado": "default",
      "Conectado": "outline",
      "Pendiente": "secondary"
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const getBidStatusColor = (status: string) => {
    return status === "Ganando" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Panel de Comprador</h1>
          <p className="text-muted-foreground">Gestiona tus compras y activos favoritos</p>
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
            <Search className="h-4 w-4" />
            Explorar Marketplace
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Compras</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPurchases}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2 este mes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gastado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalSpent.toLocaleString()}</div>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +€8.5K este mes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pujas Activas</CardTitle>
            <Gavel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBids}</div>
            <div className="flex items-center text-xs text-orange-600">
              <Clock className="h-3 w-3 mr-1" />
              2 terminan hoy
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favorites}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +5 esta semana
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
              -€340
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ahorros</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.savings.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              vs precios originales
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="purchases" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="purchases">Mis Compras</TabsTrigger>
          <TabsTrigger value="bids">Pujas Activas</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="payments">Métodos de Pago</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Compras</CardTitle>
              <CardDescription>Todos tus activos digitales adquiridos</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Compra</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Valoración</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-mono">{purchase.id}</TableCell>
                      <TableCell className="font-medium">{purchase.asset}</TableCell>
                      <TableCell>{purchase.seller}</TableCell>
                      <TableCell className="font-semibold">€{purchase.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{purchase.method}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                      <TableCell>{purchase.date}</TableCell>
                      <TableCell>
                        {purchase.rating ? (
                          <div className="flex items-center gap-1">
                            {Array.from({length: purchase.rating}).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm">Valorar</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids">
          <Card>
            <CardHeader>
              <CardTitle>Pujas Activas</CardTitle>
              <CardDescription>Seguimiento de tus ofertas en curso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeBids.map((bid) => (
                <Card key={bid.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{bid.asset}</h4>
                          <Badge variant={bid.status === "Ganando" ? "default" : "destructive"}>
                            {bid.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Vendedor: {bid.seller}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {bid.timeLeft}
                          </span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Mi puja</div>
                          <div className="text-xl font-bold">€{bid.myBid.toLocaleString()}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Puja actual</div>
                          <div className={`text-lg font-semibold ${getBidStatusColor(bid.status)}`}>
                            €{bid.currentBid.toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Aumentar Puja</Button>
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Activos Favoritos</CardTitle>
              <CardDescription>Tus activos guardados para seguimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Tráfico/Usuarios</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Agregado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {favorites.map((fav) => (
                    <TableRow key={fav.id}>
                      <TableCell className="font-medium">{fav.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{fav.type}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">€{fav.price.toLocaleString()}</TableCell>
                      <TableCell>{fav.traffic}</TableCell>
                      <TableCell>{fav.seller}</TableCell>
                      <TableCell>{fav.added}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Gavel className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>Gestiona tus formas de pago</CardDescription>
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
                            <p className="text-sm text-muted-foreground">{payment.type}</p>
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
                  <CreditCard className="h-4 w-4 mr-2" />
                  Agregar Nuevo Método de Pago
                </Button>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h4 className="font-medium">Pagos Seguros</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Todos los pagos están protegidos por nuestro sistema de custodia. 
                  Tus fondos se mantienen seguros hasta que confirmes la recepción del activo.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BuyerDashboard