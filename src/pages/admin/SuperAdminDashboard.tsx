import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Shield, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Flag,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Lock,
  Unlock,
  MessageSquare,
  Package,
  CreditCard,
  Activity,
  Database,
  Server
} from "lucide-react"

const SuperAdminDashboard = () => {
  const [systemStatus, setSystemStatus] = useState({
    maintenanceMode: false,
    newRegistrations: true,
    paymentProcessing: true,
    emailNotifications: true
  })

  // Mock data - En producción vendría de Supabase con datos reales
  const systemStats = {
    totalUsers: 2847,
    activeListings: 1243,
    totalTransactions: 892,
    pendingVerifications: 23,
    totalRevenue: 1247680,
    systemUptime: "99.9%",
    dailyActiveUsers: 423,
    conversionRate: 3.2
  }

  const recentUsers = [
    {
      id: 1,
      name: "Juan García",
      email: "juan@email.com",
      type: "Vendedor",
      status: "Verificado",
      registered: "2024-01-15",
      revenue: 15600,
      flagged: false
    },
    {
      id: 2,
      name: "María López",
      email: "maria@email.com", 
      type: "Comprador",
      status: "Pendiente",
      registered: "2024-01-14",
      spent: 8500,
      flagged: true
    },
    {
      id: 3,
      name: "Tech Startup Inc",
      email: "contact@techstartup.com",
      type: "Vendedor",
      status: "Suspendido",
      registered: "2024-01-12",
      revenue: 45200,
      flagged: true
    }
  ]

  const pendingListings = [
    {
      id: 1,
      title: "luxury-brands.com",
      seller: "Premium Domains",
      type: "Dominio",
      price: 25000,
      status: "Revisión",
      submitted: "2024-01-15 14:30",
      flags: ["Alto valor", "Requiere verificación"]
    },
    {
      id: 2,
      title: "Crypto Trading Bot",
      seller: "AI Developers",
      type: "Software",
      price: 8500,
      status: "Reportado",
      submitted: "2024-01-14 09:15",
      flags: ["Contenido dudoso", "Usuario reportado"]
    }
  ]

  const systemAlerts = [
    {
      id: 1,
      type: "security",
      severity: "high",
      message: "Múltiples intentos de acceso fallidos detectados",
      time: "hace 15 min",
      resolved: false
    },
    {
      id: 2,
      type: "payment",
      severity: "medium", 
      message: "Transacción de €50,000 requiere aprobación manual",
      time: "hace 2 horas",
      resolved: false
    },
    {
      id: 3,
      type: "system",
      severity: "low",
      message: "Backup automático completado exitosamente",
      time: "hace 4 horas", 
      resolved: true
    }
  ]

  const disputesCases = [
    {
      id: "DIS001",
      buyer: "carlos.silva@email.com",
      seller: "WebShop Masters", 
      asset: "ecommerce-starter.com",
      amount: 5200,
      issue: "Activo no transferido",
      status: "En investigación",
      created: "2024-01-14",
      priority: "Alta"
    },
    {
      id: "DIS002",
      buyer: "ana.torres@email.com",
      seller: "Digital Assets Pro",
      asset: "marketing-tools.com",
      amount: 1800,
      issue: "Descripción incorrecta",
      status: "Mediación",
      created: "2024-01-13",
      priority: "Media"
    }
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      "Verificado": "default",
      "Pendiente": "secondary",
      "Suspendido": "destructive",
      "Revisión": "secondary",
      "Reportado": "destructive",
      "En investigación": "secondary",
      "Mediación": "outline"
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      "high": "text-red-600",
      "medium": "text-yellow-600", 
      "low": "text-green-600"
    }
    return colors[severity] || "text-gray-600"
  }

  const handleUserAction = (userId: number, action: string) => {
    console.log(`Acción ${action} aplicada al usuario ${userId}`)
  }

  const handleListingAction = (listingId: number, action: string) => {
    console.log(`Acción ${action} aplicada al listado ${listingId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header with Security Warning */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-destructive" />
          <div>
            <h2 className="font-semibold text-destructive">Panel de Super Administrador</h2>
            <p className="text-sm text-destructive/80">
              Acceso restringido. Todas las acciones quedan registradas en logs de auditoría.
            </p>
          </div>
        </div>
      </div>

      {/* System Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Controles del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance">Modo Mantenimiento</Label>
              <Switch
                id="maintenance"
                checked={systemStatus.maintenanceMode}
                onCheckedChange={(checked) => 
                  setSystemStatus({...systemStatus, maintenanceMode: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="registrations">Nuevos Registros</Label>
              <Switch
                id="registrations"
                checked={systemStatus.newRegistrations}
                onCheckedChange={(checked) => 
                  setSystemStatus({...systemStatus, newRegistrations: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="payments">Procesamiento Pagos</Label>
              <Switch
                id="payments"
                checked={systemStatus.paymentProcessing}
                onCheckedChange={(checked) => 
                  setSystemStatus({...systemStatus, paymentProcessing: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="emails">Notificaciones Email</Label>
              <Switch
                id="emails"
                checked={systemStatus.emailNotifications}
                onCheckedChange={(checked) => 
                  setSystemStatus({...systemStatus, emailNotifications: checked})
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.3%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listados Activos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeListings.toLocaleString()}</div>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.7%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalTransactions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +15.2%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verificaciones</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.pendingVerifications}</div>
            <div className="flex items-center text-xs text-orange-600">
              <Clock className="h-3 w-3 mr-1" />
              Pendientes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(systemStats.totalRevenue / 1000).toFixed(0)}K</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +23.1%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime Sistema</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.systemUptime}</div>
            <div className="flex items-center text-xs text-green-600">
              <Activity className="h-3 w-3 mr-1" />
              Estable
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.dailyActiveUsers}</div>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Hoy
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.conversionRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +0.3%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alertas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${
                alert.resolved ? 'bg-muted/30 border-muted' : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <Badge variant="outline">{alert.type}</Badge>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.resolved ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Button variant="ghost" size="sm">Resolver</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Gestión Usuarios</TabsTrigger>
          <TabsTrigger value="listings">Moderación Listados</TabsTrigger>
          <TabsTrigger value="disputes">Disputas</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Avanzado</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>Administra usuarios, verificaciones y permisos</CardDescription>
              <div className="flex items-center gap-2">
                <Input placeholder="Buscar usuarios..." className="max-w-sm" />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Actividad</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.registered}</TableCell>
                      <TableCell>
                        {user.type === "Vendedor" ? (
                          <span className="text-green-600">€{user.revenue?.toLocaleString()}</span>
                        ) : (
                          <span className="text-blue-600">€{user.spent?.toLocaleString()}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.flagged && <Flag className="h-4 w-4 text-red-600" />}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'suspend')}
                          >
                            <Ban className="h-4 w-4" />
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

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>Moderación de Listados</CardTitle>
              <CardDescription>Revisa y aprueba listados pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingListings.map((listing) => (
                  <Card key={listing.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{listing.title}</h4>
                            {getStatusBadge(listing.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Vendedor: {listing.seller}</span>
                            <span>Tipo: {listing.type}</span>
                            <span>{listing.submitted}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {listing.flags.map((flag, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="text-2xl font-bold">€{listing.price.toLocaleString()}</div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleListingAction(listing.id, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleListingAction(listing.id, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprobar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Disputas</CardTitle>
              <CardDescription>Resuelve conflictos entre compradores y vendedores</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Disputa</TableHead>
                    <TableHead>Partes Involucradas</TableHead>
                    <TableHead>Activo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Problema</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputesCases.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-mono">{dispute.id}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Comprador: {dispute.buyer}</div>
                          <div>Vendedor: {dispute.seller}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{dispute.asset}</TableCell>
                      <TableCell className="font-semibold">€{dispute.amount.toLocaleString()}</TableCell>
                      <TableCell>{dispute.issue}</TableCell>
                      <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                      <TableCell>
                        <Badge variant={dispute.priority === "Alta" ? "destructive" : "secondary"}>
                          {dispute.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="h-4 w-4" />
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

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Avanzado</CardTitle>
              <CardDescription>Métricas detalladas del sistema y comportamiento de usuarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Métricas de Rendimiento</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tiempo promedio de carga</span>
                      <span className="font-medium">1.2s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tasa de error</span>
                      <span className="font-medium text-green-600">0.02%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime mensual</span>
                      <span className="font-medium">99.97%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Métricas de Negocio</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Comisión promedio</span>
                      <span className="font-medium">€187</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tiempo resolución disputas</span>
                      <span className="font-medium">2.3 días</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Satisfacción usuarios</span>
                      <span className="font-medium text-green-600">4.7/5</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Reporte
                </Button>
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Sistema
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar Datos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SuperAdminDashboard