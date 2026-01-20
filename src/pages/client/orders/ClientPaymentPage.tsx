import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ColumnDef } from "@/components/ui/data-table";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import {
  CreditCard,
  Search,
  Loader2,
  Eye,
  Package,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  useGetPaymentsQuery,
} from "@/store/api/paymentsApi";
import {
  formatCurrency,
  timeFormat,
  getStatusBadgeVariant,
} from "@/lib/helperFun";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/usePagination";
import { ROUTES } from "@/lib/routes";
import CustomTooltip from "@/components/common/CustomTooltip";
import EmptyState from "@/components/common/EmptyState";

type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded" | "partially_refunded";

interface PaymentFilters {
  skip?: number;
  limit?: number;
  status?: string;
  order_id?: number;
  payment_method?: string;
}

const ClientPaymentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [orderIdFilter, setOrderIdFilter] = useState<string>("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 10,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: PaymentFilters = {
      skip: (page - 1) * size,
      limit: size,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    if (orderIdFilter) {
      const orderId = parseInt(orderIdFilter, 10);
      if (!isNaN(orderId)) {
        params.order_id = orderId;
      }
    }

    if (paymentMethodFilter !== "all") {
      params.payment_method = paymentMethodFilter;
    }

    return params;
  }, [page, size, statusFilter, orderIdFilter, paymentMethodFilter]);

  const {
    data: paymentsData,
    isLoading,
    error,
    refetch,
  } = useGetPaymentsQuery(queryParams);

  // Handle paginated or array response
  const payments = useMemo(() => {
    if (!paymentsData) return [];
    if (Array.isArray(paymentsData)) return paymentsData;
    return paymentsData.items || [];
  }, [paymentsData]);

  // Get status label helper
  const getStatusLabel = useCallback((status: string) => {
    return t(`payments.status.${status}`) || status;
  }, [t]);

  // Get status color helper
  const getStatusColor = useCallback((status: string) => {
    const colors: Record<string, string> = {
      pending: "text-yellow-600",
      processing: "text-blue-600",
      completed: "text-green-600",
      failed: "text-red-600",
      refunded: "text-gray-600",
      partially_refunded: "text-orange-600",
    };
    return colors[status] || "text-gray-600";
  }, []);

  // Define table columns
  const columns: ColumnDef<Payment>[] = useMemo(() => [
    {
      id: "payment_number",
      accessorKey: "payment_number",
      header: t("payments.table.payment_number"),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.payment_number}
        </div>
      ),
    },
    {
      id: "order",
      accessorKey: "order",
      header: t("payments.table.order"),
      cell: ({ row }) => {
        const order = row.order;
        return (
          <div className="flex items-center gap-2">
            {order ? (
              <>
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.order_number}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                {t("common.not_available")}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: t("payments.table.amount"),
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.amount)} {row.currency}
        </div>
      ),
    },
    {
      id: "payment_method",
      accessorKey: "payment_method",
      header: t("payments.table.payment_method"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm capitalize">{row.payment_method}</span>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t("common.status.status"),
      cell: ({ row }) => (
        <Badge
          variant={getStatusBadgeVariant(row.status)}
          className={cn("capitalize", getStatusColor(row.status))}
        >
          {getStatusLabel(row.status)}
        </Badge>
      ),
    },
    {
      id: "paid_at",
      accessorKey: "paid_at",
      header: t("payments.table.paid_at"),
      cell: ({ row }) => (
        <div className="text-sm">
          {row.paid_at ? (
            timeFormat(row.paid_at, "MM/DD/YYYY HH:mm")
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: t("payments.table.created_at"),
      cell: ({ row }) => (
        <div className="text-sm">
          {timeFormat(row.created_at, "MM/DD/YYYY")}
        </div>
      ),
    },
    {
      id: "actions",
      header: t("common.actions"),
      cell: ({ row }) => (
        <div className="flex items-center gap-1 justify-center">
          {row.order && (
            <CustomTooltip content={t("payments.actions.view_order")}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.CLIENT.ORDERS.ORDER_DETAILS(row.order_id))}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </CustomTooltip>
          )}
        </div>
      ),
    },
  ], [t, navigate, getStatusLabel, getStatusColor]);

  // Filter payments by search term
  const filteredPayments = useMemo(() => {
    if (!searchTerm) return payments;
    const term = searchTerm.toLowerCase();
    return payments.filter((payment) =>
      payment.payment_number.toLowerCase().includes(term) ||
      payment.order?.order_number?.toLowerCase().includes(term) ||
      payment.transaction_id?.toLowerCase().includes(term)
    );
  }, [payments, searchTerm]);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <XCircle className="h-12 w-12 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold">{t("payments.error.title")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("payments.error.description")}
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t("common.retry")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("payments.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("payments.description")}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t("payments.filters.title")}</CardTitle>
          <CardDescription>{t("payments.filters.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("payments.filters.search_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatus | "all")}>
              <SelectTrigger>
                <SelectValue placeholder={t("payments.filters.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="pending">{getStatusLabel("pending")}</SelectItem>
                <SelectItem value="processing">{getStatusLabel("processing")}</SelectItem>
                <SelectItem value="completed">{getStatusLabel("completed")}</SelectItem>
                <SelectItem value="failed">{getStatusLabel("failed")}</SelectItem>
                <SelectItem value="refunded">{getStatusLabel("refunded")}</SelectItem>
                <SelectItem value="partially_refunded">{getStatusLabel("partially_refunded")}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder={t("payments.filters.order_id_placeholder")}
              value={orderIdFilter}
              onChange={(e) => setOrderIdFilter(e.target.value)}
              type="number"
            />
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t("payments.filters.payment_method")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="crypto">Crypto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("payments.table.title")}</CardTitle>
          <CardDescription>
            {t("payments.table.description", { count: paymentsData?.pagination?.total || 0 })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {t("common.loading")}
                </p>
              </div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <EmptyState
              icon={<CreditCard className="w-16 h-16 text-muted-foreground" />}
              title={t("payments.empty.title")}
              description={t("payments.empty.description")}
            />
          ) : (
            <DataTableWithPagination
              columns={columns}
              data={filteredPayments}
              pagination={paymentsData?.pagination}
              pageSize={size}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPaymentPage;
