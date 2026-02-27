import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Shield,
  Loader2,
  Calendar,
  DollarSign,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { useGetOrderQuery } from "@/store/api/ordersApi";
import { useGetEscrowByOrderQuery } from "@/store/api/escrowApi";
import { formatCurrency, timeFormat, getStatusColor, getStatusLabel } from "@/lib/helperFun";
import { ROUTES } from "@/lib/routes";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";

export default function AdminOrderEscrowPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : 0;

  const { data: order, isLoading: orderLoading, error: orderError } = useGetOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });
  const { data: escrow, isLoading: escrowLoading } = useGetEscrowByOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });

  const isLoading = orderLoading || escrowLoading;

  if (isLoading && !order) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <EmptyState
        variant="error"
        title={t("orders.details.error.title")}
        description={t("orders.details.error.description")}
        actionLabel={t("admin.orders.back_to_list")}
        onAction={() => window.location.assign(ROUTES.ADMIN.ORDERS.LIST)}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 text-sm">
        <Link
          to={ROUTES.ADMIN.ORDERS.DETAILS(orderId)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("admin.orders.back_to_order")}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{t("admin.orders.escrow_view")}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("admin.orders.escrow_view")}
          </CardTitle>
          <CardDescription>
            {t("admin.orders.for_order")} {order.order_number}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {escrowLoading && !escrow ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !escrow ? (
            <div className="text-center py-12 text-muted-foreground">
              {t("admin.orders.no_escrow")}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.orders.escrow_number")}</p>
                  <p className="text-xl font-semibold">{escrow.escrow_number}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(escrow.status)}>
                  {getStatusLabel(escrow.status, t)}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("admin.orders.escrow_amount")}</p>
                    <p className="font-semibold">{formatCurrency(escrow.amount)} {escrow.currency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("admin.orders.platform_fee")}</p>
                    <p className="font-semibold">{formatCurrency(escrow.platform_fee)} {escrow.currency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("admin.orders.seller_amount")}</p>
                    <p className="font-semibold">{formatCurrency(escrow.seller_amount)} {escrow.currency}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">{t("orders.details.buyer")} ID</p>
                  <p className="font-medium">{escrow.buyer_id}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">{t("orders.details.seller")} ID</p>
                  <p className="font-medium">{escrow.seller_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("admin.orders.held_at")}</p>
                  <p className="font-medium">{timeFormat(escrow.held_at, "MMM DD, YYYY HH:mm")}</p>
                </div>
              </div>
              {escrow.released_at && (
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("admin.orders.released_at")}</p>
                    <p className="font-medium">{timeFormat(escrow.released_at, "MMM DD, YYYY HH:mm")}</p>
                    {escrow.release_reason && <p className="text-sm text-muted-foreground mt-1">{escrow.release_reason}</p>}
                  </div>
                </div>
              )}
              {escrow.refunded_at && (
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("admin.orders.refunded_at")}</p>
                    <p className="font-medium">{timeFormat(escrow.refunded_at, "MMM DD, YYYY HH:mm")}</p>
                    {escrow.refund_reason && <p className="text-sm text-muted-foreground mt-1">{escrow.refund_reason}</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
