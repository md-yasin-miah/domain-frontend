import { useState, useMemo } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetAdminDashboardQuery } from "@/store/api/dashboardApi"
import { useDeactivateUserMutation } from "@/store/api/userApi"
import { useUpdateMarketplaceListingMutation } from "@/store/api/marketplaceApi"
import { useResolveDisputeMutation } from "@/store/api/disputesApi"
import {
  useLazyExportListingsQuery,
  useLazyExportOrdersQuery,
} from "@/store/api/exportApi"
import { ROUTES } from "@/lib/routes"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  Download,
  Search,
  RefreshCw,
  MessageSquare,
  Package,
  CreditCard,
  Activity,
  Loader2,
} from "lucide-react"

const PERIOD_DAYS = 30
const LIMIT_RECENT = 10

const STATUS_TO_KEY: Record<string, string> = {
  Verificado: "status_verified",
  Pendiente: "status_pending",
  Suspendido: "status_suspended",
  Revisión: "status_review",
  Reportado: "status_reported",
  "En investigación": "status_investigation",
  Mediación: "status_mediation",
}

const ADMIN_DASH_TAB_VALUES = ["users", "listings", "disputes", "analytics"] as const
type AdminDashTab = (typeof ADMIN_DASH_TAB_VALUES)[number]

function parseAdminDashTabParam(raw: string | null): AdminDashTab {
  if (raw && (ADMIN_DASH_TAB_VALUES as readonly string[]).includes(raw)) {
    return raw as AdminDashTab
  }
  return "users"
}

const SuperAdminDashboard = () => {
  const { t } = useTranslation()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = useMemo(
    () => parseAdminDashTabParam(searchParams.get("tab")),
    [searchParams],
  )

  const setDashboardTab = (value: string) => {
    const tab = parseAdminDashTabParam(value)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (tab === "users") {
          next.delete("tab")
        } else {
          next.set("tab", tab)
        }
        return next
      },
      { replace: true },
    )
  }

  const [suspendUserId, setSuspendUserId] = useState<number | null>(null)
  const [listingMutating, setListingMutating] = useState<{
    id: number
    action: "active" | "suspended"
  } | null>(null)
  const [resolveDisputeId, setResolveDisputeId] = useState<number | null>(null)
  const [resolveNotes, setResolveNotes] = useState("")
  const [resolveAction, setResolveAction] = useState<string>("")

  const { data, isLoading, isError, refetch } = useGetAdminDashboardQuery({
    days: PERIOD_DAYS,
    limit_recent: LIMIT_RECENT,
  })

  const [deactivateUser, { isLoading: isDeactivating }] = useDeactivateUserMutation()
  const [updateListing, { isLoading: isUpdatingListing }] = useUpdateMarketplaceListingMutation()
  const [resolveDispute, { isLoading: isResolvingDispute }] = useResolveDisputeMutation()
  const [triggerExportListings, { isFetching: isExportingListings }] = useLazyExportListingsQuery()
  const [triggerExportOrders, { isFetching: isExportingOrders }] = useLazyExportOrdersQuery()

  const stats = data?.stats
  const recentListings = data?.recent_listings ?? []
  const recentOrders = data?.recent_orders ?? []
  const recentSupportTickets = data?.recent_support_tickets ?? []
  const recentDisputes = data?.recent_disputes ?? []

  const systemAlerts = useMemo(() => {
    const alerts: Array<{
      id: number | string
      type: string
      severity: "high" | "medium" | "low"
      message: string
      time: string
      resolved: boolean
    }> = []
    if (stats) {
      if (stats.open_support_tickets > 0) {
        alerts.push({
          id: stats.open_support_tickets,
          type: "support",
          severity: stats.open_support_tickets > 5 ? "high" : "medium",
          message: t("super_admin.support_tickets_alert", { count: stats.open_support_tickets }),
          time: "",
          resolved: false,
        })
      }
      if (stats.open_disputes > 0) {
        alerts.push({
          id: stats.open_disputes,
          type: "dispute",
          severity: "high",
          message: t("super_admin.disputes_alert", { count: stats.open_disputes }),
          time: "",
          resolved: false,
        })
      }
      if (stats.pending_withdrawals > 0) {
        alerts.push({
          id: "withdrawals",
          type: "payment",
          severity: "medium",
          message: t("super_admin.withdrawals_alert", { count: stats.pending_withdrawals }),
          time: "",
          resolved: false,
        })
      }
      if (alerts.length === 0) {
        alerts.push({
          id: "ok",
          type: "system",
          severity: "low",
          message: t("super_admin.no_critical_alerts"),
          time: "",
          resolved: true,
        })
      }
    }
    return alerts
  }, [stats, t])

  const recentActivityUsers = useMemo(() => {
    const orders = data?.recent_orders ?? []
    const seen = new Set<number>()
    const list: Array<{ id: number; name: string; email: string; role: "buyer" | "seller" }> = []
    for (const o of orders) {
      if (o.buyer && !seen.has(o.buyer.id)) {
        seen.add(o.buyer.id)
        list.push({
          id: o.buyer.id,
          name: o.buyer.username,
          email: o.buyer.email ?? "",
          role: "buyer",
        })
      }
      if (o.seller && !seen.has(o.seller.id)) {
        seen.add(o.seller.id)
        list.push({
          id: o.seller.id,
          name: o.seller.username,
          email: o.seller.email ?? "",
          role: "seller",
        })
      }
    }
    return list.slice(0, 10)
  }, [data?.recent_orders])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Verificado: "default",
      Pendiente: "secondary",
      Suspendido: "destructive",
      Revisión: "secondary",
      Reportado: "destructive",
      "En investigación": "secondary",
      Mediación: "outline",
      // API listing / dispute statuses (backend)
      draft: "secondary",
      active: "default",
      pending: "secondary",
      sold: "outline",
      expired: "outline",
      suspended: "destructive",
      open: "secondary",
      in_review: "secondary",
      resolved: "default",
      closed: "outline",
      rejected: "destructive",
    }
    const key = STATUS_TO_KEY[status]
    const label = key ? t(`super_admin.${key}`) : status.replace(/_/g, " ")
    return <Badge variant={variants[status] || "secondary"}>{label}</Badge>
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      "high": "text-red-600",
      "medium": "text-yellow-600", 
      "low": "text-green-600"
    }
    return colors[severity] || "text-gray-600"
  }

  const confirmDeactivateUser = async () => {
    if (suspendUserId == null) return
    try {
      await deactivateUser(suspendUserId).unwrap()
      toast({
        title: t("super_admin.user_deactivated", "User deactivated"),
      })
      setSuspendUserId(null)
      await refetch()
    } catch {
      toast({
        title: t("common.error", "Error"),
        description: t("super_admin.user_deactivate_failed", "Could not deactivate user"),
        variant: "destructive",
      })
    }
  }

  const handleListingStatus = async (listingId: number, status: "active" | "suspended") => {
    setListingMutating({ id: listingId, action: status })
    try {
      await updateListing({ id: listingId, data: { status } }).unwrap()
      toast({
        title:
          status === "active"
            ? t("super_admin.listing_activated", "Listing set to active")
            : t("super_admin.listing_suspended", "Listing suspended"),
      })
      await refetch()
    } catch {
      toast({
        title: t("common.error", "Error"),
        description: t("super_admin.listing_update_failed", "Could not update listing"),
        variant: "destructive",
      })
    } finally {
      setListingMutating(null)
    }
  }

  const submitResolveDispute = async () => {
    if (resolveDisputeId == null || !resolveNotes.trim()) return
    try {
      await resolveDispute({
        id: resolveDisputeId,
        resolution: resolveNotes.trim(),
        resolution_action: resolveAction.trim() || undefined,
      }).unwrap()
      toast({ title: t("admin.disputes.resolved", "Dispute resolved") })
      setResolveDisputeId(null)
      setResolveNotes("")
      setResolveAction("")
      await refetch()
    } catch {
      toast({
        title: t("common.error", "Error"),
        variant: "destructive",
      })
    }
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportListings = async () => {
    try {
      const blob = await triggerExportListings({}).unwrap()
      downloadBlob(blob, `listings_export_${Date.now()}.csv`)
      toast({ title: t("super_admin.export_ready", "Export downloaded") })
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" })
    }
  }

  const handleExportOrders = async () => {
    try {
      const blob = await triggerExportOrders({}).unwrap()
      downloadBlob(blob, `orders_export_${Date.now()}.csv`)
      toast({ title: t("super_admin.export_ready", "Export downloaded") })
    } catch {
      toast({ title: t("common.error", "Error"), variant: "destructive" })
    }
  }

  const formatDate = (s: string | null) =>
    s ? new Date(s).toLocaleDateString(undefined, { dateStyle: "short" }) : "—"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">{t("super_admin.error_load_panel")}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("super_admin.retry")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* System Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("super_admin.total_users")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.total_users ?? 0).toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {t("super_admin.last_days", { count: data.period_days })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("super_admin.active_listings")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.active_listings ?? 0).toLocaleString()}</div>
            <div className="flex items-center text-xs text-blue-600">
              {t("super_admin.of_total", { total: stats?.total_listings ?? 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("super_admin.transactions")}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.total_orders ?? 0).toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              {t("super_admin.completed_count", { count: stats?.completed_orders ?? 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("super_admin.support_open")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.open_support_tickets ?? 0)}</div>
            <div className="flex items-center text-xs text-orange-600">
              {t("super_admin.of_tickets", { count: stats?.total_support_tickets ?? 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("super_admin.revenue_period")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.revenue_in_period != null
                ? `${(stats.revenue_in_period / 1000).toFixed(1)}K`
                : "—"}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              {t("super_admin.days", { count: data.period_days })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("super_admin.disputes_open")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.open_disputes ?? 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {t("super_admin.of_total", { total: stats?.total_disputes ?? 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("super_admin.pending_offers")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.pending_offers ?? 0)}</div>
            <div className="flex items-center text-xs text-blue-600">
              {t("super_admin.of_offers", { count: stats?.total_offers ?? 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("super_admin.reviews")}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats?.total_reviews ?? 0)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {t("super_admin.total")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {t("super_admin.system_alerts")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("super_admin.loading_alerts")}</p>
            ) : (
            systemAlerts.map((alert) => (
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
                      <Link to={
                        alert.type === "support" ? ROUTES.ADMIN.SUPPORT : ROUTES.ADMIN.DISPUTES}
                      >
                      <Button variant="ghost" size="sm">{t("super_admin.resolve")}</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setDashboardTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">{t("super_admin.tab_users")}</TabsTrigger>
          <TabsTrigger value="listings">{t("super_admin.tab_listings")}</TabsTrigger>
          <TabsTrigger value="disputes">{t("super_admin.tab_disputes")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("super_admin.tab_analytics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>{t("super_admin.user_management")}</CardTitle>
              <CardDescription>
                {t("super_admin.user_management_desc", { count: (stats?.total_users ?? 0) })}
              </CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={ROUTES.ADMIN.USERS.LIST}>
                    <Search className="h-4 w-4 mr-2" />
                    {t("super_admin.open_user_directory", "Search & filter users")}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("super_admin.refresh")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("super_admin.user")}</TableHead>
                    <TableHead>{t("super_admin.type")}</TableHead>
                    <TableHead>{t("super_admin.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivityUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        {t("super_admin.no_recent_orders_activity")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentActivityUsers.map((user) => (
                      <TableRow key={`${user.id}-${user.role}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role === "seller" ? t("super_admin.seller") : t("super_admin.buyer")}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild title={t("super_admin.view_profile", "View user")}>
                              <Link to={ROUTES.ADMIN.USERS.DETAILS(user.id)}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title={t("super_admin.deactivate_user", "Deactivate user")}
                              onClick={() => setSuspendUserId(user.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" aria-label={t("super_admin.more_actions", "More")}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={ROUTES.ADMIN.USERS.DETAILS(user.id)}>
                                    {t("super_admin.user_details", "User details")}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to={ROUTES.ADMIN.USERS.LIST}>{t("super_admin.all_users", "All users")}</Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>{t("super_admin.listing_moderation")}</CardTitle>
              <CardDescription>{t("super_admin.recent_listings_count", { count: recentListings.length })}</CardDescription>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={ROUTES.ADMIN.LISTINGS_MANAGEMENT}>
                    {t("super_admin.all_listings", "All listings")}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("super_admin.refresh")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentListings.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center">{t("super_admin.no_recent_listings")}</p>
                ) : (
                  recentListings.map((listing) => (
                    <Card key={listing.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`${ROUTES.ADMIN.LISTINGS_MANAGEMENT}/view/${listing.id}`}
                                className="font-semibold hover:underline"
                              >
                                {listing.title}
                              </Link>
                              {getStatusBadge(listing.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{t("super_admin.seller_id", { id: listing.seller_id })}</span>
                              <span>{formatDate(listing.created_at)}</span>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div className="text-2xl font-bold">
                              {listing.currency} {listing.price.toLocaleString()}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={
                                  (listingMutating?.id === listing.id && isUpdatingListing) ||
                                  listing.status === "suspended"
                                }
                                onClick={() => handleListingStatus(listing.id, "suspended")}
                              >
                                {listingMutating?.id === listing.id &&
                                listingMutating.action === "suspended" &&
                                isUpdatingListing ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1" />
                                    {t("super_admin.suspend_listing", "Suspend")}
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                disabled={
                                  (listingMutating?.id === listing.id && isUpdatingListing) ||
                                  listing.status === "active"
                                }
                                onClick={() => handleListingStatus(listing.id, "active")}
                              >
                                {listingMutating?.id === listing.id &&
                                listingMutating.action === "active" &&
                                isUpdatingListing ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    {t("super_admin.publish_active", "Set active")}
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>{t("super_admin.dispute_management")}</CardTitle>
              <CardDescription>
                {t("super_admin.recent_disputes_open", { count: stats?.open_disputes ?? 0 })}
              </CardDescription>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={ROUTES.ADMIN.DISPUTES}>{t("super_admin.all_disputes", "All disputes")}</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("super_admin.refresh")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("super_admin.dispute_id")}</TableHead>
                    <TableHead>{t("super_admin.order")}</TableHead>
                    <TableHead>{t("super_admin.state")}</TableHead>
                    <TableHead>{t("super_admin.date")}</TableHead>
                    <TableHead>{t("super_admin.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDisputes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        {t("super_admin.no_recent_disputes")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentDisputes.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell className="font-mono">{dispute.id}</TableCell>
                        <TableCell>
                          <Link
                            to={ROUTES.ADMIN.ORDERS.DETAILS(dispute.order_id)}
                            className="text-primary hover:underline"
                          >
                            {t("super_admin.order_number", { id: dispute.order_id })}
                          </Link>
                        </TableCell>
                        <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                        <TableCell>{formatDate(dispute.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              title={t("super_admin.open_dispute_thread", "Open in disputes")}
                              onClick={() =>
                                navigate(ROUTES.ADMIN.DISPUTES, {
                                  state: { focusDisputeId: dispute.id },
                                })
                              }
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" asChild title={t("super_admin.view_order", "View order")}>
                              <Link to={ROUTES.ADMIN.ORDERS.DETAILS(dispute.order_id)}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {dispute.status !== "resolved" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                title={t("super_admin.resolve_dispute", "Resolve dispute")}
                                onClick={() => setResolveDisputeId(dispute.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>{t("super_admin.analytics_title")}</CardTitle>
              <CardDescription>
                {t("super_admin.analytics_desc", { count: data.period_days })}
              </CardDescription>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("super_admin.refresh_data")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">{t("super_admin.period_summary")}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t("super_admin.total_users")}</span>
                      <span className="font-medium">{(stats?.total_users ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("super_admin.total_listings_active")}</span>
                      <span className="font-medium">
                        {(stats?.total_listings ?? 0)} / {(stats?.active_listings ?? 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("super_admin.completed_orders")}</span>
                      <span className="font-medium text-green-600">
                        {(stats?.completed_orders ?? 0)} {t("super_admin.of_payments", { total: stats?.total_orders ?? 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("super_admin.revenue_period_label")}</span>
                      <span className="font-medium">
                        {stats?.revenue_in_period != null
                          ? `${stats.revenue_in_period.toLocaleString()}`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">{t("super_admin.support_disputes")}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t("super_admin.open_tickets")}</span>
                      <span className="font-medium">{(stats?.open_support_tickets ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("super_admin.open_disputes")}</span>
                      <span className="font-medium">{(stats?.open_disputes ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("super_admin.payments_paid")}</span>
                      <span className="font-medium text-green-600">
                        {(stats?.paid_payments ?? 0)} {t("super_admin.of_payments", { total: stats?.total_payments ?? 0 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("super_admin.pending_withdrawals")}</span>
                      <span className="font-medium">{(stats?.pending_withdrawals ?? 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {data.graphs && (
                <div className="mt-6 space-y-2">
                  <h4 className="font-semibold">{t("super_admin.time_series_daily")}</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {t("super_admin.users_days_data", { count: data.graphs.users?.length ?? 0 })}
                    </span>
                    <span className="text-muted-foreground">
                      {t("super_admin.listings_days", { count: data.graphs.listings?.length ?? 0 })}
                    </span>
                    <span className="text-muted-foreground">
                      {t("super_admin.orders_days", { count: data.graphs.orders?.length ?? 0 })}
                    </span>
                    <span className="text-muted-foreground">
                      {t("super_admin.revenue_days", { count: data.graphs.revenue?.length ?? 0 })}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  disabled={isExportingListings}
                  onClick={() => void handleExportListings()}
                >
                  {isExportingListings ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {t("super_admin.export_listings_csv", "Export listings (CSV)")}
                </Button>
                <Button
                  variant="outline"
                  disabled={isExportingOrders}
                  onClick={() => void handleExportOrders()}
                >
                  {isExportingOrders ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {t("super_admin.export_orders_csv", "Export orders (CSV)")}
                </Button>
                <Button variant="outline" asChild>
                  <Link to={ROUTES.ADMIN.REPORTS.OVERVIEW}>
                    <Activity className="h-4 w-4 mr-2" />
                    {t("super_admin.open_reports", "Full reports")}
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("super_admin.refresh_data")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={suspendUserId != null} onOpenChange={(open) => !open && setSuspendUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("super_admin.confirm_deactivate", "Deactivate user?")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "super_admin.confirm_deactivate_desc",
                "Calls PUT /users/{id}/deactivate. The user will not be able to sign in until reactivated."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel", "Cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDeactivateUser()} disabled={isDeactivating}>
              {isDeactivating ? <Loader2 className="h-4 w-4 animate-spin" /> : t("super_admin.deactivate", "Deactivate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={resolveDisputeId != null}
        onOpenChange={(open) => {
          if (!open) {
            setResolveDisputeId(null)
            setResolveNotes("")
            setResolveAction("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("super_admin.resolve_dispute_title", "Resolve dispute")}</DialogTitle>
            <DialogDescription>
              {t(
                "super_admin.resolve_dispute_api_hint",
                "Submits POST /disputes/{id}/resolve with your resolution notes (admin only)."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="resolve-notes">{t("admin.disputes.resolution", "Resolution")}</Label>
              <Textarea
                id="resolve-notes"
                value={resolveNotes}
                onChange={(e) => setResolveNotes(e.target.value)}
                rows={4}
                placeholder={t("super_admin.resolution_placeholder", "Describe the resolution…")}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("super_admin.resolution_action_optional", "Resolution action (optional)")}</Label>
              <Select value={resolveAction || "__none__"} onValueChange={(v) => setResolveAction(v === "__none__" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("common.select", "Select")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t("common.none", "None")}</SelectItem>
                  <SelectItem value="refund">refund</SelectItem>
                  <SelectItem value="partial_refund">partial_refund</SelectItem>
                  <SelectItem value="no_action">no_action</SelectItem>
                  <SelectItem value="ban">ban</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResolveDisputeId(null)
                setResolveNotes("")
                setResolveAction("")
              }}
            >
              {t("common.cancel", "Cancel")}
            </Button>
            <Button
              disabled={!resolveNotes.trim() || isResolvingDispute}
              onClick={() => void submitResolveDispute()}
            >
              {isResolvingDispute ? <Loader2 className="h-4 w-4 animate-spin" /> : t("admin.disputes.resolve", "Resolve")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SuperAdminDashboard