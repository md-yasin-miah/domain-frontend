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
  CreditCard,
  Loader2,
  Calendar,
  DollarSign,
  Receipt,
  CheckCircle,
} from "lucide-react";
import { useGetOrderQuery } from "@/store/api/ordersApi";
import { useGetPaymentByOrderQuery } from "@/store/api/paymentsApi";
import { formatCurrency, timeFormat, getStatusColor, getStatusLabel } from "@/lib/helperFun";
import { ROUTES } from "@/lib/routes";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";

export default function AdminOrderPaymentPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : 0;

  const { data: order, isLoading: orderLoading, error: orderError } = useGetOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });
  const { data: payment, isLoading: paymentLoading } = useGetPaymentByOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });

  const isLoading = orderLoading || paymentLoading;

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
        <span className="font-medium">{t("admin.orders.payment_view")}</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t("admin.orders.payment_view")}
          </CardTitle>
          <CardDescription>
            {t("admin.orders.for_order")} {order.order_number}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentLoading && !payment ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !payment ? (
            <div className="text-center py-12 text-muted-foreground">
              {t("admin.orders.no_payment")}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.orders.payment_number")}</p>
                  <p className="text-xl font-semibold">{payment.payment_number}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(payment.status)}>
                  {getStatusLabel(payment.status, t)}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("admin.orders.amount")}</p>
                    <p className="font-semibold">{formatCurrency(payment.amount)} {payment.currency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("admin.orders.payment_method")}</p>
                    <p className="font-medium">{payment.payment_method || "—"}</p>
                  </div>
                </div>
              </div>
              {payment.transaction_id && (
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">{t("admin.orders.transaction_id")}</p>
                  <p className="font-mono text-sm break-all">{payment.transaction_id}</p>
                </div>
              )}
              {(payment.paid_at || payment.processed_at) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {payment.paid_at && (
                    <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                      <CheckCircle className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t("admin.orders.paid_at")}</p>
                        <p className="font-medium">{timeFormat(payment.paid_at, "MMM DD, YYYY HH:mm")}</p>
                      </div>
                    </div>
                  )}
                  {payment.processed_at && (
                    <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t("admin.orders.processed_at")}</p>
                        <p className="font-medium">{timeFormat(payment.processed_at, "MMM DD, YYYY HH:mm")}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("admin.orders.created_at")}</p>
                  <p className="font-medium">{timeFormat(payment.created_at, "MMM DD, YYYY HH:mm")}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
