import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, Loader2, Pencil, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
  type Payment,
  type PaymentUpdateRequest,
} from "@/store/api/paymentsApi";
import { ROUTES } from "@/lib/routes";
import { DataTableWithPagination } from "@/components/common/DataTableWithPagination";
import { type ColumnDef } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/usePagination";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatAmount(amount: number | string | null, currency: string): string {
  if (amount == null) return "—";
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
  }).format(n);
}

function getStatusClass(status: string): string {
  if (status === "completed") return "text-green-600";
  if (status === "failed" || status === "cancelled") return "text-destructive";
  return "";
}

export default function AdminPaymentsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [updateForm, setUpdateForm] = useState<PaymentUpdateRequest>({});

  const { page, size, handlePageChange, handlePageSizeChange } = usePagination({
    initialPage: 1,
    initialPageSize: 15,
  });

  const filters = useMemo(
    () => ({
      skip: (page - 1) * size,
      limit: size,
      ...(statusFilter !== "all" && { status: statusFilter }),
      ...(paymentMethodFilter !== "all" && { payment_method: paymentMethodFilter }),
    }),
    [page, size, statusFilter, paymentMethodFilter]
  );

  const { data, isLoading, refetch, error } = useGetPaymentsQuery(filters);
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

  const items = data?.items ?? [];
  const rawPagination = data?.pagination;
  const pagination = useMemo(
    () =>
      rawPagination
        ? {
            total: rawPagination.total ?? 0,
            page: rawPagination.page ?? 0,
            total_pages: rawPagination.total_pages ?? 1,
            has_next: rawPagination.has_next ?? false,
            has_previous: rawPagination.has_previous ?? false,
          }
        : undefined,
    [rawPagination]
  );

  const handleOpenUpdate = (payment: Payment) => {
    setSelectedPayment(payment);
    setUpdateForm({
      status: payment.status,
      transaction_id: payment.transaction_id ?? undefined,
      refund_amount: payment.refund_amount ?? undefined,
      refund_reason: payment.refund_reason ?? undefined,
    });
  };

  const handleCloseUpdate = () => {
    setSelectedPayment(null);
    setUpdateForm({});
  };

  const handleSubmitUpdate = async () => {
    if (!selectedPayment) return;

    try {
      await updatePayment({
        id: selectedPayment.id,
        data: {
          status: updateForm.status,
          transaction_id: updateForm.transaction_id ?? undefined,
          refund_amount:
            updateForm.refund_amount !== undefined && updateForm.refund_amount !== ""
              ? Number(updateForm.refund_amount)
              : undefined,
          refund_reason: updateForm.refund_reason ?? undefined,
        },
      }).unwrap();

      toast({
        title: t("admin.payments.updated", "Payment updated"),
        description: t("admin.payments.updated_desc", "Payment has been updated successfully."),
      });

      handleCloseUpdate();
      refetch();
    } catch (err: unknown) {
      const detail =
        err && typeof err === "object" && "data" in err && err.data && typeof (err as { data: { detail?: string } }).data === "object"
          ? (err as { data: { detail?: string } }).data?.detail
          : t("common.error");
      toast({
        title: t("common.error", "Error"),
        description: String(detail),
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Payment>[] = useMemo(
    () => [
      {
        id: "payment_number",
        accessorKey: "payment_number",
        header: t("admin.payments.payment_number", "Payment #"),
        cell: ({ row }) => (
          <Link
            to={ROUTES.ADMIN.PAYMENT_DETAILS(row.id)}
            className="text-primary hover:underline font-medium"
          >
            {row.payment_number}
          </Link>
        ),
      },
      {
        id: "order",
        accessorKey: (row) => row.order?.order_number ?? row.order_id,
        header: t("admin.payments.order", "Order"),
        cell: ({ row }) =>
          row.order ? (
            <Link
              to={ROUTES.ADMIN.ORDERS.DETAILS(row.order.id)}
              className="text-primary hover:underline"
            >
              {row.order.order_number}
            </Link>
          ) : (
            `#${row.order_id}`
          ),
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: t("admin.payments.amount", "Amount"),
        cell: ({ row }) => (
          <div>
            <span>{formatAmount(row.amount, row.currency)}</span>
            {row.refund_amount != null && Number(row.refund_amount) > 0 && (
              <span className="text-muted-foreground text-xs block">
                Refund: {formatAmount(row.refund_amount, row.currency)}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "payment_method",
        accessorKey: "payment_method",
        header: t("admin.payments.method", "Method"),
      },
      {
        id: "status",
        accessorKey: "status",
        header: t("admin.payments.status", "Status"),
        cell: ({ row }) => (
          <span className={cn("capitalize", getStatusClass(row.status))}>
            {row.status}
          </span>
        ),
      },
      {
        id: "paid_at",
        accessorKey: "paid_at",
        header: t("admin.payments.paid_at", "Paid at"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.paid_at)}
          </span>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: t("admin.payments.created", "Created"),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {formatDate(row.created_at)}
          </span>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CreditCard className="h-7 w-7" />
          {t("admin.payments.title", "Payments")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("admin.payments.description", "View and manage all payments.")}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("admin.payments.list_title", "All Payments")}</CardTitle>
            <CardDescription>
              {t("admin.payments.list_desc", "Payments across all orders. Filter by status or method.")}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label className="sr-only">{t("admin.payments.filter_status", "Status")}</Label>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  handlePageChange(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin.payments.all_statuses", "All statuses")}</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="sr-only">{t("admin.payments.filter_method", "Payment method")}</Label>
              <Select
                value={paymentMethodFilter}
                onValueChange={(v) => {
                  setPaymentMethodFilter(v);
                  handlePageChange(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("admin.payments.all_methods", "All methods")}</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableWithPagination<Payment>
            data={items}
            columns={columns}
            pagination={pagination}
            isLoading={isLoading}
            emptyMessage={t("admin.payments.no_payments", "No payments found.")}
            emptyIcon={<CreditCard className="w-16 h-16 text-muted-foreground" />}
            getRowId={(row) => String(row.id)}
            renderActions={(row) => (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <Link to={ROUTES.ADMIN.PAYMENT_DETAILS(row.id)} title={t("admin.payments.view", "View")}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleOpenUpdate(row)}
                  title={t("admin.payments.update", "Update")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            )}
            actionsColumnHeader={t("admin.payments.actions", "Actions")}
            enableSorting={true}
            pageSize={size}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            error={error}
            errorTitle={t("common.error", "Error")}
            errorDescription={t("admin.payments.error_desc", "Failed to load payments.")}
            errorIcon={<CreditCard className="w-16 h-16 text-muted-foreground" />}
          />
        </CardContent>
      </Card>

      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && handleCloseUpdate()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("admin.payments.update_title", "Update Payment")}</DialogTitle>
            <DialogDescription>
              {selectedPayment && (
                <>
                  {selectedPayment.payment_number} — {formatAmount(selectedPayment.amount, selectedPayment.currency)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="update_status">{t("admin.payments.status", "Status")}</Label>
              <Select
                value={updateForm.status ?? ""}
                onValueChange={(v) => setUpdateForm((f) => ({ ...f, status: v }))}
              >
                <SelectTrigger id="update_status">
                  <SelectValue placeholder={t("admin.payments.select_status", "Select status")} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="update_transaction_id">{t("admin.payments.transaction_id", "Transaction ID")}</Label>
              <Input
                id="update_transaction_id"
                value={updateForm.transaction_id ?? ""}
                onChange={(e) => setUpdateForm((f) => ({ ...f, transaction_id: e.target.value || undefined }))}
                placeholder="e.g. pi_xxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update_refund_amount">{t("admin.payments.refund_amount", "Refund amount")}</Label>
              <Input
                id="update_refund_amount"
                type="number"
                step="0.01"
                min="0"
                value={updateForm.refund_amount ?? ""}
                onChange={(e) =>
                  setUpdateForm((f) => ({
                    ...f,
                    refund_amount: e.target.value === "" ? undefined : e.target.value,
                  }))
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update_refund_reason">{t("admin.payments.refund_reason", "Refund reason")}</Label>
              <Input
                id="update_refund_reason"
                value={updateForm.refund_reason ?? ""}
                onChange={(e) => setUpdateForm((f) => ({ ...f, refund_reason: e.target.value || undefined }))}
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseUpdate} disabled={isUpdating}>
              {t("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleSubmitUpdate} disabled={isUpdating}>
              {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("common.save", "Save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
