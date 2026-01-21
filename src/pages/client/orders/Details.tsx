import { useState, startTransition } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
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
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Clock,
  ShoppingCart,
  TrendingUp,
  Calendar,
  Sparkles,
  Receipt,
  Download,
  File,
  Shield,
} from "lucide-react";
import {
  useGetOrderQuery,
  useCancelOrderMutation,
  useCompleteOrderMutation,
  useRequestRefundMutation,
} from "@/store/api/ordersApi";
import {
  useCreateInvoiceMutation,
  useGetInvoiceByOrderQuery,
} from "@/store/api/invoiceApi";
import {
  useGetPaymentByOrderQuery,
  useCreatePaymentMutation,
} from "@/store/api/paymentsApi";
import PaymentDialog from "@/components/payment/PaymentDialog";
import {
  useGetEscrowByOrderQuery,
} from "@/store/api/escrowApi";
import { useAuth } from "@/store/hooks/useAuth";
import {
  formatCurrency,
  timeFormat,
  getStatusColor,
  getStatusBadgeVariant,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { CardDescription } from "@/components/ui/card";
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
import OfferDetailsSkeleton from "@/components/skeletons/OfferDetailsSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { generatePDF } from "@/lib/pdfUtils";

// Lazy load InvoicePDF to avoid bundling react-pdf until needed
const loadInvoicePDF = async () => {
  const module = await import("@/components/invoice/InvoicePDF");
  return module.default;
};

const ClientOrderDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const orderId = id ? parseInt(id, 10) : 0;
  const {
    data: order,
    isLoading,
    error,
    refetch: refetchOrder,
  } = useGetOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [completeOrder, { isLoading: isCompleting }] =
    useCompleteOrderMutation();
  const [requestRefund, { isLoading: isRefunding }] =
    useRequestRefundMutation();
  const [createInvoice, { isLoading: isGeneratingInvoice }] =
    useCreateInvoiceMutation();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Check if invoice already exists for this order
  const {
    data: existingInvoice,
    isLoading: isLoadingInvoice,
  } = useGetInvoiceByOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });

  // Get payment for this order
  const {
    data: payment,
    isLoading: isLoadingPayment,
    refetch: refetchPayment,
  } = useGetPaymentByOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });

  // Get escrow for this order
  const {
    data: escrow,
    isLoading: isLoadingEscrow,
    refetch: refetchEscrow,
  } = useGetEscrowByOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });

  const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();

  // Get status label
  const getStatusLabel = (status: string) => {
    return t(`common.status.${status}`) || status;
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await cancelOrder(order.id).unwrap();
      toast({
        title: t("orders.details.cancel_success"),
        description: t("orders.details.cancel_success_desc"),
      });
      setShowCancelDialog(false);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { detail?: string } }).data?.detail
          : error && typeof error === "object" && "message" in error
            ? (error as { message?: string }).message
            : t("orders.details.cancel_error_desc");
      toast({
        title: t("orders.details.cancel_error"),
        description: errorMessage || t("orders.details.cancel_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Handle complete order
  const handleCompleteOrder = async () => {
    if (!order) return;

    try {
      await completeOrder(order.id).unwrap();
      toast({
        title: t("orders.details.complete_success"),
        description: t("orders.details.complete_success_desc"),
      });
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { detail?: string } }).data?.detail
          : error && typeof error === "object" && "message" in error
            ? (error as { message?: string }).message
            : t("orders.details.complete_error_desc");
      toast({
        title: t("orders.details.complete_error"),
        description: errorMessage || t("orders.details.complete_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Handle request refund
  const handleRequestRefund = async () => {
    if (!order) return;

    try {
      await requestRefund(order.id).unwrap();
      toast({
        title: t("orders.details.refund_success"),
        description: t("orders.details.refund_success_desc"),
      });
      setShowRefundDialog(false);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { detail?: string } }).data?.detail
          : error && typeof error === "object" && "message" in error
            ? (error as { message?: string }).message
            : t("orders.details.refund_error_desc");
      toast({
        title: t("orders.details.refund_error"),
        description: errorMessage || t("orders.details.refund_error_desc"),
        variant: "destructive",
      });
    }
  };

  // Handle generate invoice
  const handleGenerateInvoice = async () => {
    if (!order) return;

    try {
      const invoice = await createInvoice({
        order_id: order.id,
        subtotal: Number(order.listing_price),
        platform_fee: Number(order.platform_fee),
        total_amount: Number(order.final_price),
        currency: order.currency,
      }).unwrap();

      toast({
        title: t("orders.details.invoice_success") || "Invoice Generated",
        description:
          t("orders.details.invoice_success_desc") ||
          `Invoice #${invoice.invoice_number} has been generated successfully.`,
      });
    } catch (error: unknown) {
      toast({
        title: (error as ApiError)?.data?.detail || "Failed to generate invoice",
        variant: "destructive",
      });
    }
  };

  // Handle download invoice as PDF
  const handleDownloadInvoice = async () => {
    if (!order) return;

    setIsGeneratingPDF(true);
    try {
      const invoiceNumber =
        existingInvoice?.invoice_number || `INV-${order.order_number}`;
      const filename = `Invoice-${invoiceNumber}-${order.order_number}.pdf`;

      // Generate PDF using react-pdf (lazy loaded)
      const InvoicePDF = await loadInvoicePDF();
      await generatePDF(
        <InvoicePDF order={order} invoice={existingInvoice || undefined} />,
        filename
      );

      toast({
        title: t("orders.details.invoice_download_success") || "Invoice Downloaded",
        description:
          t("orders.details.invoice_download_success_desc") ||
          "Invoice has been downloaded successfully.",
      });
    } catch (error: unknown) {
      console.error("Error generating PDF:", error);
      toast({
        title: t("orders.details.invoice_download_error") || "Download Failed",
        description:
          t("orders.details.invoice_download_error_desc") ||
          "Failed to download invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Check if user can perform actions
  const isBuyer = user?.id === order?.buyer_id;
  const isSeller = user?.id === order?.seller_id;
  const canCancel =
    (isBuyer || isSeller) &&
    ["pending", "processing"].includes(order?.status || "");
  const canComplete = isSeller && order?.status === "processing";
  const canRefund =
    isBuyer && ["completed", "processing"].includes(order?.status || "");
  const canMakePayment =
    isBuyer &&
    (order?.status === "pending" || order?.status === "payment_pending") &&
    !payment;

  if (isLoading) {
    return <OfferDetailsSkeleton />;
  }

  if (error || !order) {
    return (
      <EmptyState
        variant="error"
        title={t("orders.details.error.title")}
        description={t("orders.details.error.description")}
        actionLabel={t("orders.details.back_to_orders")}
        onAction={() => navigate(ROUTES.CLIENT.ORDERS.INDEX)}
      />
    );
  }

  // Calculate fee percentage
  const feePercentage = order.listing_price
    ? ((Number(order.platform_fee) / Number(order.listing_price)) * 100).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen">
      <div className="space-y-6 p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.CLIENT.ORDERS.INDEX}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t("orders.details.back_to_orders")}
          </Link>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {t("orders.details.order_number")}: {order.order_number}
          </span>
        </div>

        {/* Premium Header - Subtle Design */}
        <div className="relative overflow-hidden rounded-xl bg-primary/10 border border-border/50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 border border-border">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight mb-1 text-foreground">
                  {t("orders.details.title")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("orders.details.order_number")}: {order.order_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={getStatusBadgeVariant(order.status)}
                className={cn(
                  "text-xs font-medium px-3 py-1 capitalize",
                  getStatusColor(order.status),
                  "text-white border-0"
                )}
              >
                {getStatusLabel(order.status)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards - Subtle Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Final Price</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(order.final_price)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.currency}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Listing Price</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(order.listing_price)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.currency}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Platform Fee</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatCurrency(order.platform_fee)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{feePercentage}% of listing</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                  <p className="text-xl font-semibold text-foreground">
                    #{order.id}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Unique identifier</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{t("orders.details.order_information")}</CardTitle>
                    <CardDescription className="text-xs">Complete order details and timeline</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Order ID */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("orders.details.order_id")}
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      #{order.id}
                    </p>
                  </div>

                  {/* Order Number */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("orders.details.order_number")}
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {order.order_number}
                    </p>
                  </div>

                  {/* Created At */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("orders.details.created_at")}
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {timeFormat(order.created_at, "MMM DD, YYYY")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {timeFormat(order.created_at, "HH:mm")}
                    </p>
                  </div>

                  {/* Updated At */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("orders.details.updated_at")}
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {timeFormat(order.updated_at, "MMM DD, YYYY")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {timeFormat(order.updated_at, "HH:mm")}
                    </p>
                  </div>

                  {/* Paid At */}
                  {order.paid_at && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">
                          {t("orders.details.paid_at")}
                        </label>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {timeFormat(order.paid_at, "MMM DD, YYYY")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {timeFormat(order.paid_at, "HH:mm")}
                      </p>
                    </div>
                  )}

                  {/* Completed At */}
                  {order.completed_at && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">
                          {t("orders.details.completed_at")}
                        </label>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {timeFormat(order.completed_at, "MMM DD, YYYY")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {timeFormat(order.completed_at, "HH:mm")}
                      </p>
                    </div>
                  )}

                  {/* Cancelled At */}
                  {order.cancelled_at && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">
                          {t("orders.details.cancelled_at")}
                        </label>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {timeFormat(order.cancelled_at, "MMM DD, YYYY")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {timeFormat(order.cancelled_at, "HH:mm")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Cancellation Reason */}
                {order.cancellation_reason && (
                  <>
                    <Separator className="my-3" />
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
                        <label className="text-xs font-medium text-muted-foreground">
                          {t("orders.details.cancellation_reason")}
                        </label>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {order.cancellation_reason}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Listing Information - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{t("orders.details.listing_information")}</CardTitle>
                    <CardDescription className="text-xs">Product details and information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {t("orders.details.listing_title")}
                  </label>
                  <p className="text-sm font-semibold text-foreground">
                    {order.listing?.title || "N/A"}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      {t("orders.details.listing_id")}
                    </label>
                    <p className="text-sm font-semibold text-foreground">#{order.listing_id}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      {t("orders.details.listing_price")}
                    </label>
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(order.listing_price)} {order.currency}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Buyer & Seller Information - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{t("orders.details.parties_information")}</CardTitle>
                    <CardDescription className="text-xs">Buyer and seller details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Buyer */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("orders.details.buyer")}
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      {order.buyer?.username || order.buyer?.email || "N/A"}
                    </p>
                    {order.buyer?.email && (
                      <p className="text-xs text-muted-foreground">
                        {order.buyer.email}
                      </p>
                    )}
                  </div>

                  {/* Seller */}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("orders.details.seller")}
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      {order.seller?.username || order.seller?.email || "N/A"}
                    </p>
                    {order.seller?.email && (
                      <p className="text-xs text-muted-foreground">
                        {order.seller.email}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Summary - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{t("orders.details.pricing_summary")}</CardTitle>
                    <CardDescription className="text-xs">Complete pricing breakdown</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-xs font-medium text-muted-foreground">
                    {t("orders.details.listing_price")}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(order.listing_price)} {order.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 border border-border">
                  <span className="text-xs font-medium text-muted-foreground">
                    {t("orders.details.platform_fee")}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(order.platform_fee)} {order.currency}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 border border-border">
                  <span className="text-sm font-semibold text-foreground">{t("orders.details.final_price")}</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(order.final_price)} {order.currency}
                  </span>
                </div>
                {order.seller_amount && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 border border-border">
                      <span className="text-xs font-medium text-muted-foreground">
                        {t("orders.details.seller_amount")}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(order.seller_amount)} {order.currency}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            {isLoadingPayment ? (
              <Card className="border border-border/50 bg-card shadow-sm">
                <CardContent className="p-4">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ) : payment ? (
              <Card className="border border-border/50 bg-card shadow-sm">
                <CardHeader className="border-b border-border bg-secondary/10">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{t("orders.details.payment_information")}</CardTitle>
                      <CardDescription className="text-xs">{t("orders.details.payment_details_desc")}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("orders.details.payment_number")}
                      </label>
                      <p className="text-sm font-semibold text-foreground">{payment.payment_number}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("orders.details.payment_method")}
                      </label>
                      <p className="text-sm font-semibold text-foreground capitalize">{payment.payment_method}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("orders.details.amount")}
                      </label>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(payment.amount)} {payment.currency}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("common.status.status")}
                      </label>
                      <Badge
                        variant={getStatusBadgeVariant(payment.status)}
                        className={cn("capitalize", getStatusColor(payment.status))}
                      >
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </div>
                    {payment.transaction_id && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border col-span-2">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          {t("orders.details.transaction_id")}
                        </label>
                        <p className="text-sm font-semibold text-foreground">
                          {payment.transaction_id}
                        </p>
                      </div>
                    )}
                    {payment.paid_at && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border col-span-2">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          {t("orders.details.paid_at")}
                        </label>
                        <p className="text-sm font-semibold text-foreground">
                          {timeFormat(payment.paid_at, "MMM DD, YYYY HH:mm")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : order.payment_method ? (
              <Card className="border border-border/50 bg-card shadow-sm">
                <CardHeader className="border-b border-border bg-secondary/10">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{t("orders.details.payment_information")}</CardTitle>
                      <CardDescription className="text-xs">{t("orders.details.payment_details_desc")}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      {t("orders.details.payment_method")}
                    </label>
                    <p className="text-sm font-semibold text-foreground">{order.payment_method}</p>
                  </div>
                  {order.payment_transaction_id && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("orders.details.transaction_id")}
                      </label>
                      <p className="text-sm font-semibold text-foreground">
                        #{order.payment_transaction_id}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {/* Escrow Information */}
            {isLoadingEscrow ? (
              <Card className="border border-border/50 bg-card shadow-sm">
                <CardContent className="p-4">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ) : escrow ? (
              <Card className="border border-border/50 bg-card shadow-sm">
                <CardHeader className="border-b border-border bg-secondary/10">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{t("orders.details.escrow_information")}</CardTitle>
                      <CardDescription className="text-xs">{t("orders.details.escrow_details_desc")}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("orders.details.escrow_number")}
                      </label>
                      <p className="text-sm font-semibold text-foreground">{escrow.escrow_number}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("common.status.status")}
                      </label>
                      <Badge
                        variant={getStatusBadgeVariant(escrow.status)}
                        className={cn("capitalize", getStatusColor(escrow.status))}
                      >
                        {getStatusLabel(escrow.status)}
                      </Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("orders.details.escrow_amount")}
                      </label>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(escrow.amount)} {escrow.currency}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("orders.details.platform_fee")}
                      </label>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(escrow.platform_fee)} {escrow.currency}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("orders.details.seller_amount")}
                      </label>
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(escrow.seller_amount)} {escrow.currency}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">
                        {t("orders.details.held_at")}
                      </label>
                      <p className="text-sm font-semibold text-foreground">
                        {timeFormat(escrow.held_at, "MMM DD, YYYY")}
                      </p>
                    </div>
                    {escrow.released_at && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          {t("orders.details.released_at")}
                        </label>
                        <p className="text-sm font-semibold text-foreground">
                          {timeFormat(escrow.released_at, "MMM DD, YYYY HH:mm")}
                        </p>
                      </div>
                    )}
                    {escrow.refunded_at && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">
                          {t("orders.details.refunded_at")}
                        </label>
                        <p className="text-sm font-semibold text-foreground">
                          {timeFormat(escrow.refunded_at, "MMM DD, YYYY HH:mm")}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Actions - Clean Design */}
            {(canCancel || canComplete || canRefund) && (
              <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
                <CardHeader className="border-b border-border bg-blue-500/20">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{t("orders.details.actions")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  {canCancel && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => setShowCancelDialog(true)}
                      disabled={isCancelling}
                      size="sm"
                    >
                      {isCancelling ? (
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 mr-2" />
                      )}
                      {t("orders.details.cancel_order")}
                    </Button>
                  )}
                  {canComplete && (
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={handleCompleteOrder}
                      disabled={isCompleting}
                      size="sm"
                    >
                      {isCompleting ? (
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 mr-2" />
                      )}
                      {t("orders.details.complete_order")}
                    </Button>
                  )}
                  {canRefund && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowRefundDialog(true)}
                      disabled={isRefunding}
                      size="sm"
                    >
                      {isRefunding ? (
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 mr-2" />
                      )}
                      {t("orders.details.request_refund")}
                    </Button>
                  )}
                  {canMakePayment && (
                    <Button
                      variant="default"
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        startTransition(() => {
                          setShowPaymentDialog(true);
                        });
                      }}
                      size="sm"
                    >
                      <CreditCard className="w-3.5 h-3.5 mr-2" />
                      {t("orders.details.make_payment") || "Make Payment"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Invoice Generation - Clean Design */}
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center border border-border">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {t("orders.details.invoice") || "Invoice"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {t("orders.details.invoice_description") ||
                        "Generate invoice for this order"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {existingInvoice ? (
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Receipt className="h-3.5 w-3.5 text-muted-foreground" />
                      <label className="text-xs font-medium text-muted-foreground">
                        {t("orders.details.invoice_number") || "Invoice Number"}
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-foreground mb-2">
                      {existingInvoice.invoice_number}
                    </p>
                    <Badge
                      variant={
                        existingInvoice.status === "paid"
                          ? "default"
                          : existingInvoice.status === "issued"
                            ? "secondary"
                            : "outline"
                      }
                      className={cn(
                        "text-xs",
                        existingInvoice.status === "paid" && "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
                      )}
                    >
                      {existingInvoice.status}
                    </Badge>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {t("orders.details.no_invoice") ||
                      "No invoice has been generated for this order yet."}
                  </p>
                )}
                {/* download invoice button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleDownloadInvoice}
                  disabled={isGeneratingPDF || !order}
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5 mr-2" />
                  )}
                  {t("orders.details.download_invoice") || "Download Invoice"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGenerateInvoice}
                  disabled={isGeneratingInvoice || isLoadingInvoice}
                  size="sm"
                >
                  {isGeneratingInvoice ? (
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  ) : (
                    <File className="w-3.5 h-3.5 mr-2" />
                  )}
                  {existingInvoice
                    ? t("orders.details.regenerate_invoice") ||
                    "Regenerate Invoice"
                    : t("orders.details.generate_invoice") ||
                    "Generate Invoice"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("orders.details.cancel_dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("orders.details.cancel_dialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("orders.details.cancel_order")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Refund Dialog */}
      <AlertDialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("orders.details.refund_dialog.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("orders.details.refund_dialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRequestRefund}>
              {t("orders.details.request_refund")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Dialog */}
      {order && (
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          orderId={order.id}
          amount={Number(order.final_price)}
          currency={order.currency}
          orderNumber={order.order_number}
          onSuccess={() => {
            refetchOrder();
            refetchPayment();
            refetchEscrow();
          }}
        />
      )}
    </div>
  );
};

export default ClientOrderDetailsPage;
