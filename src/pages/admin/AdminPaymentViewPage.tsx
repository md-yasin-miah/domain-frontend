import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  ArrowLeft,
  Loader2,
  FileText,
  Receipt,
  CopyIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetPaymentQuery } from "@/store/api/paymentsApi";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/lib/helperFun";
import { CopyToClipboard } from "@/components/common/CopyToClipboard";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatAmount(
  amount: number | string | null,
  currency: string,
): string {
  if (amount == null) return "—";
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
  }).format(n);
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "completed") return "default";
  if (status === "failed" || status === "cancelled") return "destructive";
  if (status === "refunded" || status === "partially_refunded")
    return "secondary";
  return "outline";
}

export default function AdminPaymentViewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const paymentId = id ? parseInt(id, 10) : NaN;
  const isValidId = !isNaN(paymentId) && paymentId > 0;

  const {
    data: payment,
    isLoading,
    isError,
  } = useGetPaymentQuery(paymentId, {
    skip: !isValidId,
  });

  if (!isValidId) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(ROUTES.ADMIN.PAYMENTS)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t("admin.payments.invalid_id", "Invalid payment ID.")}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !payment) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(ROUTES.ADMIN.PAYMENTS)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t("admin.payments.not_found", "Payment not found.")}
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasRefund =
    payment.refund_amount != null && Number(payment.refund_amount) > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(ROUTES.ADMIN.PAYMENTS)}
            aria-label={t("common.back", "Back")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="h-7 w-7" />
              {payment.payment_number}
            </h1>
            <p className="text-muted-foreground mt-0.5">
              {t("admin.payments.view_subtitle", "Payment details")}
            </p>
          </div>
        </div>
        <Badge
          variant={getStatusVariant(payment.status)}
          className="capitalize"
        >
          {payment.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="h-4 w-4" />
              {t("admin.payments.overview", "Overview")}
            </CardTitle>
            <CardDescription>
              {t(
                "admin.payments.overview_desc",
                "Payment and transaction information.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">
                  {t("admin.payments.amount", "Amount")}
                </p>
                <p className="font-medium">
                  {formatAmount(payment.amount, payment.currency)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("admin.payments.currency", "Currency")}
                </p>
                <p className="font-medium">{payment.currency}</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("admin.payments.method", "Method")}
                </p>
                <p className="font-medium capitalize">
                  {payment.payment_method}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("admin.payments.transaction_id", "Transaction ID")}
                </p>
                <CopyToClipboard
                  textToCopy={payment.transaction_id || ""}
                  size="sm"
                >
                  <span className="font-mono text-xs break-all w-fit">
                    {payment.transaction_id || "—"}
                  </span>
                </CopyToClipboard>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("admin.payments.created", "Created")}
                </p>
                <p className="font-medium">{formatDate(payment.created_at)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("admin.payments.updated_at", "Last updated")}
                </p>
                <p className="font-medium">{formatDate(payment.updated_at)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("admin.payments.paid_at", "Paid at")}
                </p>
                <p className="font-medium">{formatDate(payment.paid_at)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("admin.payments.processed_at", "Processed at")}
                </p>
                <p className="font-medium">
                  {formatDate(payment.processed_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              {t("admin.payments.order_info", "Order")}
            </CardTitle>
            <CardDescription>
              {t(
                "admin.payments.order_info_desc",
                "Related order for this payment.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {payment.order ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {t("admin.payments.order", "Order")}
                </p>
                <Link
                  to={ROUTES.ADMIN.ORDERS.DETAILS(payment.order.id)}
                  className="font-medium text-primary hover:underline"
                >
                  {payment.order.order_number}
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {t("admin.payments.order_status", "Status")}:
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      getStatusColor(payment.order.status),
                    )}
                  >
                    {getStatusLabel(payment.order.status, t)}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("admin.payments.order_id_only", "Order ID")}: #
                {payment.order_id}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {hasRefund && (
        <Card className={cn("border-amber-200 dark:border-amber-900")}>
          <CardHeader>
            <CardTitle className="text-base">
              {t("admin.payments.refund_info", "Refund information")}
            </CardTitle>
            <CardDescription>
              {t(
                "admin.payments.refund_info_desc",
                "Refund amount and reason.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-muted-foreground">
                  {t("admin.payments.refund_amount", "Refund amount")}
                </p>
                <p className="font-medium">
                  {formatAmount(payment.refund_amount, payment.currency)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  {t("admin.payments.refunded_at", "Refunded at")}
                </p>
                <p className="font-medium">{formatDate(payment.refunded_at)}</p>
              </div>
            </div>
            {payment.refund_reason && (
              <div className="pt-2">
                <p className="text-muted-foreground text-sm">
                  {t("admin.payments.refund_reason", "Refund reason")}
                </p>
                <p className="text-sm">{payment.refund_reason}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
