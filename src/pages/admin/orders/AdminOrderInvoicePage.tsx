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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Calendar,
  DollarSign,
  Receipt,
  Download,
} from "lucide-react";
import { useGetOrderQuery } from "@/store/api/ordersApi";
import { useGetInvoiceByOrderQuery } from "@/store/api/invoiceApi";
import { formatCurrency, timeFormat, getStatusColor, getStatusLabel } from "@/lib/helperFun";
import { ROUTES } from "@/lib/routes";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import { generatePDF } from "@/lib/pdfUtils";

const loadInvoicePDF = async () => {
  const module = await import("@/components/invoice/InvoicePDF");
  return module.default;
};

export default function AdminOrderInvoicePage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : 0;

  const { data: order, isLoading: orderLoading, error: orderError } = useGetOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });
  const { data: invoice, isLoading: invoiceLoading } = useGetInvoiceByOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });

  const isLoading = orderLoading || invoiceLoading;

  const handleDownloadPDF = async () => {
    if (!order) return;
    try {
      const InvoicePDF = await loadInvoicePDF();
      const filename = `Invoice-${invoice?.invoice_number ?? order.order_number}-${order.order_number}.pdf`;
      await generatePDF(
        <InvoicePDF order={order} invoice={invoice ?? undefined} />,
        filename
      );
    } catch (e) {
      console.error(e);
    }
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link
            to={ROUTES.ADMIN.ORDERS.DETAILS(orderId)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("admin.orders.back_to_order")}
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">{t("admin.orders.invoice_view")}</span>
        </div>
        {invoice && (
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            {t("admin.orders.download_invoice")}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("admin.orders.invoice_view")}
          </CardTitle>
          <CardDescription>
            {t("admin.orders.for_order")} {order.order_number}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoiceLoading && !invoice ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !invoice ? (
            <div className="text-center py-12 text-muted-foreground">
              {t("admin.orders.no_invoice")}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("admin.orders.invoice_number")}</p>
                  <p className="text-xl font-semibold">{invoice.invoice_number}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(invoice.status)}>
                  {getStatusLabel(invoice.status, t)}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("admin.orders.issued_at")}</p>
                    <p className="font-medium">{invoice.issued_at ? timeFormat(invoice.issued_at, "MMM DD, YYYY") : "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("admin.orders.total_amount")}</p>
                    <p className="font-medium">{formatCurrency(invoice.total_amount)} {invoice.currency}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">{t("admin.orders.subtotal")}</p>
                  <p className="font-semibold">{formatCurrency(invoice.subtotal)} {invoice.currency}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">{t("admin.orders.platform_fee")}</p>
                  <p className="font-semibold">{formatCurrency(invoice.platform_fee)} {invoice.currency}</p>
                </div>
              </div>
              {invoice.paid_at && (
                <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t("admin.orders.paid_at")}</p>
                    <p className="font-medium">{timeFormat(invoice.paid_at, "MMM DD, YYYY HH:mm")}</p>
                  </div>
                </div>
              )}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">{t("orders.details.buyer")}</p>
                  <p className="font-medium">ID: {invoice.buyer_id}</p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">{t("orders.details.seller")}</p>
                  <p className="font-medium">ID: {invoice.seller_id}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
