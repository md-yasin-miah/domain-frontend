import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Clock,
} from "lucide-react";
import {
  useGetOrderQuery,
  useCancelOrderMutation,
  useCompleteOrderMutation,
  useRequestRefundMutation,
} from "@/store/api/ordersApi";
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
  } = useGetOrderQuery(orderId, {
    skip: !orderId || isNaN(orderId),
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const [completeOrder, { isLoading: isCompleting }] =
    useCompleteOrderMutation();
  const [requestRefund, { isLoading: isRefunding }] =
    useRequestRefundMutation();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  // Get status label
  const getStatusLabel = (status: string) => {
    return t(`orders.status.${status}`) || status;
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

  // Check if user can perform actions
  const isBuyer = user?.id === order?.buyer_id;
  const isSeller = user?.id === order?.seller_id;
  const canCancel =
    (isBuyer || isSeller) &&
    ["pending", "processing"].includes(order?.status || "");
  const canComplete = isSeller && order?.status === "processing";
  const canRefund =
    isBuyer && ["completed", "processing"].includes(order?.status || "");

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t("common.loading")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="w-16 h-16 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">
                  {t("orders.details.error.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("orders.details.error.description")}
                </p>
              </div>
              <Button onClick={() => navigate(ROUTES.CLIENT.ORDERS.INDEX)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("orders.details.back_to_orders")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("orders.details.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("orders.details.order_number")}: {order.order_number}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.CLIENT.ORDERS.INDEX)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("orders.details.back_to_orders")}
          </Button>
          <Badge
            variant={getStatusBadgeVariant(order.status)}
            className={cn("text-sm px-4 py-1", getStatusColor(order.status))}
          >
            {getStatusLabel(order.status)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                {t("orders.details.order_information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.details.order_id")}
                  </p>
                  <p className="font-medium">#{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.details.order_number")}
                  </p>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.details.created_at")}
                  </p>
                  <p className="font-medium">
                    {timeFormat(order.created_at, "lll")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.details.updated_at")}
                  </p>
                  <p className="font-medium">
                    {timeFormat(order.updated_at, "lll")}
                  </p>
                </div>
                {order.paid_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("orders.details.paid_at")}
                    </p>
                    <p className="font-medium">
                      {timeFormat(order.paid_at, "lll")}
                    </p>
                  </div>
                )}
                {order.completed_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("orders.details.completed_at")}
                    </p>
                    <p className="font-medium">
                      {timeFormat(order.completed_at, "lll")}
                    </p>
                  </div>
                )}
                {order.cancelled_at && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("orders.details.cancelled_at")}
                    </p>
                    <p className="font-medium">
                      {timeFormat(order.cancelled_at, "lll")}
                    </p>
                  </div>
                )}
              </div>
              {order.cancellation_reason && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("orders.details.cancellation_reason")}
                    </p>
                    <p className="text-sm">{order.cancellation_reason}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Listing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t("orders.details.listing_information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("orders.details.listing_title")}
                </p>
                <p className="font-medium text-lg">
                  {order.listing?.title || "N/A"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.details.listing_id")}
                  </p>
                  <p className="font-medium">#{order.listing_id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.details.listing_price")}
                  </p>
                  <p className="font-medium">
                    {formatCurrency(order.listing_price)} {order.currency}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buyer & Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {t("orders.details.parties_information")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("orders.details.buyer")}
                  </p>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {order.buyer?.username || order.buyer?.email || "N/A"}
                    </p>
                    {order.buyer?.email && (
                      <p className="text-sm text-muted-foreground">
                        {order.buyer.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("orders.details.seller")}
                  </p>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {order.seller?.username || order.seller?.email || "N/A"}
                    </p>
                    {order.seller?.email && (
                      <p className="text-sm text-muted-foreground">
                        {order.seller.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {t("orders.details.pricing_summary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("orders.details.listing_price")}
                </span>
                <span className="font-medium">
                  {formatCurrency(order.listing_price)} {order.currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("orders.details.platform_fee")}
                </span>
                <span className="font-medium">
                  {formatCurrency(order.platform_fee)} {order.currency}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>{t("orders.details.final_price")}</span>
                <span>
                  {formatCurrency(order.final_price)} {order.currency}
                </span>
              </div>
              {order.seller_amount && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("orders.details.seller_amount")}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(order.seller_amount)} {order.currency}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          {order.payment_method && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t("orders.details.payment_information")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("orders.details.payment_method")}
                  </p>
                  <p className="font-medium">{order.payment_method}</p>
                </div>
                {order.payment_transaction_id && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("orders.details.transaction_id")}
                    </p>
                    <p className="font-medium">
                      #{order.payment_transaction_id}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {(canCancel || canComplete || canRefund) && (
            <Card>
              <CardHeader>
                <CardTitle>{t("orders.details.actions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {canCancel && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowCancelDialog(true)}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
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
                  >
                    {isCompleting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
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
                  >
                    {isRefunding ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    {t("orders.details.request_refund")}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
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
    </div>
  );
};

export default ClientOrderDetailsPage;
