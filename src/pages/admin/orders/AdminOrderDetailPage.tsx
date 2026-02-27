import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  User,
  DollarSign,
  FileText,
  Loader2,
  Calendar,
  ShoppingCart,
  Receipt,
  CreditCard,
  Shield,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useGetOrderQuery, useCancelOrderMutation } from "@/store/api/ordersApi";
import { useGetInvoiceByOrderQuery } from "@/store/api/invoiceApi";
import { useGetPaymentByOrderQuery } from "@/store/api/paymentsApi";
import { useGetEscrowByOrderQuery } from "@/store/api/escrowApi";
import {
  formatCurrency,
  timeFormat,
  getStatusColor,
  getStatusLabel,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminOrderDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const orderId = id ? parseInt(id, 10) : 0;
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { data: order, isLoading, error, refetch } = useGetOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });
  const { data: invoice } = useGetInvoiceByOrderQuery(orderId, { skip: !orderId || isNaN(orderId) });
  const { data: payment } = useGetPaymentByOrderQuery(orderId, { skip: !orderId || isNaN(orderId) });
  const { data: escrow } = useGetEscrowByOrderQuery(orderId, { skip: !orderId || isNaN(orderId) });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();


  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      await cancelOrder(order.id).unwrap();
      toast({ title: t("orders.details.cancel_success") });
      setCancelDialogOpen(false);
      refetch();
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "data" in e ? (e as { data?: { detail?: string } }).data?.detail : t("orders.details.cancel_error_desc");
      toast({ title: msg as string, variant: "destructive" });
    }
  };

  if (isLoading || !orderId) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <EmptyState
        variant="error"
        title={t("orders.details.error.title")}
        description={t("orders.details.error.description")}
        actionLabel={t("admin.orders.back_to_list")}
        onAction={() => navigate(ROUTES.ADMIN.ORDERS.LIST)}
      />
    );
  }

  const feePercentage = order.listing_price
    ? ((Number(order.platform_fee) / Number(order.listing_price)) * 100).toFixed(1)
    : "0";

  const navCards = [
    {
      title: t("admin.orders.invoice"),
      description: invoice ? `${t("admin.orders.invoice_number")}: ${invoice.invoice_number}` : t("admin.orders.view_invoice"),
      href: ROUTES.ADMIN.ORDERS.INVOICES(order.id),
      icon: FileText,
      hasData: !!invoice,
    },
    {
      title: t("admin.orders.payment"),
      description: payment ? `${t("admin.orders.payment_id")}: ${payment.id}` : t("admin.orders.view_payment"),
      href: ROUTES.ADMIN.ORDERS.PAYMENTS(order.id),
      icon: CreditCard,
      hasData: !!payment,
    },
    {
      title: t("admin.orders.escrow"),
      description: escrow ? `${t("admin.orders.escrow_number")}: ${escrow.escrow_number}` : t("admin.orders.view_escrow"),
      href: ROUTES.ADMIN.ORDERS.ESCROWS(order.id),
      icon: Shield,
      hasData: !!escrow,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          to={ROUTES.ADMIN.ORDERS.LIST}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("admin.orders.back_to_list")}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{order.order_number}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary/10 border border-border flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("admin.orders.order_view")}</h1>
            <p className="text-muted-foreground">{order.order_number} · ID #{order.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={cn("capitalize", getStatusColor(order.status))}>
            {getStatusLabel(order.status, t)}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t("orders.details.final_price")}</p>
              <p className="text-xl font-semibold">{formatCurrency(order.final_price)}</p>
              <p className="text-xs text-muted-foreground">{order.currency}</p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t("orders.details.listing_price")}</p>
              <p className="text-xl font-semibold">{formatCurrency(order.listing_price)}</p>
              <p className="text-xs text-muted-foreground">{order.currency}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t("orders.details.platform_fee")}</p>
              <p className="text-xl font-semibold">{formatCurrency(order.platform_fee)}</p>
              <p className="text-xs text-muted-foreground">{feePercentage}%</p>
            </div>
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t("orders.details.created_at")}</p>
              <p className="text-sm font-semibold">{timeFormat(order.created_at, "MMM DD, YYYY")}</p>
              <p className="text-xs text-muted-foreground">{timeFormat(order.created_at, "HH:mm")}</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t("orders.details.order_information")}
              </CardTitle>
              <CardDescription>{t("orders.details.order_information_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <label className="text-xs text-muted-foreground">{t("orders.details.order_id")}</label>
                  <p className="font-semibold">#{order.id}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <label className="text-xs text-muted-foreground">{t("orders.details.order_number")}</label>
                  <p className="font-semibold">{order.order_number}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <label className="text-xs text-muted-foreground">{t("orders.details.created_at")}</label>
                  <p className="font-semibold">{timeFormat(order.created_at, "MMM DD, YYYY HH:mm")}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <label className="text-xs text-muted-foreground">{t("orders.details.updated_at")}</label>
                  <p className="font-semibold">{timeFormat(order.updated_at, "MMM DD, YYYY HH:mm")}</p>
                </div>
              </div>
              {order.paid_at && (
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <label className="text-xs text-muted-foreground">{t("orders.details.paid_at")}</label>
                  <p className="font-semibold">{timeFormat(order.paid_at, "MMM DD, YYYY HH:mm")}</p>
                </div>
              )}
              {order.cancellation_reason && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <label className="text-xs text-muted-foreground">{t("orders.details.cancellation_reason")}</label>
                  <p className="text-sm">{order.cancellation_reason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("orders.details.parties_information")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">{t("orders.details.buyer")}</p>
                  <p className="font-semibold">{order.buyer?.username || order.buyer?.email || "—"}</p>
                  {order.buyer?.email && <p className="text-sm text-muted-foreground">{order.buyer.email}</p>}
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">{t("orders.details.seller")}</p>
                  <p className="font-semibold">{order.seller?.username || order.seller?.email || "—"}</p>
                  {order.seller?.email && <p className="text-sm text-muted-foreground">{order.seller.email}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Quick links + Pricing */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("admin.orders.related_sections")}</CardTitle>
              <CardDescription>{t("admin.orders.related_sections_desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {navCards.map((item) => (
                <Button key={item.href} variant="ghost" className="w-full justify-between h-auto py-3" asChild>
                  <Link to={item.href}>
                    <div className="flex items-center gap-3 text-left">
                      <item.icon className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t("orders.details.pricing_summary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("orders.details.listing_price")}</span>
                <span>{formatCurrency(order.listing_price)} {order.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("orders.details.platform_fee")}</span>
                <span>{formatCurrency(order.platform_fee)} {order.currency}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>{t("orders.details.final_price")}</span>
                <span className="text-primary">{formatCurrency(order.final_price)} {order.currency}</span>
              </div>
              {order.seller_amount != null && (
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-muted-foreground">{t("orders.details.seller_amount")}</span>
                  <span>{formatCurrency(order.seller_amount)} {order.currency}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("orders.details.cancel_order")}</AlertDialogTitle>
            <AlertDialogDescription>{t("orders.details.cancel_confirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder} className="bg-destructive text-destructive-foreground">
              {isCancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {t("common.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
