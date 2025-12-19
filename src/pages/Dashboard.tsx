import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Users, 
  Plus,
  Eye,
  MessageSquare,
  Clock,
  LogIn,
  UserPlus,
  ArrowRight
} from "lucide-react"
import { useTranslation } from 'react-i18next'
import { Link } from "react-router-dom"

const Dashboard = () => {
  const { t } = useTranslation();
  // Simulamos que el usuario NO está autenticado
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">{t('dashboard.access')}</CardTitle>
            <CardDescription>
              {t('auth.login_or_register')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full flex items-center gap-2" size="lg">
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
                {t('nav.login')}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full flex items-center gap-2" size="lg">
              <Link to="/auth">
                <UserPlus className="h-4 w-4" />
                {t('dashboard.create_account')}
              </Link>
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <p>{t('dashboard.no_account')}</p>
              <p className="mt-2">
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link to="/marketplace">
                    {t('dashboard.explore_marketplace')}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Resto del código del dashboard para usuarios autenticados...
  const myListings = [
    {
      id: 1,
      title: "marketing-digital.com",
      type: "Dominio",
      price: "€1,200",
      status: "Activo",
      views: 45,
      offers: 3
    },
    {
      id: 2,
      title: "Blog de Recetas",
      type: "Sitio Web",
      price: "€3,500",
      status: "Pendiente",
      views: 12,
      offers: 0
    }
  ]

  const recentActivity = [
    { action: "Nueva oferta recibida", item: "marketing-digital.com", time: "hace 2 horas" },
    { action: "Listado aprobado", item: "Blog de Recetas", time: "hace 1 día" },
    { action: "Mensaje recibido", item: "App de Fitness", time: "hace 2 días" }
  ]

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('dashboard.my_dashboard')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('dashboard.create_listing')}
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_revenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€8,420</div>
            <p className="text-xs text-muted-foreground">
              +12% {t('dashboard.revenue_increase')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.active_listings')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              2 {t('dashboard.pending_approval')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.views')}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +8% {t('dashboard.increase_this_week')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.offers_received')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              3 {t('dashboard.new_today')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis Listados */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.my_listings')}</CardTitle>
            <CardDescription>
              {t('dashboard.manage_assets')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{listing.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{listing.type}</Badge>
                      <Badge variant={listing.status === 'Activo' ? 'default' : 'secondary'}>
                        {listing.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {listing.views} {t('dashboard.views_count')} • {listing.offers} {t('dashboard.offers_count')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{listing.price}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      {t('dashboard.manage')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recent_activity')}</CardTitle>
            <CardDescription>
              {t('dashboard.latest_actions')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    {activity.action.includes('oferta') ? <DollarSign className="h-4 w-4 text-primary" /> :
                     activity.action.includes('mensaje') ? <MessageSquare className="h-4 w-4 text-primary" /> :
                     <Package className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard